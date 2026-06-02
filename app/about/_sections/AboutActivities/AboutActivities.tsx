import { Container } from '@/app/_components/Container/Container';
import styles from './AboutActivities.module.css';
import CardList from './CardList/CardList';

export default function AboutActivities() {
  return (
    <section className={styles.section}>
      <Container>
        <span className={styles.badge}>Activities & Tournaments</span>
        <h2 className={styles.title}>Become a legend of the ecosystem</h2>

        <p className={styles.description}>
          Our ecosystem never sleeps. Every week we run large-scale events. Take part in regular
          tournaments with real prizes and fight for top spots in the global rankings.
        </p>

        <div className={styles.leaderboard}>
          <p className={styles.leaderboardTitle}>Top Players</p>
          <CardList />
        </div>
      </Container>
    </section>
  );
}
