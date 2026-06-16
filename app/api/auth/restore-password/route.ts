import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { RestorePasswordInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as RestorePasswordInput;
    const { data } = await backend.post('/user/restore_password/', { email });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to send reset email');
  }
}
