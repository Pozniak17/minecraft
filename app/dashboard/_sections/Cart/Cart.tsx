'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  getOrderItems,
  changeItemAmount,
  removeFromCart,
} from '@/lib/api/cart';
import { getServers, getProducts } from '@/lib/api/shop';
import { createPayment } from '@/lib/api/payment';
import type { OrderItem } from '@/lib/api/types';
import { DEFAULT_CURRENCY, formatMoney } from '@/lib/client/currency';
import { notifyCartUpdated } from '@/lib/client/cartCount';
import styles from './Cart.module.css';

type Row = {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  subtitleDesktop: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  currency: string;
  image: string;
  fromApi: boolean;
};

const CART_IMAGES = ['/profile/cart/1.webp', '/profile/cart/2.webp', '/profile/cart/3.webp'];
// Реальні сервери з ТЗ (бекенд /core/servers/ поки повертає []).
const FALLBACK_SERVERS = ['LuckySurvival', 'MineWars', 'CalmSky'];
const PAYMENT_METHODS = ['VISA', 'MC', 'Pay', 'GPay', 'PayPal'] as const;
// Верхня межа кількості за позицію — узгоджено з бекендом (AddToCart.amount max 20000).
const MAX_QTY = 15_000;

// Назва сервера бекенду ("LuckySurvival") → ключ ігрового моніторингу ("luckysurvival").
function serverKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}


// create_payment може повернути URL платіжки під різними іменами полів —
// дістаємо перший валідний, щоб коректно зредіректити на оплату.
function extractPaymentUrl(data: unknown): string | null {
  if (typeof data === 'string') {
    return /^https?:\/\//.test(data) ? data : null;
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const keys = [
      'payment_url',
      'paymentUrl',
      'redirect_url',
      'redirectUrl',
      'checkout_url',
      'checkoutUrl',
      'url',
      'link',
    ];
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'string' && /^https?:\/\//.test(value)) return value;
    }
  }
  return null;
}

function labelFromImage(name: string | undefined): string {
  if (!name) return 'Item';
  const base = name.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  return base ? base.replace(/[-_]+/g, ' ') : 'Item';
}

type ProductMeta = { title: string; isCrystal: boolean };

function orderItemToRow(item: OrderItem, index: number): Row {
  const unitPrice = Number(item.price) || 0;
  // Сума по позиції — авторитетна з бекенду; фолбек на unitPrice*amount.
  const lineTotal = Number(item.sum_item_price) || unitPrice * item.amount;
  return {
    id: item.id,
    productId: item.product_id,
    title: labelFromImage(item.image_name),
    subtitle: item.currency ?? 'In-game',
    subtitleDesktop: `${item.currency ?? 'In-game'} — instant delivery`,
    unitPrice,
    qty: item.amount,
    lineTotal,
    currency: item.currency ?? DEFAULT_CURRENCY,
    image: CART_IMAGES[index % CART_IMAGES.length],
    fromApi: true,
  };
}

