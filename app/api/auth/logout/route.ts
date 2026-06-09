import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/server/authCookies';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
