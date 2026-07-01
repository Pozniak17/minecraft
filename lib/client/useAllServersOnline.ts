'use client';

import { useEffect, useState } from 'react';
import type { GameServerKey } from '@/lib/server/gameServers';

type ServerOnlineEntry = {
  server: GameServerKey;
  status: 'online' | 'offline';
  online: number | null;
};

interface AllServersOnlineState {
  totalOnline: number | null;
  serversOnline: number;
  totalServers: number;
  status: 'loading' | 'ready';
}

export function useAllServersOnline(): AllServersOnlineState {
  const [state, setState] = useState<AllServersOnlineState>({
    totalOnline: null,
    serversOnline: 0,
    totalServers: 0,
    status: 'loading',
  });

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch('/api/servers/online')
        .then(res => res.json())
        .then((data: {
          totalOnline?: number;
          serversOnline?: number;
          totalServers?: number;
          servers?: ServerOnlineEntry[];
        }) => {
          if (!active) return;
          setState({
            totalOnline: typeof data.totalOnline === 'number' ? data.totalOnline : null,
            serversOnline: typeof data.serversOnline === 'number' ? data.serversOnline : 0,
            totalServers: typeof data.totalServers === 'number' ? data.totalServers : 0,
            status: 'ready',
          });
        })
        .catch(() => {
          if (!active) return;
          setState(prev => ({ ...prev, status: 'ready' }));
        });
    };

    load();
    const timer = setInterval(load, 10_000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return state;
}
