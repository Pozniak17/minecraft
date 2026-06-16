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
    id: 'classic',
    name: 'Classic / Survival',
    breadcrumbLabel: 'Classic',
    detailTitle: 'Classic — Survival',
    category: 'Survival',
    status: 'online',
    current: 128,
    max: 200,
    description:
      'A beloved classic with hardcore touches and a thriving economy. The perfect spot for cozy survival and large-scale building.',
    detailDescription:
      'Our most-played server since 2022. Classic Minecraft survival with custom claims, fair economy, and an active 200+ player community.',
    detailDescriptionDesktop:
      'Our most-played server since 2022. Classic Minecraft survival with a hand-tuned economy, custom claims plugin, and an active community of 200+ regulars.',
    image: '/profile/servers/1.webp',
    latency: '32 ms',
    uptime: '99.9%',
    ip: 'classic.minecraft-ecosystem.example',
    version: 'Java • 1.20.4',
    joinLabel: 'Join',
    joinLabelDesktop: 'Join server',
    aboutText:
      'Classic Survival is our oldest server, running since 2022. Economy tuned for fair early-game progression. Players claim land with our custom plugin and trade at community markets.',
    aboutTextDesktop:
      'Classic Survival is our oldest server, running continuously since launch in 2022. The economy is tuned to keep early-game progression rewarding without flattening the late game. Players claim land with our custom claims plugin, trade at community markets, and form alliances or guilds for large-scale builds and PvP.',
    features: [
      'Custom land-claim plugin',
      'Player-driven economy',
      'Active community Discord',
      'Hand-tuned mob spawns',
    ],
    featuresDesktop: [
      'Custom land-claim plugin with grief protection',
      'Player-driven economy with daily auctions',
      'Active community Discord with regular events',
      'Hand-tuned mob spawns and balanced loot tables',
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
    id: 'skyblock',
    name: 'Skyblock / Tech',
    nameMobile: 'Skyblock',
    breadcrumbLabel: 'Skyblock',
    detailTitle: 'Skyblock — Tech',
    category: 'Skyblock',
    status: 'online',
    current: 84,
    max: 150,
    description:
      'Sharpen your automation and survival skills on floating islands. Custom crafts, machines, and endless possibilities for engineers.',
    detailDescription:
      'Engineer your island from a single tree into a sprawling factory. Custom tech trees, automation plugins, and weekly island challenges.',
    detailDescriptionDesktop:
      'Engineer your island from a single tree into a sprawling factory. Custom tech trees, automation plugins, and weekly island challenges for 150+ engineers.',
    image: '/profile/servers/2.webp',
    latency: '38 ms',
    uptime: '99.7%',
    ip: 'skyblock.minecraft-ecosystem.example',
    version: 'Java • 1.20.4',
    joinLabel: 'Join',
    joinLabelDesktop: 'Join server',
    aboutText:
      'Skyblock Tech blends classic island survival with redstone-friendly automation. Progress through tiers, unlock machines, and compete in seasonal island rankings.',
    aboutTextDesktop:
      'Skyblock Tech blends classic island survival with redstone-friendly automation. Progress through upgrade tiers, unlock custom machines, and compete in seasonal island rankings with co-op teams.',
    features: [
      'Custom crafting & machines',
      'Island upgrade tiers',
      'Weekly automation challenges',
      'Co-op island teams',
    ],
    featuresDesktop: [
      'Custom crafting & machines with tier unlocks',
      'Island upgrade tiers with shared co-op progress',
      'Weekly automation challenges with leaderboard rewards',
      'Co-op island teams and cross-island trade routes',
    ],
    livePlayers: [
      { initial: 'T', name: 'TechForge', activity: 'Automating' },
      { initial: 'S', name: 'SkyBuilder', activity: 'Island build' },
      { initial: 'C', name: 'CircuitCat', activity: 'Redstone lab' },
    ],
    livePlayersDesktop: [
      { initial: 'T', name: 'TechForge', activity: 'Automating' },
      { initial: 'S', name: 'SkyBuilder', activity: 'Island build' },
      { initial: 'C', name: 'CircuitCat', activity: 'Redstone lab' },
      { initial: 'M', name: 'ModMaster', activity: 'Crafting' },
    ],
    chartData: [
      30, 45, 55, 50, 90, 100, 115, 95, 80, 70, 60, 75, 110, 130, 125, 115, 100, 85, 70, 55,
      45, 40, 55, 84,
    ],
  },
  {
    id: 'anarchy',
    name: 'Anarchy / PvP',
    breadcrumbLabel: 'Anarchy',
    detailTitle: 'Anarchy — PvP',
    category: 'PvP',
    status: 'offline',
    current: 0,
    max: 100,
    description:
      'A world with no rules but ruthless competition. Prove your dominance in PvP, capture territories, and crush your enemies.',
    detailDescription:
      'No claims, no mercy. Pure PvP anarchy with territory wars, loot crates, and a leaderboard that resets every season.',
    detailDescriptionDesktop:
      'No claims, no mercy. Pure PvP anarchy with territory wars, loot crates, and a seasonal leaderboard that resets every month.',
    image: '/profile/servers/3.webp',
    latency: 'Offline',
    uptime: '—',
    ip: 'anarchy.minecraft-ecosystem.example',
    version: 'Java • 1.20.4',
    joinLabel: 'Notify',
    joinLabelDesktop: 'Notify me',
    aboutText:
      'Anarchy PvP is currently offline for a major map reset and anti-cheat upgrade. Sign up for notifications to join the reopening event.',
    aboutTextDesktop:
      'Anarchy PvP is currently offline for a major map reset and anti-cheat upgrade. The new season launches with refreshed territories, balanced loot tables, and a reopening event for early sign-ups.',
    features: [
      'Zero-rules PvP world',
      'Seasonal territory wars',
      'Custom loot events',
      'Reopening notification list',
    ],
    featuresDesktop: [
      'Zero-rules PvP world with no land claims',
      'Seasonal territory wars and clan rankings',
      'Custom loot events with rare gear drops',
      'Reopening notification list for the next season',
    ],
    livePlayers: [],
    livePlayersDesktop: [],
    chartData: [
      20, 35, 50, 45, 80, 95, 110, 90, 75, 60, 50, 65, 100, 120, 110, 95, 80, 65, 50, 35, 25,
      20, 15, 0,
    ],
  },
];

export function getDashboardServer(id: string): DashboardServer | undefined {
  return DASHBOARD_SERVERS.find(server => server.id === id);
}
