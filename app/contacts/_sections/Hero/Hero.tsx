import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import { Badge } from '@/app/_components/Badge/Badge';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { CONTACT_STATS, SUPPORT_EMAIL } from '@/lib/data/contacts';
import { TWITCH_URL } from '@/lib/data/social';
import styles from './Hero.module.css';

const BREADCRUMB_ITEMS = ['Home', 'FAQ', 'Contacts'];
const BREADCRUMB_LINKS = ['/', '/faq'];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} aria-hidden="true" />

      <Container variant="faq" className={styles.content}>
        <Breadcrumbs items={BREADCRUMB_ITEMS} links={BREADCRUMB_LINKS} />

        <div className={styles.head}>
          <Badge className={styles.badge}>Get in touch</Badge>
          <h1 className={styles.title}>Contact us</h1>
          <p className={`${styles.description} ${styles.descriptionMobile}`}>
            Our team is here to help. Pick the channel that works best for you.
          </p>
          <p className={`${styles.description} ${styles.descriptionDesktop}`}>
            Our support team is here to help. Email, Twitch, or the FAQ — whichever is easiest for
            you.
          </p>
        </div>

        <div className={styles.stats}>
          {CONTACT_STATS.map(stat => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>
                <span className={styles.statLabelMobile}>{stat.label}</span>
                <span className={styles.statLabelDesktop}>{stat.labelDesktop}</span>
              </span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.actionPrimary}>
            Email us
          </a>
          <a
            href={TWITCH_URL}
            className={styles.actionSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Twitch
          </a>
          <Link href="/faq" className={styles.actionSecondary}>
            Browse FAQ
          </Link>
        </div>
      </Container>
    </section>
  );
}
