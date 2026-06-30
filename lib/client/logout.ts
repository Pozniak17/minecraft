import { logout } from '@/lib/api/auth';
import { setSuppressAuthRedirect } from '@/lib/api/authRedirect';

export async function performClientLogout() {
  setSuppressAuthRedirect(true);
  try {
    await logout();
  } catch {
    // виходимо навіть якщо API впав
  } finally {
    window.localStorage.removeItem('user_email');
    window.location.assign('/');
  }
}
