'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import styles from './Tournaments.module.css';

const LAUNCH_AT = new Date('2026-06-30T23:59:59');

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownUnit = {
  key: keyof Countdown;
  labelMobile: string;
  labelDesktop: string;
};

type FeatureCard = {
  icon: string;
  title: string;
  description: string;
};

const COUNTDOWN_UNITS: CountdownUnit[] = [
  { key: 'days', labelMobile: 'd', labelDesktop: 'days' },
  { key: 'hours', labelMobile: 'h', labelDesktop: 'hours' },
  { key: 'minutes', labelMobile: 'm', labelDesktop: 'minutes' },
  { key: 'seconds', labelMobile: 's', labelDesktop: 'seconds' },
];

const FEATURES: FeatureCard[] = [
  {
    icon: '♛',
    title: 'Weekly brackets',
    description: 'New tournaments every Friday at 18:00 UTC, running through Sunday 23:59.',
  },
  {
    icon: '◆',
    title: 'Real prize pools',
    description: 'Top finishers earn crystals, trophies, and exclusive cosmetic skins.',
  },
  {
    icon: '⚔',
    title: 'Fair matchmaking',
    description: 'Auto-balanced brackets by playtime and historical performance.',
  },
];

function getCountdown(target: Date): Countdown {
  const diff = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export default function Tournaments() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(LAUNCH_AT));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(LAUNCH_AT));
    }, 1_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <div className={styles.hero}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>Coming soon</span>
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

          <h1 className={styles.title}>Tournaments are coming</h1>

          <p className={styles.descriptionMobile}>
            Weekly brackets, real prize pools, seasonal trophies. Full launch in June 2026.
          </p>

          <p className={styles.descriptionDesktop}>
            Weekly brackets, real prize pools, and seasonal trophies. We are testing the system right
            now — full launch in June 2026.
          </p>
        </div>

        <div className={styles.countdown} aria-label="Time until launch">
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
                <span className={styles.countdownLabelMobile}>{unit.labelMobile}</span>
                <span className={styles.countdownLabelDesktop}>{unit.labelDesktop}</span>
              </div>
            </Fragment>
          ))}
        </div>

        <section className={styles.featureCards} aria-label="Tournament features">
          {FEATURES.map(feature => (
            <article key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                {feature.icon}
              </span>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureText}>{feature.description}</p>
            </article>
          ))}
        </section>

        <p className={styles.blogNote}>
          For more details, follow our{' '}
          <Link href="/blog" className={styles.blogLink}>
            blog
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
