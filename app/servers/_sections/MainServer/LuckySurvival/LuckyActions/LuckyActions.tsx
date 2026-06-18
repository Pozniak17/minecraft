import Image from 'next/image';
import Link from 'next/link';
import styles from './LuckyActions.module.css';

export default function LuckyActions({ isAuthed = false }: { isAuthed?: boolean }) {
  const playHref = isAuthed ? '/dashboard/servers/classic' : '/register';

  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>Quick Actions</h3>

      <Link href={playHref} className={`${styles.button} ${styles.primary}`}>
        Play Now
      </Link>

      <button type="button" className={`${styles.button} ${styles.secondary}`}>
        <Image
          src="/icons/social/ic_outline-discord.svg"
          alt=""
          width={24}
          height={24}
          className={styles.discordIcon}
        />
        Join Discord
      </button>
    </section>
  );
}
