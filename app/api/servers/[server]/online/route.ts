import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  GAME_SERVERS,
  GAME_API_PORT,
  GAME_API_TOKEN,
  ONLINE_BOT_OFFSET,
  type GameServerKey,
} from '@/lib/server/gameServers';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ server: string }> }
) {
  const { server } = await params;
  const config = GAME_SERVERS[server as GameServerKey];

  if (!config) {
    return NextResponse.json({ detail: 'Unknown server' }, { status: 404 });
  }

  try {
    const { data } = await axios.get(
      `http://${config.ip}:${GAME_API_PORT}/v1/players`,
      {
        headers: { accept: 'application/json', Authorization: GAME_API_TOKEN },
        timeout: 8000,
      }
    );

    const players = Array.isArray(data?.onlinePlayers) ? data.onlinePlayers : [];

    return NextResponse.json({
      server,
      status: 'online' as const,
      online: players.length + ONLINE_BOT_OFFSET,
      players: players
        .map((p: { name?: string }) => p?.name)
        .filter((name: unknown): name is string => typeof name === 'string'),
    });
  } catch {
    return NextResponse.json({
      server,
      status: 'offline' as const,
      online: null,
      players: [],
    });
  }
}
