import { Container } from '@/app/_components/Container/Container';
import styles from './Rate.module.css';
import RateCard from './RateCard/RateCard';
import { Divider } from '@/app/_components/Divider/Divider';
import { TOP_RATED_PLAYERS, type TopRatedPlayer } from '@/lib/data/topRatedPlayers';

export type RateCardProps = TopRatedPlayer;

export default function Rate() {
  return (
    <>
      <section className={styles.rateSection}>
        <Container>
          <h2 className={styles.title}>Top Rated Players</h2>
          <p className={styles.text}>Play more. Progress further. Stand out.</p>
          <div className={styles.rateHeader} aria-hidden="true">
            <span>Rank</span>
            <span>Player</span>
            <span>Server</span>
            <span>Level</span>
            <span>Playtime</span>
            <span>Activity Score</span>
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
