import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import { DEFAULT_LANG } from '@/lib/api/config';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const lang = sp.get('lang') ?? DEFAULT_LANG;
    const priced = sp.get('priced') === '1';

    const params: Record<string, string> = {};
    for (const key of ['page', 'page_size', 'search_query', 'category', 'currency']) {
      const value = sp.get(key);
      if (value) params[key] = value;
    }

    if (priced) {
      const data = await withAuth(async token => {
        const res = await backend.get(`/core/${lang}/list/`, {
          params,
          ...backendAuth(token),
        });
        return res.data;
      });
      return NextResponse.json(data);
    }

    delete params.currency;
    const { data } = await backend.get(`/core/${lang}/list/public/`, { params });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load products');
  }
}
