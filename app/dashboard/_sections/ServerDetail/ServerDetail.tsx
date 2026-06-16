'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { DashboardServer, LivePlayer } from '@/lib/data/dashboardServers';
import styles from './ServerDetail.module.css';

type ServerDetailProps = {
  server: DashboardServer;
};

function LiveRows({ players }: { players: LivePlayer[] }) {
  return (
    <>
      {players.map(player => (
        <li key={player.name} className={styles.liveRow}>
          <span className={styles.avatar} aria-hidden>
            {player.initial}
          </span>
          <div className={styles.liveCopy}>
            <span className={styles.liveName}>{player.name}</span>
            <span className={styles.liveActivity}>{player.activity}</span>
          </div>
          <span className={styles.liveDot} aria-hidden />
        </li>
      ))}
    </>
  );
}

function ChartBlock({
  chartData,
  chartMax,
}: {
  chartData: number[];
  chartMax: number;
}) {
  return (
    <div className={styles.chart}>
      <h3 className={styles.chartTitle}>Players over the last 24 h</h3>
      <div className={styles.chartBars} aria-hidden>
        {chartData.map((height, index) => (
          <span
            key={index}
            className={styles.chartBar}
            style={{ height: `${Math.round((height / chartMax) * 180)}px` }}
          />
        ))}
      </div>
      <div className={styles.chartFooter}>
        <span>24h ago</span>
        <span className={styles.chartNow}>Now</span>
      </div>
    </div>
  );
}

export default function ServerDetail({ server }: ServerDetailProps) {
  const [copied, setCopied] = useState(false);
  const isOnline = server.status === 'online';
  const chartMax = Math.max(...server.chartData, 1);
  const hasLive = server.livePlayers.length > 0;

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(server.ip).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [server.ip]);

  return (
    <section className={styles.root}>
      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/dashboard/servers" className={styles.crumbLink}>
          <span className={styles.crumbArrow} aria-hidden>
            ←
          </span>
          <span>All servers</span>
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbCurrent}>{server.breadcrumbLabel}</span>
      </nav>

      <div className={styles.heroRow}>
        <div className={styles.heroMedia}>
          <Image
            src={server.image}
            alt=""
            width={734}
            height={451}
            className={styles.heroImg}
            priority
            aria-hidden
          />
        </div>

        <div className={styles.heroInfo}>
          <div className={styles.badges}>
            <span
              className={`${styles.status} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
            >
              <span className={styles.statusDot} aria-hidden />
              {server.status}
            </span>
            <span className={styles.category}>{server.category}</span>
          </div>

          <h1 className={styles.title}>{server.detailTitle}</h1>

          <p className={styles.leadMobile}>{server.detailDescription}</p>
          <p className={styles.leadDesktop}>{server.detailDescriptionDesktop}</p>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.statValue}>
                <span className={styles.statValueMobile}>
                  {server.current}/{server.max}
                </span>
                <span className={styles.statValueDesktop}>
                  {server.current} / {server.max}
                </span>
              </dt>
              <dd className={styles.statLabel}>
                <span className={styles.statLabelMobile}>players</span>
                <span className={styles.statLabelDesktop}>players online</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{server.latency}</dt>
              <dd className={styles.statLabel}>latency</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{server.uptime}</dt>
              <dd className={styles.statLabel}>uptime</dd>
            </div>
          </dl>

          <div className={styles.ipBox}>
            <div className={styles.ipTop}>
              <span className={styles.ipLabel}>Server IP</span>
              <span className={styles.ipVersion}>{server.version}</span>
            </div>
            <div className={styles.ipRow}>
              <p className={styles.ipAddress}>{server.ip}</p>
              <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.join} ${!isOnline ? styles.joinMuted : ''}`}
          >
            {server.joinLabelDesktop}
          </button>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>About the server</h2>
      <div className={styles.about}>
        <p className={styles.aboutTextMobile}>{server.aboutText}</p>
        <p className={styles.aboutTextDesktop}>{server.aboutTextDesktop}</p>
        <p className={styles.featuresHeading}>Key features:</p>
        <ul className={styles.featureListMobile}>
          {server.features.map(feature => (
            <li key={feature} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
        <ul className={styles.featureListDesktop}>
          {server.featuresDesktop.map(feature => (
            <li key={feature} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {hasLive ? (
        <>
          <h2 className={styles.liveTitleMobile}>Live now</h2>
          <h2 className={styles.activityTitleDesktop}>Current activity</h2>

          <div className={styles.activityRow}>
            <div className={styles.livePanelMobile}>
              <ul className={styles.liveList}>
                <LiveRows players={server.livePlayers} />
              </ul>
            </div>

            <div className={styles.livePanelDesktop}>
              <div className={styles.liveHeadDesktop}>
                <span className={styles.liveHeadTitle}>Live now</span>
                <span className={styles.liveHeadCount}>
                  {server.current} / {server.max} players
                </span>
              </div>
              <ul className={styles.liveList}>
                <LiveRows players={server.livePlayersDesktop} />
              </ul>
            </div>

            <ChartBlock chartData={server.chartData} chartMax={chartMax} />
          </div>
        </>
      ) : (
        <div className={styles.chartOnly}>
          <ChartBlock chartData={server.chartData} chartMax={chartMax} />
        </div>
      )}
    </section>
  );
}
