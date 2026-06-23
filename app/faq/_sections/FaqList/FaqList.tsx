'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { filterFaqArticles, getFaqArticleHref, sortFaqArticles } from '@/app/faq/_data/faqArticles';
import { getCategoryById, type FaqCategoryId } from '../faqCategories';
import { useFaqPage } from '../FaqPageContext';
import type { FaqListItem } from './faqItems';
import FaqPerPageSelect from './FaqPerPageSelect';
import FaqSortSelect from './FaqSortSelect';
import styles from './FaqList.module.css';

type FaqListProps = {
  activeCategory: FaqCategoryId;
};

function toListItem(article: ReturnType<typeof filterFaqArticles>[number]): FaqListItem {
  return {
    id: article.listId,
    slug: article.slug,
    category: article.listCategoryLabel,
    categoryId: article.categoryId,
    updated: article.updated,
    question: article.question,
    featured: article.featured,
    divider: article.listId === '03' && article.categoryId === 'getting-started',
  };
}

function buildPageNumbers(totalPages: number, activePage: number): (number | '…')[] {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (activePage <= 3) {
    return [1, 2, 3, 4, '…', totalPages];
  }

  if (activePage >= totalPages - 2) {
    return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '…', activePage - 1, activePage, activePage + 1, '…', totalPages];
}

export default function FaqList({ activeCategory }: FaqListProps) {
  const [activePage, setActivePage] = useState(1);
  const { searchQuery, clearSearch, itemsPerPage, setItemsPerPage, sortOption, setSortOption } =
    useFaqPage();
  const category = getCategoryById(activeCategory);
  const trimmedQuery = searchQuery.trim();

  const filteredItems = useMemo(
    () => sortFaqArticles(filterFaqArticles(activeCategory, searchQuery), sortOption).map(toListItem),
    [activeCategory, searchQuery, sortOption],
  );

  const headerTitle = trimmedQuery ? `Results for "${trimmedQuery}"` : category.label;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const rangeStart =
    filteredItems.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(activePage * itemsPerPage, filteredItems.length);
  const pageItems = filteredItems.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage,
  );
  const pageNumbers = buildPageNumbers(totalPages, activePage);
  const showPageControls = filteredItems.length > 0 && totalPages > 1;
  const showListFooter = filteredItems.length > 0;

  useEffect(() => {
    setActivePage(1);
  }, [activeCategory, searchQuery, itemsPerPage, sortOption]);

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  return (
    <div className={styles.faqList}>
      <div className={styles.content}>
        <header className={styles.desktopHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>{headerTitle}</h2>
            <p className={styles.headerSubtitle}>
              {filteredItems.length === 0
                ? 'No matching questions'
                : `Showing ${rangeStart}-${rangeEnd} of ${filteredItems.length} questions`}
            </p>
            {trimmedQuery && (
              <button type="button" className={styles.clearSearch} onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>
          <FaqSortSelect value={sortOption} onChange={setSortOption} variant="desktop" />
        </header>

        {filteredItems.length === 0 ? (
          <p className={styles.empty}>
            No questions match your search. Try another keyword or clear the filter to browse all
            topics.
          </p>
        ) : (
          <ul className={styles.list}>
            {pageItems.map(item => (
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
                        <span className={styles.updatedLabelDesktop}>Updated</span> {item.updated}
                      </span>
                    </div>

                    <h3 className={styles.question}>{item.question}</h3>

                    <Link href={getFaqArticleHref(item.slug)} className={styles.readButton}>
                      Read Now
                    </Link>
                  </div>
                </div>

                {item.divider && <span className={styles.divider} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}

        {showListFooter && (
          <nav className={styles.pagination} aria-label="FAQ pagination">
            {showPageControls && (
              <>
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

                  {pageNumbers.map((page, index) => {
                    if (page === '…') {
                      return (
                        <span
                          key={`ellipsis-mobile-${index}`}
                          className={styles.pagEllipsis}
                          aria-hidden="true"
                        >
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
                    disabled={activePage === totalPages}
                    onClick={() => setActivePage(page => Math.min(totalPages, page + 1))}
                  >
                    →
                  </button>
                </div>

                <p className={`${styles.pagCaption} ${styles.mobileOnly}`}>
                  Page {activePage} of {totalPages} — {filteredItems.length} questions
                </p>
              </>
            )}

            <div
              className={`${styles.pagDesktop} ${styles.desktopOnly} ${!showPageControls ? styles.pagDesktopFooterOnly : ''}`}
            >
              {showPageControls && (
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
                    {pageNumbers.map((page, index) => {
                      if (page === '…') {
                        return (
                          <span
                            key={`ellipsis-desktop-${index}`}
                            className={styles.pagEllipsis}
                            aria-hidden="true"
                          >
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
                    disabled={activePage === totalPages}
                    onClick={() => setActivePage(page => Math.min(totalPages, page + 1))}
                  >
                    <span>Next</span>
                    <span className={styles.pagDesktopNextArrow} aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              )}

              <div className={styles.pagDesktopInfo}>
                <span className={styles.pagDesktopRange}>
                  {rangeStart}-{rangeEnd} of {filteredItems.length}
                </span>
                <FaqPerPageSelect value={itemsPerPage} onChange={setItemsPerPage} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
