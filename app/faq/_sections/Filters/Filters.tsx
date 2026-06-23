'use client';

import { useMemo } from 'react';
import { filterFaqArticles } from '@/app/faq/_data/faqArticles';
import styles from './Filters.module.css';
import {
  FAQ_MOBILE_CHIP_IDS,
  getCategoryById,
  type FaqCategoryId,
} from '../faqCategories';
import { useFaqPage } from '../FaqPageContext';
import FaqSortSelect from '../FaqList/FaqSortSelect';

type FiltersProps = {
  activeCategory: FaqCategoryId;
  onCategoryChange: (category: FaqCategoryId) => void;
};

export default function Filters({ activeCategory, onCategoryChange }: FiltersProps) {
  const active = getCategoryById(activeCategory);
  const { searchQuery, clearSearch, itemsPerPage, sortOption, setSortOption } = useFaqPage();
  const selectedLabel = active.id === 'all' ? 'All categories' : active.mobileLabel;
  const trimmedQuery = searchQuery.trim();

  const totalInCategory = useMemo(
    () => filterFaqArticles(activeCategory, searchQuery).length,
    [activeCategory, searchQuery],
  );
  const visibleEnd = totalInCategory === 0 ? 0 : Math.min(itemsPerPage, totalInCategory);

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
          <p className={styles.result}>
            {trimmedQuery
              ? totalInCategory === 0
                ? `0 results for "${trimmedQuery}"`
                : `1-${visibleEnd} of ${totalInCategory} for "${trimmedQuery}"`
              : totalInCategory === 0
                ? '0 results'
                : `1-${visibleEnd} of ${totalInCategory}`}
          </p>
          {trimmedQuery ? (
            <button type="button" className={styles.clearSearch} onClick={clearSearch}>
              Clear
            </button>
          ) : (
            <FaqSortSelect value={sortOption} onChange={setSortOption} variant="mobile" />
          )}
        </div>
      </div>
    </div>
  );
}
