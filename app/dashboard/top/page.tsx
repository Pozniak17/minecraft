import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Top / Ratings — Dashboard',
  description: 'Leaderboards and player rankings.',
};

export default async function DashboardTopPage() {
  await requireAuth();

  return null;
}
