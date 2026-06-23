import type { ArticleCardProps } from '../CardList/Card/Card';
import { BLOG_POSTS } from '../_article/posts';

export type BlogArticle = ArticleCardProps & {
  popularity: number;
  slug: string;
};

export type ArticleSort = 'all' | 'newest' | 'popular';

export const ARTICLE_SORT_OPTIONS: { value: ArticleSort; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
];

export const BLOG_ARTICLES: BlogArticle[] = BLOG_POSTS.map(
  ({
    popularity,
    slug,
    heroTags: _heroTags,
    sidebarTags: _sidebarTags,
    breadcrumbLabel: _breadcrumbLabel,
    descriptionDesktop: _descriptionDesktop,
    heroImageDesktop: _heroImageDesktop,
    lead: _lead,
    sections: _sections,
    ...article
  }) => ({
    ...article,
    slug,
    popularity,
  }),
);

function toTimestamp(date: Date | string): number {
  const parsed = date instanceof Date ? date : new Date(date);
  return parsed.getTime();
}

export function sortBlogArticles(
  articles: BlogArticle[],
  sort: ArticleSort,
): (ArticleCardProps & { slug: string })[] {
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
