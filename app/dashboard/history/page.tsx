import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Purchase History — Dashboard',
  description: 'Your past orders and transactions.',
};

export default async function DashboardHistoryPage() {
  await requireAuth();

  return null;
}
