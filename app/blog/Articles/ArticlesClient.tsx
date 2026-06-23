'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CardList from '../CardList/CardList';
import { filterArticlesByCategory, parseCategoryParam } from '../categories';
import {
  ARTICLE_SORT_OPTIONS,
  type ArticleSort,
  type BlogArticle,
  sortBlogArticles,
} from './articlesData';
import styles from './Articles.module.css';

type ArticleSortSelectProps = {
  value: ArticleSort;
  onChange: (value: ArticleSort) => void;
};

function ArticleSortSelect({ value, onChange }: ArticleSortSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = ARTICLE_SORT_OPTIONS.find(option => option.value === value)?.label ?? 'All Posts';

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (next: ArticleSort) => {
    setOpen(false);
    if (next !== value) onChange(next);
  };

  return (
    <div className={styles.sortWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.button_sort}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        {label}
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className={styles.sortMenu} role="listbox" aria-label="Sort articles">
          {ARTICLE_SORT_OPTIONS.map(option => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`${styles.sortOption} ${value === option.value ? styles.sortOptionActive : ''}`}
                onClick={() => choose(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type ArticlesClientProps = {
  articles: BlogArticle[];
};

export default function ArticlesClient({ articles }: ArticlesClientProps) {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get('category'));
  const [sort, setSort] = useState<ArticleSort>('all');

  const filteredArticles = useMemo(
    () => filterArticlesByCategory(articles, category),
    [articles, category],
  );
  const visibleArticles = useMemo(
    () => sortBlogArticles(filteredArticles, sort),
    [filteredArticles, sort],
  );

  const sectionTitle =
    category === 'All' ? 'Latest articles' : `${category} articles`;

  return (
    <>
      <div className={styles.article_wrapper}>
        <h2 className={styles.title}>{sectionTitle}</h2>
        <ArticleSortSelect value={sort} onChange={setSort} />
      </div>
      <CardList articles={visibleArticles} />
    </>
  );
}
