'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HowToStart.module.css';

type StepStatus = 'completed' | 'current' | 'pending';

type Step = {
  id: number;
  navLabel: string;
  title: string;
  titleDesktop?: string;
  description: string;
  descriptionDesktop: string;
  bullets: string[];
  bulletsDesktop: string[];
  callout?: string;
  calloutDesktop?: string;
  status: StepStatus;
  image?: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    navLabel: 'Download Minecraft',
    title: 'Download Minecraft',
    description: 'You need Minecraft Java or Bedrock. Java has more plugins.',
    descriptionDesktop:
      'You need a legal copy of Minecraft (Java or Bedrock edition). The Java edition is what most of our players use because it supports more plugins and custom crafts.',
    bullets: [
      'Open minecraft.net and sign in.',
      'Install 1.20.4 (Java) or latest Bedrock.',
      'Launch once to verify.',
    ],
    bulletsDesktop: [
      'Open minecraft.net and sign in with your Microsoft account.',
      'Download the launcher and install Minecraft 1.20.4 (Java) or the latest Bedrock release.',
      'Launch the game once to verify everything loads.',
    ],
    callout: 'Cosmetics and tournaments ship to Java first.',
    calloutDesktop:
      'Both editions work on our servers, but cosmetics and tournament features ship to Java first. Bedrock support arrives 1-2 weeks later.',
    status: 'completed',
    image: '/how-to-start/private-image-desktop.webp',
  },
  {
    id: 2,
    navLabel: 'Create your account',
    title: 'Create your account',
    description: 'Sign up with email + password. One-minute activation.',
    descriptionDesktop:
      'Sign up on our website with your email and password. Activation takes one minute.',
    bullets: [
      'Open Sign Up, enter email + password.',
      'Confirm via the link in your email.',
      'Pick an in-game nickname.',
    ],
    bulletsDesktop: [
      'Open the Sign Up page and enter your email + password.',
      'Confirm your email via the link we send (check spam if it does not arrive in 2 min).',
      'Set an in-game nickname — this is what other players will see.',
    ],
    status: 'completed',
  },
  {
    id: 3,
    navLabel: 'Buy or join a server',
    title: 'Buy or join a server',
    description: 'Pick a server, copy the IP, paste in Minecraft.',
    descriptionDesktop:
      'Pick a server from the Servers page — Classic, Skyblock, or Anarchy. Copy the IP and paste it into Minecraft → Multiplayer → Add Server.',
    bullets: [
      'Open Servers page.',
      'Click Copy IP.',
      'Minecraft → Multiplayer → Add Server.',
      'Click to connect.',
    ],
    bulletsDesktop: [
      'Open the Servers page in your dashboard.',
      'Click "Copy IP" on the card you want.',
      'In Minecraft, choose Multiplayer → Add Server → paste the IP.',
      'Click the server card to connect.',
    ],
    callout: 'First connection downloads our 80 MB resource pack.',
    calloutDesktop:
      'First connection downloads our ~80 MB resource pack. After that, joining is instant.',
    status: 'current',
  },
  {
    id: 4,
    navLabel: 'Link your account',
    title: 'Link your nickname',
    titleDesktop: 'Link your in-game nickname',
    description: 'Connect your in-game name to your account for delivery.',
    descriptionDesktop:
      'After joining for the first time, link your in-game nickname to your account so privileges and crystals deliver to the right player.',
    bullets: [
      'In game: /link <your email>',
      'Get a 6-digit code by email.',
      '/link confirm 123456',
    ],
    bulletsDesktop: [
      'In game, run /link followed by your account email.',
      'We send a 6-digit code to your email.',
      'Run /link confirm 123456 to finish.',
    ],
    status: 'pending',
  },
  {
    id: 5,
    navLabel: 'Pick a privilege',
    title: 'Pick a privilege',
    titleDesktop: 'Pick a privilege (optional)',
    description: 'Unlock cosmetics, cooldowns, and home points.',
    descriptionDesktop:
      'Privileges unlock cosmetics, faster cooldowns, and extra home points. All eight tiers are listed in the Shop with descriptions and live preview.',
    bullets: ['Shop → Privileges, pick a tier.', 'Add to cart, pay.'],
    bulletsDesktop: [
      'Open Shop → Privileges.',
      'Hover any tier to see the full perk list.',
      'Add to cart, pick the server, pay.',
    ],
    status: 'pending',
  },
  {
    id: 6,
    navLabel: 'Top up crystals',
    title: 'Top up crystals',
    titleDesktop: 'Top up crystals (optional)',
    description: 'Buy a pack or use the slider for custom amount.',
    descriptionDesktop:
      'Crystals are our in-game currency for cosmetics, tournament entries, and time-limited items. Buy a pack or use the custom-amount slider.',
    bullets: [
      'Shop → Crystals.',
      'Pick a preset or set amount.',
      'Instant delivery.',
    ],
    bulletsDesktop: [
      'Open Shop → Crystals.',
      'Pick a preset pack or use the slider to set exact amount.',
      'Crystals deliver instantly to your nickname.',
    ],
    status: 'pending',
  },
  {
    id: 7,
    navLabel: 'Join community Discord',
    title: 'Join community Discord',
    titleDesktop: 'Join the community Discord',
    description: 'Updates, announcements, support — all live on Discord.',
    descriptionDesktop:
      'Most of our updates, tournament announcements, and player support happen on Discord. Free to join, easy to leave.',
    bullets: [
      'Tap the Discord button.',
      'Run /verify in Discord.',
      'Pick your server role.',
    ],
    bulletsDesktop: [
      'Click the Discord button in the sidebar.',
      'Use the /verify command to link your accounts.',
      'Pick your favourite-server role and you are set.',
    ],
    callout: 'Average first-response on support: under 4 hours.',
    calloutDesktop:
      'Live support is available on Discord 24/7. Average first-response time is under 4 hours.',
    status: 'pending',
  },
];

