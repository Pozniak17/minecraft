'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import styles from './TopRatings.module.css';

type Metric = 'playtime' | 'kills' | 'wealth' | 'achievements';

type PodiumPlayer = {
  rank: number;
  name: string;
  server: string;
  value: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  desktopImageWidth: number;
  desktopImageHeight: number;
  cardWidth: number;
  nameWidth: number;
  variant: 'gold' | 'silver' | 'bronze';
};

type ListPlayer = {
  rank: number;
  name: string;
  server: string;
  playtime: string;
  kills: number;
  wealth: string;
  achievements: number;
};

const TABS: { id: Metric; labelMobile: string; labelDesktop: string }[] = [
  { id: 'playtime', labelMobile: 'Playtime', labelDesktop: 'Playtime' },
  { id: 'kills', labelMobile: 'Kills', labelDesktop: 'Kills' },
  { id: 'wealth', labelMobile: 'Wealth', labelDesktop: 'Wealth' },
  { id: 'achievements', labelMobile: 'Achiev', labelDesktop: 'Achievements' },
];

const PERIODS = ['This week', 'This month', 'All time'] as const;
const SERVERS = ['All servers', 'LuckySurvival', 'MineWars', 'CalmSky'] as const;

type Period = (typeof PERIODS)[number];
type ServerFilter = (typeof SERVERS)[number];

const PODIUM: PodiumPlayer[] = [
  {
    rank: 1,
    name: 'RedstoneKing',
    server: 'LuckySurvival',
    value: '248 h 12 m',
    image: '/profile/top-ratings/1.webp',
    imageWidth: 72,
    imageHeight: 73,
    desktopImageWidth: 211,
    desktopImageHeight: 213,
    cardWidth: 106,
    nameWidth: 96,
    variant: 'gold',
  },
  {
    rank: 2,
    name: 'PixelHunter',
    server: 'CalmSky',
    value: '231 h 04 m',
    image: '/profile/top-ratings/2.webp',
    imageWidth: 83,
    imageHeight: 83,
    desktopImageWidth: 226,
    desktopImageHeight: 226,
    cardWidth: 107,
    nameWidth: 90,
    variant: 'silver',
  },
  {
    rank: 3,
    name: 'EnderQueen',
    server: 'MineWars',
    value: '209 h 47 m',
    image: '/profile/top-ratings/3.webp',
    imageWidth: 69,
    imageHeight: 69,
    desktopImageWidth: 211,
    desktopImageHeight: 211,
    cardWidth: 107,
    nameWidth: 90,
    variant: 'bronze',
  },
];

const LIST: ListPlayer[] = [
  { rank: 4, name: 'BlockNinja', server: 'MineWars', playtime: '187 h 22 m', kills: 268, wealth: '9,940', achievements: 41 },
  { rank: 5, name: 'LavaWalker', server: 'LuckySurvival', playtime: '172 h 09 m', kills: 212, wealth: '8,720', achievements: 36 },
  { rank: 6, name: 'DiamondHand', server: 'CalmSky', playtime: '164 h 33 m', kills: 198, wealth: '8,150', achievements: 33 },
  { rank: 7, name: 'CreeperSlayer', server: 'MineWars', playtime: '158 h 14 m', kills: 284, wealth: '7,920', achievements: 38 },
  { rank: 8, name: 'NetheriteSoul', server: 'LuckySurvival', playtime: '146 h 52 m', kills: 175, wealth: '7,440', achievements: 29 },
  { rank: 9, name: 'SkyMaster', server: 'CalmSky', playtime: '139 h 18 m', kills: 142, wealth: '6,820', achievements: 27 },
  { rank: 10, name: 'OreDigger', server: 'LuckySurvival', playtime: '128 h 05 m', kills: 154, wealth: '6,300', achievements: 24 },
  { rank: 11, name: 'PhantomRider', server: 'MineWars', playtime: '117 h 41 m', kills: 202, wealth: '5,890', achievements: 22 },
  { rank: 12, name: 'IronArchitect', server: 'CalmSky', playtime: '108 h 26 m', kills: 138, wealth: '5,420', achievements: 19 },
];

const TABLE_COLUMNS = ['#', 'Player', 'Server', 'Playtime', 'Kills', 'Wealth'] as const;

function playerInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

