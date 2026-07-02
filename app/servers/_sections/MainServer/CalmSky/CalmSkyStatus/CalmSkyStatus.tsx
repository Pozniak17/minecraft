'use client';

import { useTranslations } from 'next-intl';
import { formatServerOnlineCount } from '@/lib/client/formatServerOnlineCount';
import { useServerOnline } from '@/lib/client/useServerOnline';
import styles from './CalmSkyStatus.module.css';

export default function CalmSkyStatus() {
  const t = useTranslations('servers');
  const { online, status } = useServerOnline('calmsky');
  const isOffline = status === 'offline';

  const STATS = [
    {
      value: formatServerOnlineCount(online, status),
      labelMobile: t('shared.playersMobile'),
      labelDesktop: t('shared.playersDesktop'),
    },
    { value: '24/7', labelMobile: t('shared.availabilityLabel'), labelDesktop: t('shared.availabilityLabel') },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span
          className={[styles.dot, isOffline && styles.dotOffline].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
        <h3 className={styles.title}>
          <span className={styles.titleMobile}>{t('shared.liveStatusMobile')}</span>
          <span className={styles.titleDesktop}>{t('shared.liveServerStatus')}</span>
        </h3>
        <span className={isOffline ? styles.offline : styles.online}>
          {isOffline ? t('shared.offline') : t('shared.online')}
        </span>
      </div>

      <ul className={styles.stats}>
        {STATS.map((stat) => (
          <li key={stat.labelDesktop} className={styles.stat}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>
              <span className={styles.labelMobile}>{stat.labelMobile}</span>
              <span className={styles.labelDesktop}>{stat.labelDesktop}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
