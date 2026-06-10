import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getRefreshToken } from '@/lib/server/authCookies';
import Dashboard from './_sections/Dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard — Minecraft Game',
  description: 'Your personal hub: servers, balance and quick actions.',
};

export default async function DashboardPage() {
  const refresh = await getRefreshToken();

  if (!refresh) {
    redirect('/login');
  }

  return <Dashboard />;
}
