export type FaqCategoryId =
  | 'all'
  | 'getting-started'
  | 'account'
  | 'payments'
  | 'servers'
  | 'privileges'
  | 'gameplay'
  | 'technical'
  | 'rules';

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  mobileLabel: string;
  count: number;
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', label: 'All questions', mobileLabel: 'All', count: 132 },
  { id: 'getting-started', label: 'Getting started', mobileLabel: 'Getting started', count: 18 },
  { id: 'account', label: 'Account & login', mobileLabel: 'Account', count: 21 },
  { id: 'payments', label: 'Payments', mobileLabel: 'Payments', count: 14 },
  { id: 'servers', label: 'Servers & worlds', mobileLabel: 'Servers', count: 23 },
  { id: 'privileges', label: 'Privileges', mobileLabel: 'Privileges', count: 12 },
  { id: 'gameplay', label: 'Gameplay', mobileLabel: 'Gameplay', count: 19 },
  { id: 'technical', label: 'Technical issues', mobileLabel: 'Technical issues', count: 16 },
  { id: 'rules', label: 'Rules & moderation', mobileLabel: 'Rules', count: 9 },
];

export const FAQ_MOST_ASKED = [
  { num: '01', question: 'How do I join the server?' },
  { num: '02', question: 'What versions do you support?' },
  { num: '03', question: 'How do I reset my password?' },
  { num: '04', question: 'How do refunds work?' },
  { num: '05', question: 'Why am I getting connection lost?' },
] as const;

export const DEFAULT_FAQ_CATEGORY: FaqCategoryId = 'getting-started';

export const FAQ_MOBILE_CHIP_IDS: FaqCategoryId[] = [
  'all',
  'getting-started',
  'account',
  'payments',
  'servers',
  'privileges',
  'gameplay',
];

export function getCategoryById(id: FaqCategoryId): FaqCategory {
  return FAQ_CATEGORIES.find(category => category.id === id) ?? FAQ_CATEGORIES[1];
}
