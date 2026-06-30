'use client';

import { useTranslations } from 'next-intl';
import { buildPageNumbers } from '@/lib/pagination/buildPageNumbers';
import Card, { ArticleCardProps } from './Card/Card';
import styles from './CardList.module.css';

type CardListPagination = {
  activePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CardList({
  articles,
  pagination,
  paginationLabel = 'Articles pagination',
}: {
  articles: ArticleCardProps[];
  pagination?: CardListPagination;
  paginationLabel?: string;
}) {
  const t = useTranslations('blog.pagination');
  const pageNumbers = pagination
    ? buildPageNumbers(pagination.totalPages, pagination.activePage)
    : [];

  return (
    <>
      <ul className={styles.list}>
        {articles.map(article => (
          <Card key={article.slug ?? article.title} {...article} />
        ))}
      </ul>

      {pagination ? (
        <nav className={styles.pagination} aria-label={paginationLabel}>
          <div className={styles.pagRow}>
            <button
              type="button"
              className={styles.pagArrow}
              aria-label={t('prevAriaLabel')}
              disabled={pagination.activePage === 1}
              onClick={() => pagination.onPageChange(pagination.activePage - 1)}
            >
              ←
            </button>

            {pageNumbers.map((page, index) => {
              if (page === '…') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={styles.pagEllipsis}
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === pagination.activePage;

              return (
                <button
                  key={page}
                  type="button"
                  className={`${styles.pagNumber} ${isActive ? styles.pagNumberActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => pagination.onPageChange(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className={`${styles.pagArrow} ${styles.pagArrowNext}`}
              aria-label={t('nextAriaLabel')}
              disabled={pagination.activePage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.activePage + 1)}
            >
              →
            </button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
