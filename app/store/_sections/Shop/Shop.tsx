'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import { isAxiosError } from 'axios';
import { getCurrencies, getProducts } from '@/lib/api/shop';
import { addToCart, changeItemAmount, getOrderItems } from '@/lib/api/cart';
import { crystalsToEur } from '@/lib/pricing';
import styles from './Shop.module.css';

const TABS = ['All', 'Crystals', 'Privileges'] as const;
type Tab = (typeof TABS)[number];

const MIN = 10;
const MAX = 15_000;
const STEP = 10;
// Жорсткий ліміт кількості за позицію на бекенді (AddToCart.amount max).
const BACKEND_MAX_QTY = 20_000;

type CrystalPack = {
  amount: number;
  img: string;
  save?: number; // знижка у відсотках («більше береш — більша знижка»)
  popular?: boolean;
};

const PACKS: CrystalPack[] = [
  { amount: 500, img: '/profile/shop/crystal-1.webp' },
  { amount: 1500, img: '/profile/shop/crystal-2.webp' },
  {
    amount: 5000,
    img: '/profile/shop/crystal-3.webp',
    popular: true,
  },
  { amount: 15000, img: '/profile/shop/crystal-4.webp' },
];

const nf = new Intl.NumberFormat('en-US');

// Ціна за кількість кристалів: реальний курс бекенду (за 1 кристал), якщо відомий,
// інакше — лінійна оцінка з lib/pricing.ts (для публічної вітрини без авторизації).
function crystalsPrice(amount: number, pricePerCrystal: number | null): string {
  const value = pricePerCrystal != null ? amount * pricePerCrystal : crystalsToEur(amount);
  return value.toFixed(2);
}

function formatSliderLabel(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return nf.format(value);
}

// Мітки на рівних відстанях = значення на лінійній шкалі MIN…MAX.
const SLIDER_TICKS = [0, 0.25, 0.5, 0.75, 1].map(
  t => Math.round(MIN + t * (MAX - MIN)),
);