function podiumVariantClass(variant: PodiumPlayer['variant']) {
  if (variant === 'gold') return styles.podiumVariantGold;
  if (variant === 'silver') return styles.podiumVariantSilver;
  return styles.podiumVariantBronze;
}

function metricValue(player: ListPlayer, metric: Metric): string {
  switch (metric) {
    case 'kills':
      return String(player.kills);
    case 'wealth':
      return `${player.wealth} ◆`;
    case 'achievements':
      return String(player.achievements);
    default:
      return player.playtime;
  }
}

function matchesServer(server: string, filter: ServerFilter) {
  return filter === 'All servers' || server === filter;
}

function matchesPeriod(rank: number, period: Period) {
  if (period === 'All time') return true;
  if (period === 'This month') return rank <= 10;
  return rank <= 6;
}

export default function TopRatings() {
  const [activeMetric, setActiveMetric] = useState<Metric>('playtime');
  const [period, setPeriod] = useState<Period>('This week');
  const [server, setServer] = useState<ServerFilter>('All servers');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);

  const filteredPodium = useMemo(
    () =>
      PODIUM.filter(
        player => matchesServer(player.server, server) && matchesPeriod(player.rank, period)
      ),
    [server, period]
  );

  const filteredList = useMemo(
    () =>
      LIST.filter(
        player => matchesServer(player.server, server) && matchesPeriod(player.rank, period)
      ),
    [server, period]
  );

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>Top / Ratings</span>
            <h1 className={styles.title}>Player leaderboard</h1>
            <p className={styles.subtitleMobile}>
              Updated weekly. 200+ active players ranked across every server.
            </p>
            <p className={styles.subtitleDesktop}>
              Top players by playtime, updated automatically. 200+ active players ranked across
              every server.
            </p>
          </div>

          <div className={styles.refreshBadge}>
            <span className={styles.refreshDot} aria-hidden="true" />
            <span>Auto refresh — weekly</span>
          </div>
        </header>

        <div className={styles.filtersRow}>
          <div className={styles.tabs} role="tablist" aria-label="Leaderboard metrics">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeMetric === tab.id}
                className={[styles.tab, activeMetric === tab.id && styles.tabActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveMetric(tab.id)}
              >
                <span className={styles.tabLabelMobile}>{tab.labelMobile}</span>
                <span className={styles.tabLabelDesktop}>{tab.labelDesktop}</span>
              </button>
            ))}
          </div>

          <div className={styles.filterTools}>
            <div className={styles.filterWrap}>
              <button
                type="button"
                className={styles.filterBtn}
                onClick={() => {
                  setPeriodOpen(open => !open);
                  setServerOpen(false);
                }}
                aria-expanded={periodOpen}
                aria-haspopup="listbox"
              >
                <span className={styles.filterPrefix}>Period:</span>
                <span className={styles.filterValue}>{period}</span>
                <span className={styles.filterCaret} aria-hidden="true">
                  ▾
                </span>
              </button>
              {periodOpen && (
                <ul className={styles.filterMenu} role="listbox" aria-label="Select period">
                  {PERIODS.map(option => (
                    <li key={option} role="option" aria-selected={period === option}>
                      <button
                        type="button"
                        className={styles.filterOption}
                        onClick={() => {
                          setPeriod(option);
                          setPeriodOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.filterWrap}>
              <button
                type="button"
                className={styles.filterBtn}
                onClick={() => {
                  setServerOpen(open => !open);
                  setPeriodOpen(false);
                }}
                aria-expanded={serverOpen}
                aria-haspopup="listbox"
              >
                <span className={styles.filterPrefix}>Server:</span>
                <span className={styles.filterValue}>{server}</span>
                <span className={styles.filterCaret} aria-hidden="true">
                  ▾
                </span>
              </button>
              {serverOpen && (
                <ul className={styles.filterMenu} role="listbox" aria-label="Select server">
                  {SERVERS.map(option => (
                    <li key={option} role="option" aria-selected={server === option}>
                      <button
                        type="button"
                        className={styles.filterOption}
                        onClick={() => {
                          setServer(option);
                          setServerOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={`${styles.podium} ${styles.podiumMobile}`} aria-label="Top 3 players">
          {filteredPodium.map(player => (
            <article
              key={player.rank}
              className={[
                styles.podiumCard,
                player.variant === 'gold' && styles.podiumCardGold,
                player.variant === 'silver' && styles.podiumCardSilver,
                player.variant === 'bronze' && styles.podiumCardBronze,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ width: player.cardWidth }}
            >
              <div
                className={styles.podiumImageWrap}
                style={{ width: player.imageWidth, height: player.imageHeight }}
              >
                <Image
                  src={player.image}
                  alt=""
                  width={player.imageWidth}
                  height={player.imageHeight}
                  className={styles.podiumImage}
                  sizes={`${player.imageWidth}px`}
                />
              </div>
              <p className={styles.podiumName} style={{ maxWidth: player.nameWidth }}>
                {player.name}
              </p>
              <p
                className={[
                  styles.podiumValue,
                  player.variant === 'gold' && styles.podiumValueGold,
                  player.variant === 'silver' && styles.podiumValueSilver,
                  player.variant === 'bronze' && styles.podiumValueBronze,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {player.value}
              </p>
            </article>
          ))}
        </div>

        <div className={`${styles.podium} ${styles.podiumDesktop}`} aria-label="Top 3 players">
          {filteredPodium.map(player => (
            <article
              key={player.rank}
              className={[
                styles.podiumCardDesktop,
                player.variant === 'gold' && styles.podiumCardGold,
                player.variant === 'silver' && styles.podiumCardSilver,
                player.variant === 'bronze' && styles.podiumCardBronze,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div
                className={styles.podiumDesktopFigure}
                style={{
                  width: player.desktopImageWidth,
                  height: player.desktopImageHeight,
                }}
              >
                <Image
                  src={player.image}
                  alt=""
                  width={player.desktopImageWidth}
                  height={player.desktopImageHeight}
                  className={styles.podiumDesktopImage}
                  sizes={`${player.desktopImageWidth}px`}
                  priority
                />
              </div>
              <div className={styles.podiumDesktopBody}>
                <div className={styles.podiumDesktopPlayer}>
                  <span
                    className={[styles.podiumDesktopAvatar, podiumVariantClass(player.variant)]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  >
                    {playerInitial(player.name)}
                  </span>
                  <div className={styles.podiumDesktopCopy}>
                    <p className={styles.podiumDesktopName}>{player.name}</p>
                    <div className={styles.podiumDesktopMeta}>
                      <p
                        className={[
                          styles.podiumDesktopValue,
                          player.variant === 'gold' && styles.podiumValueGold,
                          player.variant === 'silver' && styles.podiumValueSilver,
                          player.variant === 'bronze' && styles.podiumValueBronze,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {player.value}
                      </p>
                      <span className={styles.serverPill}>{player.server}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className={`${styles.list} ${styles.listMobile}`} aria-label="Leaderboard rankings">
          {filteredList.length === 0 ? (
            <p className={styles.emptyFilter}>No players match these filters.</p>
          ) : (
            <ul className={styles.listRows}>
              {filteredList.map(player => (
                <li key={player.rank} className={styles.listRow}>
                  <span className={styles.listRank}>{String(player.rank).padStart(2, '0')}</span>
                  <span className={styles.listAvatar} aria-hidden="true">
                    {playerInitial(player.name)}
                  </span>
                  <div className={styles.listInfo}>
                    <span className={styles.listName}>{player.name}</span>
                    <span className={styles.listServer}>{player.server}</span>
                  </div>
                  <span className={styles.listValue}>{metricValue(player, activeMetric)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.table} aria-label="Leaderboard rankings">
          <div className={styles.tableHead}>
            {TABLE_COLUMNS.map(column => (
              <span key={column} className={styles.tableHeadCell}>
                {column}
              </span>
            ))}
          </div>
          {filteredList.length === 0 ? (
            <p className={styles.emptyFilter}>No players match these filters.</p>
          ) : (
            <ul className={styles.tableBody}>
              {filteredList.map(player => (
                <li key={player.rank} className={styles.tableRow}>
                  <span className={styles.tableRank}>{String(player.rank).padStart(2, '0')}</span>
                  <div className={styles.tablePlayer}>
                    <span className={styles.tableAvatar} aria-hidden="true">
                      {playerInitial(player.name)}
                    </span>
                    <span className={styles.tableName}>{player.name}</span>
                  </div>
                  <div className={styles.tableServerCell}>
                    <span className={styles.serverPill}>{player.server}</span>
                  </div>
                  <span className={styles.tablePlaytime}>{player.playtime}</span>
                  <span className={styles.tableKills}>{player.kills}</span>
                  <span className={styles.tableWealth}>{player.wealth} ◆</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
