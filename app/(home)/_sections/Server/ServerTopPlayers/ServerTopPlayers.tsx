import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getTopRatedPlayersPreview } from '@/lib/data/topRatedPlayers';
import styles from '../Server.module.css';

export async function ServerTopPlayers() {
  const t = await getTranslations('home');
  const topPlayers = getTopRatedPlayersPreview();

  return (
    <div className={styles.topPlayers}>
      <h3 className={styles.statsTitleWrapper}>
        {t('server.topPlayersToday')}
        <Image
          src="/icons/illustrations/champ-cup.webp"
          alt=""
          width={33}
          height={36}
          aria-hidden="true"
        />
      </h3>

      <ul className={styles.statsList}>
        {topPlayers.map(player => (
          <li key={player.rank} className={styles.statsItem}>
            <p className={styles.statsItemText}>{player.player}</p>
            <span className={styles.statsBadge}>
              <Image
                className={styles.statsBadgeDot}
                src="/icons/icons/ellipse.svg"
                alt=""
                width={7}
                height={7}
              />
              {t('server.topPlayerPoints', { score: player.active_score })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
