import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RateCardProps } from '../Rate';
import styles from './RateCard.module.css';

export default async function RateCard({
  rank,
  player,
  server,
  level,
  play_time,
  active_score,
}: RateCardProps) {
  const t = await getTranslations('home');

  return (
    <li className={styles.rateCard}>
      <div className={`${styles.cell} ${styles.cellRank}`}>
        <span className={styles.label}>{t('rate.rank')}</span>
        <span className={styles.value}>
          <Image
            src="/icons/illustrations/champ-cup.webp"
            alt=""
            width={20}
            height={22}
            className={styles.cup}
          />
          {rank}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.cellPlayer}`}>
        <span className={styles.label}>{t('rate.player')}</span>
        <span className={styles.value}>{player}</span>
      </div>

      <div className={`${styles.cell} ${styles.cellServer}`}>
        <span className={styles.label}>{t('rate.server')}</span>
        <span className={styles.value}>
          <Image
            src="/icons/icons/ellipse.svg"
            alt=""
            width={9}
            height={9}
            className={styles.serverDot}
            aria-hidden
          />
          {server}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.cellLevel}`}>
        <span className={styles.label}>{t('rate.level')}</span>
        <span className={styles.value}>{level}</span>
      </div>

      <div className={`${styles.cell} ${styles.cellPlaytime}`}>
        <span className={styles.label}>{t('rate.playtime')}</span>
        <span className={styles.value}>{play_time}</span>
      </div>

      <div className={`${styles.cell} ${styles.cellScore}`}>
        <span className={styles.label}>{t('rate.activityScore')}</span>
        <span className={styles.value}>{active_score}</span>
      </div>
    </li>
  );
}
