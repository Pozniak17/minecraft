'use client';

import { useState } from 'react';
import styles from './HeroTopics.module.css';

const TOPICS = [
  'Getting started',
  'Account & login',
  'Payments',
  'Servers',
  'Privileges',
  'Gameplay',
  'Technical issues',
  'Rules',
] as const;

type Topic = (typeof TOPICS)[number];

export default function HeroTopics() {
  const [activeTopic, setActiveTopic] = useState<Topic>('Getting started');

  return (
    <div className={styles.topics}>
      <p className={styles.label}>Popular topics</p>

      <div className={styles.tags} role="tablist" aria-label="Popular FAQ topics">
        {TOPICS.map(topic => {
          const isActive = topic === activeTopic;

          return (
            <button
              key={topic}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
}
