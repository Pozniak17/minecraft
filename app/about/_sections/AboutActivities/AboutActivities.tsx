import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './AboutActivities.module.css';
import CardList from './CardList/CardList';

export default async function AboutActivities() {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.leaderboard}>
            <p className={styles.leaderboardTitle}>{t('about.activities.topPlayers')}</p>
            <CardList />
          </div>

          <div className={styles.main}>
            <div className={styles.content}>
              <span className={styles.badge}>{t('about.activities.badge')}</span>
              <h2 className={styles.title}>{t('about.activities.title')}</h2>
              <p className={styles.description}>{t('about.activities.description')}</p>
            </div>

            <ul className={styles.bottomList}>
              <li className={styles.bottomItem}>{t('about.activities.bullet1')}</li>
              <li className={styles.bottomItem}>{t('about.activities.bullet2')}</li>
              <li className={styles.bottomItem}>{t('about.activities.bullet3')}</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
