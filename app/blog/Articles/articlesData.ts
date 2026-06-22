import type { ArticleCardProps } from '../CardList/Card/Card';

export type BlogArticle = ArticleCardProps & {
  popularity: number;
};

export type ArticleSort = 'all' | 'newest' | 'popular';

export const ARTICLE_SORT_OPTIONS: { value: ArticleSort; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    image: '/blog/1.webp',
    genre: 'Guides',
    time: 4,
    title: 'Top 10 survival tips for absolute beginners',
    description:
      'Spawning in a fresh world is overwhelming. Here is the short list of things to do in your first hour.',
    date: 'Apr 22, 2026',
    popularity: 920,
  },
  {
    image: '/blog/2.webp',
    genre: 'Engineering',
    time: 6,
    title: 'How to build an efficient iron farm in 2026',
    description:
      'A compact, lag-friendly design that produces ~600 ingots per hour and works on every server in our ecosystem.',
    date: 'Apr 18, 2026',
    popularity: 1240,
  },
  {
    image: '/blog/3.webp',
    genre: 'PvP',
    time: 5,
    title: 'PvP loadouts that actually work on Anarchy',
    description:
      'We tested 18 builds across two weeks of small-scale fights. Four loadouts keep winning — the rest, retire.',
    date: 'Apr 15, 2026',
    popularity: 1580,
  },
  {
    image: '/blog/4.webp',
    genre: 'Community',
    time: 3,
    title: 'Player of the month: meet RedstoneKing',
    description:
      "A 13-month run, a 40-floor sky base, and an impressive tournament finish — the full story from this month's spotlight.",
    date: 'Apr 12, 2026',
    popularity: 760,
  },
  {
    image: '/blog/5.webp',
    genre: 'Tutorials',
    time: 5,
    title: 'Redstone 101: an automated wheat farm in 30 minutes',
    description:
      'No prior redstone knowledge needed. Every block, every comparator, and the trick that doubles your yield.',
    date: 'Apr 8, 2026',
    popularity: 1100,
  },
  {
    image: '/blog/6.webp',
    genre: 'Updates',
    time: 4,
    title: 'The 7 best resource packs to try in 2026',
    description:
      'From minimal vanilla refreshes to painterly worlds — the packs our team is running on every server right now.',
    date: 'Apr 4, 2026',
    popularity: 680,
  },
];

function toTimestamp(date: Date | string): number {
  const parsed = date instanceof Date ? date : new Date(date);
  return parsed.getTime();
}

export function sortBlogArticles(articles: BlogArticle[], sort: ArticleSort): ArticleCardProps[] {
  if (sort === 'all') {
    return articles.map(({ popularity: _popularity, ...article }) => article);
  }

  const sorted = [...articles];

  if (sort === 'newest') {
    sorted.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
  } else {
    sorted.sort((a, b) => b.popularity - a.popularity);
  }

  return sorted.map(({ popularity: _popularity, ...article }) => article);
}
