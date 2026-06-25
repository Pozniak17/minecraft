'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { getOrders } from '@/lib/api/orders';
import { getProducts } from '@/lib/api/shop';
import type { OrderListItem } from '@/lib/api/types';
import {
  buildProductMeta,
  formatActivityTitle,
  formatOrderAmount,
  type ProductMeta,
} from '@/lib/client/orderDisplay';
import { useServerOnline } from '@/lib/client/useServerOnline';
import { hasPurchaseSuccessPending, clearPurchaseSuccess } from '@/lib/client/purchaseNotification';
import { crystalsToCurrency } from '@/lib/pricing';
import { DEFAULT_CURRENCY, formatMoney, getStoredCurrency } from '@/lib/client/currency';
import styles from './Dashboard.module.css';

const nf = new Intl.NumberFormat('en-US');

// Реальні сервери (ключі — з lib/server/gameServers.ts). М'який ліміт — лише для візуальної смужки.
const SERVERS = [
  {
    key: 'luckysurvival',
    name: 'LuckySurvival',
    description: 'Vanilla survival with PvP — TNT disabled.',
    meta: 'Java 1.12–1.19',
  },
  {
    key: 'minewars',
    name: 'MineWars',
    description: 'Vanilla survival, PvP and TNT enabled.',
    meta: 'Java 1.12–1.19',
  },
  {
    key: 'calmsky',
    name: 'CalmSky',
    description: 'Peaceful — no PvP, no TNT. Build and socialize.',
    meta: 'Java 1.12–1.19',
  },
] as const;

const SOFT_PLAYER_CAP = 200;

type ActivityItem = {
  title: string;
  time: string;
  body?: string;
  amount?: string;
  tone?: 'pos' | 'neg';
  img?: string;
  icon?: string;
  desktopOnly?: boolean;
};

// "A and B" / "A, B, and C"
function formatNameList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

const ACTIVITY_IMAGES = [
  '/profile/activity/act-1.png',
  '/profile/activity/act-2.png',
  '/profile/activity/act-5.png',
  '/profile/img.png',
];

const PACK_AMOUNTS = [500, 1500, 5000];

