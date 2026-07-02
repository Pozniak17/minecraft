'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DASHBOARD_SERVERS, type DashboardServer } from '@/lib/data/dashboardServers';
import { useServerOnline } from '@/lib/client/useServerOnline';
import styles from './Servers.module.css';

/** Лише для ширини зеленої смуги — не показується користувачу. */
function getOnlineBarWidth(online: number, chartData: number[]): number {
  const peak = Math.max(...chartData, 1);
  return Math.min(100, Math.max(12, Math.round((online / peak) * 100)));
}

function ServerCard({ server }: { server: DashboardServer }) {
  const t = useTranslations('serversData');
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useServerOnline(server.id);
  const isOnline = live.status === 'online';
  const showPlayers = isOnline && live.online !== null;
  const mobileTitle = server.nameMobile ?? server.name;
  const playersMobile = showPlayers ? `${live.online} ${t('ui.players')}` : null;
  const playersDesktop = showPlayers ? String(live.online) : null;
  const statusLabel = live.status === 'loading' ? t('ui.checking') : isOnline ? t('ui.online') : t('ui.offline');

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleCopyIp = useCallback(() => {
    void navigator.clipboard.writeText(server.ip).then(() => {
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1500);
    });
  }, [server.ip]);

  return (
    <li className={styles.card}>
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
            {statusLabel}
          </span>
          {isOnline ? <span className={styles.latency}>{server.latency}</span> : null}
        </div>

        <h2 className={styles.cardTitle}>
          <span className={styles.titleMobile}>{mobileTitle}</span>
          <span className={styles.titleDesktop}>{server.name}</span>
        </h2>

        {playersMobile ? <p className={styles.playersMobile}>{playersMobile}</p> : null}

        <p className={styles.description}>{t(`${server.id}.description`)}</p>

        {showPlayers ? (
          <div className={styles.playersRow}>
            <span className={styles.playersLabel}>{t('ui.playersOnline')}</span>
            <span className={styles.playersCount}>{playersDesktop}</span>
          </div>
        ) : null}

        {showPlayers ? (
          <div className={styles.bar} aria-hidden>
            <span
              className={styles.barFill}
              style={{ width: `${getOnlineBarWidth(live.online!, server.chartData)}%` }}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.join} onClick={handleCopyIp}>
          {copied ? (
            t('ui.copied')
          ) : (
            <>
              <span className={styles.joinMobile}>{t('ui.copyIp')}</span>
              <span className={styles.joinDesktop}>{t('ui.copyIp')}</span>
            </>
          )}
        </button>
        <Link href={`/dashboard/servers/${server.id}`} className={styles.open}>
          <span className={styles.openMobile}>{t('ui.open')}</span>
          <span className={styles.openDesktop}>
            {t('ui.openPage')} <span className={styles.openArrow}>→</span>
          </span>
        </Link>
      </div>
    </li>
  );
}

export default function Servers() {
  const t = useTranslations('serversData');

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>{t('ui.serversEyebrow')}</span>
          <h1 className={styles.title}>{t('ui.pickYourWorld')}</h1>
          <p className={styles.subtitle}>
            {t('ui.subtitleMain')}
            <span className={styles.subtitleExtra}> {t('ui.subtitleTap')}</span>
            <span className={styles.subtitleDesktop}> {t('ui.subtitleClick')}</span>
          </p>
        </div>

        <div className={styles.refresh}>
          <span className={styles.refreshDot} aria-hidden />
          {t('ui.autoRefresh')}
        </div>
      </header>

      <ul className={styles.list}>
        {DASHBOARD_SERVERS.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </ul>
    </section>
  );
}
