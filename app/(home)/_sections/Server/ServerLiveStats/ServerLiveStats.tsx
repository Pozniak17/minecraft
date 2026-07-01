'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAllServersOnline } from '@/lib/client/useAllServersOnline';
import styles from '../Server.module.css';

export function ServerLiveStats() {
  const t = useTranslations('home');
  const { totalOnline, serversOnline, totalServers, status } = useAllServersOnline();
  const isLoading = status === 'loading';

  return (
    <div className={styles.stats}>
      <h3 className={styles.statsTitle}>{t('server.liveStats')}</h3>
      <ul className={styles.statsList}>
        <li className={styles.statsItem}>
          <p className={styles.statsItemText}>{t('server.totalPlayersOnline')}</p>
          <span className={styles.statsBadge}>
            <Image
              className={styles.statsBadgeDot}
              src="/icons/icons/ellipse.svg"
              alt=""
              width={7}
              height={7}
            />
            {isLoading ? '…' : (totalOnline ?? '—')}
          </span>
        </li>

        <li className={styles.statsItem}>
          <p className={styles.statsItemText}>{t('server.serversOnline')}</p>
          <span className={styles.statsBadge}>
            <Image
              className={styles.statsBadgeDot}
              src="/icons/icons/ellipse.svg"
              alt=""
              width={7}
              height={7}
            />
            {isLoading ? '…' : `${serversOnline} / ${totalServers}`}
          </span>
        </li>
      </ul>
    </div>
  );
}
