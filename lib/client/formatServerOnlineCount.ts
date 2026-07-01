export function formatServerOnlineCount(
  online: number | null,
  status: 'online' | 'offline' | 'loading'
): string {
  if (status === 'loading') return '…';
  if (online !== null) return String(online);
  return '—';
}

/** Estimated capacity until a real load API exists. */
const SERVER_LOAD_CAPACITY = 200;

export function getServerLoadPercent(
  status: 'online' | 'offline' | 'loading',
  playerCount: number
): number | null {
  if (status !== 'online' || playerCount === 0) return null;
  return Math.min(99, Math.max(1, Math.round((playerCount / SERVER_LOAD_CAPACITY) * 100)));
}

export function formatServerLoadPercent(
  status: 'online' | 'offline' | 'loading',
  playerCount: number
): string {
  if (status === 'loading') return '…';
  const load = getServerLoadPercent(status, playerCount);
  if (load === null) return '—';
  return `${load}%`;
}
