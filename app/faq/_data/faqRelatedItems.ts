import {
  getFaqArticleBySlug,
  getFaqArticleHref,
  getRelatedArticleSlugs,
} from './faqArticles';
import type { FaqArticleCategoryId } from './faqTypes';

export type FaqRelatedItem = {
  slug: string;
  categoryId: FaqArticleCategoryId;
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
        slug: relatedSlug,
        categoryId: meta.categoryId,
        helpfulPercent: meta.helpfulPercent,
        href: getFaqArticleHref(relatedSlug),
      },
    ];
  });
}
