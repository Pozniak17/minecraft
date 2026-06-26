'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Tournaments.module.css';

const CYCLE_DAYS = 30;
const CYCLE_MS = CYCLE_DAYS * 86_400_000;
const LAUNCH_ANCHOR_MS = Date.parse('2026-07-26T23:59:59');

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Next 30-day cycle boundary — rolls forward automatically after each countdown ends. */
function getNextLaunchAt(now = Date.now()): Date {
  if (now < LAUNCH_ANCHOR_MS) {
    return new Date(LAUNCH_ANCHOR_MS);
  }

  const elapsed = now - LAUNCH_ANCHOR_MS;
  const cycleIndex = Math.floor(elapsed / CYCLE_MS) + 1;
  return new Date(LAUNCH_ANCHOR_MS + cycleIndex * CYCLE_MS);
}

function getCountdown(now = Date.now()): Countdown {
  const diff = Math.max(0, getNextLaunchAt(now).getTime() - now);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

type CountdownUnit = {
  key: keyof Countdown;
  mobileKey: string;
  desktopKey: string;
};

const COUNTDOWN_UNITS: CountdownUnit[] = [
  { key: 'days', mobileKey: 'tournaments.countdown.daysMobile', desktopKey: 'tournaments.countdown.daysDesktop' },
  { key: 'hours', mobileKey: 'tournaments.countdown.hoursMobile', desktopKey: 'tournaments.countdown.hoursDesktop' },
  { key: 'minutes', mobileKey: 'tournaments.countdown.minutesMobile', desktopKey: 'tournaments.countdown.minutesDesktop' },
  { key: 'seconds', mobileKey: 'tournaments.countdown.secondsMobile', desktopKey: 'tournaments.countdown.secondsDesktop' },
];

const FEATURE_ICONS = ['♛', '◆', '⚔'] as const;
const FEATURE_KEYS = ['f0', 'f1', 'f2'] as const;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export default function Tournaments() {
  const t = useTranslations('account');
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <div className={styles.hero}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>{t('tournaments.comingSoon')}</span>
          </div>

          <div className={styles.heroImageWrap}>
            <Image
              src="/profile/tournaments/1.webp"
              alt=""
              width={186}
              height={186}
              className={styles.heroImage}
              sizes="(min-width: 1024px) 186px, 186px"
              priority
            />
          </div>

          <h1 className={styles.title}>{t('tournaments.title')}</h1>

          <p className={styles.descriptionMobile}>{t('tournaments.descMobile')}</p>

          <p className={styles.descriptionDesktop}>{t('tournaments.descDesktop')}</p>
        </div>

        <div className={styles.countdown} aria-label={t('tournaments.countdownLabel')}>
          {COUNTDOWN_UNITS.map((unit, index) => (
            <Fragment key={unit.key}>
              {index > 0 && (
                <span className={styles.countdownSep} aria-hidden="true">
                  :
                </span>
              )}
              <div className={styles.countdownUnit}>
                <span className={styles.countdownValue}>
                  {unit.key === 'days' ? countdown.days : pad(countdown[unit.key])}
                </span>
                <span className={styles.countdownLabelMobile}>
                  {t(unit.mobileKey as Parameters<typeof t>[0])}
                </span>
                <span className={styles.countdownLabelDesktop}>
                  {t(unit.desktopKey as Parameters<typeof t>[0])}
                </span>
              </div>
            </Fragment>
          ))}
        </div>

        <section className={styles.featureCards} aria-label={t('tournaments.featuresLabel')}>
          {FEATURE_KEYS.map((key, i) => (
            <article key={key} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                {FEATURE_ICONS[i]}
              </span>
              <h2 className={styles.featureTitle}>
                {t(`tournaments.${key}.title` as Parameters<typeof t>[0])}
              </h2>
              <p className={styles.featureText}>
                {t(`tournaments.${key}.desc` as Parameters<typeof t>[0])}
              </p>
            </article>
          ))}
        </section>

        <p className={styles.blogNote}>
          {t.rich('tournaments.blogNote', {
            link: chunks => (
              <Link href="/blog" className={styles.blogLink}>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
