import Image from 'next/image';
import Link from 'next/link';
import { getDashboardPlayHref } from '@/lib/data/servers';
import styles from './StartAdventure.module.css';
import { Container } from '../../../_components/Container/Container';

export default function StartAdventure({ isAuthed = false }: { isAuthed?: boolean }) {
  const playHref = getDashboardPlayHref(isAuthed);

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>Ready to start your adventure?</h2>
            <p className={styles.description}>Join the world of unique Minecraft servers.</p>
            <Link href={playHref} className={styles.btn}>
              Play Now
            </Link>
          </div>
        </div>
      </Container>

      {/* Decorative video — anchored to 1440 column (desktop only) */}
      <div className={styles.frame}>
        <div className={styles.videoBox}>
          <video
            src="/video/big_cat.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className={styles.video}
          />
          <Image
            src="/icons/illustrations/effect.png"
            alt=""
            fill
            loading="lazy"
            className={styles.effect}
          />
        </div>
      </div>
    </section>
  );
}
