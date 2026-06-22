import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import type { UserProfileUpdate } from '@/lib/api/types';

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as UserProfileUpdate;
    const payload: UserProfileUpdate = {};
    if (body.username !== undefined) payload.username = body.username;
    if (body.game_username !== undefined) payload.game_username = body.game_username;
    if (body.country !== undefined) payload.country = body.country;
    if (body.bio !== undefined) payload.bio = body.bio;

    const data = await withAuth(async token => {
      const res = await backend.patch('/user/profile/update/', payload, backendAuth(token));
      return res.data;
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err, 'Failed to update profile');
  }
}