export default function Shop() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  const [tab, setTab] = useState<Tab>('All');
  const [amount, setAmount] = useState(2500);
  // Окреме текстове значення поля — щоб дати вводити суму вручну (в одиницях кристалів).
  const [amountInput, setAmountInput] = useState('2500');

  const [currency, setCurrency] = useState('EUR');

  // Мапа продуктів бекенду: title(lowercase) → id; окремо id товару «Crystals».
  const [productIdByTitle, setProductIdByTitle] = useState<Map<string, string>>(new Map());
  const [crystalId, setCrystalId] = useState<string | null>(null);
  // Реальна ціна за 1 кристал з бекенду (лише в кабінеті, де є авторизація).
  const [pricePerCrystal, setPricePerCrystal] = useState<number | null>(null);
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const percent = ((amount - MIN) / (MAX - MIN)) * 100;
  const price = useMemo(
    () => crystalsPrice(amount, pricePerCrystal),
    [amount, pricePerCrystal]
  );

  const showCrystals = tab === 'All' || tab === 'Crystals';
  const showPrivileges = tab === 'All' || tab === 'Privileges';

  // Єдина точка зміни кількості: клемп у [MIN..MAX] + синхронізація текстового поля.
  const applyAmount = useCallback((next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(next)));
    setAmount(clamped);
    setAmountInput(String(clamped));
  }, []);

  // Кнопки + / − крокують по 10 (STEP).
  const step = (dir: 1 | -1) => applyAmount(amount + dir * STEP);

  // Вільний ввід суми вручну: лишаємо тільки цифри, верх обмежуємо одразу, низ — на blur.
  const onAmountInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setAmountInput(digits);
    if (digits) setAmount(Math.min(MAX, Math.max(1, Number(digits))));
  };

  const onAmountBlur = () => applyAmount(amountInput ? Number(amountInput) : MIN);

  const flash = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  useEffect(() => {
    let active = true;
    getCurrencies()
      .then(list => {
        if (!active || list.length === 0) return;
        setCurrency(list[0].abbr);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100 })
      .then(data => {
        if (!active) return;
        const map = new Map<string, string>();
        let crystal: string | null = null;
        for (const p of data.results) {
          if (p.title) map.set(p.title.toLowerCase(), p.id);
          if (p.category_slug === 'crystals') crystal = p.id;
        }
        setProductIdByTitle(map);
        setCrystalId(crystal);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // У кабінеті (authed) тягнемо приватний список із цінами, щоб показувати реальний
  // курс кристалів (price за 1 кристал) — узгоджено з тим, що порахує бекенд у кошику.
  useEffect(() => {
    if (!isDashboard) return;
    let active = true;
    getProducts({ priced: true, page_size: 100, currency })
      .then(data => {
        if (!active) return;
        const crystal = data.results.find(p => p.category_slug === 'crystals');
        const parsed = crystal?.price != null ? Number(crystal.price) : NaN;
        if (Number.isFinite(parsed) && parsed > 0) setPricePerCrystal(parsed);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isDashboard, currency]);

  // amount = кількість кристалів (бекенд тарифікує за одиницю товару «Crystals»).
  const addCrystals = useCallback(
    async (qty: number) => {
      if (!crystalId || addingKey) return;
      const key = `crystals-${qty}`;
      setAddingKey(key);
      try {
        await addToCart({ amount: qty, item_id: crystalId, currency });
        flash(`Added ${nf.format(qty)} crystals to cart`);
      } catch (err) {
        // Бекенд відхиляє повторний add того ж товару (403/400) — кристали вже в кошику.
        // У такому разі оновлюємо кількість позиції замість додавання нової.
        if (isAxiosError(err) && (err.response?.status === 403 || err.response?.status === 400)) {
          try {
            // Кристали вже в кошику — додаємо до наявної кількості (не перезаписуємо).
            const items = await getOrderItems();
            const existing = items.find(it => it.product_id === crystalId);
            const nextQty = Math.min(BACKEND_MAX_QTY, (existing?.amount ?? 0) + qty);
            await changeItemAmount(crystalId, nextQty);
            flash(`Added ${nf.format(qty)} crystals (cart: ${nf.format(nextQty)})`);
            return;
          } catch {
            // падаємо у загальний фолбек нижче
          }
        }
        flash('Could not add to cart. Please try again.');
      } finally {
        setAddingKey(null);
      }
    },
    [crystalId, addingKey, currency, flash]
  );

  const addPrivilege = useCallback(
    async (title: string) => {
      const id = productIdByTitle.get(title.toLowerCase());
      if (!id) {
        flash('This item is not available yet.');
        return;
      }
      try {
        await addToCart({ amount: 1, item_id: id, currency });
        flash(`${title} privilege added to cart`);
      } catch (err) {
        // 403 — привілей уже в кошику (або вже придбано); для користувача це не помилка.
        if (isAxiosError(err) && err.response?.status === 403) {
          flash(`${title} is already in your cart`);
          return;
        }
        flash('Could not add to cart. Please try again.');
        throw new Error('add-failed');
      }
    },
    [productIdByTitle, currency, flash]
  );

  return (
    <div className={styles.shell}>
    <div className={styles.root}>
      <header className={styles.shopHeader}>
        <div className={styles.hdrTop}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>Shop</span>
            <h1 className={styles.title}>Crystals &amp; privileges</h1>
            <p className={styles.subtitle}>
              Top up your wallet or upgrade your account.
              <span className={styles.subtitleExtra}>
                {' '}
                All purchases activate instantly across every server.
              </span>
            </p>
          </div>

          <div className={styles.currency}>
            <span className={styles.currencyLabel}>Currency:</span>
            <span className={styles.currencyValue}>{currency}</span>
            <span className={styles.currencyCaret} aria-hidden>▾</span>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map(item => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={`${styles.tab} ${tab === item ? styles.tabActive : ''}`}
              onClick={() => setTab(item)}
            >
              {item === 'All' ? (
                <>
                  All<span className={styles.tabSuffix}> items</span>
                </>
              ) : (
                item
              )}
            </button>
          ))}
        </div>
      </header>

      {showCrystals && (
        <>
          <div className={styles.crysTitle}>
            <h2 className={styles.crysHeading}>Crystals — top up your wallet</h2>
            <p className={styles.bestValue}>Best value: 5,000 pack saves 20%</p>
          </div>

          <div className={styles.crysRow}>
            <div className={styles.calc}>
              <span className={styles.calcHead}>Custom amount</span>
              <p className={styles.calcDesc}>Pick exactly how many crystals you need</p>

              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => step(-1)}
                  aria-label="Decrease"
                >
                  −
                </button>
                <div className={styles.stepValue}>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`${styles.stepAmount} ${styles.stepInput}`}
                    value={amountInput}
                    onChange={e => onAmountInput(e.target.value)}
                    onBlur={onAmountBlur}
                    onFocus={e => e.target.select()}
                    aria-label="Crystals amount"
                  />
                  <span className={styles.stepUnit}>crystals</span>
                </div>
                <button
                  type="button"
                  className={`${styles.stepBtn} ${styles.stepBtnPlus}`}
                  onClick={() => step(1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <div className={styles.slider}>
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={amount}
                  onChange={e => applyAmount(Number(e.target.value))}
                  className={styles.range}
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${percent}%, rgba(255, 255, 255, 0.08) ${percent}%)`,
                  }}
                  aria-label="Crystals amount"
                />
                <div className={styles.sliderLabels}>
                  {SLIDER_TICKS.map(value => (
                    <span key={value}>{formatSliderLabel(value)}</span>
                  ))}
                </div>
              </div>

              <div className={styles.calcPrice}>
                <div className={styles.calcTotal}>
                  <span className={styles.calcTotalLabel}>Total</span>
                  <span className={styles.calcPriceValue}>
                    {price} {currency}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.addAccent}
                  onClick={() => addCrystals(amount)}
                  disabled={!crystalId || addingKey === `crystals-${amount}`}
                >
                  <span className={styles.addGlyph} aria-hidden>
                    ◆
                  </span>
                  <span className={styles.addTextShort}>Add</span>
                  <span className={styles.addTextFull}>
                    {addingKey === `crystals-${amount}` ? 'Adding…' : 'Add to cart'}
                  </span>
                </button>
              </div>

              <Image
                src="/profile/shop/crystal-2.webp"
                alt=""
                width={115}
                height={115}
                className={styles.calcImg}
                aria-hidden
              />
            </div>

            <div className={styles.packsCol}>
              <h2 className={styles.packsHeading}>Crystal packs</h2>
              <div className={styles.packs}>
                {PACKS.map(pack => (
                  <div
                    key={pack.amount}
                    className={`${styles.pack} ${pack.popular ? styles.packPopular : ''}`}
                  >
                    {pack.popular && (
                      <span className={styles.popular}>
                        <span className={styles.popPrefix}>Most </span>popular
                      </span>
                    )}
                    {pack.save && (
                      <div className={styles.saveWrap}>
                        <span className={styles.save}>
                          <span className={styles.savePrefix}>Save </span>
                          {pack.save}%
                        </span>
                      </div>
                    )}
                    <span className={styles.packAmount}>
                      {nf.format(pack.amount)}
                      <span className={styles.packUnit}> crystals</span>
                    </span>
                    <div className={styles.packPriceRow}>
                      <span className={styles.packPrice}>
                        {crystalsPrice(pack.amount, pricePerCrystal)} {currency}
                      </span>
                      <button
                        type="button"
                        className={styles.packAdd}
                        onClick={() => addCrystals(pack.amount)}
                        disabled={!crystalId || addingKey === `crystals-${pack.amount}`}
                      >
                        {addingKey === `crystals-${pack.amount}` ? '…' : 'Add'}
                      </button>
                    </div>
                    <Image
                      src={pack.img}
                      alt=""
                      width={140}
                      height={140}
                      className={styles.packImg}
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showPrivileges && (
        <>
          <div className={styles.prTitle}>
            <h2 className={styles.prHeading}>Privileges — 8 tiers</h2>
            <p className={styles.prNote}>All tiers stack with crystals balance</p>
          </div>
          <div className={styles.privilegesFull}>
            <PrivilegesCards compact={isDashboard} onAddToCart={addPrivilege} />
          </div>
        </>
      )}
    </div>
    {notice && (
      <div className={styles.toast} role="status" aria-live="polite">
        {notice}
      </div>
    )}
    </div>
  );
}
