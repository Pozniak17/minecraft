import { Container } from '@/app/_components/Container/Container';
import styles from './Articles.module.css';
import CardList from '../CardList/CardList';
import type { ArticleCardProps } from '../CardList/Card/Card';

const ARTICLES: ArticleCardProps[] = [
  {
    image: '/blog/1.webp',
    genre: 'Guides',
    time: 4,
    title: 'Top 10 survival tips for absolute beginners',
    description:
      'Spawning in a fresh world is overwhelming. Here is the short list of things to do in your first hour.',
    author: 'Sarah Kim',
    date: 'Apr 22, 2026',
  },
  {
    image: '/blog/2.webp',
    genre: 'Engineering',
    time: 6,
    title: 'How to build an efficient iron farm in 2026',
    description:
      'A compact, lag-friendly design that produces ~600 ingots per hour and works on every server in our ecosystem.',
    author: 'Alex Petrov',
    date: 'Apr 18, 2026',
  },
  {
    image: '/blog/3.webp',
    genre: 'PvP',
    time: 5,
    title: 'PvP loadouts that actually work on Anarchy',
    description:
      'We tested 18 builds across two weeks of small-scale fights. Four loadouts keep winning — the rest, retire.',
    author: 'Jonas Bergman',
    date: 'Apr 15, 2026',
  },

  {
    image: '/blog/4.webp',
    genre: 'Community',
    time: 3,
    title: 'Player of the month: meet RedstoneKing',
    description:
      "A 13-month run, a 40-floor sky base, and an impressive tournament finish — the full story from this month's spotlight.",
    author: 'Lena Park',
    date: 'Apr 12, 2026',
  },

  {
    image: '/blog/5.webp',
    genre: 'Tutorials',
    time: 5,
    title: 'Redstone 101: an automated wheat farm in 30 minutes',
    description:
      'No prior redstone knowledge needed. Every block, every comparator, and the trick that doubles your yield.',
    author: 'Diego Marin',
    date: 'Apr 8, 2026',
  },

  {
    image: '/blog/6.webp',
    genre: 'Updates',
    time: 4,
    title: 'The 7 best resource packs to try in 2026',
    description:
      'From minimal vanilla refreshes to painterly worlds — the packs our team is running on every server right now.',
    author: 'Mia Chen',
    date: 'Apr 4, 2026',
  },
];

export default function Articles() {
  return (
    <section className={styles.articles}>
      <Container>
        <div className={styles.article_wrapper}>
          <h2 className={styles.title}>Latest articles</h2>
          <button className={styles.button_sort}>
            Newest
            <span className={styles.arrow}>▾</span>
          </button>
        </div>
        <CardList articles={ARTICLES} />
      </Container>
    </section>
  );
}
