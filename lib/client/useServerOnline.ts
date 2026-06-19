'use client';

import { useEffect, useState } from 'react';

interface OnlineState {
  online: number | null;
  status: 'online' | 'offline' | 'loading';
  players: string[];
}

// Опитує наш проксі /api/servers/{server}/online кожні 10с.
// Токен ігрового API лишається на сервері; сюди приходить лише число онлайн.
export function useServerOnline(server: string): OnlineState {
  const [state, setState] = useState<OnlineState>({
    online: null,
    status: 'loading',
    players: [],
  });

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch(`/api/servers/${server}/online`)
        .then(res => res.json())
        .then((data: {
          online: number | null;
          status?: 'online' | 'offline';
          players?: string[];
        }) => {
          if (!active) return;
          setState({
            online: typeof data.online === 'number' ? data.online : null,
            status: data.status === 'online' ? 'online' : 'offline',
            players: Array.isArray(data.players) ? data.players : [],
          });
        })
        .catch(() => {
          if (active) setState({ online: null, status: 'offline', players: [] });
        });
    };

    load();
    const timer = setInterval(load, 10_000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [server]);

  return state;
}
