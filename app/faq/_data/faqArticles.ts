export type FaqArticleMeta = {
  slug: string;
  listId: string;
  category: string;
  categoryLabel: string;
  breadcrumbCategory: string;
  breadcrumbShort: string;
  breadcrumbItemsDesktop: string[];
  breadcrumbLinksDesktop: string[];
  question: string;
  updated: string;
  updatedFull: string;
  views: number;
  helpfulPercent: number;
  readMinutes: number;
  quickAnswer: string;
  featured?: boolean;
};

export const FAQ_ARTICLE_JOIN: FaqArticleMeta = {
  slug: 'join',
  listId: '01',
  category: 'getting-started',
  categoryLabel: 'Getting started',
  breadcrumbCategory: 'Getting started',
  breadcrumbShort: 'Join',
  breadcrumbItemsDesktop: ['Home', 'Support', 'FAQ', 'Getting started', 'How to join'],
  breadcrumbLinksDesktop: ['/', '/support', '/faq', '/faq'],
  question: 'How do I join the server for the first time?',
  updated: 'May 12',
  updatedFull: 'Updated May 12, 2026',
  views: 12840,
  helpfulPercent: 94,
  readMinutes: 3,
  quickAnswer:
    'Sign up → choose a server → copy IP → paste into Minecraft → Multiplayer → Add Server. The whole flow takes about 2 minutes if Minecraft is already installed.',
  featured: true,
};

const FAQ_ARTICLES: FaqArticleMeta[] = [FAQ_ARTICLE_JOIN];

export function getFaqArticleBySlug(slug: string): FaqArticleMeta | undefined {
  return FAQ_ARTICLES.find(article => article.slug === slug);
}

export function getFaqArticleHref(slug: string): string {
  return `/faq/${slug}`;
}

export function formatArticleViews(views: number): string {
  return views.toLocaleString('en-US');
}
