import Image from 'next/image';
import styles from './AboutMission.module.css';
import { Container } from '@/app/_components/Container/Container';

export default function AboutMission() {
  return (
    <section className={styles.section}>
      <Container>
        <span className={styles.badge}>Mission</span>
        <h2 className={styles.title}>Who we are</h2>
        <p className={styles.description}>
          Built by friends in love with Minecraft — grown into a full-scale ecosystem powered by
          community.
        </p>

        <p className={styles.description}>
          This project is more than a set of servers — it is a full community. We started as a small
          group of friends in love with Minecraft and grew into a large ecosystem. Our goal is to
          give players quality hosting, stable TPS, unique custom plugins, and — most importantly —
          a safe and friendly atmosphere to play in. We keep evolving and we listen to every piece
          of feedback we receive.
        </p>

        <ul className={styles.iconList}>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon1.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon2.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon3.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon4.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
        </ul>
      </Container>
    </section>
  );
}
