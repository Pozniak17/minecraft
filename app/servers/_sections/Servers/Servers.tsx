'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DASHBOARD_SERVERS } from '@/lib/data/dashboardServers';
import styles from './Servers.module.css';

export default function Servers() {
  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>Servers</span>
          <h1 className={styles.title}>Pick your world</h1>
          <p className={styles.subtitle}>
            Live status, current load, latency.
            <span className={styles.subtitleExtra}> Tap a card to open the server.</span>
            <span className={styles.subtitleDesktop}>
              {' '}
              Click a server to see details and copy IP.
            </span>
          </p>
        </div>

        <div className={styles.refresh}>
          <span className={styles.refreshDot} aria-hidden />
          Auto refresh — 10 s
        </div>
      </header>

      <ul className={styles.list}>
        {DASHBOARD_SERVERS.map(server => {
          const ratio = server.max > 0 ? server.current / server.max : 0;
          const isOnline = server.status === 'online';
          const mobileTitle = server.nameMobile ?? server.name;
          const playersMobile = `${server.current}/${server.max} players`;
          const playersDesktop = `${server.current} / ${server.max}`;

          return (
            <li key={server.id} className={styles.card}>
              <div className={styles.thumb}>
                <Image
                  src={server.image}
                  alt=""
                  width={214}
                  height={140}
                  className={styles.thumbImg}
                  aria-hidden
                />
              </div>

              <div className={styles.body}>
                <div className={styles.tagRow}>
                  <span
                    className={`${styles.status} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
                  >
                    <span className={styles.statusDot} aria-hidden />
                    {server.status}
                  </span>
                  <span className={styles.latency}>{server.latency}</span>
                </div>

                <h2 className={styles.cardTitle}>
                  <span className={styles.titleMobile}>{mobileTitle}</span>
                  <span className={styles.titleDesktop}>{server.name}</span>
                </h2>

                <p className={styles.playersMobile}>{playersMobile}</p>

                <p className={styles.description}>{server.description}</p>

                <div className={styles.playersRow}>
                  <span className={styles.playersLabel}>Players online</span>
                  <span className={styles.playersCount}>{playersDesktop}</span>
                </div>

                <div className={styles.bar} aria-hidden>
                  <span
                    className={`${styles.barFill} ${!isOnline ? styles.barFillEmpty : ''}`}
                    style={{ width: `${Math.round(ratio * 100)}%` }}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.join} ${!isOnline ? styles.joinMuted : ''}`}
                >
                  <span className={styles.joinMobile}>{server.joinLabel}</span>
                  <span className={styles.joinDesktop}>{server.joinLabelDesktop}</span>
                </button>
                <Link href={`/dashboard/servers/${server.id}`} className={styles.open}>
                  <span className={styles.openMobile}>Open</span>
                  <span className={styles.openDesktop}>
                    Open page <span className={styles.openArrow}>→</span>
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
