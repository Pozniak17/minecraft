'use client';

import Link from 'next/link';
import { FAQ_CATEGORIES, FAQ_MOST_ASKED, type FaqCategoryId } from '../faqCategories';
import styles from './FaqSidebar.module.css';

type FaqSidebarProps = {
  activeCategory: FaqCategoryId;
  onCategoryChange: (category: FaqCategoryId) => void;
};

export default function FaqSidebar({ activeCategory, onCategoryChange }: FaqSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="FAQ navigation">
      <div className={styles.categoriesCard}>
        <h2 className={styles.cardTitle}>Browse by topic</h2>
        <ul className={styles.categoryList}>
          {FAQ_CATEGORIES.map(category => {
            const isActive = category.id === activeCategory;

            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  aria-pressed={isActive}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className={styles.categoryLabel}>{category.label}</span>
                  <span className={styles.categoryCount}>{category.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.popularCard}>
        <h2 className={styles.cardTitle}>Most asked</h2>
        <ul className={styles.popularList}>
          {FAQ_MOST_ASKED.map(item => (
            <li key={item.num} className={styles.popularItem}>
              <span className={styles.popularNum}>{item.num}</span>
              <Link href={`/faq/${item.slug}`} className={styles.popularQuestion}>
                {item.question}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
