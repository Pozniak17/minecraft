import Image from 'next/image';
import Link from 'next/link';
import { getDashboardPlayHref } from '@/lib/data/servers';
import { TWITCH_URL } from '@/lib/data/social';
import { Container } from '../../../_components/Container/Container';
import { Divider } from '../../../_components/Divider/Divider';
import styles from './Hero.module.css';

export function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
  const playHref = getDashboardPlayHref(isAuthed);

  return (
    <>
      <section className={styles.main}>
        {/* Video + overlay + cat share the same containing block (video size) */}
        <div className={styles.videoWrap}>
          <video
            className={styles.video}
            src="/video/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className={styles.overlay}></div>
          <div className={styles.frame}>
            <div className={styles.cat}>
              <Image
                src="/icons/illustrations/cat.webp"
                alt="Minecraft cat"
                width={488}
                height={222}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <Container className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>Minecraft:</span>
            {'\n'}A Next-Generation Ecosystem
          </h1>

          <p className={styles.description}>
            Three unique servers, an in-game economy, rankings, and tournaments. Play the way you
            like—PvP, survival, or casual building.
          </p>

          <div className={styles.buttons}>
            <Link href={playHref} className={styles.btnPrimary}>
              Play Now
            </Link>
            <a
              href={TWITCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <Image src="/icons/social/twitch.svg" alt="" width={24} height={24} />
              <span>Join Twitch</span>
            </a>
          </div>
        </Container>
      </section>

      <Divider />
    </>
  );
}
