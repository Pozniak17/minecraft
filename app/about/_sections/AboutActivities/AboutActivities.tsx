import { Container } from '@/app/_components/Container/Container';
import styles from './AboutActivities.module.css';
import CardList from './CardList/CardList';

export default function AboutActivities() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.leaderboard}>
            <p className={styles.leaderboardTitle}>Top Players</p>
            <CardList />
          </div>

          <div className={styles.main}>
            <div className={styles.content}>
              <span className={styles.badge}>Activities & Tournaments</span>
              <h2 className={styles.title}>Become a legend of the ecosystem</h2>
              <p className={styles.description}>
                Our ecosystem never sleeps. Every week we run large-scale events and in-game
                activities. Take part in regular tournaments with real prizes, fight for top spots in
                the global rankings — top by wealth, top by kills, top by hours played — and show
                everyone who is in charge.
              </p>
            </div>

            <ul className={styles.bottomList}>
              <li className={styles.bottomItem}>Weekly tournaments with prize pools</li>
              <li className={styles.bottomItem}>Global rankings: wealth, kills, time</li>
              <li className={styles.bottomItem}>Seasonal events and limited rewards</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
