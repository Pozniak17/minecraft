import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';

export function handleApiError(err: unknown, fallback = 'Request failed') {
  if (isAxiosError(err)) {
    const status = err.response?.status ?? 502;
    const data = err.response?.data;

    // Django може віддати HTML (наприклад сторінку 500) — не пробрасуємо розмітку назад
    if (typeof data === 'string') {
      return NextResponse.json(
        { detail: status >= 500 ? 'Backend server error' : fallback },
        { status }
      );
    }

    return NextResponse.json(data ?? { detail: fallback }, { status });
  }

  return NextResponse.json({ detail: 'Unexpected error' }, { status: 500 });
}
