import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import { DEFAULT_LANG } from '@/lib/api/config';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sp = req.nextUrl.searchParams;
    const lang = sp.get('lang') ?? DEFAULT_LANG;
    const priced = sp.get('priced') === '1';
    const currency = sp.get('currency');

    if (priced) {
      const data = await withAuth(async token => {
        const res = await backend.get(`/core/${lang}/get/${id}/`, {
          params: currency ? { currency } : undefined,
          ...backendAuth(token),
        });
        return res.data;
      });
      return NextResponse.json(data);
    }

    const { data } = await backend.get(`/core/${lang}/get/${id}/public/`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load product');
  }
}
