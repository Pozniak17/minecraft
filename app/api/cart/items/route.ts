import { NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';

export async function GET() {
  try {
    const data = await withAuth(async token => {
      const res = await backend.get('/core/order_items/', backendAuth(token));
      return res.data;
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load cart');
  }
}
