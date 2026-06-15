import type { Metadata } from 'next';
import Tournaments from '@/app/dashboard/_sections/Tournaments/Tournaments';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Tournaments — Dashboard',
  description: 'Competitive tournaments with prize pools — launching soon.',
};

export default async function DashboardTournamentsPage() {
  await requireAuth();

  return <Tournaments />;
}
