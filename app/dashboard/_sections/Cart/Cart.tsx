'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  getOrderItems,
  changeItemAmount,
  removeFromCart,
} from '@/lib/api/cart';
import { getServers } from '@/lib/api/shop';
import { createPayment } from '@/lib/api/payment';
import type { OrderItem } from '@/lib/api/types';
import styles from './Cart.module.css';

type Row = {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  subtitleDesktop: string;
  unitPrice: number;
  qty: number;
  image: string;
  fromApi: boolean;
};

const FALLBACK_ROWS: Row[] = [
  {
    id: 'phoenix',
    productId: 'phoenix',
    title: 'Phoenix privilege',
    subtitle: 'Lifetime upgrade',
    subtitleDesktop: 'Lifetime upgrade — works on all servers',
    unitPrice: 9.99,
    image: '/profile/cart/1.webp',
    qty: 1,
    fromApi: false,
  },
  {
    id: 'crystals-2500',
    productId: 'crystals-2500',
    title: 'Crystals × 2,500',
    subtitle: 'In-game currency',
    subtitleDesktop: 'In-game currency, instant delivery',
    unitPrice: 19.99,
    image: '/profile/cart/2.webp',
    qty: 1,
    fromApi: false,
  },
  {
    id: 'crystals-15000',
    productId: 'crystals-15000',
    title: '15,000 crystals',
    subtitle: 'Banner + lantern',
    subtitleDesktop: 'Glowing banner set + floating lantern',
    unitPrice: 3.99,
    image: '/profile/cart/3.webp',
    qty: 2,
    fromApi: false,
  },
];

const CART_IMAGES = ['/profile/cart/1.webp', '/profile/cart/2.webp', '/profile/cart/3.webp'];
// Реальні сервери з ТЗ (бекенд /core/servers/ поки повертає []).
const FALLBACK_SERVERS = ['LuckySurvival', 'MineWars', 'CalmSky'];
const PAYMENT_METHODS = ['VISA', 'MC', 'Pay', 'GPay', 'PayPal'] as const;

const nf = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

function formatPrice(value: number) {
  return nf.format(value);
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

function orderItemToRow(item: OrderItem, index: number): Row {
  return {
    id: item.id,
    productId: item.product_id,
    title: labelFromImage(item.image_name),
    subtitle: item.currency ?? 'In-game',
    subtitleDesktop: `${item.currency ?? 'In-game'} — instant delivery`,
    unitPrice: Number(item.price) || 0,
    qty: item.amount,
    image: CART_IMAGES[index % CART_IMAGES.length],
    fromApi: true,
  };
}

export default function Cart() {
  const [rows, setRows] = useState<Row[]>(FALLBACK_ROWS);
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

  useEffect(() => {
    let active = true;
    getOrderItems()
      .then(items => {
        if (!active || items.length === 0) return;
        setRows(items.map(orderItemToRow));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const lineCount = rows.length;

  const subtotal = useMemo(
    () => rows.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [rows]
  );

  const changeQty = (id: string, delta: number) => {
    let nextQty = 1;
    setRows(prev =>
      prev.map(row => {
        if (row.id !== id) return row;
        nextQty = Math.max(1, row.qty + delta);
        return { ...row, qty: nextQty };
      })
    );

    const target = rows.find(r => r.id === id);
    // Бекенд ідентифікує позицію кошика за product_id, а не за id рядка замовлення.
    if (target?.fromApi) {
      changeItemAmount(target.productId, nextQty).catch(() => {});
    }
  };

  const removeItem = (id: string) => {
    const target = rows.find(r => r.id === id);
    setRows(prev => prev.filter(row => row.id !== id));
    if (target?.fromApi) {
      removeFromCart(target.productId).catch(() => {});
    }
  };

  async function handlePay() {
    if (!nickname.trim()) {
      setPayMessage('Enter your in-game nickname.');
      return;
    }
    setPaying(true);
    setPayMessage(null);
    try {
      const data = await createPayment({ user_nickname: nickname.trim(), server });
      const url = extractPaymentUrl(data);
      if (url) {
        window.location.href = url;
        return;
      }
      setPayMessage('Payment created. Check your dashboard for status.');
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
        <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Promo (—)</span>
        <span className={styles.summaryValue}>–</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Service fee</span>
        <span className={styles.summaryValue}>{formatPrice(0)}</span>
      </div>
      <div className={styles.summaryDivider} aria-hidden />
      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span className={styles.summaryTotalValue}>{formatPrice(subtotal)}</span>
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
        <div className={styles.main}>
          <section className={styles.panel} aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className={styles.panelLabel}>
              <span className={styles.panelLabelMobile}>Items</span>
              <span className={styles.panelLabelDesktop}>Items in cart</span>
            </h2>
            <ul className={styles.itemList}>
              {rows.map(item => {
                const lineTotal = item.unitPrice * item.qty;

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
                      <p className={styles.itemTitle}>{item.title}</p>
                      <p className={styles.itemSubtitleMobile}>{item.subtitle}</p>
                      <p className={styles.itemSubtitleDesktop}>{item.subtitleDesktop}</p>
                    </div>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => changeQty(item.id, -1)}
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button
                        type="button"
                        className={`${styles.qtyBtn} ${styles.qtyBtnPlus}`}
                        onClick={() => changeQty(item.id, 1)}
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <p className={styles.itemPrice}>{formatPrice(lineTotal)}</p>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
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

        <aside className={styles.sidebar}>{summaryBlock}</aside>
      </div>
      </div>
    </div>
  );
}
