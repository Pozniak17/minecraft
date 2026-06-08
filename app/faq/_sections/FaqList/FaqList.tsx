'use client';

import { useState } from 'react';
import { FAQ_CATEGORY_COUNT, FAQ_LIST_ITEMS, FAQ_TOTAL_PAGES } from './faqItems';
import { getCategoryById, type FaqCategoryId } from '../faqCategories';
import styles from './FaqList.module.css';

const MOBILE_PAGE_NUMBERS = [1, 2, 3, '…', 12] as const;
const DESKTOP_PAGE_NUMBERS = [1, 2, 3, 4, 5, '…', 12] as const;

type FaqListProps = {
  activeCategory: FaqCategoryId;
};

export default function FaqList({ activeCategory }: FaqListProps) {
  const [activePage, setActivePage] = useState(1);
  const category = getCategoryById(activeCategory);

  return (
    <div className={styles.faqList}>
      <div className={styles.content}>
        <header className={styles.desktopHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>{category.label}</h2>
            <p className={styles.headerSubtitle}>Showing 1-5 of {category.count} questions</p>
          </div>
          <button type="button" className={styles.desktopSort}>
            <span className={styles.desktopSortLabel}>Sort:</span>
            <span className={styles.desktopSortValue}>Most helpful</span>
            <span className={styles.desktopSortChevron} aria-hidden="true">
              ▾
            </span>
          </button>
        </header>

        <ul className={styles.list}>
          {FAQ_LIST_ITEMS.map(item => (
            <li
              key={item.id}
              className={`${styles.item} ${item.featured ? styles.itemFeatured : ''}`}
            >
              <div className={styles.head}>
                <span className={styles.num}>{item.id}</span>

                <div className={styles.body}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{item.category}</span>
                    <span className={styles.updated}>
                      <span className={styles.updatedLabelMobile}>Upd</span>
                      <span className={styles.updatedLabelDesktop}>Updated</span>{' '}
                      {item.updated}
                    </span>
                  </div>

                  <h3 className={styles.question}>{item.question}</h3>

                  <button type="button" className={styles.readButton}>
                    Read Now
                  </button>
                </div>
              </div>

              {item.divider && <span className={styles.divider} aria-hidden="true" />}
            </li>
          ))}
        </ul>

        <nav className={styles.pagination} aria-label="FAQ pagination">
          <div className={`${styles.pagRow} ${styles.mobileOnly}`}>
            <button
              type="button"
              className={styles.pagArrow}
              aria-label="Previous page"
              disabled={activePage === 1}
              onClick={() => setActivePage(page => Math.max(1, page - 1))}
            >
              ←
            </button>

            {MOBILE_PAGE_NUMBERS.map(page => {
              if (page === '…') {
                return (
                  <span key="ellipsis-mobile" className={styles.pagEllipsis} aria-hidden="true">
                    …
                  </span>
                );
              }

              const isActive = page === activePage;

              return (
                <button
                  key={page}
                  type="button"
                  className={`${styles.pagNumber} ${isActive ? styles.pagNumberActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className={`${styles.pagArrow} ${styles.pagArrowNext}`}
              aria-label="Next page"
              disabled={activePage === FAQ_TOTAL_PAGES}
              onClick={() => setActivePage(page => Math.min(FAQ_TOTAL_PAGES, page + 1))}
            >
              →
            </button>
          </div>

          <p className={`${styles.pagCaption} ${styles.mobileOnly}`}>
            Page {activePage} of {FAQ_TOTAL_PAGES} — {FAQ_CATEGORY_COUNT} questions in this
            category
          </p>

          <div className={`${styles.pagDesktop} ${styles.desktopOnly}`}>
            <div className={styles.pagDesktopLeft}>
              <button
                type="button"
                className={styles.pagDesktopPrev}
                aria-label="Previous page"
                disabled={activePage === 1}
                onClick={() => setActivePage(page => Math.max(1, page - 1))}
              >
                <span aria-hidden="true">←</span>
                <span>Prev</span>
              </button>

              <div className={styles.pagDesktopNumbers}>
                {DESKTOP_PAGE_NUMBERS.map(page => {
                  if (page === '…') {
                    return (
                      <span key="ellipsis-desktop" className={styles.pagEllipsis} aria-hidden="true">
                        …
                      </span>
                    );
                  }

                  const isActive = page === activePage;

                  return (
                    <button
                      key={page}
                      type="button"
                      className={`${styles.pagNumber} ${isActive ? styles.pagNumberActive : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setActivePage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.pagDesktopNext}
                aria-label="Next page"
                disabled={activePage === FAQ_TOTAL_PAGES}
                onClick={() => setActivePage(page => Math.min(FAQ_TOTAL_PAGES, page + 1))}
              >
                <span>Next</span>
                <span className={styles.pagDesktopNextArrow} aria-hidden="true">
                  →
                </span>
              </button>
            </div>

            <div className={styles.pagDesktopInfo}>
              <span className={styles.pagDesktopRange}>1-5 of {category.count}</span>
              <button type="button" className={styles.pagPerPage}>
                <span className={styles.pagPerPageLabel}>Per page:</span>
                <span className={styles.pagPerPageValue}>10</span>
                <span className={styles.pagPerPageChevron} aria-hidden="true">
                  ▾
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
