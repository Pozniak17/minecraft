'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import styles from './Articles.module.css';

const TOC_ITEMS = [
  { id: '01', label: "What's new in 2.6" },
  { id: '02', label: 'Skyblock generator rewrite' },
  { id: '03', label: '12 new custom crafts' },
  { id: '04', label: 'Economy rebalance' },
  { id: '05', label: 'Tournament mode' },
  { id: '06', label: 'How to update' },
  { id: '07', label: 'Known issues' },
  { id: '08', label: "What's next" },
] as const;

const SOCIAL_LINKS = [
  { icon: '/icons/social/ic_outline-discord.svg', alt: 'Discord', href: '#', size: 24 },
  { icon: '/icons/social/prime_twitter.svg', alt: 'X', href: '#', size: 18 },
  { icon: '/icons/social/mingcute_youtube-fill.svg', alt: 'YouTube', href: '#', size: 24 },
  { icon: '/icons/social/ic_twotone-tiktok.svg', alt: 'TikTok', href: '#', size: 24 },
] as const;

const TAGS = ['Updates', 'Skyblock', 'Economy', 'Tournaments'] as const;

const WHATS_NEW_BULLETS = [
  'New Skyblock generator with biome-aware islands.',
  'Twelve new custom crafts, including the Ender Compass.',
  'Economy rebalance covering prices and rewards.',
  'Brand-new Tournament mode with weekly brackets.',
  'Cross-server friend list and improved chat.',
];

const WHATS_NEW_BULLETS_DESKTOP = [
  'New Skyblock generator with biome-aware island shapes.',
  'Twelve new custom crafts, including the long-requested Ender Compass.',
  'Economy rebalance covering vendor prices, taxes, and reward curves.',
  'Brand-new Tournament mode with weekly brackets and seasonal trophies.',
  'Cross-server friend list, party invites, and improved chat tooling.',
];

const UTILITY_CRAFTS = [
  'Ender Compass — points to your last death.',
  'Bulk Smelter — smelts a full stack at once.',
  'Server Pickaxe — works across claim boundaries.',
  'Quick-Stack Pouch — auto-sorts into nearby chests.',
  'Friend Beacon — pings your party on the map.',
  'Spawner Lasso — relocates monster spawners.',
];

const UTILITY_CRAFTS_DESKTOP = [
  'Ender Compass — points to your last death.',
  'Bulk Smelter — smelts a full stack at once.',
  'Server Pickaxe — works across claim boundaries (with permission).',
  'Quick-Stack Pouch — auto-sorts into nearby chests.',
  'Friend Beacon — pings your party on the map.',
  'Spawner Lasso — relocates monster spawners.',
];

const ECONOMY_BULLETS = [
  'Tools and basic armor are 15-25% cheaper.',
  'Beacons and enchanted gear are 5-10% more expensive.',
  'Daily login bonus increased by 20%.',
  'Tournament prize pools roughly doubled.',
];

const ECONOMY_BULLETS_DESKTOP = [
  'Tools and basic armor are 15-25% cheaper.',
  'Beacons and enchanted gear are 5-10% more expensive.',
  'Daily login bonus increased by 20%.',
  'Tournament prize pools are roughly double last season.',
];

const UPDATE_STEPS = [
  'Close the game completely.',
  'Open the launcher and click the refresh icon.',
  'Wait for the update banner to disappear.',
  'Launch the game; you should land on the 2.6 splash.',
];

const UPDATE_STEPS_DESKTOP = [
  'Close the game completely.',
  'Open the launcher and click the small refresh icon next to the play button.',
  'Wait for the update banner to disappear.',
  'Launch the game as usual; you should land on the 2.6 splash screen.',
];

const KNOWN_ISSUES = [
  'Ender Compass occasionally points to spawn — fix in 2.6.1.',
  'Friend Beacon does not display on some viewports.',
  'Tournament chat delayed by 5-10 seconds at peak.',
  'Three minor lantern glitches in low-light biomes.',
];

const KNOWN_ISSUES_DESKTOP = [
  'Ender Compass occasionally points to the world spawn instead of last death; fix in 2.6.1.',
  'Friend Beacon does not display correctly on certain mobile viewports.',
  'Tournament chat is sometimes delayed by 5-10 seconds during peak hours.',
  'Three minor visual glitches with the new lantern cosmetic in low-light biomes.',
];

const DESKTOP_MEDIA = '(min-width: 1280px)';

