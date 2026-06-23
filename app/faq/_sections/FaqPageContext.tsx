'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { filterFaqArticles } from '@/app/faq/_data/faqArticles';
import { DEFAULT_FAQ_CATEGORY, type FaqCategoryId } from './faqCategories';

type FaqPageContextValue = {
  activeCategory: FaqCategoryId;
  setActiveCategory: (category: FaqCategoryId) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  searchQuery: string;
  applySearch: () => void;
  clearSearch: () => void;
  resultCount: number;
};

const FaqPageContext = createContext<FaqPageContextValue | null>(null);

export function FaqPageProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>(DEFAULT_FAQ_CATEGORY);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const resultCount = useMemo(
    () => filterFaqArticles(activeCategory, searchQuery).length,
    [activeCategory, searchQuery],
  );

  const applySearch = useCallback(() => {
    const nextQuery = searchInput.trim();
    setSearchQuery(nextQuery);
    requestAnimationFrame(() => {
      document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handleCategoryChange = useCallback((category: FaqCategoryId) => {
    setActiveCategory(category);
  }, []);

  const value = useMemo(
    () => ({
      activeCategory,
      setActiveCategory: handleCategoryChange,
      searchInput,
      setSearchInput,
      searchQuery,
      applySearch,
      clearSearch,
      resultCount,
    }),
    [
      activeCategory,
      handleCategoryChange,
      searchInput,
      searchQuery,
      applySearch,
      clearSearch,
      resultCount,
    ],
  );

  return <FaqPageContext.Provider value={value}>{children}</FaqPageContext.Provider>;
}

export function useFaqPage() {
  const context = useContext(FaqPageContext);
  if (!context) {
    throw new Error('useFaqPage must be used within FaqPageProvider');
  }
  return context;
}
