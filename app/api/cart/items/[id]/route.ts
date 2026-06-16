import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { amount } = (await req.json()) as { amount: number };
    const data = await withAuth(async token => {
      const res = await backend.post(
        `/core/order_item_change/${id}/`,
        { amount },
        backendAuth(token)
      );
      return res.data;
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Failed to update item');
  }
}
