'use client';

import { FormEvent } from 'react';
import { FAQ_TOTAL_COUNT } from '@/app/faq/_data/faqArticles';
import { useFaqPage } from '../FaqPageContext';
import styles from './Hero.module.css';

export default function HeroSearch() {
  const { searchInput, setSearchInput, applySearch } = useFaqPage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <span className={styles.searchIcon} aria-hidden="true">
        ⌕
      </span>
      <input
        className={`${styles.input} ${styles.inputMobile}`}
        type="search"
        placeholder={`Search ${FAQ_TOTAL_COUNT} questions…`}
        aria-label="Search FAQ"
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
      <input
        className={`${styles.input} ${styles.inputDesktop}`}
        type="search"
        placeholder={`Search ${FAQ_TOTAL_COUNT} questions — "reset password", "payment refund"…`}
        aria-label="Search FAQ"
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        <span className={styles.searchButtonMobile}>Go</span>
        <span className={styles.searchButtonDesktop}>Search</span>
      </button>
    </form>
  );
}
