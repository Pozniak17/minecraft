import { Container } from '@/app/_components/Container/Container';
import styles from './AboutEconomy.module.css';

export default function AboutEconomy() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.bg_image}></div>
        <div className={styles.inner}>
          <span className={styles.badge}>Economy & Privileges</span>
          <h2 className={styles.title}>Your comfort, your customization</h2>
          <p className={styles.description}>
            We built a fair and transparent ecosystem. Earn the in-game currency while you play, or
            support the project to unlock unique privileges, custom cosmetic items, and boosters that
            make you stand out and make gameplay even more enjoyable.
          </p>

          <ul className={styles.list}>
            <li className={styles.item}>
              <p className={styles.text}>
                Cosmetic items<span className={styles.accent}>100+</span>
              </p>
            </li>

            <li className={styles.item}>
              <p className={styles.text}>
                Privilege tiers<span className={styles.accent}>20+</span>
              </p>
            </li>

            <li className={styles.item}>
              <p className={styles.text}>
                Live economy<span className={styles.accent}>24/7</span>
              </p>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
