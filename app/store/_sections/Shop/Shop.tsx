'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import styles from './Shop.module.css';

const TABS = ['All', 'Crystals', 'Privileges'] as const;
type Tab = (typeof TABS)[number];

const MIN = 100;
const MAX = 10_000;
const STEP = 100;
const RATE = 19.99 / 2500; // ≈ price per crystal so 2,500 → $19.99

type CrystalPack = {
  amount: number;
  price: string;
  img: string;
  save?: string;
  popular?: boolean;
};

const PACKS: CrystalPack[] = [
  { amount: 500, price: '$4.99', img: '/profile/shop/crystal-1.webp' },
  { amount: 1500, price: '$12.99', save: '10%', img: '/profile/shop/crystal-2.webp' },
  {
    amount: 5000,
    price: '$39.99',
    save: '20%',
    img: '/profile/shop/crystal-3.webp',
    popular: true,
  },
  { amount: 15000, price: '$99.99', save: '30%', img: '/profile/shop/crystal-4.webp' },
];

const nf = new Intl.NumberFormat('en-US');

export default function Shop() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  const [tab, setTab] = useState<Tab>('All');
  const [amount, setAmount] = useState(2500);

  const percent = ((amount - MIN) / (MAX - MIN)) * 100;
  const price = useMemo(() => (amount * RATE).toFixed(2), [amount]);

  const showCrystals = tab === 'All' || tab === 'Crystals';
  const showPrivileges = tab === 'All' || tab === 'Privileges';

  const step = (dir: 1 | -1) =>
    setAmount(prev => Math.min(MAX, Math.max(MIN, prev + dir * STEP)));

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
            <span className={styles.currencyValue}>USD</span>
            <span className={styles.currencyCaret} aria-hidden>
              ▾
            </span>
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
                  <span className={styles.stepAmount}>{nf.format(amount)}</span>
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
                  onChange={e => setAmount(Number(e.target.value))}
                  className={styles.range}
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${percent}%, rgba(255, 255, 255, 0.08) ${percent}%)`,
                  }}
                  aria-label="Crystals amount"
                />
                <div className={styles.sliderLabels}>
                  <span>100</span>
                  <span>1k</span>
                  <span>2.5k</span>
                  <span>5k</span>
                  <span>10k</span>
                </div>
              </div>

              <div className={styles.calcPrice}>
                <div className={styles.calcTotal}>
                  <span className={styles.calcTotalLabel}>Total</span>
                  <span className={styles.calcPriceValue}>${price}</span>
                </div>
                <button type="button" className={styles.addAccent}>
                  <span className={styles.addGlyph} aria-hidden>
                    ◆
                  </span>
                  <span className={styles.addTextShort}>Add</span>
                  <span className={styles.addTextFull}>Add to cart</span>
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
                          {pack.save}
                        </span>
                      </div>
                    )}
                    <span className={styles.packAmount}>
                      {nf.format(pack.amount)}
                      <span className={styles.packUnit}> crystals</span>
                    </span>
                    <div className={styles.packPriceRow}>
                      <span className={styles.packPrice}>{pack.price}</span>
                      <button type="button" className={styles.packAdd}>
                        Add
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
            <PrivilegesCards compact={isDashboard} />
          </div>
        </>
      )}
    </div>
    </div>
  );
}
