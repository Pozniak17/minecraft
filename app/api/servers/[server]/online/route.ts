import { NextResponse } from 'next/server';
import { fetchServerOnline } from '@/lib/server/fetchServerOnline';
import { GAME_SERVERS, type GameServerKey } from '@/lib/server/gameServers';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ server: string }> }
) {
  const { server } = await params;

  if (!GAME_SERVERS[server as GameServerKey]) {
    return NextResponse.json({ detail: 'Unknown server' }, { status: 404 });
  }

  return NextResponse.json(await fetchServerOnline(server as GameServerKey));
}
