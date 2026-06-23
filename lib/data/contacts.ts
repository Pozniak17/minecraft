export const SUPPORT_EMAIL = 'support@minecraftsgame.com';
export const DISCORD_URL = 'https://discord.gg/minecraftsgame';

export const CONTACT_STATS = [
  { value: '< 4h', label: 'avg reply', labelDesktop: 'average reply time' },
  { value: '24/7', label: 'support', labelDesktop: 'live support' },
  { value: '3', label: 'channels', labelDesktop: 'contact channels' },
] as const;

export type ContactChannel = {
  id: string;
  icon: string;
  iconImage?: string;
  title: string;
  description: string;
  actionLabel: string;
  meta?: string;
  href?: string;
  external?: boolean;
  type: 'link' | 'mailto' | 'button';
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'chat',
    icon: '💬',
    title: 'Live chat',
    description: 'Talk to a moderator in real time. Best for urgent in-game issues.',
    actionLabel: 'Open live chat',
    type: 'button',
  },
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
  {
    id: 'discord',
    icon: '',
    iconImage: '/icons/social/ic_outline-discord.svg',
    title: 'Community Discord',
    description: 'Join #support for help, announcements, and player chat.',
    actionLabel: 'Join Discord',
    href: DISCORD_URL,
    external: true,
    type: 'link',
  },
];
