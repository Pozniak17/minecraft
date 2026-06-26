import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Rate.module.css';
import RateCard from './RateCard/RateCard';
import { Divider } from '@/app/_components/Divider/Divider';
import { TOP_RATED_PLAYERS, type TopRatedPlayer } from '@/lib/data/topRatedPlayers';

export type RateCardProps = TopRatedPlayer;

export default async function Rate() {
  const t = await getTranslations('home');

  return (
    <>
      <section className={styles.rateSection}>
        <Container>
          <h2 className={styles.title}>{t('rate.title')}</h2>
          <p className={styles.text}>{t('rate.text')}</p>
          <div className={styles.rateHeader} aria-hidden="true">
            <span>{t('rate.rank')}</span>
            <span>{t('rate.player')}</span>
            <span>{t('rate.server')}</span>
            <span>{t('rate.level')}</span>
            <span>{t('rate.playtime')}</span>
            <span>{t('rate.activityScore')}</span>
          </div>
          <ul className={styles.rateList}>
            {TOP_RATED_PLAYERS.map(card => (
              <RateCard
                key={`${card.rank}-${card.player}`}
                rank={card.rank}
                player={card.player}
                server={card.server}
                level={card.level}
                play_time={card.play_time}
                active_score={card.active_score}
              />
            ))}
          </ul>
        </Container>
      </section>
      <Divider />
    </>
  );
}
