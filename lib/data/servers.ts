export const PROJECT_SERVERS = [
  { id: 'luckysurvival', name: 'LuckySurvival', publicTab: 'lucky' },
  { id: 'minewars', name: 'MineWars', publicTab: 'minewars' },
  { id: 'calmsky', name: 'CalmSky', publicTab: 'calmsky' },
] as const;

export type ProjectServerId = (typeof PROJECT_SERVERS)[number]['id'];

export function getDashboardServerHref(id: ProjectServerId): string {
  return `/dashboard/servers/${id}`;
}

export function getPlayNowHref(id: ProjectServerId, isAuthed: boolean): string {
  return isAuthed ? getDashboardServerHref(id) : '/register';
}

/** Головна CTA «Play Now»: кабінет → сервери, гість без акаунта → реєстрація. */
export function getDashboardPlayHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/servers' : '/register';
}

/** Store preview на головній: публічний store або shop у кабінеті. */
export function getStoreHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/shop' : '/store';
}

/** CTA store/shop (Category, preview): кабінет → shop, гість → логін. */
export function getShopHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/shop' : '/login';
}

/** «Open Store»: залогінений → shop; гість з акаунтом → login (немає акаунта → крок 2 Sign Up /register). */
export function getOpenStoreHref(isAuthed: boolean): string {
  return isAuthed ? '/dashboard/shop' : '/login';
}
