import { NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { getRefreshToken, setAuthCookies } from '@/lib/server/authCookies';
import { handleApiError } from '@/lib/server/apiError';

export async function POST() {
  try {
    const refresh = await getRefreshToken();
    if (!refresh) {
      return NextResponse.json({ detail: 'No refresh token' }, { status: 401 });
    }
    const { data } = await backend.post('/user/refresh_token/', { refresh });
    await setAuthCookies(data.access, data.refresh ?? refresh);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err, 'Refresh failed');
  }
}
