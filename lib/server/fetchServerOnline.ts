import axios from 'axios';
import {
  GAME_SERVERS,
  GAME_API_PORT,
  GAME_API_TOKEN,
  ONLINE_BOT_OFFSET,
  type GameServerKey,
} from '@/lib/server/gameServers';

export type ServerOnlineResult = {
  server: GameServerKey;
  status: 'online' | 'offline';
  online: number | null;
  players: string[];
};

export async function fetchServerOnline(server: GameServerKey): Promise<ServerOnlineResult> {
  const config = GAME_SERVERS[server];

  try {
    const { data } = await axios.get(
      `http://${config.ip}:${GAME_API_PORT}/v1/players`,
      {
        headers: { accept: 'application/json', Authorization: GAME_API_TOKEN },
        timeout: 8000,
      }
    );

    const players = Array.isArray(data?.onlinePlayers) ? data.onlinePlayers : [];

    return {
      server,
      status: 'online',
      online: players.length + ONLINE_BOT_OFFSET,
      players: players
        .map((p: { name?: string }) => p?.name)
        .filter((name: unknown): name is string => typeof name === 'string'),
    };
  } catch {
    return {
      server,
      status: 'offline',
      online: null,
      players: [],
    };
  }
}
