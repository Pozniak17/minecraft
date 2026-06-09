import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { VerifyCodeInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { email, email_code } = (await req.json()) as VerifyCodeInput;
    const { data } = await backend.post('/user/verify_email_code/', { email, email_code });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to verify code');
  }
}
