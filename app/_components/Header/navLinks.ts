export const NAV_LINKS = [
  { label: 'HOME', drawerLabel: 'Home', href: '/' },
  { label: 'SERVERS', drawerLabel: 'Servers', href: '/servers' },
  { label: 'STORE', drawerLabel: 'Store', href: '/store' },
  { label: 'HOW TO START', drawerLabel: 'How to Start', href: '/how-to-start' },
  { label: 'BLOG', drawerLabel: 'Blog', href: '/blog' },
  { label: 'ABOUT', drawerLabel: 'About', href: '/about' },
  { label: 'FAQ', drawerLabel: 'FAQ', href: '/faq' },
] as const;

export function isNavLinkActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SOCIAL_LINKS = [
  { icon: '/icons/social/twitch.png', alt: 'Twitch', href: 'https://twitch.tv/', size: 24 },
  { icon: '/icons/social/prime_twitter.svg', alt: 'Twitter', href: '#', size: 18 },
  { icon: '/icons/social/mingcute_youtube-fill.svg', alt: 'YouTube', href: '#', size: 24 },
  { icon: '/icons/social/ic_twotone-tiktok.svg', alt: 'TikTok', href: '#', size: 24 },
] as const;

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookie-policy' },
] as const;

export { LEGAL_LINKS, SOCIAL_LINKS };
