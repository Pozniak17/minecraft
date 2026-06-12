import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Cart — Dashboard',
  description: 'Review items before checkout.',
};

export default async function DashboardCartPage() {
  await requireAuth();

  return null;
}
