import { getTranslations } from 'next-intl/server';
import { Container } from '../../../_components/Container/Container';
import { Divider } from '../../../_components/Divider/Divider';
import CardList from './CardList/CardList';
import { NewPlayerBonus } from './NewPlayerBonus/NewPlayerBonus';
import { ServerLiveStats } from './ServerLiveStats/ServerLiveStats';
import { ServerTopPlayers } from './ServerTopPlayers/ServerTopPlayers';
import styles from './Server.module.css';

export default async function Server() {
  const t = await getTranslations('home');

  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>{t('server.title')}</h2>
          <p className={styles.description}>
            {t('server.descLine1')}
            <br />
            {t('server.descLine2')}
          </p>
          <div className={styles.cards}>
            <CardList />
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statsCards}>
              <ServerLiveStats />
              <ServerTopPlayers />
            </div>

            <NewPlayerBonus />
          </div>
        </Container>
      </section>

      <Divider />
    </>
  );
}
