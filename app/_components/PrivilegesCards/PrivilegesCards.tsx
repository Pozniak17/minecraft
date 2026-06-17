'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import Card from './Card/Card';
import styles from './PrivilegesCards.module.css';
import image1 from '@/public/privileges/images/1.png';
import image2 from '@/public/privileges/images/2.png';
import image3 from '@/public/privileges/images/3.png';
import image4 from '@/public/privileges/images/4.png';
import image5 from '@/public/privileges/images/5.png';
import image6 from '@/public/privileges/images/6.png';
import image7 from '@/public/privileges/images/7.png';
import image8 from '@/public/privileges/images/8.png';

export type PrivilegesCardProps = {
  title: string;
  text: string;
  icon: StaticImageData;
};

const Data: PrivilegesCardProps[] = [
  {
    title: 'Silver',
    text: 'Get the SILVER kit and enjoy useful gameplay, instant access to workbench, ender chest and inventory, player teleportation, and private message control. You’ll also get 4 auction slots, 2 land claims, 2 sethome points, and earn $50 per hour in-game. A practical upgrade for smoother and more comfortable gameplay.',
    icon: image1,
  },

  {
    title: 'Supreme',
    text: 'Unlock the SUPREME kit and enjoy advanced perks like wearing items as a hat, ignoring players, checking last visits, and changing your personal weather. You’ll also get 6 auction slots, 4 land claims, 4 sethome points, and earn $100 per hour in-game. A powerful upgrade for players who want maximum control and extra benefits.',
    icon: image2,
  },

  {
    title: 'Wither',
    text: 'Unlock the WITHER kit and gain powerful perks like access to admin chat, viewing nearby players, restoring hunger, extinguishing yourself, and checking server information. You’ll also get 8 auction slots, 6 land claims, 6 sethome points, and earn $150 per hour in-game. A premium choice for players who want extended control and advanced server privileges.',
    icon: image3,
  },

  {
    title: 'Hero',
    text: 'Unlock the HERO kit and enjoy high-level perks like broadcasting ads, viewing other players’ inventories etc. You’ll also receive spawner drops when broken with Silk Touch, 12 auction slots, 8 land claims, 8 sethome points, and earn $200 per hour in-game. A top-tier upgrade for players who want maximum power, control, and server advantages.',
    icon: image4,
  },

  {
    title: 'Avenger',
    text: 'Take full control of your gameplay with the AVENGER kit. Change your nickname, control time and weather and view other players’ armor. You’ll also get 22 auction slots, the ability to claim up to 50 regions, set 50 homes, and earn $250 per hour in-game. Designed for dedicated players who want full freedom, large-scale building potential.',
    icon: image5,
  },

  {
    title: 'Legend',
    text: 'Reach the highest tier with the LEGEND kit and powerful server privileges. Manage players, repair your items, and monitor private messages. You’ll receive 30 auction slots, the ability to claim up to 99 regions, set 99 homes, and earn $250 per hour in-game. The ultimate package for players who want top authority',
    icon: image6,
  },

  {
    title: 'Phantom',
    text: 'Enter the server with ultimate power through the PHANTOM kit and unmatched privileges. Gain immunity from bans, kicks, mutes, and similar restrictions, heal yourself instantly, ban players, and reveal real nicknames. You’ll receive 60 auction slots, the ability to claim up to 199 regions, set 199 homes, and earn $300 per hour in-game. The most exclusive tier for players who want maximum server dominance.',
    icon: image7,
  },

  {
    title: 'Phoenix',
    text: 'Rise above all with the PHOENIX kit and the most powerful privileges on the server. Gain enhanced banning abilities (×2), repair all items at once, heal other players using, and activate immortality.You’ll receive 100 auction slots, the ability to claim up to 299 regions, set 299 homes, and earn $400 per hour in-game. The ultimate rank for players who want complete control, prestige, and maximum server advantages.',
    icon: image8,
  },
];

type PrivilegesCardsProps = {
  initialLimit?: number;
  /** When set, "View more" navigates here instead of expanding inline. */
  viewMoreHref?: string;
  /** Smaller cards for the narrower dashboard content area. */
  compact?: boolean;
  /** When provided, the "Add to cart" button on each card is wired to this. */
  onAddToCart?: (title: string) => Promise<void> | void;
};

export default function PrivilegesCards({
  initialLimit,
  viewMoreHref,
  compact = false,
  onAddToCart,
}: PrivilegesCardsProps) {
  const [expanded, setExpanded] = useState(false);
  const [pendingTitle, setPendingTitle] = useState<string | null>(null);
  const [doneTitles, setDoneTitles] = useState<Set<string>>(new Set());

  const hasMore = initialLimit != null && Data.length > initialLimit;
  const visible = hasMore && !expanded ? Data.slice(0, initialLimit) : Data;
  const showViewMore = hasMore && !expanded;

  const handleAdd = async (title: string) => {
    if (!onAddToCart || pendingTitle) return;
    setPendingTitle(title);
    try {
      await onAddToCart(title);
      setDoneTitles(prev => new Set(prev).add(title));
    } catch {
      // Помилку показує батьківський компонент (Shop) через свій notice.
    } finally {
      setPendingTitle(null);
    }
  };

  return (
    <div className={styles.root}>
      <ul className={`${styles.cards} ${compact ? styles.cardsCompact : ''}`}>
        {visible.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            text={item.text}
            icon={item.icon}
            compact={compact}
            onAdd={onAddToCart ? () => handleAdd(item.title) : undefined}
            pending={pendingTitle === item.title}
            done={doneTitles.has(item.title)}
          />
        ))}
      </ul>

      {showViewMore && (
        <div className={styles.viewMore}>
          {viewMoreHref ? (
            <Link href={viewMoreHref} className={styles.viewMoreBtn}>
              View more
            </Link>
          ) : (
            <button
              type="button"
              className={styles.viewMoreBtn}
              onClick={() => setExpanded(true)}
            >
              View more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
