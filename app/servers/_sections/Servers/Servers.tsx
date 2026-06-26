'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DASHBOARD_SERVERS, type DashboardServer } from '@/lib/data/dashboardServers';
import { useServerOnline } from '@/lib/client/useServerOnline';
import styles from './Servers.module.css';

function ServerCard({ server }: { server: DashboardServer }) {
  const t = useTranslations('serversData');
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useServerOnline(server.id);
  const isOnline = live.status === 'online';
  const isLoading = live.status === 'loading';
  const current = live.online ?? (isLoading ? server.current : 0);
  const ratio = server.max > 0 ? current / server.max : 0;
  const mobileTitle = server.nameMobile ?? server.name;
  const playersMobile =
    live.online !== null
      ? `${live.online}/${server.max} ${t('ui.players')}`
      : `—/${server.max} ${t('ui.players')}`;
  const playersDesktop =
    live.online !== null ? `${live.online} / ${server.max}` : `— / ${server.max}`;
  const statusLabel = isLoading ? t('ui.checking') : isOnline ? t('ui.online') : t('ui.offline');

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
          <span className={styles.latency}>{isOnline ? server.latency : t('ui.offlineLabel')}</span>
        </div>

        <h2 className={styles.cardTitle}>
          <span className={styles.titleMobile}>{mobileTitle}</span>
          <span className={styles.titleDesktop}>{server.name}</span>
        </h2>

        <p className={styles.playersMobile}>{playersMobile}</p>

        <p className={styles.description}>{t(`${server.id}.description`)}</p>

        <div className={styles.playersRow}>
          <span className={styles.playersLabel}>{t('ui.playersOnline')}</span>
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
