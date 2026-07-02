import type { UserProfile } from '@/lib/api/types';

function trim(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

/** Display name → in-game nick → email local part → fallback. */
export function resolveWelcomeName(
  profile: UserProfile | null,
  fallback = 'Player',
): string {
  const username = trim(profile?.username);
  const gameUsername = trim(profile?.game_username);
  const emailLocal = trim(profile?.email?.split('@')[0]);

  return username || gameUsername || emailLocal || fallback;
}

/** In-game nick when it differs from the welcome headline. */
export function resolvePlayingAsNickname(
  profile: UserProfile | null,
  welcomeName: string,
): string | null {
  const gameUsername = trim(profile?.game_username);
  if (!gameUsername) return null;
  if (gameUsername.localeCompare(welcomeName, undefined, { sensitivity: 'accent' }) === 0) {
    return null;
  }
  return gameUsername;
}