export default function Cart() {
  const locale = useLocale();
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [servers, setServers] = useState<string[]>(FALLBACK_SERVERS);
  const [server, setServer] = useState<string>(FALLBACK_SERVERS[0]);
  const [nickname, setNickname] = useState('RedstoneKing');
  const [promoCode, setPromoCode] = useState('');
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState<string | null>(null);

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (email) setNickname(email.split('@')[0]);
  }, []);

  useEffect(() => {
    let active = true;
    getServers()
      .then(list => {
        if (!active || list.length === 0) return;
        const types = list.map(s => s.server_type);
        setServers(types);
        setServer(prev => (types.includes(prev) ? prev : types[0]));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Перезавантаження кошика з бекенду — щоб підтягнути авторитетні price/sum_item_price.
  const reloadCart = useCallback(async () => {
    try {
      const items = await getOrderItems();
      setRows(items.map(orderItemToRow));
      notifyCartUpdated();
    } catch {
      // мовчазний фолбек — лишаємо поточний стан
    }
  }, []);

  useEffect(() => {
    let active = true;
    getOrderItems()
      .then(items => {
        if (!active) return;
        setRows(items.map(orderItemToRow));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Мапа продуктів: даємо позиціям кошика реальну назву та крок (кристали — по 10).
  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        const map = new Map<string, ProductMeta>();
        for (const p of data.results) {
          map.set(p.id, {
            title: p.title ?? '',
            isCrystal: p.category_slug === 'crystals',
          });
        }
        setProductMeta(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  // Назва та крок кількості — derived з мапи продуктів (кристали продаються по 10).
  const titleFor = (row: Row) => productMeta.get(row.productId)?.title || row.title;
  const stepFor = (row: Row) => (productMeta.get(row.productId)?.isCrystal ? 10 : 1);

  const lineCount = rows.length;

  const subtotal = useMemo(
    () => rows.reduce((sum, item) => sum + item.lineTotal, 0),
    [rows]
  );

  // Валюта кошика = валюта його позицій (бекенд тримає одну валюту на кошик).
  const cartCurrency = rows[0]?.currency ?? DEFAULT_CURRENCY;

  // dir: +1 / -1 — напрямок; крок залежить від товару (кристали — по 10).
  const changeQty = (id: string, dir: 1 | -1) => {
    let nextQty = 1;
    let productId: string | null = null;
    let fromApi = false;
    setRows(prev =>
      prev.map(row => {
        if (row.id !== id) return row;
        const step = stepFor(row);
        // Клемп у межах бекенду: [step .. MAX_QTY].
        nextQty = Math.min(MAX_QTY, Math.max(step, row.qty + dir * step));
        productId = row.productId;
        fromApi = row.fromApi;
        // Оптимістичне оновлення суми; нижче синхронізуємо з бекендом.
        return { ...row, qty: nextQty, lineTotal: row.unitPrice * nextQty };
      })
    );

    // Бекенд ідентифікує позицію кошика за product_id, а не за id рядка замовлення.
    if (fromApi && productId) {
      changeItemAmount(productId, nextQty)
        .then(() => reloadCart())
        .catch(() => {});
    }
  };

  const removeItem = (id: string) => {
    const target = rows.find(r => r.id === id);
    setRows(prev => prev.filter(row => row.id !== id));
    if (target?.fromApi) {
      removeFromCart(target.productId)
        .then(() => notifyCartUpdated())
        .catch(() => {});
    } else {
      notifyCartUpdated();
    }
  };

  // ТЗ: перед видачею донату гравець ОБОВ'ЯЗКОВО має бути в мережі, інакше товар "піде в молоко".
  // Повертає true, якщо ник знайдено серед онлайн-гравців; null — якщо перевірити не вдалося.
  async function isNicknameOnline(nick: string): Promise<boolean | null> {
    try {
      const res = await fetch(`/api/servers/${serverKey(server)}/online`);
      if (!res.ok) return null;
      const data = (await res.json()) as { status?: string; players?: unknown };
      if (data.status !== 'online') return false;
      const players = Array.isArray(data.players) ? (data.players as string[]) : [];
      return players.some(p => p.toLowerCase() === nick.toLowerCase());
    } catch {
      return null;
    }
  }

  async function handlePay() {
    const nick = nickname.trim();
    if (!nick) {
      setPayMessage('Enter your in-game nickname.');
      return;
    }
    setPaying(true);
    setPayMessage(null);
    try {
      // Перевірка онлайну — best-effort нагадування, НЕ блокер: доставка відбувається
      // після оплати, тож не зриваємо створення платежу, якщо гравця ще немає в мережі.
      const online = await isNicknameOnline(nick);

      const data = await createPayment({ user_nickname: nick, server });
      const url = extractPaymentUrl(data);
      if (url) {
        window.location.href = url;
        return;
      }
      setPayMessage(
        online === false
          ? `Payment created — join ${server} as "${nick}" so your items can be delivered.`
          : 'Payment created — awaiting confirmation. Track it in your purchase history.'
      );
    } catch {
      setPayMessage('Could not start payment. Please try again.');
    } finally {
      setPaying(false);
    }
  }

  const summaryBlock = (
    <section className={styles.summary} aria-labelledby="summary-heading">
      <h2 id="summary-heading" className={styles.summaryTitle}>
        Order summary
      </h2>
      <div className={styles.summaryRow}>
        <span>
          Subtotal
          {lineCount > 0 ? ` (${lineCount} ${lineCount === 1 ? 'item' : 'items'})` : ''}
        </span>
        <span className={styles.summaryValue}>{formatMoney(subtotal, cartCurrency)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Promo (—)</span>
        <span className={styles.summaryValue}>–</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Service fee</span>
        <span className={styles.summaryValue}>{formatMoney(0, cartCurrency)}</span>
      </div>
      <div className={styles.summaryDivider} aria-hidden />
      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span className={styles.summaryTotalValue}>{formatMoney(subtotal, cartCurrency)}</span>
      </div>
      <button
        type="button"
        className={styles.payBtn}
        onClick={handlePay}
        disabled={paying || lineCount === 0}
      >
        <span>{paying ? 'Processing…' : 'Proceed to pay'}</span>
        <span aria-hidden>→</span>
      </button>
      {payMessage && <p className={styles.secureNote}>{payMessage}</p>}
      <p className={styles.secureNote}>
        <span className={styles.secureNoteMobile}>SSL secure checkout</span>
        <span className={styles.secureNoteDesktop}>Secure checkout — SSL encrypted</span>
      </p>
      <div className={styles.paymentMethods}>
        {PAYMENT_METHODS.map(method => (
          <span key={method} className={styles.paymentBadge}>
            {method}
          </span>
        ))}
      </div>
    </section>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Cart</span>
        <h1 className={styles.title}>
          Your cart ({lineCount} {lineCount === 1 ? 'item' : 'items'})
        </h1>
        <p className={styles.subtitle}>
          Review the items below, pick a server and your in-game nickname, then proceed to
          checkout.
        </p>
      </header>

      <div className={styles.body}>
        <div className={styles.mainPrimary}>
          <section className={styles.panel} aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className={styles.panelLabel}>
              <span className={styles.panelLabelMobile}>Items</span>
              <span className={styles.panelLabelDesktop}>Items in cart</span>
            </h2>
            {!loaded ? (
              <p className={styles.cartState}>Loading your cart…</p>
            ) : rows.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>Your cart is empty</p>
                <p className={styles.emptyText}>
                  Add privileges or crystals from the store to get started.
                </p>
                <Link href="/store" className={styles.emptyCta}>
                  Browse the store →
                </Link>
              </div>
            ) : (
            <ul className={styles.itemList}>
              {rows.map(item => {
                const lineTotal = item.lineTotal;
                const title = titleFor(item);

                return (
                  <li key={item.id} className={styles.itemRow}>
                    <div className={styles.itemThumb}>
                      <Image
                        src={item.image}
                        alt=""
                        width={64}
                        height={64}
                        className={styles.itemImg}
                        aria-hidden
                      />
                    </div>
                    <div className={styles.itemMeta}>
                      <p className={styles.itemTitle}>{title}</p>
                      <p className={styles.itemSubtitleMobile}>{item.subtitle}</p>
                      <p className={styles.itemSubtitleDesktop}>{item.subtitleDesktop}</p>
                    </div>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => changeQty(item.id, -1)}
                        aria-label={`Decrease ${title} quantity`}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button
                        type="button"
                        className={`${styles.qtyBtn} ${styles.qtyBtnPlus}`}
                        onClick={() => changeQty(item.id, 1)}
                        aria-label={`Increase ${title} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <p className={styles.itemPrice}>{formatMoney(lineTotal, item.currency)}</p>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${title}`}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
            )}
          </section>

          <section
            className={`${styles.panel} ${styles.panelDelivery}`}
            aria-labelledby="delivery-heading"
          >
            <div className={styles.panelHead}>
              <h2 id="delivery-heading" className={styles.panelTitle}>
                Delivery
              </h2>
              <span className={styles.requiredBadge}>Required</span>
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Select server</p>
              <div className={styles.serverRow} role="radiogroup" aria-label="Select server">
                {servers.map(option => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={server === option}
                    className={`${styles.serverOption} ${server === option ? styles.serverOptionActive : ''}`}
                    onClick={() => setServer(option)}
                  >
                    <span className={styles.serverRadio} aria-hidden>
                      {server === option && <span className={styles.serverRadioDot} />}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cart-nickname">
                <span className={styles.nicknameLabelMobile}>Nickname</span>
                <span className={styles.nicknameLabelDesktop}>In-game nickname</span>
              </label>
              <input
                id="cart-nickname"
                className={styles.input}
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                autoComplete="username"
              />
            </div>
            <p className={styles.deliveryNote}>
              We will deliver privileges and crystals to this nickname on the selected server.
            </p>
          </section>
        </div>

        <div className={styles.sidebarColumn}>
          {summaryBlock}

          <aside className={styles.importantNotice} aria-label="Important delivery notice">
            <div className={styles.importantHead}>
              <span className={styles.importantIcon} aria-hidden="true">
                ⚠
              </span>
              <p className={styles.importantTitle}>Important</p>
            </div>
            <p className={styles.importantText}>
              You must be on the selected server{' '}
              <span className={styles.importantHighlight}>at the moment of purchase.</span>
            </p>
            <p className={styles.importantText}>
              Delivery of items is only possible if you are online on the server.
            </p>
          </aside>
        </div>

        <section className={styles.promoPanel} aria-labelledby="promo-heading">
          <span className={styles.promoIcon} aria-hidden>
            🎟
          </span>
          <div className={styles.promoCopy}>
            <h2 id="promo-heading" className={styles.promoTitle}>
              <span className={styles.promoTitleMobile}>Promo code</span>
              <span className={styles.promoTitleDesktop}>Have a promo code?</span>
            </h2>
            <p className={styles.promoHint}>Apply a discount before checkout.</p>
          </div>
          <div className={styles.promoRow}>
            <input
              className={styles.promoInput}
              placeholder="Enter code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
            />
            <button type="button" className={styles.promoApply}>
              Apply
            </button>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
