import type { CSSProperties } from 'react';

export type WorkspaceLink = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  soon?: boolean;
};

export const WORKSPACE_LINKS: WorkspaceLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home-2-outline' },
  { label: 'Shop', href: '/store', icon: 'shop-minimalistic-outline' },
  { label: 'Servers', href: '/servers', icon: 'server-2-outline' },
  { label: 'Cart', href: '/cart', icon: 'cart-large-minimalistic-outline', badge: 0 },
  { label: 'Purchase History', href: '/dashboard/history', icon: 'history-outline' },
  { label: 'Top / Ratings', href: '/top', icon: 'bill-check-outline' },
  { label: 'Tournaments', href: '#', icon: 'cup-first-outline', soon: true },
  { label: 'How to Start', href: '/how-to-start', icon: 'flag-2-outline' },
];

export function dashboardIconStyle(name: string): CSSProperties {
  const url = `url("/icons/dashboard/${name}.svg")`;
  return { maskImage: url, WebkitMaskImage: url };
}
