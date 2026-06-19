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
