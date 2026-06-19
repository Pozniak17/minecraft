'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  getServerConnectAddress,
  type GameServerKey,
} from '@/lib/server/gameServers';
import type { CardProps } from '../Card/Card';
import { Card } from '../Card/Card';
import styles from './CardList.module.css';

const COPY_NOTICE = 'IP copied! Launch Minecraft and connect now';

const CARDS: (Omit<CardProps, 'connectAddress'> & { id: GameServerKey })[] = [
  {
    id: 'luckysurvival',
    title: 'Lucky Survival',
    text: 'Classic survival with balanced PvP',
    description:
      'Vanilla survival with PvP and TNT disabled. Perfect for fair fights, progression, and long-term gameplay.',
    icon: '/home/images/server-1.webp',
  },
  {
    id: 'minewars',
    title: 'MineWars',
    text: 'Total freedom. Total chaos.',
    description:
      'Vanilla survival with PvP and TNT enabled. Build, destroy, raid, or dominate — no limits on playstyle.',
    icon: '/home/images/server-2.webp',
  },
  {
    id: 'calmsky',
    title: 'CalmSky',
    text: 'Build, relax, and connect',
    description:
      'Peaceful vanilla server without PvP or TNT. Focus on creativity, social play, and beautiful builds.',
    icon: '/home/images/server-3.webp',
  },
];

export default function CardList() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    breakpoints: {
      '(min-width: 1280px)': { active: false },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const showCopyNotice = useCallback(() => {
    setNotice(COPY_NOTICE);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Embla doesn't emit `select` on initial mount, so sync the active index once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>
            {CARDS.map(card => (
              <div className={styles.slide} key={card.id}>
                <Card
                  {...card}
                  connectAddress={getServerConnectAddress(card.id)}
                  onCopied={showCopyNotice}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Servers">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-label={`Go to ${card.title}`}
              aria-selected={i === selectedIndex}
              className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ''}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      </div>

      {notice && (
        <div className={styles.toast} role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </>
  );
}
