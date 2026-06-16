import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { ChangePasswordInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { email, tmp_password, new_password } = (await req.json()) as ChangePasswordInput;
    const { data } = await backend.post('/user/change_password/', {
      email,
      tmp_password,
      new_password,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to change password');
  }
}
