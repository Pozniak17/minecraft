'use client';

import styles from './Filters.module.css';
import { FAQ_MOBILE_CHIP_IDS, getCategoryById, type FaqCategoryId } from '../faqCategories';

const SORT_LABEL = 'Most helpful';

type FiltersProps = {
  activeCategory: FaqCategoryId;
  onCategoryChange: (category: FaqCategoryId) => void;
};

export default function Filters({ activeCategory, onCategoryChange }: FiltersProps) {
  const active = getCategoryById(activeCategory);
  const selectedLabel = active.id === 'all' ? 'All categories' : active.mobileLabel;

  return (
    <div className={styles.filters}>
      <div className={styles.content}>
        <div className={`${styles.chipsScroll} ${styles.mobileOnly}`}>
          {FAQ_MOBILE_CHIP_IDS.map(id => {
            const category = getCategoryById(id);
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                aria-pressed={isActive}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.mobileLabel}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.select} ${styles.mobileOnly}`}
          aria-haspopup="listbox"
        >
          <span className={styles.selectLeft}>
            <span className={styles.selectIcon} aria-hidden="true">
              ▦
            </span>
            <span className={styles.selectLabel}>Category:</span>
            <span className={styles.selectValue}>{selectedLabel}</span>
            {active.id !== 'all' && <span className={styles.countBadge}>{active.count}</span>}
          </span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        <div className={`${styles.meta} ${styles.mobileOnly}`}>
          <p className={styles.result}>1-5 of 18</p>
          <button type="button" className={styles.sort}>
            <span>{SORT_LABEL}</span>
            <span className={styles.chevron} aria-hidden="true">
              ▾
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
