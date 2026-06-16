import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import { DEFAULT_LANG } from '@/lib/api/config';

export async function GET(req: NextRequest) {
  try {
    const lang = req.nextUrl.searchParams.get('lang') ?? DEFAULT_LANG;
    const { data } = await backend.get(`/core/${lang}/categories/list/`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load categories');
  }
}
