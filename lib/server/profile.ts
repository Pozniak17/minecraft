import { backend, backendAuth } from './backend';
import { withAuth } from './withAuth';
import type { UserProfile } from '@/lib/api/types';

// Серверне завантаження профілю для SSR (без клієнтського раунд-тріпу).
// При помилці (немає токена / refresh у RSC) повертає null — клієнт зробить фолбек-фетч.
export async function getServerProfile(): Promise<UserProfile | null> {
  try {
    return await withAuth(async token => {
      const res = await backend.get<UserProfile>('/user/profile/', backendAuth(token));
      return res.data;
    });
  } catch {
    return null;
  }
}
