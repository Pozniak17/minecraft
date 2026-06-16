import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await withAuth(async token => {
      const res = await backend.post(`/core/remove_from_cart/${id}/`, {}, backendAuth(token));
      return res.data;
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Failed to remove item');
  }
}
