import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { RegisterInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { username, password, email } = (await req.json()) as RegisterInput;
    const payload: Record<string, unknown> = { password };
    if (username) payload.username = username;
    if (email) payload.email = email;

    const { data } = await backend.post('/user/register/', payload);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Register failed');
  }
}
