import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import type { AuthenticatedChangePasswordInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const { current, new_password, confirm } =
      (await req.json()) as AuthenticatedChangePasswordInput;

    const data = await withAuth(async token => {
      const res = await backend.post(
        '/user/profile/change_password/',
        { current, new_password, confirm },
        backendAuth(token)
      );
      return res.data;
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to change password');
  }
}
