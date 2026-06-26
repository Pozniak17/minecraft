import { GAME_SERVERS } from '@/lib/server/gameServers';

type ServerStatus = 'online' | 'offline';

export type LivePlayer = {
  initial: string;
  name: string;
  /** Translation key within serversData.activities — e.g. 'building', 'pvpArena' */
  activity: string;
};

export type DashboardServer = {
  id: string;
  name: string;
  nameMobile?: string;
  breadcrumbLabel: string;
  detailTitle: string;
  status: ServerStatus;
  current: number;
  max: number;
  image: string;
  latency: string;
  uptime: string;
  ip: string;
  version: string;
  featureCount: number;
  featureCountDesktop: number;
  livePlayers: LivePlayer[];
  livePlayersDesktop: LivePlayer[];
  chartData: number[];
};

export const DASHBOARD_SERVERS: DashboardServer[] = [
  {
    id: 'luckysurvival',
    name: 'LuckySurvival',
    breadcrumbLabel: 'LuckySurvival',
    detailTitle: 'LuckySurvival',
    status: 'online',
    current: 128,
    max: 200,
    image: '/profile/servers/1.webp',
    latency: '12 ms',
    uptime: '99.9%',
    ip: GAME_SERVERS.luckysurvival.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
    livePlayers: [
      { initial: 'R', name: 'RedstoneKing', activity: 'building' },
      { initial: 'P', name: 'PixelHunter', activity: 'pvpArena' },
      { initial: 'E', name: 'EnderQueen', activity: 'mining' },
    ],
    livePlayersDesktop: [
      { initial: 'R', name: 'RedstoneKing', activity: 'building' },
      { initial: 'P', name: 'PixelHunter', activity: 'pvpArena' },
      { initial: 'E', name: 'EnderQueen', activity: 'mining' },
      { initial: 'B', name: 'BlockNinja', activity: 'trading' },
    ],
    chartData: [
      40, 60, 80, 55, 120, 140, 160, 135, 110, 90, 75, 100, 150, 180, 170, 155, 140, 120,
      100, 80, 60, 55, 70, 128,
    ],
  },
  {
    id: 'minewars',
    name: 'MineWars',
    breadcrumbLabel: 'MineWars',
    detailTitle: 'MineWars',
    status: 'online',
    current: 312,
    max: 400,
    image: '/profile/servers/2.webp',
    latency: '8 ms',
    uptime: '99.8%',
    ip: GAME_SERVERS.minewars.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
    livePlayers: [
      { initial: 'W', name: 'WarLord', activity: 'pvpArena' },
      { initial: 'A', name: 'AlexPvP', activity: 'rankedQueue' },
      { initial: 'F', name: 'FireStrike', activity: 'raiding' },
    ],
    livePlayersDesktop: [
      { initial: 'W', name: 'WarLord', activity: 'pvpArena' },
      { initial: 'A', name: 'AlexPvP', activity: 'rankedQueue' },
      { initial: 'F', name: 'FireStrike', activity: 'raiding' },
      { initial: 'K', name: 'KnightX', activity: 'tournament' },
    ],
    chartData: [
      80, 95, 110, 90, 150, 180, 200, 175, 160, 140, 120, 135, 190, 220, 210, 195, 180, 165,
      150, 130, 110, 95, 120, 312,
    ],
  },
  {
    id: 'calmsky',
    name: 'CalmSky',
    nameMobile: 'CalmSky',
    breadcrumbLabel: 'CalmSky',
    detailTitle: 'CalmSky',
    status: 'online',
    current: 84,
    max: 150,
    image: '/profile/servers/3.webp',
    latency: '15 ms',
    uptime: '99.7%',
    ip: GAME_SERVERS.calmsky.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
    livePlayers: [
      { initial: 'S', name: 'SkyBuilder', activity: 'building' },
      { initial: 'C', name: 'CraftQueen', activity: 'plotDesign' },
      { initial: 'B', name: 'BlockArtist', activity: 'contestBuild' },
    ],
    livePlayersDesktop: [
      { initial: 'S', name: 'SkyBuilder', activity: 'building' },
      { initial: 'C', name: 'CraftQueen', activity: 'plotDesign' },
      { initial: 'B', name: 'BlockArtist', activity: 'contestBuild' },
      { initial: 'P', name: 'PeacefulPanda', activity: 'exploring' },
    ],
    chartData: [
      30, 45, 55, 50, 90, 100, 115, 95, 80, 70, 60, 75, 110, 130, 125, 115, 100, 85, 70, 55,
      45, 40, 55, 84,
    ],
  },
];

export function getDashboardServer(id: string): DashboardServer | undefined {
  return DASHBOARD_SERVERS.find(server => server.id === id);
}
