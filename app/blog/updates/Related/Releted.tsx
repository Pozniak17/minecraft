import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import Card, { type ArticleCardProps } from '@/app/blog/CardList/Card/Card';
import styles from './Releted.module.css';

const RELATED_ARTICLES: (ArticleCardProps & { slug: string })[] = [
  {
    image: '/blog/1.webp',
    genre: 'Guides',
    time: 4,
    title: 'Top 10 survival tips for absolute beginners',
    description:
      'Spawning in a fresh world is overwhelming. Here is the short list of things to do in your first hour.',
    date: 'Apr 22, 2026',
    slug: 'survival-tips',
  },
  {
    image: '/blog/2.webp',
    genre: 'Engineering',
    time: 6,
    title: 'How to build an efficient iron farm in 2026',
    description:
      'A compact, lag-friendly design that produces ~600 ingots per hour and works on every server in our ecosystem.',
    date: 'Apr 18, 2026',
    slug: 'iron-farm',
  },
  {
    image: '/blog/3.webp',
    genre: 'PvP',
    time: 5,
    title: 'PvP loadouts that actually work on Anarchy',
    description:
      'We tested 18 builds across two weeks of small-scale fights. Four loadouts keep winning — the rest, retire.',
    date: 'Apr 15, 2026',
    slug: 'pvp-loadouts',
  },
];

const RELATED_ARTICLES_DESKTOP: ArticleCardProps[] = [
  {
    ...RELATED_ARTICLES[0],
    description:
      'Spawning in a fresh world is overwhelming. Here is the short list of things to do in your first hour — and the three mistakes that ruin most new runs.',
  },
  {
    ...RELATED_ARTICLES[1],
    description:
      'A compact, lag-friendly design that produces around 600 ingots per hour and works on every server in our ecosystem — no datapacks required.',
  },
  {
    ...RELATED_ARTICLES[2],
    description:
      'We tested 18 builds across two weeks of small-scale fights. These are the four loadouts that keep winning, plus the ones you can safely retire.',
  },
];

export default function Related() {
  return (
    <section className={styles.related}>
      <Container variant="blog">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <span className={styles.badge}>Popular this week</span>
              <h2 className={styles.title}>Keep reading</h2>
            </div>

            <Link href="/blog" className={`${styles.button} ${styles.buttonDesktop}`}>
              All articles
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={`${styles.list} ${styles.listMobile}`}>
            {RELATED_ARTICLES.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <ul className={`${styles.list} ${styles.listDesktop}`}>
            {RELATED_ARTICLES_DESKTOP.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <Link href="/blog" className={`${styles.button} ${styles.buttonMobile}`}>
            All articles
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
