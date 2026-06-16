import { NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';

export async function GET() {
  try {
    const { data } = await backend.get('/core/servers/');
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to load servers');
  }
}
