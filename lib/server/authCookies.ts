import { cookies } from 'next/headers';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(access: string, refresh: string) {
  const store = await cookies();
  store.set(ACCESS, access, { ...base, maxAge: 60 * 30 }); // 30 хв
  store.set(REFRESH, refresh, { ...base, maxAge: 60 * 60 * 24 * 7 }); // 7 днів
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH)?.value ?? null;
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS);
  store.delete(REFRESH);
}
