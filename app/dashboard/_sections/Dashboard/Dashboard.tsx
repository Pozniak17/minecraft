'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

type ServerStatus = 'online' | 'offline';

type ServerCard = {
  name: string;
  status: ServerStatus;
  description: string;
  players: string;
  ratio: number;
  meta: string;
  cta: string;
};

const SERVERS: ServerCard[] = [
  {
    name: 'Classic',
    status: 'online',
    description: 'Survival with custom economy.',
    players: '128 / 200',
    ratio: 0.64,
    meta: 'Ping 32 ms',
    cta: 'Join',
  },
  {
    name: 'Skyblock',
    status: 'online',
    description: 'Floating islands & automation.',
    players: '84 / 150',
    ratio: 0.56,
    meta: 'Ping 38 ms',
    cta: 'Join',
  },
  {
    name: 'Anarchy',
    status: 'offline',
    description: 'No rules, just chaos.',
    players: '0 / 100',
    ratio: 0,
    meta: 'Last seen 2 h ago',
    cta: 'Notify',
  },
];

type ActivityItem = {
  title: string;
  time: string;
  amount?: string;
  tone?: 'pos' | 'neg';
  img?: string;
  icon?: string;
  desktopOnly?: boolean;
};

const ACTIVITY: ActivityItem[] = [
  { title: 'Purchased VIP+ privilege', time: '2 h ago', amount: '-980 ◆', tone: 'neg', img: '/profile/activity/act-1.png' },
  { title: 'Reached top 50 in Skyblock', time: '5 h ago', amount: '+200 ◆', tone: 'pos', img: '/profile/activity/act-2.png' },
  { title: 'Joined Classic server', time: 'Yesterday', icon: 'server-2-outline' },
  { title: 'Crystals top-up: 1,000', time: '2 days ago', amount: '+1,000 ◆', tone: 'pos', img: '/profile/img.png', desktopOnly: true },
  { title: 'Logged in from new device', time: '3 days ago', img: '/profile/activity/act-5.png', desktopOnly: true },
];

type Pack = {
  amount: string;
  price: string;
  save?: string;
};

const PACKS: Pack[] = [
  { amount: '500', price: '$4.99' },
  { amount: '1,500', price: '$12.99', save: 'Save 10%' },
  { amount: '5,000', price: '$39.99', save: 'Save 20%' },
];

export default function Dashboard() {
  const [name, setName] = useState('Player');

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    if (email) setName(email.split('@')[0]);
  }, []);

  return (
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

          <div className={styles.headerBalance}>
            <Image src="/profile/img.png" alt="" width={18} height={23} className={styles.headerBalanceIcon} />
            <span className={styles.headerBalanceValue}>2,480</span>
            <span className={styles.headerBalanceUnit}>crystals</span>
          </div>

          <Link href="/store" className={styles.topUp}>
            Top up
          </Link>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Active servers</span>
          <span className={styles.statValue}>2 / 3</span>
          <span className={styles.statHint}>Classic &amp; Skyblock online</span>
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
        <Link href="/servers" className={styles.seeAll}>
          <span>See all servers</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.servers}>
        {SERVERS.map(server => (
          <article key={server.name} className={styles.server}>
            <div className={styles.serverTop}>
              <div className={styles.serverName}>
                <span
                  className={`${styles.dot} ${server.status === 'offline' ? styles.dotOffline : ''}`}
                  aria-hidden="true"
                />
                <span>{server.name}</span>
              </div>
              <span
                className={`${styles.statusBadge} ${
                  server.status === 'offline' ? styles.statusBadgeOffline : ''
                }`}
              >
                {server.status}
              </span>
            </div>

            <p className={styles.serverDesc}>{server.description}</p>

            <div className={styles.playersRow}>
              <span className={styles.playersLabel}>Players online</span>
              <span className={styles.playersValue}>{server.players}</span>
            </div>

            <div className={styles.bar}>
              <span
                className={`${styles.barFill} ${server.status === 'offline' ? styles.barFillEmpty : ''}`}
                style={{ width: `${Math.round(server.ratio * 100)}%` }}
              />
            </div>

            <div className={styles.serverFoot}>
              <span className={styles.serverMeta}>{server.meta}</span>
              <Link href="/servers" className={styles.joinButton}>
                <span>{server.cta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.activity}>
          <div className={styles.activityHead}>
            <h2 className={styles.activityTitle}>Recent activity</h2>
            <Link href="/profile/history" className={styles.viewAll}>
              View all
            </Link>
          </div>

          {ACTIVITY.map(item => (
            <div
              key={item.title}
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
            {PACKS.map(pack => (
              <div key={pack.amount} className={styles.pack}>
                <span className={styles.packLeft}>
                  <Image src="/profile/img.png" alt="" width={16} height={20} className={styles.packIcon} />
                  <span className={styles.packAmount}>{pack.amount}</span>
                  {pack.save && <span className={styles.packSave}>{pack.save}</span>}
                </span>
                <span className={styles.packPrice}>{pack.price}</span>
              </div>
            ))}
          </div>

          <Link href="/store" className={styles.openShop}>
            Open Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
