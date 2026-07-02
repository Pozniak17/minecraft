'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DashboardServer, LivePlayer } from '@/lib/data/dashboardServers';
import { useServerOnline } from '@/lib/client/useServerOnline';
import styles from './ServerDetail.module.css';

type ServerDetailProps = {
  server: DashboardServer;
};

function LiveRows({ players }: { players: LivePlayer[] }) {
  const t = useTranslations('serversData');

  return (
    <>
      {players.map(player => (
        <li key={player.name} className={styles.liveRow}>
          <span className={styles.avatar} aria-hidden>
            {player.initial}
          </span>
          <div className={styles.liveCopy}>
            <span className={styles.liveName}>{player.name}</span>
            <span className={styles.liveActivity}>{t(`activities.${player.activity}`)}</span>
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
  const t = useTranslations('serversData');

  return (
    <div className={styles.chart}>
      <h3 className={styles.chartTitle}>{t('ui.playersLast24h')}</h3>
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
        <span>{t('ui.24hAgo')}</span>
        <span className={styles.chartNow}>{t('ui.now')}</span>
      </div>
    </div>
  );
}

export default function ServerDetail({ server }: ServerDetailProps) {
  const t = useTranslations('serversData');
  const [copied, setCopied] = useState(false);
  const live = useServerOnline(server.id);
  const isOnline = live.status === 'online';
  const isLoading = live.status === 'loading';
  const statusLabel = isLoading ? t('ui.checking') : isOnline ? t('ui.online') : t('ui.offline');
  const current =
    live.online !== null ? live.online : isLoading ? server.current : null;
  const playersMobile =
    current !== null ? String(current) : '—';
  const playersDesktop =
    current !== null ? String(current) : '—';
  const chartMax = Math.max(...server.chartData, 1);

  const livePlayers = useMemo((): LivePlayer[] => {
    if (isOnline && live.players.length > 0) {
      return live.players.map(name => ({
        initial: name.charAt(0).toUpperCase() || '?',
        name,
        activity: 'playing',
      }));
    }
    if (isLoading) {
      return server.livePlayersDesktop;
    }
    return [];
  }, [isOnline, isLoading, live.players, server.livePlayersDesktop]);

  const hasLive = livePlayers.length > 0;

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(server.ip).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [server.ip]);

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/dashboard/servers" className={styles.crumbLink}>
          <span className={styles.crumbArrow} aria-hidden>
            ←
          </span>
          <span>{t('ui.allServers')}</span>
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
              {statusLabel}
            </span>
            <span className={styles.category}>{t(`${server.id}.category`)}</span>
          </div>

          <h1 className={styles.title}>{server.detailTitle}</h1>

          <p className={styles.leadMobile}>{t(`${server.id}.detailDescription`)}</p>
          <p className={styles.leadDesktop}>{t(`${server.id}.detailDescriptionDesktop`)}</p>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.statValue}>
                <span className={styles.statValueMobile}>{playersMobile}</span>
                <span className={styles.statValueDesktop}>{playersDesktop}</span>
              </dt>
              <dd className={styles.statLabel}>
                <span className={styles.statLabelMobile}>{t('ui.statLabelPlayers')}</span>
                <span className={styles.statLabelDesktop}>{t('ui.statLabelPlayersDesktop')}</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{isOnline ? server.latency : t('ui.offlineLabel')}</dt>
              <dd className={styles.statLabel}>{t('ui.latencyLabel')}</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{server.uptime}</dt>
              <dd className={styles.statLabel}>{t('ui.uptimeLabel')}</dd>
            </div>
          </dl>

          <div className={styles.ipBox}>
            <div className={styles.ipTop}>
              <span className={styles.ipLabel}>{t('ui.serverIp')}</span>
              <span className={styles.ipVersion}>{server.version}</span>
            </div>
            <div className={styles.ipRow}>
              <p className={styles.ipAddress}>{server.ip}</p>
            </div>
          </div>

          <button type="button" className={styles.join} onClick={handleCopy}>
            {copied ? t('ui.copied') : t('ui.copyIp')}
          </button>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>{t('ui.aboutServer')}</h2>
      <div className={styles.about}>
        <p className={styles.aboutTextMobile}>{t(`${server.id}.aboutText`)}</p>
        <p className={styles.aboutTextDesktop}>{t(`${server.id}.aboutTextDesktop`)}</p>
        <p className={styles.featuresHeading}>{t('ui.keyFeatures')}</p>
        <ul className={styles.featureListMobile}>
          {Array.from({ length: server.featureCount }, (_, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {t(`${server.id}.feature${i}`)}
            </li>
          ))}
        </ul>
        <ul className={styles.featureListDesktop}>
          {Array.from({ length: server.featureCountDesktop }, (_, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {t(`${server.id}.featureD${i}`)}
            </li>
          ))}
        </ul>
      </div>

      {hasLive ? (
        <>
          <h2 className={styles.liveTitleMobile}>{t('ui.liveNow')}</h2>
          <h2 className={styles.activityTitleDesktop}>{t('ui.currentActivity')}</h2>

          <div className={styles.activityRow}>
            <div className={styles.livePanelMobile}>
              <ul className={styles.liveList}>
                <LiveRows players={livePlayers} />
              </ul>
            </div>

            <div className={styles.livePanelDesktop}>
              <div className={styles.liveHeadDesktop}>
                <span className={styles.liveHeadTitle}>{t('ui.liveNow')}</span>
                <span className={styles.liveHeadCount}>{playersDesktop} {t('ui.players')}</span>
              </div>
              <ul className={styles.liveList}>
                <LiveRows players={livePlayers} />
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
      </div>
    </section>
  );
}
