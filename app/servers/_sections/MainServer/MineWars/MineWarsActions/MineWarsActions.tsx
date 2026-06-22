import Image from 'next/image';
import Link from 'next/link';
import { getPlayNowHref } from '@/lib/data/servers';
import { TWITCH_URL } from '@/lib/data/social';
import styles from './MineWarsActions.module.css';

export default function MineWarsActions({ isAuthed = false }: { isAuthed?: boolean }) {
  const playHref = getPlayNowHref('minewars', isAuthed);

  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>Quick Actions</h3>

      <Link href={playHref} className={`${styles.button} ${styles.primary}`}>
        Play Now
      </Link>

      <a
        href={TWITCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.secondary}`}
      >
        <Image
          src="/icons/social/twitch.svg"
          alt=""
          width={24}
          height={24}
          className={styles.discordIcon}
        />
        Join Twitch
      </a>
    </section>
  );
}
