import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Settings from '@/app/dashboard/_sections/Settings/Settings';

export const metadata: Metadata = {
  title: 'Settings — Dashboard',
  description: 'Manage your account security and credentials.',
};

export default async function DashboardSettingsPage() {
  await requireAuth();

  return <Settings />;
}