const TOTAL_STEPS = STEPS.length;
const DONE_COUNT = 3;
const PROGRESS_PERCENT = (DONE_COUNT / TOTAL_STEPS) * 100;
const DEFAULT_ACTIVE_STEP = STEPS.find(step => step.status === 'current')?.id ?? 1;

function getDesktopSidebarStatus(stepId: number, activeStepId: number): StepStatus {
  if (stepId <= 2) return 'completed';
  if (stepId === activeStepId) return 'current';
  return 'pending';
}

function scrollSidebarItemIntoView(button: HTMLButtonElement | undefined) {
  button?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}

function MobileStepBadge({ step }: { step: Step }) {
  if (step.status === 'completed') {
    return (
      <span className={styles.stepBadgeDone} aria-hidden="true">
        ✓
      </span>
    );
  }

  return (
    <span
      className={step.status === 'current' ? styles.stepBadgeCurrent : styles.stepBadgePending}
      aria-hidden="true"
    >
      {String(step.id).padStart(2, '0')}
    </span>
  );
}

function SidebarBadge({ step, status }: { step: Step; status: StepStatus }) {
  if (status === 'completed') {
    return (
      <span className={styles.navBadgeDone} aria-hidden="true">
        ✓
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span className={styles.navBadgeCurrent} aria-hidden="true">
        {step.id}
      </span>
    );
  }

  return (
    <span className={styles.navBadgePending} aria-hidden="true">
      {step.id}
    </span>
  );
}

