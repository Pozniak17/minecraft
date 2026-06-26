import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '../../../_components/Container/Container';
import { Divider } from '../../../_components/Divider/Divider';
import CardList from './CardList/CardList';
import { NewPlayerBonus } from './NewPlayerBonus/NewPlayerBonus';
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
                      100+
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
                      3 / 3
                    </span>
                  </li>
                </ul>
              </div>
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
                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>AlexPvP</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      4,520 pts
                    </span>
                  </li>

                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>SkyBuilder</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      3,980 pts
                    </span>
                  </li>

                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>WarLord</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      3,740 pts
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <NewPlayerBonus />
          </div>
        </Container>
      </section>

      <Divider />
    </>
  );
}
