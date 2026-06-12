import { redirect } from 'next/navigation';
import { getRefreshToken } from './authCookies';

export async function requireAuth() {
  const refresh = await getRefreshToken();

  if (!refresh) {
    redirect('/login');
  }
}
