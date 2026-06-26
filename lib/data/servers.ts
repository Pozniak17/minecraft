export const PROJECT_SERVERS = [
  { id: 'luckysurvival', name: 'LuckySurvival', publicTab: 'lucky' },
  { id: 'minewars', name: 'MineWars', publicTab: 'minewars' },
  { id: 'calmsky', name: 'CalmSky', publicTab: 'calmsky' },
] as const;

export type ProjectServerId = (typeof PROJECT_SERVERS)[number]['id'];

function getDashboardServerHref(id: ProjectServerId): string {
  return `/dashboard/servers/${id}`;
}

export function getPlayNowHref(id: ProjectServerId, isAuthed: boolean): string {
  return isAuthed ? getDashboardServerHref(id) : '/register';
}

export function getPublicServerHref(id: ProjectServerId): string {
  const server = PROJECT_SERVERS.find(item => item.id === id);
  return server ? `/servers#${server.publicTab}` : '/servers';
}

/** Головна CTA «Play Now»: кабінет → сервери; гість з акаунтом → login; без акаунта → register. */
export function getDashboardPlayHref(isAuthed: boolean, hasAccount = false): string {
  if (isAuthed) return '/dashboard/servers';
  return hasAccount ? '/login' : '/register';
}

/** Store preview на головній: публічний store або shop у кабінеті. */
export function getStoreHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/shop' : '/store';
}

/** CTA store/shop (Category, preview): кабінет → shop, гість → логін. */
export function getShopHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/shop' : '/login';
}

/** «Open Store»: shop у кабінеті; гість з акаунтом → login; без акаунта → register. */
export function getOpenStoreHref(isAuthed: boolean, hasAccount = false): string {
  if (isAuthed) return '/dashboard/shop';
  return hasAccount ? '/login' : '/register';
}
