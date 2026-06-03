'use client';

import { useState } from 'react';
import styles from './HeroTags.module.css';

export const HERO_TAGS = [
  'All',
  'Guides',
  'Engineering',
  'PvP',
  'Community',
  'Updates',
  'Tutorials',
] as const;
export type HeroTag = (typeof HERO_TAGS)[number];

export default function HeroTags() {
  const [activeTag, setActiveTag] = useState<HeroTag>('All');

  return (
    <div className={styles.tags} role="tablist" aria-label="Blog categories">
      {HERO_TAGS.map(tag => {
        const isActive = tag === activeTag;

        return (
          <button
            key={tag}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
