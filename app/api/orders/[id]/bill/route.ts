import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/server/backend';
import { withAuthFetch } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const billUrl = `${BACKEND_API_URL}/core/orders/${encodeURIComponent(id)}/bill/`;

    const res = await withAuthFetch(token =>
      fetch(billUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
      })
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({ detail: 'Bill not found.' }));
      return NextResponse.json(data, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('content-type') ?? 'application/octet-stream');
    const disposition = res.headers.get('content-disposition');
    if (disposition) headers.set('Content-Disposition', disposition);

    return new NextResponse(buffer, { status: 200, headers });
  } catch (err) {
    return handleApiError(err, 'Failed to download bill');
  }
}
