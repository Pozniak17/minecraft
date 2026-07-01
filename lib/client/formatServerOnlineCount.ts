export function formatServerOnlineCount(
  online: number | null,
  status: 'online' | 'offline' | 'loading'
): string {
  if (status === 'loading') return '…';
  if (online !== null) return String(online);
  return '—';
}
