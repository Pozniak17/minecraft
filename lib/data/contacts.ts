export const SUPPORT_EMAIL = 'support@minecraftsgame.com';

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'account', label: 'Account & login' },
  { value: 'billing', label: 'Billing & payments' },
  { value: 'privacy', label: 'Privacy & data' },
  { value: 'other', label: 'Other' },
] as const;

export const CONTACT_STATS = [
  { value: 'Quick', label: 'replies', labelDesktop: 'timely replies' },
  { value: 'Direct', label: 'contact', labelDesktop: 'direct contact' },
  { value: 'Helpful', label: 'support', labelDesktop: 'friendly support' },
] as const;

export type ContactChannel = {
  id: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  meta?: string;
  href: string;
  type: 'mailto';
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'email',
    icon: '✉',
    title: 'Email support',
    description: 'Account, billing, and privacy requests. We reply within one business day.',
    actionLabel: 'Email us',
    meta: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    type: 'mailto',
  },
];
