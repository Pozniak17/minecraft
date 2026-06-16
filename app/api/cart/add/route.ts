import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import type { AddToCartInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AddToCartInput;
    const data = await withAuth(async token => {
      const res = await backend.post('/core/add_to_cart/', body, backendAuth(token));
      return res.data;
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Failed to add to cart');
  }
}