function relativeTime(iso: string | undefined): string {
  if (!iso) return 'Recently';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Recently';
  const mins = Math.round((Date.now() - then) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} mo ago`;
}

function orderToActivity(
  order: OrderListItem,
  meta: Map<string, ProductMeta>,
  index: number,
): ActivityItem {
  const items = order.order_item ?? [];
  const first = items[0];
  const currency = first?.currency ?? 'EUR';
  return {
    title: formatActivityTitle(order, meta),
    time: relativeTime(first?.created),
    amount: `-${formatOrderAmount(order.total_price, currency)}`,
    tone: 'neg',
    img: ACTIVITY_IMAGES[index % ACTIVITY_IMAGES.length],
  };
}

export default function Dashboard() {
  const locale = useLocale();
  const [name, setName] = useState('Player');
  const [rawOrders, setRawOrders] = useState<OrderListItem[]>([]);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const activityReady = productsLoaded && ordersLoaded;
  const activity = useMemo(
    () => rawOrders.map((order, index) => orderToActivity(order, productMeta, index)),
    [rawOrders, productMeta],
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [purchaseNotif, setPurchaseNotif] = useState<ActivityItem | null>(null);
  // Валюта читається після маунту (localStorage) — щоб уникнути розбіжності SSR/CSR.
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  // Живий онлайн кожного сервера (фіксована кількість викликів хука — коректно).
  const lucky = useServerOnline('luckysurvival');
  const mine = useServerOnline('minewars');
  const calm = useServerOnline('calmsky');
  const liveByKey: Record<string, ReturnType<typeof useServerOnline>> = {
    luckysurvival: lucky,
    minewars: mine,
    calmsky: calm,
  };

  const onlineNames = SERVERS.filter(s => liveByKey[s.key].status === 'online').map(s => s.name);
  const activeCount = onlineNames.length;
  const activeHint =
    activeCount > 0 ? `${onlineNames.join(', ')} online` : 'Checking server status…';

  const offlineNames = SERVERS.filter(s => liveByKey[s.key].status === 'offline').map(s => s.name);
  const allResolved = SERVERS.every(s => liveByKey[s.key].status !== 'loading');
  const offlineKey = allResolved ? offlineNames.join('|') : '';
  const offlineNotifications = useMemo<ActivityItem[]>(() => {
    if (offlineKey === '') return [];
    const names = offlineKey.split('|');

    let title: string;
    let body: string;
    if (names.length === SERVERS.length) {
      title = 'All servers offline';
      body = "We're working on it. Please check back shortly.";
    } else if (names.length === 1) {
      title = `${names[0]} is offline`;
      body = "We're restoring access. Status refreshes every 10 seconds.";
    } else {
      title = `${names.length} servers offline`;
      body = `${formatNameList(names)} are temporarily unavailable.`;
    }

    return [{ title, body, time: 'Live', tone: 'neg' }];
  }, [offlineKey]);

  const notifications = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [...offlineNotifications];
    if (purchaseNotif) items.unshift(purchaseNotif);
    return items;
  }, [offlineNotifications, purchaseNotif]);

  const hasAlert = notifications.some(item => item.tone === 'neg');
  const hasSuccess = notifications.some(item => item.tone === 'pos');
  const notifAriaLabel = hasAlert
    ? 'Notifications — server alert'
    : hasSuccess
      ? 'Notifications — purchase complete'
      : 'Notifications';

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (email) setName(email.split('@')[0]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(getStoredCurrency());
  }, []);

  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        setProductMeta(buildProductMeta(data.results));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setProductsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    let active = true;
    getOrders(1, 50)
      .then(data => {
        if (!active) return;
        setRawOrders(data.results.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setOrdersLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activityReady || !hasPurchaseSuccessPending()) return;

    const latest = rawOrders[0];
    if (latest) {
      setPurchaseNotif({
        title: 'Purchase complete',
        body: `${formatActivityTitle(latest, productMeta)}. Delivered to your in-game nickname.`,
        time: 'Just now',
        tone: 'pos',
      });
      return;
    }

    setPurchaseNotif({
      title: 'Purchase complete',
      body: 'Your payment went through. Crystals and privileges are on their way.',
      time: 'Just now',
      tone: 'pos',
    });
  }, [activityReady, rawOrders, productMeta]);

  useEffect(() => {
    if (!notifOpen || !purchaseNotif) return;
    clearPurchaseSuccess();
  }, [notifOpen, purchaseNotif]);

  useEffect(() => {
    if (!notifOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (notifRef.current?.contains(event.target as Node)) return;
      setNotifOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotifOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notifOpen]);

  return (
    <div className={styles.shell}>
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          <span className={styles.eyebrow}>Dashboard</span>
          <h1 className={styles.title}>Welcome back, {name}</h1>
          <p className={styles.subtitle}>Here is what is happening across your worlds today.</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.notifWrap} ref={notifRef}>
            <button
              type="button"
              className={styles.notif}
              aria-label={notifAriaLabel}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen(open => !open)}
            >
              <span
                className={styles.notifIcon}
                style={{
                  maskImage: 'url("/icons/dashboard/notification-2-line.svg")',
                  WebkitMaskImage: 'url("/icons/dashboard/notification-2-line.svg")',
                }}
                aria-hidden="true"
              />
              {hasAlert && <span className={styles.notifDot} aria-hidden="true" />}
              {!hasAlert && hasSuccess && (
                <span className={`${styles.notifDot} ${styles.notifDotSuccess}`} aria-hidden="true" />
              )}
            </button>

            {notifOpen && (
              <div className={styles.notifPanel} role="region" aria-label="Notifications">
                <p className={styles.notifPanelTitle}>Notifications</p>
                {notifications.length === 0 ? (
                  <p className={styles.notifEmpty}>No recent notifications</p>
                ) : (
                  <ul className={styles.notifList}>
                    {notifications.map((item, index) => (
                      <li
                        key={`${item.title}-${index}`}
                        className={`${styles.notifItem} ${
                          item.tone === 'neg'
                            ? styles.notifItemAlert
                            : item.tone === 'pos'
                              ? styles.notifItemSuccess
                              : ''
                        }`}
                      >
                        <span className={styles.notifItemTitle}>{item.title}</span>
                        {item.body && (
                          <span className={styles.notifItemBody}>{item.body}</span>
                        )}
                        <span className={styles.notifItemTime}>{item.time}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <Link href="/dashboard/shop" className={styles.topUp}>
            Top up
          </Link>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Active servers</span>
          <span className={styles.statValue}>
            {activeCount} / {SERVERS.length}
          </span>
          <span className={styles.statHint}>{activeHint}</span>
        </div>
        <Image
          src="/profile/1.webp"
          alt=""
          width={200}
          height={200}
          className={styles.statsMascot}
          aria-hidden="true"
        />
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Server status</h2>
        <Link href="/dashboard/servers" className={styles.seeAll}>
          <span>See all servers</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.servers}>
        {SERVERS.map(server => {
          const live = liveByKey[server.key];
          const isOnline = live.status === 'online';
          const onlineText = live.online !== null ? nf.format(live.online) : '—';
          const ratio =
            isOnline && live.online !== null
              ? Math.min(1, live.online / SOFT_PLAYER_CAP)
              : 0;

          return (
            <article key={server.key} className={styles.server}>
              <div className={styles.serverTop}>
                <div className={styles.serverName}>
                  <span
                    className={`${styles.dot} ${isOnline ? '' : styles.dotOffline}`}
                    aria-hidden="true"
                  />
                  <span>{server.name}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${isOnline ? '' : styles.statusBadgeOffline}`}
                >
                  {isOnline ? 'online' : 'offline'}
                </span>
              </div>

              <p className={styles.serverDesc}>{server.description}</p>

              <div className={styles.playersRow}>
                <span className={styles.playersLabel}>Players online</span>
                <span className={styles.playersValue}>{onlineText}</span>
              </div>

              <div className={styles.bar}>
                <span
                  className={`${styles.barFill} ${isOnline ? '' : styles.barFillEmpty}`}
                  style={{ width: `${Math.round(ratio * 100)}%` }}
                />
              </div>

              <div className={styles.serverFoot}>
                <span className={styles.serverMeta}>{server.meta}</span>
                <Link href="/dashboard/servers" className={styles.joinButton}>
                  <span>Join</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.bottom}>
        <div className={styles.activity}>
          <div className={styles.activityHead}>
            <h2 className={styles.activityTitle}>Recent activity</h2>
            <Link href="/dashboard/history" className={styles.viewAll}>
              View all
            </Link>
          </div>

          {!activityReady && (
            <p className={styles.activityEmpty}>Loading…</p>
          )}

          {activityReady && activity.length === 0 && (
            <p className={styles.activityEmpty}>
              No activity yet. Your purchases will show up here.
            </p>
          )}

          {activityReady &&
            activity.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`${styles.activityRow} ${item.desktopOnly ? styles.desktopOnly : ''}`}
            >
              <span className={styles.activityIcon}>
                {item.img ? (
                  <Image src={item.img} alt="" width={28} height={28} className={styles.activityImg} />
                ) : (
                  <span
                    className={styles.activityMask}
                    style={{
                      maskImage: `url("/icons/dashboard/${item.icon}.svg")`,
                      WebkitMaskImage: `url("/icons/dashboard/${item.icon}.svg")`,
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className={styles.activityText}>
                <span className={styles.activityRowTitle}>{item.title}</span>
                <span className={styles.activityTime}>{item.time}</span>
              </span>
              {item.amount && (
                <span
                  className={`${styles.activityAmount} ${
                    item.tone === 'neg' ? styles.amountNeg : styles.amountPos
                  }`}
                >
                  {item.amount}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.crystals}>
          <span className={styles.crystalsLabel}>Top up</span>
          <h2 className={styles.crystalsTitle}>Need more crystals?</h2>
          <p className={styles.crystalsText}>
            Buy a pack and unlock privileges, cosmetics, and tournament entries.
          </p>

          <div className={styles.packs}>
            {PACK_AMOUNTS.map(amount => (
              <div key={amount} className={styles.pack}>
                <span className={styles.packLeft}>
                  <Image src="/profile/img.png" alt="" width={16} height={20} className={styles.packIcon} />
                  <span className={styles.packAmount}>{nf.format(amount)}</span>
                </span>
                <span className={styles.packPrice}>
                  {formatMoney(crystalsToCurrency(amount, currency), currency)}
                </span>
              </div>
            ))}
          </div>

          <Link href="/dashboard/shop" className={styles.openShop}>
            Open Shop
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}
