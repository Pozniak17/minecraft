import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const params: Record<string, string> = {};
    for (const key of ['page', 'page_size']) {
      const value = sp.get(key);
      if (value) params[key] = value;
    }

    const data = await withAuth(async token => {
      const res = await backend.get('/core/orders/', { params, ...backendAuth(token) });
      return res.data;
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load orders');
  }
}
