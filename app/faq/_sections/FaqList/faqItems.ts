export type FaqListItem = {
  id: string;
  category: string;
  updated: string;
  question: string;
  featured?: boolean;
  divider?: boolean;
};

export const FAQ_LIST_ITEMS: FaqListItem[] = [
  {
    id: '01',
    category: 'Get started',
    updated: 'May 12',
    question: 'How do I join the server for the first time?',
    featured: true,
  },
  {
    id: '02',
    category: 'Account',
    updated: 'May 09',
    question: 'What versions of Minecraft do you support?',
  },
  {
    id: '03',
    category: 'Account',
    updated: 'May 04',
    question: 'I forgot my password — how do I reset it?',
    divider: true,
  },
  {
    id: '04',
    category: 'Account',
    updated: 'Apr 28',
    question: 'How do I link my Microsoft / Mojang account?',
  },
  {
    id: '05',
    category: 'Payments',
    updated: 'Apr 25',
    question: 'What payment methods do you accept?',
  },
  {
    id: '06',
    category: 'Payments',
    updated: 'Apr 20',
    question: 'How do donations and privileges work?',
  },
  {
    id: '07',
    category: 'Payments',
    updated: 'Apr 18',
    question: 'Can I refund a purchase or privilege?',
  },
  {
    id: '08',
    category: 'Servers',
    updated: 'Apr 15',
    question: "What's the difference between Classic, Skyblock, and Anarchy?",
  },
  {
    id: '09',
    category: 'Tech',
    updated: 'Apr 12',
    question: 'Why am I getting "connection lost" errors?',
  },
  {
    id: '10',
    category: 'Gameplay',
    updated: 'Apr 08',
    question: 'How do claims and grief protection work?',
  },
];

export const FAQ_TOTAL_PAGES = 12;
export const FAQ_CATEGORY_COUNT = 18;