function getSectionScrollState(sectionElements: HTMLElement[]) {
  const anchor = window.scrollY + window.innerHeight * 0.3;
  let progressUnits = 0;
  let activeId: (typeof TOC_ITEMS)[number]['id'] = TOC_ITEMS[0].id;

  for (let index = 0; index < sectionElements.length; index += 1) {
    const section = sectionElements[index];
    const top = section.getBoundingClientRect().top + window.scrollY;
    const height = section.offsetHeight;
    const bottom = top + height;

    if (anchor >= bottom) {
      progressUnits += 1;
      activeId = TOC_ITEMS[index].id;
    } else if (anchor > top) {
      progressUnits += (anchor - top) / height;
      activeId = TOC_ITEMS[index].id;
      break;
    } else {
      break;
    }
  }

  return {
    activeId,
    progress: Math.min(100, Math.round((progressUnits / sectionElements.length) * 100)),
  };
}

function BulletList({
  items,
  desktopItems,
}: {
  items: readonly string[];
  desktopItems?: readonly string[];
}) {
  return (
    <>
      <ul className={`${styles.bulletList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map(item => (
          <li key={item} className={styles.bulletItem}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.bulletText}>{item}</span>
          </li>
        ))}
      </ul>
      {desktopItems && (
        <ul className={`${styles.bulletList} ${styles.desktopOnly}`}>
          {desktopItems.map(item => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span className={styles.bulletText}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function OrderedList({
  items,
  desktopItems,
}: {
  items: readonly string[];
  desktopItems?: readonly string[];
}) {
  return (
    <>
      <ol className={`${styles.orderedList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map((item, index) => (
          <li key={item} className={styles.orderedItem}>
            <span className={styles.orderedNum}>{index + 1}</span>
            <span className={styles.orderedText}>{item}</span>
          </li>
        ))}
      </ol>
      {desktopItems && (
        <ol className={`${styles.orderedList} ${styles.desktopOnly}`}>
          {desktopItems.map((item, index) => (
            <li key={item} className={styles.orderedItem}>
              <span className={styles.orderedNum}>{index + 1}</span>
              <span className={styles.orderedText}>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function ArticleFigure({
  src,
  alt,
  caption,
  dashed,
}: {
  src: string;
  alt: string;
  caption: string;
  dashed?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <div
        className={`${styles.figureFrame} ${dashed ? styles.figureFrameDashed : ''}`}
      >
        <Image src={src} alt={alt} width={760} height={420} className={styles.figureImage} />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

function Callout({
  variant,
  title,
  children,
  desktopChildren,
}: {
  variant: 'info' | 'warn';
  title: string;
  children: React.ReactNode;
  desktopChildren?: React.ReactNode;
}) {
  return (
    <aside
      className={`${styles.callout} ${variant === 'info' ? styles.calloutInfo : styles.calloutWarn}`}
    >
      <p className={styles.calloutTitle}>{title}</p>
      <p className={`${styles.calloutText} ${desktopChildren ? styles.mobileOnly : ''}`}>
        {children}
      </p>
      {desktopChildren && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{desktopChildren}</p>
      )}
    </aside>
  );
}

function ShareLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map(link => (
        <a
          key={link.alt}
          href={link.href}
          className={styles.shareLink}
          aria-label={link.alt}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={link.icon} alt="" width={link.size} height={link.size} />
        </a>
      ))}
    </div>
  );
}

export default function Articles() {
  const [activeId, setActiveId] = useState<(typeof TOC_ITEMS)[number]['id']>('01');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    let frameId = 0;

    const syncFromScroll = () => {
      if (!mediaQuery.matches) {
        return;
      }

      const sections = TOC_ITEMS.map(item => document.getElementById(`section-${item.id}`)).filter(
        (section): section is HTMLElement => section !== null,
      );

      if (sections.length === 0) {
        return;
      }

      const { activeId: nextActiveId, progress } = getSectionScrollState(sections);
      setActiveId(nextActiveId);
      setReadingProgress(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mediaQuery.addEventListener('change', syncFromScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mediaQuery.removeEventListener('change', syncFromScroll);
    };
  }, []);

  const scrollToSection = (id: (typeof TOC_ITEMS)[number]['id']) => {
    setActiveId(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.card} aria-label="On this page">
              <div className={styles.head}>
                <span className={styles.headLabel}>On this page</span>
                <span className={styles.headIcon} aria-hidden="true">
                  ▾
                </span>
              </div>

              <ol className={styles.list}>
                {TOC_ITEMS.map(item => {
                  const isActive = item.id === activeId;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className={styles.itemNumber}>{item.id}</span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className={styles.progressBlock}>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>Reading progress</span>
                  <span className={styles.progressValue}>{readingProgress}%</span>
                </div>

                <div
                  className={styles.progressBar}
                  role="progressbar"
                  aria-valuenow={readingProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Reading progress"
                >
                  <span
                    className={styles.progressFill}
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>Share this article</p>
              <ShareLinks className={styles.shareCardLinks} />
            </div>

            <div className={styles.tagsCard}>
              <p className={styles.tagsCardTitle}>Tags</p>
              <ul className={styles.tagsList}>
                {TAGS.map(tag => (
                  <li key={tag}>
                    <span className={styles.tag}>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Share:</span>
              <ShareLinks className={styles.shareRowLinks} />
            </div>

            <p className={`${styles.lead} ${styles.mobileOnly}`}>
              After eight weeks on the public test branch, the 2.6 patch is finally rolling out
              across every server. This release rewrites how Skyblock works, adds twelve new crafts,
              ships a new tournament mode, and touches almost every economy curve.
            </p>
            <p className={`${styles.lead} ${styles.desktopOnly}`}>
              After eight weeks on the public test branch, the 2.6 patch is finally rolling out
              across every server. This release rewrites a fair amount of how Skyblock works, adds
              twelve new crafts, ships a brand-new tournament mode, and touches almost every economy
              curve in the game. Here is the full breakdown.
            </p>

            <section id="section-01" className={styles.section}>
              <h2 className={styles.sectionTitle}>1. What&apos;s new in 2.6</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                We focused this release on the three areas players asked for most: Skyblock
                progression, economy balance, and competitive play. Every change ships across all
                servers simultaneously.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                We focused this release on the three areas players asked for most in the spring
                survey: Skyblock progression, economy balance, and competitive play. Every change
                ships across all servers simultaneously, so nothing is locked behind a specific
                world.
              </p>
              <BulletList items={WHATS_NEW_BULLETS} desktopItems={WHATS_NEW_BULLETS_DESKTOP} />
            </section>

            <section id="section-02" className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Skyblock generator rewrite</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                The original Skyblock generator was the oldest piece of our codebase — four years
                old, before we supported custom biomes. We finally retired it. The new generator
                produces biome-aware islands.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                The original Skyblock generator was the oldest piece of our codebase — written four
                years ago, before we supported custom biomes or large-scale automation. We finally
                retired it. The new generator produces islands that respect the biome you picked at
                signup: lush jungle starters, snowy spruce platforms, and a brand-new mushroom
                variant for adventurous players.
              </p>
              <ArticleFigure
                src="/blog/update-skyblock.png"
                alt="Biome-aware starter island in Skyblock"
                caption="Caption: One of three new biome-aware starter islands available on day one."
                dashed
              />
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Underneath, the generator is now seeded — the same world ID always produces the same
                island, so you can plan builds with friends before you spawn in. Existing saves are
                not touched.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Underneath, the generator is now seeded — the same world ID always produces the same
                island, so you can plan builds with friends before you even spawn in. The change is
                fully backwards-compatible: existing saves are not touched.
              </p>
              <Callout
                variant="info"
                title="Heads up"
                desktopChildren="If you decide to regenerate your island, your old build is archived for 30 days. You can restore it from the user dashboard at any time during that window."
              >
                If you regenerate your island, your old build is archived for 30 days. Restore it
                from the dashboard any time.
              </Callout>
            </section>

            <section id="section-03" className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Twelve new custom crafts</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Custom crafts are recipes that only exist on our servers. With 2.6, we are shipping
                twelve new ones — six utility, six cosmetic.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Custom crafts are recipes that only exist on our servers. They use vanilla materials
                but produce unique tools and decorative items. With 2.6, we are shipping twelve new
                ones — six utility, six cosmetic. The full list is in the in-game compendium under
                Recipes → Server.
              </p>
              <h3 className={styles.subheading}>Utility crafts</h3>
              <OrderedList items={UTILITY_CRAFTS} desktopItems={UTILITY_CRAFTS_DESKTOP} />
              <h3 className={styles.subheading}>Cosmetic crafts</h3>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Six new decorative items joined the catalog, including the Glowing Banner Set, the
                Floating Lantern, and three Iron Trophy variants.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Six new decorative items have joined the catalog, including the wildly popular
                Glowing Banner Set, the Skyblock Floating Lantern, and three variants of the
                seasonal Iron Trophy used in tournaments. All cosmetic crafts are also available as
                a bundle in the in-game store.
              </p>
            </section>

            <section id="section-04" className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Economy rebalance</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                We adjusted every vendor price, every event reward, and the daily tax curve. Most are
                small percentage changes — but a handful of items are now significantly cheaper to
                help early progression.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                We adjusted every vendor price, every event reward, and the daily tax curve. Most of
                these are small percentage changes that should be invisible during a normal session
                — but a handful of items are now significantly cheaper to encourage early-game
                progression.
              </p>
              <blockquote className={styles.quote}>
                <p className={`${styles.quoteText} ${styles.mobileOnly}`}>
                  &ldquo;We wanted new players to feel real progression in their first three hours of
                  play — not a slow grind.&rdquo;
                </p>
                <p className={`${styles.quoteText} ${styles.desktopOnly}`}>
                  &ldquo;We wanted new players to feel real progression in their first three hours of
                  play — not a slow grind. Most of the rebalance is aimed at hour one and hour two of
                  a fresh account.&rdquo;
                </p>
                <cite className={styles.quoteAuthor}>— Mike Rasmus, Lead Server Engineer</cite>
              </blockquote>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                A complete diff of the changes is published on the developer blog if you want to see
                every line. The TL;DR is below.
              </p>
              <BulletList items={ECONOMY_BULLETS} desktopItems={ECONOMY_BULLETS_DESKTOP} />
            </section>

            <section id="section-05" className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Tournament mode</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                The biggest single feature in 2.6. Every week a new bracket opens Friday at 18:00
                UTC and runs through Sunday 23:59 UTC. Top finishers earn trophies, prize-pool
                currency, and exclusive cosmetics.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                The biggest single feature in 2.6: Tournament mode. Every week a new bracket opens on
                Friday at 18:00 UTC and runs through Sunday at 23:59 UTC. Top finishers earn season
                trophies, prize-pool currency, and exclusive cosmetic skins.
              </p>
              <ArticleFigure
                src="/blog/update-tournament.png"
                alt="Tournament bracket interface"
                caption="Caption: The new bracket interface — fully accessible from the in-game menu."
              />
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Brackets are auto-balanced by playtime, so brand-new accounts compete with peers of
                similar experience.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Brackets are auto-balanced by playtime and historical performance, so brand-new
                accounts compete with peers of similar experience. We will publish a full strategy
                guide once the first season closes in three weeks.
              </p>
            </section>

            <section id="section-06" className={styles.section}>
              <h2 className={styles.sectionTitle}>6. How to update</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                The patch installs automatically on next launch. To force the update, follow the steps
                below.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                You do not need to do anything — the patch installs automatically on next launch. If
                you want to force the update, follow the steps below.
              </p>
              <OrderedList items={UPDATE_STEPS} desktopItems={UPDATE_STEPS_DESKTOP} />
              <Callout
                variant="warn"
                title="Performance note"
                desktopChildren="If you play with high-resolution resource packs, expect a one-time longer load on the first launch after the update. Subsequent loads return to normal."
              >
                If you play with high-resolution resource packs, expect a one-time longer load on
                first launch.
              </Callout>
            </section>

            <section id="section-07" className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Known issues</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Here is what we already know and are tracking for hotfix 2.6.1, scheduled for next
                Tuesday.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Every release ships with a few rough edges. Here is what we already know about and
                are tracking for hotfix 2.6.1, scheduled for next Tuesday.
              </p>
              <BulletList items={KNOWN_ISSUES} desktopItems={KNOWN_ISSUES_DESKTOP} />
            </section>

            <section id="section-08" className={styles.section}>
              <h2 className={styles.sectionTitle}>8. What&apos;s next</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                We are already planning 2.7. Headline features: a creative-mode sandbox, expanded
                redstone components, and an in-game macro recorder. Public test branch opens
                mid-June.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                We are already deep into planning for 2.7. The headline features are a creative-mode
                building sandbox, expanded redstone components, and an in-game macro recorder for
                repetitive builds. Expect the public test branch to open around mid-June.
              </p>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>
                Thanks for being part of the ecosystem. See you on the islands.
              </p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>
                Thanks, as always, for being part of the ecosystem. See you on the islands.
              </p>
              <div className={styles.cta}>
                <button type="button" className={styles.ctaPrimary}>
                  Subscribe to updates
                </button>
                <Link href="/blog" className={styles.ctaSecondary}>
                  Browse all updates
                </Link>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