export default function HowToStart() {
  const [activeStepId, setActiveStepId] = useState(DEFAULT_ACTIVE_STEP);
  const sidebarButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const isProgrammaticScroll = useRef(false);
  const lastSyncedStepId = useRef(DEFAULT_ACTIVE_STEP);

  const scrollToStep = useCallback((id: number) => {
    setActiveStepId(id);
    lastSyncedStepId.current = id;
    isProgrammaticScroll.current = true;

    document.getElementById(`how-to-start-step-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    scrollSidebarItemIntoView(sidebarButtonRefs.current.get(id));

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const resolveActiveStep = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      );
      const marker = (Number.isFinite(headerHeight) ? headerHeight : 72) + 40;
      let nextActiveStep = STEPS[0].id;

      for (const step of STEPS) {
        const element = document.getElementById(`how-to-start-step-${step.id}`);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= marker) {
          nextActiveStep = step.id;
        }
      }

      setActiveStepId(nextActiveStep);

      if (lastSyncedStepId.current !== nextActiveStep) {
        lastSyncedStepId.current = nextActiveStep;
        scrollSidebarItemIntoView(sidebarButtonRefs.current.get(nextActiveStep));
      }
    };

    const onScroll = () => {
      if (!mediaQuery.matches || isProgrammaticScroll.current) return;
      resolveActiveStep();
    };

    const onMediaChange = () => {
      if (mediaQuery.matches) {
        resolveActiveStep();
      } else {
        setActiveStepId(DEFAULT_ACTIVE_STEP);
      }
    };

    onMediaChange();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', onMediaChange);
    };
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>How to Start</span>
          <h1 className={styles.title}>Get started in under 2 minutes</h1>
          <p className={styles.subtitleMobile}>
            Quick step-by-step guide for new players. Support chat is one click away if you get
            stuck.
          </p>
          <p className={styles.subtitleDesktop}>
            A quick step-by-step guide for new players. If you get stuck at any step, the in-app
            support chat is one click away.
          </p>
        </header>

        <section className={styles.progressCard} aria-label="Your progress">
          <div className={styles.progressTop}>
            <span className={styles.progressLabel}>Your progress</span>
            <span className={styles.progressValue}>
              {DONE_COUNT} of {TOTAL_STEPS} done
            </span>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={DONE_COUNT}
            aria-valuemin={0}
            aria-valuemax={TOTAL_STEPS}
            aria-label={`${DONE_COUNT} of ${TOTAL_STEPS} steps completed`}
          >
            <span
              className={styles.progressFill}
              style={{ width: `${PROGRESS_PERCENT}%` }}
            />
          </div>
        </section>

        <div className={styles.body}>
          <nav className={styles.sidebar} aria-label="Steps">
            <span className={styles.sidebarLabel}>Steps</span>
            <ul className={styles.sidebarList}>
              {STEPS.map(step => {
                const sidebarStatus = getDesktopSidebarStatus(step.id, activeStepId);

                return (
                  <li key={step.id}>
                    <button
                      ref={node => {
                        if (node) {
                          sidebarButtonRefs.current.set(step.id, node);
                        } else {
                          sidebarButtonRefs.current.delete(step.id);
                        }
                      }}
                      type="button"
                      className={[
                        styles.sidebarItem,
                        sidebarStatus === 'completed' && styles.sidebarItemDone,
                        sidebarStatus === 'current' && styles.sidebarItemCurrent,
                        sidebarStatus === 'pending' && styles.sidebarItemPending,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-current={sidebarStatus === 'current' ? 'step' : undefined}
                      onClick={() => scrollToStep(step.id)}
                    >
                      <SidebarBadge step={step} status={sidebarStatus} />
                      <span className={styles.sidebarItemLabel}>{step.navLabel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.content}>
            <ol className={styles.steps}>
              {STEPS.map(step => (
                <li
                  key={step.id}
                  id={`how-to-start-step-${step.id}`}
                  className={[
                    styles.stepCard,
                    step.status === 'completed' && styles.stepCardDone,
                    step.status === 'current' && styles.stepCardCurrent,
                    step.status === 'pending' && styles.stepCardPending,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.stepHeadMobile}>
                    <MobileStepBadge step={step} />
                    <h2 className={styles.stepTitleMobile}>{step.title}</h2>
                  </div>

                  <div className={styles.stepHeadDesktop}>
                    <span className={styles.stepNumberDesktop} aria-hidden="true">
                      {String(step.id).padStart(2, '0')}
                    </span>
                    <h2 className={styles.stepTitleDesktop}>
                      {step.titleDesktop ?? step.title}
                    </h2>
                  </div>

                  <p className={styles.stepDescriptionMobile}>{step.description}</p>
                  <p className={styles.stepDescriptionDesktop}>{step.descriptionDesktop}</p>

                  <ul className={styles.stepList}>
                    {step.bullets.map(bullet => (
                      <li key={`${step.id}-m-${bullet}`} className={styles.stepListItemMobile}>
                        <span className={styles.stepDot} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                    {step.bulletsDesktop.map(bullet => (
                      <li key={`${step.id}-d-${bullet}`} className={styles.stepListItemDesktop}>
                        <span className={styles.stepDot} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {step.image ? (
                    <div className={styles.stepMedia}>
                      <Image
                        src={step.image}
                        alt="Minecraft download illustration"
                        fill
                        className={styles.stepImage}
                        sizes="(min-width: 1024px) 50vw, 0px"
                        priority={step.id === 1}
                      />
                    </div>
                  ) : null}

                  {step.callout ? (
                    <p className={styles.stepCalloutMobile}>{step.callout}</p>
                  ) : null}
                  {step.calloutDesktop ? (
                    <p className={styles.stepCalloutDesktop}>{step.calloutDesktop}</p>
                  ) : null}
                </li>
              ))}
            </ol>

            <section className={styles.doneCard} aria-label="All steps complete">
              <div className={styles.doneMain}>
                <span className={styles.doneIcon} aria-hidden="true">
                  ✓
                </span>
                <div className={styles.doneCopy}>
                  <h2 className={styles.doneTitle}>All set — welcome aboard.</h2>
                  <p className={styles.doneText}>Need help? The support chat is one click away.</p>
                </div>
              </div>
              <div className={styles.doneActions}>
                <Link href="/faq" className={styles.doneButtonPrimary}>
                  Open support
                </Link>
                <Link href="/dashboard" className={styles.doneButtonSecondary}>
                  Go to dashboard
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
