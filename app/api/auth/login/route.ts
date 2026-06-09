import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { setAuthCookies } from '@/lib/server/authCookies';
import { handleApiError } from '@/lib/server/apiError';
import type { LoginInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = (await req.json()) as LoginInput;
    const { data } = await backend.post('/user/login/', { username, password });
    await setAuthCookies(data.access, data.refresh);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err, 'Login failed');
  }
}
