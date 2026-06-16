import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import { evaluateRegistration } from '@/lib/server/seon';
import type { RegisterInput } from '@/lib/api/types';

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, email, seonSession } = (await req.json()) as RegisterInput;

    const verdict = await evaluateRegistration({
      email,
      ip: clientIp(req),
      session: seonSession,
    });
    if (!verdict.allow) {
      return NextResponse.json(
        { detail: 'Registration blocked by anti-fraud check. Please contact support.' },
        { status: 403 },
      );
    }

    const payload: Record<string, unknown> = { password };
    if (username) payload.username = username;
    if (email) payload.email = email;

    const { data } = await backend.post('/user/register/', payload);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Register failed');
  }
}
