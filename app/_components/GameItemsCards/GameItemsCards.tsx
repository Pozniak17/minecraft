'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getAllGameItems } from '@/lib/api/shop';
import type { Product } from '@/lib/api/types';
import { buildPageNumbers } from '@/lib/pagination/buildPageNumbers';
import Card from './Card/Card';
import styles from './GameItemsCards.module.css';

// 24 = 4 рядки по 6 колонок на десктопі, і ділиться без остачі на 6/4/3/2,
// тож на жодному брейкпоінті останній рядок не буде обрізаним.
const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 200;
const SKELETON_COUNT = 12;
const DONE_RESET_MS = 800;

type GameItemsCardsProps = {
  /** Showcase (/store): кнопка веде за посиланням. */
  shopHref?: string;
  /** Shop (дашборд): ціни й реальне додавання в корзину. */
  priced?: boolean;
  currency?: string;
  onAddToCart?: (product: { id: string; title: string }) => Promise<void>;
  /** Коли задано — рендеримо стільки карток і показуємо Load more. */
  initialLimit?: number;
};

function normalizeItems(products: Product[]): Product[] {
  return products
    .filter(p => p.image_name && p.title)
    .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }));
}

export default function GameItemsCards({
  shopHref,
  priced = false,
  currency,
  onAddToCart,
  initialLimit,
}: GameItemsCardsProps) {
  const t = useTranslations('store');
  const locale = useLocale();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(initialLimit == null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const doneTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showFull = expanded || initialLimit == null;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllGameItems(locale, { priced, currency })
      .then(data => {
        if (!active) return;
        setItems(normalizeItems(data));
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [locale, priced, currency]);

  useEffect(() => {
    return () => {
      doneTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const priceById = useMemo(() => {
    const map = new Map<string, string>();
    if (!priced) return map;
    for (const p of items) {
      if (p.price == null) continue;
      const value = Number(p.price);
      if (!Number.isFinite(value)) continue;
      map.set(p.id, `${value.toFixed(2)} ${p.currency ?? currency ?? 'EUR'}`);
    }
    return map;
  }, [items, priced, currency]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter(p => (p.title ?? '').toLowerCase().includes(debouncedQuery));
  }, [items, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const displayItems = useMemo(() => {
    if (!showFull && initialLimit != null) {
      return filtered.slice(0, initialLimit);
    }
    return pageItems;
  }, [showFull, initialLimit, filtered, pageItems]);

  const pageNumbers = buildPageNumbers(totalPages, safePage);
  const showLoadMore = !showFull && initialLimit != null && filtered.length > initialLimit;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const markDone = useCallback((id: string) => {
    setDoneIds(prev => new Set(prev).add(id));

    const existing = doneTimers.current.get(id);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      setDoneIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      doneTimers.current.delete(id);
    }, DONE_RESET_MS);

    doneTimers.current.set(id, timer);
  }, []);

  const handleAdd = useCallback(
    async (product: { id: string; title: string }) => {
      if (!onAddToCart || addingId) return;
      setAddingId(product.id);
      try {
        await onAddToCart(product);
        markDone(product.id);
      } finally {
        setAddingId(null);
      }
    },
    [onAddToCart, addingId, markDone],
  );

  return (
    <div className={styles.root}>
      {showFull && (
        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.search}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('gameItems_searchPlaceholder')}
            aria-label={t('gameItems_searchAriaLabel')}
          />
          {!loading && (
            <p className={styles.count} aria-live="polite">
              {t('gameItems_count', { count: filtered.length })}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <ul className={styles.grid} aria-busy="true" aria-label={t('gameItems_ariaLabel')}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li key={i} className={styles.skeleton} aria-hidden />
          ))}
        </ul>
      ) : displayItems.length === 0 ? (
        <p className={styles.empty} role="status">
          {t('gameItems_empty')}
        </p>
      ) : (
        <ul className={styles.grid} aria-label={t('gameItems_ariaLabel')}>
          {displayItems.map(item => (
            <Card
              key={item.id}
              title={item.title ?? ''}
              imageName={item.image_name!}
              shopHref={shopHref}
              price={priceById.get(item.id)}
              onAdd={
                onAddToCart
                  ? () => handleAdd({ id: item.id, title: item.title ?? '' })
                  : undefined
              }
              pending={addingId === item.id}
              done={doneIds.has(item.id)}
            />
          ))}
        </ul>
      )}

      {showLoadMore && (
        <div className={styles.loadMoreWrap}>
          <button type="button" className={styles.loadMore} onClick={() => setExpanded(true)}>
            {t('shop_loadMore')}
          </button>
        </div>
      )}

      {showFull && !loading && totalPages > 1 && (
        <nav className={styles.pagination} aria-label={t('gameItems_paginationLabel')}>
          <div className={styles.pagRow}>
            <button
              type="button"
              className={styles.pagArrow}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label={t('gameItems_prevAriaLabel')}
            >
              ←
            </button>

            {pageNumbers.map((item, index) =>
              item === '…' ? (
                <span key={`ellipsis-${index}`} className={styles.pagEllipsis} aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`${styles.pagNumber} ${item === safePage ? styles.pagNumberActive : ''}`}
                  onClick={() => setPage(item)}
                  aria-current={item === safePage ? 'page' : undefined}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className={`${styles.pagArrow} ${styles.pagArrowNext}`}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              aria-label={t('gameItems_nextAriaLabel')}
            >
              →
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
