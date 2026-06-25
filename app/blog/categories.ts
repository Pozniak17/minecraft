import type { ArticleCardProps } from './CardList/Card/Card';

export const BLOG_CATEGORIES = [
  'All',
  'Guides',
  'Engineering',
  'PvP',
  'Community',
  'Updates',
  'Tutorials',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
type BlogGenre = Exclude<BlogCategory, 'All'>;

export function parseCategoryParam(value: string | null | undefined): BlogCategory {
  if (value && BLOG_CATEGORIES.includes(value as BlogCategory) && value !== 'All') {
    return value as BlogGenre;
  }

  return 'All';
}

export function categoryHref(category: BlogCategory): string {
  if (category === 'All') {
    return '/blog';
  }

  return `/blog?category=${encodeURIComponent(category)}`;
}

export function filterArticlesByCategory<T extends Pick<ArticleCardProps, 'genre'>>(
  articles: T[],
  category: BlogCategory,
): T[] {
  if (category === 'All') {
    return articles;
  }

  return articles.filter(article => article.genre === category);
}
