import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/server/backend';
import { withAuthFetch } from '@/lib/server/withAuth';

const PHOTO_URL = `${BACKEND_API_URL}/user/profile/photo/`;

function authHeader(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  try {
    const res = await withAuthFetch(token =>
      fetch(PHOTO_URL, { headers: authHeader(token), cache: 'no-store' })
    );

    if (!res.ok) {
      return NextResponse.json({ detail: 'Profile photo not found.' }, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/jpeg',
        // Приватний короткий кеш: миттєва промальовка при навігації в межах кабінету.
        // Після upload/delete клієнт додає ?v=timestamp і б'є кеш.
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch {
    return NextResponse.json({ detail: 'Failed to load profile photo' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get('profile_photo');
    if (!(file instanceof Blob)) {
      return NextResponse.json({ detail: 'profile_photo file is required.' }, { status: 400 });
    }

    const forward = new FormData();
    forward.append('profile_photo', file, (file as File).name || 'photo');

    const res = await withAuthFetch(token =>
      fetch(PHOTO_URL, { method: 'POST', headers: authHeader(token), body: forward })
    );

    const data = await res.json().catch(() => ({ detail: 'Profile photo uploaded.' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Failed to upload profile photo' }, { status: 502 });
  }
}

export async function DELETE() {
  try {
    const res = await withAuthFetch(token =>
      fetch(PHOTO_URL, { method: 'DELETE', headers: authHeader(token) })
    );

    const data = await res.json().catch(() => ({ detail: 'Profile photo deleted.' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Failed to delete profile photo' }, { status: 502 });
  }
}
