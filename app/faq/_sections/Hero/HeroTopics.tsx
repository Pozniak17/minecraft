'use client';

import {
  FAQ_HERO_TOPIC_IDS,
  getHeroTopicLabel,
  type FaqCategoryId,
} from '../faqCategories';
import { useFaqPage } from '../FaqPageContext';
import styles from './HeroTopics.module.css';

function scrollToResults() {
  requestAnimationFrame(() => {
    document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export default function HeroTopics() {
  const { activeCategory, setActiveCategory } = useFaqPage();

  const selectTopic = (categoryId: FaqCategoryId) => {
    setActiveCategory(categoryId);
    scrollToResults();
  };

  return (
    <div className={styles.topics}>
      <p className={styles.label}>Popular topics</p>

      <div className={styles.tags} role="tablist" aria-label="Popular FAQ topics">
        {FAQ_HERO_TOPIC_IDS.map(categoryId => {
          const isActive = activeCategory === categoryId;

          return (
            <button
              key={categoryId}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
              onClick={() => selectTopic(categoryId)}
            >
              {getHeroTopicLabel(categoryId)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
