import { FAQ_ARTICLES, getCategoryCounts } from '../_data/faqArticles';
import type { FaqCategoryId } from '../_data/faqTypes';

export type { FaqCategoryId } from '../_data/faqTypes';

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  mobileLabel: string;
  count: number;
};

const CATEGORY_COUNTS = getCategoryCounts();

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', label: 'All questions', mobileLabel: 'All', count: FAQ_ARTICLES.length },
  {
    id: 'getting-started',
    label: 'Getting started',
    mobileLabel: 'Getting started',
    count: CATEGORY_COUNTS['getting-started'],
  },
  { id: 'account', label: 'Account & login', mobileLabel: 'Account', count: CATEGORY_COUNTS.account },
  { id: 'payments', label: 'Payments', mobileLabel: 'Payments', count: CATEGORY_COUNTS.payments },
  { id: 'servers', label: 'Servers & worlds', mobileLabel: 'Servers', count: CATEGORY_COUNTS.servers },
  { id: 'privileges', label: 'Privileges', mobileLabel: 'Privileges', count: CATEGORY_COUNTS.privileges },
  { id: 'gameplay', label: 'Gameplay', mobileLabel: 'Gameplay', count: CATEGORY_COUNTS.gameplay },
  {
    id: 'technical',
    label: 'Technical issues',
    mobileLabel: 'Technical issues',
    count: CATEGORY_COUNTS.technical,
  },
  { id: 'rules', label: 'Rules & moderation', mobileLabel: 'Rules', count: CATEGORY_COUNTS.rules },
];

export const FAQ_MOST_ASKED = [
  { num: '01', question: 'How do I join the server?', slug: 'join' },
  { num: '02', question: 'What versions do you support?', slug: 'supported-versions' },
  { num: '03', question: 'How do I reset my password?', slug: 'reset-password' },
  { num: '04', question: 'How do refunds work?', slug: 'refund-policy' },
  { num: '05', question: 'Why am I getting connection lost?', slug: 'connection-lost' },
] as const;

export const DEFAULT_FAQ_CATEGORY: FaqCategoryId = 'all';

export const FAQ_MOBILE_CHIP_IDS: FaqCategoryId[] = [
  'all',
  'getting-started',
  'account',
  'payments',
  'servers',
  'privileges',
  'gameplay',
];

export const FAQ_DEFAULT_ITEMS_PER_PAGE = 5;

export const FAQ_PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

export type FaqPageSize = (typeof FAQ_PAGE_SIZE_OPTIONS)[number];

/** @deprecated Use FAQ_DEFAULT_ITEMS_PER_PAGE */
export const FAQ_ITEMS_PER_PAGE = FAQ_DEFAULT_ITEMS_PER_PAGE;

export function getCategoryById(id: FaqCategoryId): FaqCategory {
  return FAQ_CATEGORIES.find(category => category.id === id) ?? FAQ_CATEGORIES[0];
}
