import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getRefreshToken } from '@/lib/server/authCookies';
import Profile from './_sections/Profile/Profile';

export const metadata: Metadata = {
  title: 'My Account — Minecraft Game',
  description: 'Manage your account, orders and settings.',
};

export default async function ProfilePage() {
  const refresh = await getRefreshToken();
  if (!refresh) {
    redirect('/login');
  }

  return <Profile />;
}
