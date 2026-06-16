import { isAxiosError } from 'axios';
import { backend } from './backend';
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from './authCookies';

type RequestFn<T> = (accessToken: string | null) => Promise<T>;

async function refreshAccess(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await backend.post('/user/refresh_token/', { refresh });
    await setAuthCookies(data.access, data.refresh ?? refresh);
    return data.access as string;
  } catch {
    await clearAuthCookies();
    return null;
  }
}

// Виконує авторизований запит до бекенду; при 401 один раз оновлює токен і повторює.
export async function withAuth<T>(fn: RequestFn<T>): Promise<T> {
  const token = await getAccessToken();

  try {
    return await fn(token);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      const refreshed = await refreshAccess();
      if (refreshed) {
        return await fn(refreshed);
      }
    }
    throw err;
  }
}
