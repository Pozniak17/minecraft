export type FaqRelatedItem = {
  category: string;
  question: string;
  excerpt: string;
  helpfulPercent: number;
  href: string;
};

export const FAQ_JOIN_RELATED: FaqRelatedItem[] = [
  {
    category: 'Getting started',
    question: 'What versions of Minecraft do you support?',
    excerpt:
      'Java 1.20.4 and the latest Bedrock release. Older versions are not supported because of the custom plugins we run.',
    helpfulPercent: 98,
    href: '#',
  },
  {
    category: 'Account',
    question: 'I forgot my password — how do I reset it?',
    excerpt:
      'Use the "Forgot password" link on the login page. We send a one-time reset link valid for 30 minutes.',
    helpfulPercent: 96,
    href: '#',
  },
  {
    category: 'Technical',
    question: 'Why am I getting "connection lost" errors?',
    excerpt: 'Most often it is a firewall or VPN blocking port 25565. Check both, then restart your client.',
    helpfulPercent: 91,
    href: '#',
  },
];

const RELATED_BY_SLUG: Record<string, FaqRelatedItem[]> = {
  join: FAQ_JOIN_RELATED,
};

export function getFaqRelatedItems(slug: string): FaqRelatedItem[] {
  return RELATED_BY_SLUG[slug] ?? [];
}
