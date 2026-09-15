import { getAllGameItems, getProducts } from '@/lib/api/shop';
import type { Product } from '@/lib/api/types';

// Список блоків тягнеться цілком (441 позиція, 5 запитів, ~1.6с), бо пошук і
// сортування живуть на клієнті — бекенд `ordering` ігнорує. Без цього кешу
// кожне перемикання таба й кожен повторний маунт платили б ці 1.6с знову.

const TTL_MS = 10 * 60 * 1000;

export type GameItemsQuery = {
  priced?: boolean;
  currency?: string;
  /** null — увесь каталог; число — одна сторінка для тизера. */
  limit?: number | null;
};

type Entry = { at: number; items: Product[] };

const cache = new Map<string, Entry>();
const inflight = new Map<string, Promise<Product[]>>();

/** Валюта впливає лише на прайсовий список — публічний від неї не залежить. */
function keyOf(locale: string, { priced = false, currency, limit }: GameItemsQuery): string {
  const scope = priced ? `priced:${currency ?? ''}` : 'public';
  return `${locale}|${scope}|${limit ?? 'all'}`;
}

function normalize(products: Product[]): Product[] {
  return products
    .filter(p => p.image_name && p.title)
    .sort((a, b) =>
      (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }),
    );
}

function fetchItems(locale: string, query: GameItemsQuery): Promise<Product[]> {
  const { priced = false, currency, limit } = query;

  if (limit != null) {
    return getProducts({
      category: 'items',
      page_size: limit,
      page: 1,
      lang: locale,
      priced,
      currency,
    }).then(page => normalize(page.results));
  }

  return getAllGameItems(locale, { priced, currency }).then(normalize);
}

/** Готові дані, якщо вони вже є — щоб змонтуватись без скелетона. */
export function peekGameItems(locale: string, query: GameItemsQuery): Product[] | null {
  const hit = cache.get(keyOf(locale, query));
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) return null;
  return hit.items;
}

export function loadGameItems(locale: string, query: GameItemsQuery): Promise<Product[]> {
  const cached = peekGameItems(locale, query);
  if (cached) return Promise.resolve(cached);

  const key = keyOf(locale, query);
  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = fetchItems(locale, query)
    .then(items => {
      cache.set(key, { at: Date.now(), items });
      return items;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/**
 * Прогрів у фоні. Запит стартує ще до того, як користувач відкриє таб з блоками,
 * тож на момент кліку дані вже на місці й скелетон не з'являється.
 */
export function prefetchGameItems(locale: string, query: GameItemsQuery): void {
  loadGameItems(locale, query).catch(() => {
    // Прогрів — не критичний: компонент за потреби спробує ще раз.
  });
}
