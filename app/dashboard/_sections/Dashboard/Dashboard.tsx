'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api/orders';
import type { OrderListItem } from '@/lib/api/types';
import { useServerOnline } from '@/lib/client/useServerOnline';
import { crystalsToEur } from '@/lib/pricing';
import styles from './Dashboard.module.css';

const nf = new Intl.NumberFormat('en-US');
const eur = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

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
  amount?: string;
  tone?: 'pos' | 'neg';
  img?: string;
  icon?: string;
  desktopOnly?: boolean;
};

const ACTIVITY_IMAGES = [
  '/profile/activity/act-1.png',
  '/profile/activity/act-2.png',
  '/profile/activity/act-5.png',
  '/profile/img.png',
];

const PACK_AMOUNTS = [500, 1500, 5000];

function itemLabel(imageName: string | undefined): string {
  if (!imageName) return 'item';
  const base = imageName.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const cleaned = base.replace(/[-_]+/g, ' ').trim();
  return cleaned || 'item';
}

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

function orderToActivity(order: OrderListItem, index: number): ActivityItem {
  const items = order.order_item ?? [];
  const first = items[0];
  const more = items.length > 1 ? ` +${items.length - 1} more` : '';
  const currency = first?.currency ?? 'EUR';
  return {
    title: `Purchased ${itemLabel(first?.image_name)}${more}`,
    time: relativeTime(first?.created),
    amount: `-${(Number(order.total_price) || 0).toFixed(2)} ${currency}`,
    tone: 'neg',
    img: ACTIVITY_IMAGES[index % ACTIVITY_IMAGES.length],
  };
}

export default function Dashboard() {
  const [name, setName] = useState('Player');
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoaded, setActivityLoaded] = useState(false);

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

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (email) setName(email.split('@')[0]);
  }, []);

  useEffect(() => {
    let active = true;
    getOrders(1, 5)
      .then(data => {
        if (!active) return;
        setActivity(data.results.map(orderToActivity));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setActivityLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

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
          <button type="button" className={styles.notif} aria-label="Notifications">
            <span
              className={styles.notifIcon}
              style={{
                maskImage: 'url("/icons/dashboard/notification-2-line.svg")',
                WebkitMaskImage: 'url("/icons/dashboard/notification-2-line.svg")',
              }}
              aria-hidden="true"
            />
            <span className={styles.notifDot} aria-hidden="true" />
          </button>

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

          {activityLoaded && activity.length === 0 && (
            <p className={styles.activityEmpty}>
              No activity yet. Your purchases will show up here.
            </p>
          )}

          {activity.map((item, index) => (
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
                <span className={styles.packPrice}>{eur.format(crystalsToEur(amount))}</span>
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
