import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { categoryHref } from '@/app/blog/categories';
import styles from './Hero.module.css';
import Image from 'next/image';

const BREADCRUMB_ITEMS = ['Home', 'Blog', 'Updates', 'Server Update 2.6'];
const BREADCRUMB_LINKS = ['/', '/blog', categoryHref('Updates')];

export default function Hero() {
  return (
    <div className={styles.page}>
      <Container variant="blog">
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <Breadcrumbs items={BREADCRUMB_ITEMS} links={BREADCRUMB_LINKS} />
            <ul className={styles.tags}>
              <li>
                <span>Updates</span>
              </li>
              <li>
                <span>Featured</span>
              </li>
            </ul>
            <h1 className={styles.title}>
              Server Update 2.6 — custom crafts, economy rebalance, and the biggest patch of
              the season
            </h1>

            <p className={styles.description}>
              After eight weeks on the public test branch, the 2.6 patch is finally rolling out
              across every server.
            </p>
            <p className={styles.descriptionDesktop}>
              After eight weeks on the public test branch, the 2.6 patch is finally rolling out to
              every server. We refreshed spawn hubs on LuckySurvival, MineWars, and CalmSky, added 12 new custom
              crafts, rebalanced the economy, and shipped a brand-new tournament mode.
            </p>

            <div className={styles.meta}>
              <span className={styles.date}>Apr 28, 2026</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.readTime}>7 min read</span>
            </div>
          </div>

          <Image
            src="/blog/blog-featured.webp"
            alt="Server Update 2.6 hero illustration"
            width={375}
            height={203}
            className={`${styles.image} ${styles.imageMobile}`}
            priority
          />
          <Image
            src="/blog/update-hero-desktop.png"
            alt="Server Update 2.6 hero illustration"
            width={1114}
            height={603}
            className={`${styles.image} ${styles.imageDesktop}`}
            priority
          />
        </div>
      </Container>
    </div>
  );
}
