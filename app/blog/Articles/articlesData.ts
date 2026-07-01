import type { ArticleCardProps } from '../CardList/Card/Card';
import { BLOG_POSTS } from '../_article/posts';

export type BlogArticle = ArticleCardProps & {
  popularity: number;
  slug: string;
};

export type ArticleSort = 'all' | 'newest' | 'popular';

export const ARTICLE_SORT_OPTIONS: ArticleSort[] = ['all', 'newest', 'popular'];

export const BLOG_ARTICLES_PER_PAGE = 6;

export function paginateArticles<T>(
  items: T[],
  page: number,
  perPage = BLOG_ARTICLES_PER_PAGE,
) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    pageItems: items.slice(start, start + perPage),
    totalPages,
    activePage: safePage,
    showPagination: items.length > perPage,
  };
}

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
