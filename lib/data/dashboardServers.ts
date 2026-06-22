import { GAME_SERVERS } from '@/lib/server/gameServers';

export type ServerStatus = 'online' | 'offline';

export type LivePlayer = {
  initial: string;
  name: string;
  activity: string;
};

export type DashboardServer = {
  id: string;
  name: string;
  nameMobile?: string;
  breadcrumbLabel: string;
  detailTitle: string;
  category: string;
  status: ServerStatus;
  current: number;
  max: number;
  description: string;
  detailDescription: string;
  detailDescriptionDesktop: string;
  image: string;
  latency: string;
  uptime: string;
  ip: string;
  version: string;
  joinLabel: string;
  joinLabelDesktop: string;
  aboutText: string;
  aboutTextDesktop: string;
  features: string[];
  featuresDesktop: string[];
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
    category: 'Survival',
    status: 'online',
    current: 128,
    max: 200,
    description:
      'Classic survival with fair PvP, balanced economy and an active community.',
    detailDescription:
      'LuckySurvival offers classic Minecraft survival with fair PvP, a balanced in-game economy, and an active community.',
    detailDescriptionDesktop:
      'LuckySurvival offers a classic Minecraft survival experience with fair PvP, a balanced in-game economy, and an active community — built for both casual and competitive players.',
    image: '/profile/servers/1.webp',
    latency: '12 ms',
    uptime: '99.9%',
    ip: GAME_SERVERS.luckysurvival.ip,
    version: 'Java • 1.12–1.19',
    joinLabel: 'Copy IP',
    joinLabelDesktop: 'Copy IP',
    aboutText:
      'LuckySurvival is vanilla survival with PvP enabled and TNT disabled. Fair fights, balanced economy, and long-term progression for chill and competitive players alike.',
    aboutTextDesktop:
      'LuckySurvival is vanilla survival with PvP enabled and TNT disabled. Fair fights, a hand-tuned economy, and long-term progression — ideal for players who enjoy active gameplay, fair competition, and economic strategy.',
    features: [
      'Survival gameplay',
      'Fair PvP battles',
      'In-game economy',
      'Player interaction',
    ],
    featuresDesktop: [
      'Classic open-world survival with day/night cycle',
      'Fair combat arenas and open-world PvP zones',
      'Buy, sell and trade items with other players',
      'Guilds, alliances and collaborative building',
    ],
    livePlayers: [
      { initial: 'R', name: 'RedstoneKing', activity: 'Building' },
      { initial: 'P', name: 'PixelHunter', activity: 'PvP arena' },
      { initial: 'E', name: 'EnderQueen', activity: 'Mining' },
    ],
    livePlayersDesktop: [
      { initial: 'R', name: 'RedstoneKing', activity: 'Building' },
      { initial: 'P', name: 'PixelHunter', activity: 'PvP arena' },
      { initial: 'E', name: 'EnderQueen', activity: 'Mining' },
      { initial: 'B', name: 'BlockNinja', activity: 'Trading' },
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
    category: 'PvP',
    status: 'online',
    current: 312,
    max: 400,
    description:
      'High-intensity PvP combat, ranked matches, team battles and seasonal tournaments.',
    detailDescription:
      'MineWars is built for competitive players — ranked matches, seasonal tournaments, and team warfare with PvP and TNT enabled.',
    detailDescriptionDesktop:
      'MineWars is built for competitive players who thrive in combat. Join ranked ladder matches, compete in seasonal tournaments, and rise through team-based warfare with vanilla PvP and TNT enabled.',
    image: '/profile/servers/2.webp',
    latency: '8 ms',
    uptime: '99.8%',
    ip: GAME_SERVERS.minewars.ip,
    version: 'Java • 1.12–1.19',
    joinLabel: 'Copy IP',
    joinLabelDesktop: 'Copy IP',
    aboutText:
      'MineWars is vanilla survival with PvP and TNT enabled. Ranked matches, tournaments, and team warfare — every battle counts.',
    aboutTextDesktop:
      'MineWars is vanilla survival with PvP and TNT enabled. Join ranked ladder matches, compete in seasonal tournaments, and dominate the leaderboard through team-based warfare and conquest.',
    features: [
      'PvP combat',
      'Tournaments',
      'Ranked ladder',
      'Team warfare',
    ],
    featuresDesktop: [
      'Intense player vs player battles in dedicated arenas',
      'Weekly and seasonal competitive tournaments with prizes',
      'Climb the competitive ladder and earn exclusive rewards',
      'Faction-based team combat and territory control',
    ],
    livePlayers: [
      { initial: 'W', name: 'WarLord', activity: 'PvP arena' },
      { initial: 'A', name: 'AlexPvP', activity: 'Ranked queue' },
      { initial: 'F', name: 'FireStrike', activity: 'Raiding' },
    ],
    livePlayersDesktop: [
      { initial: 'W', name: 'WarLord', activity: 'PvP arena' },
      { initial: 'A', name: 'AlexPvP', activity: 'Ranked queue' },
      { initial: 'F', name: 'FireStrike', activity: 'Raiding' },
      { initial: 'K', name: 'KnightX', activity: 'Tournament' },
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
    category: 'Peaceful',
    status: 'online',
    current: 84,
    max: 150,
    description:
      'A relaxed, peaceful server for building, exploring and enjoying Minecraft at your own pace.',
    detailDescription:
      'CalmSky is a peaceful haven — no PvP, no TNT. Focus on building, exploring, and community.',
    detailDescriptionDesktop:
      'CalmSky is a peaceful haven for players who want to focus on building, exploring, and community without the stress of combat. No PvP, no TNT — just creativity and collaboration.',
    image: '/profile/servers/3.webp',
    latency: '15 ms',
    uptime: '99.7%',
    ip: GAME_SERVERS.calmsky.ip,
    version: 'Java • 1.12–1.19',
    joinLabel: 'Copy IP',
    joinLabelDesktop: 'Copy IP',
    aboutText:
      'CalmSky is vanilla survival without PvP or TNT. Claim your plot, join build contests, and share creations with a supportive community.',
    aboutTextDesktop:
      'CalmSky is vanilla survival without PvP or TNT. Claim your plot, explore vast landscapes, join friendly build contests, and share your creations with a supportive community.',
    features: [
      'Creative building',
      'Exploration',
      'Build contests',
      'Community plots',
    ],
    featuresDesktop: [
      'Unlimited creative mode with premium WorldEdit tools',
      'Vast unexplored worlds with custom biomes and structures',
      'Regular community build competitions with prizes',
      'Claim your own plot and build with neighbors',
    ],
    livePlayers: [
      { initial: 'S', name: 'SkyBuilder', activity: 'Building' },
      { initial: 'C', name: 'CraftQueen', activity: 'Plot design' },
      { initial: 'B', name: 'BlockArtist', activity: 'Contest build' },
    ],
    livePlayersDesktop: [
      { initial: 'S', name: 'SkyBuilder', activity: 'Building' },
      { initial: 'C', name: 'CraftQueen', activity: 'Plot design' },
      { initial: 'B', name: 'BlockArtist', activity: 'Contest build' },
      { initial: 'P', name: 'PeacefulPanda', activity: 'Exploring' },
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
