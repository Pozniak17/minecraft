'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FAQ_SORT_OPTIONS,
  getFaqSortLabel,
  type FaqSortOption,
} from '../faqCategories';
import filterStyles from '../Filters/Filters.module.css';
import styles from './FaqList.module.css';

type FaqSortSelectProps = {
  value: FaqSortOption;
  onChange: (sort: FaqSortOption) => void;
  variant: 'desktop' | 'mobile';
};

export default function FaqSortSelect({ value, onChange, variant }: FaqSortSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = getFaqSortLabel(value);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (sort: FaqSortOption) => {
    setOpen(false);
    if (sort !== value) {
      onChange(sort);
    }
  };

  const menu = open ? (
    <ul className={styles.sortMenu} role="listbox" aria-label="Sort questions">
      {FAQ_SORT_OPTIONS.map(option => (
        <li key={option.id} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={value === option.id}
            className={`${styles.sortOption} ${value === option.id ? styles.sortOptionActive : ''}`}
            onClick={() => choose(option.id)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

  if (variant === 'mobile') {
    return (
      <div className={styles.sortWrap} ref={rootRef}>
        <button
          type="button"
          className={filterStyles.sort}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(current => !current)}
        >
          <span>{label}</span>
          <span
            className={`${filterStyles.chevron} ${open ? styles.sortChevronOpen : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
        {menu}
      </div>
    );
  }

  return (
    <div className={styles.sortWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.desktopSort}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        <span className={styles.desktopSortLabel}>Sort:</span>
        <span className={styles.desktopSortValue}>{label}</span>
        <span
          className={`${styles.desktopSortChevron} ${open ? styles.sortChevronOpen : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {menu}
    </div>
  );
}
