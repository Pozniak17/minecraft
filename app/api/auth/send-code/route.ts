import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { SendCodeInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as SendCodeInput;
    const { data } = await backend.post('/user/send_email_code/', { email });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to send code');
  }
}
