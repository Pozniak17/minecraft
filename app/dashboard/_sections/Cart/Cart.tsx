'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import styles from './Cart.module.css';

type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  subtitleDesktop: string;
  unitPrice: number;
  image: string;
  initialQty: number;
};

const CART_ITEMS: CartItem[] = [
  {
    id: 'phoenix',
    title: 'Phoenix privilege',
    subtitle: 'Lifetime upgrade',
    subtitleDesktop: 'Lifetime upgrade — works on all servers',
    unitPrice: 9.99,
    image: '/profile/cart/1.webp',
    initialQty: 1,
  },
  {
    id: 'crystals-2500',
    title: 'Crystals × 2,500',
    subtitle: 'In-game currency',
    subtitleDesktop: 'In-game currency, instant delivery',
    unitPrice: 19.99,
    image: '/profile/cart/2.webp',
    initialQty: 1,
  },
  {
    id: 'crystals-15000',
    title: '15,000 crystals',
    subtitle: 'Banner + lantern',
    subtitleDesktop: 'Glowing banner set + floating lantern',
    unitPrice: 3.99,
    image: '/profile/cart/3.webp',
    initialQty: 2,
  },
];

const SERVERS = ['Classic', 'Skyblock', 'Anarchy'] as const;
const PAYMENT_METHODS = ['VISA', 'MC', 'Pay', 'GPay', 'PayPal'] as const;

type Server = (typeof SERVERS)[number];

const nf = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function formatPrice(value: number) {
  return nf.format(value);
}

export default function Cart() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(CART_ITEMS.map(item => [item.id, item.initialQty])),
  );
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [server, setServer] = useState<Server>('Classic');
  const [nickname, setNickname] = useState('RedstoneKing');
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    if (email) {
      setNickname(email.split('@')[0]);
    }
  }, []);

  const activeItems = useMemo(
    () => CART_ITEMS.filter(item => !removedIds.has(item.id)),
    [removedIds],
  );

  const lineCount = activeItems.length;

  const subtotal = useMemo(
    () =>
      activeItems.reduce((sum, item) => sum + item.unitPrice * (quantities[item.id] ?? 0), 0),
    [activeItems, quantities],
  );

  const changeQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const next = Math.max(1, (prev[id] ?? 1) + delta);
      return { ...prev, [id]: next };
    });
  };

  const removeItem = (id: string) => {
    setRemovedIds(prev => new Set(prev).add(id));
  };

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
      <button type="button" className={styles.payBtn}>
        <span>Proceed to pay</span>
        <span aria-hidden>→</span>
      </button>
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
              {activeItems.map(item => {
                const qty = quantities[item.id] ?? 1;
                const lineTotal = item.unitPrice * qty;

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
                      <span className={styles.qtyValue}>{qty}</span>
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
                {SERVERS.map(option => (
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
