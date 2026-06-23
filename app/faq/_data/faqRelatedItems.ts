import {
  getFaqArticleBySlug,
  getFaqArticleHref,
  getRelatedArticleSlugs,
} from './faqArticles';

export type FaqRelatedItem = {
  category: string;
  question: string;
  excerpt: string;
  helpfulPercent: number;
  href: string;
};

export function getFaqRelatedItems(slug: string): FaqRelatedItem[] {
  return getRelatedArticleSlugs(slug, 3).flatMap(relatedSlug => {
    const meta = getFaqArticleBySlug(relatedSlug);
    if (!meta) {
      return [];
    }

    return [
      {
        category: meta.categoryLabel,
        question: meta.question,
        excerpt: meta.excerpt,
        helpfulPercent: meta.helpfulPercent,
        href: getFaqArticleHref(relatedSlug),
      },
    ];
  });
}
