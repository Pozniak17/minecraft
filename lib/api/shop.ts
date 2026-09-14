import { http } from './http';
import { apiClient } from './client';
import type {
  Currency,
  Paginated,
  Product,
  ProductsQuery,
  ServerItem,
} from './types';

export async function getCurrencies() {
  const { data } = await apiClient.get<Currency[]>('/shop/currencies');
  return data;
}

export async function getServers() {
  const { data } = await apiClient.get<ServerItem[]>('/shop/servers');
  return data;
}

export async function getProducts(query: ProductsQuery = {}) {
  const { priced, ...rest } = query;
  const params: Record<string, string | number> = { ...rest };
  if (priced) params.priced = 1;

  // Приватний (з цінами) список потребує авторизації — йде через http з auto-refresh.
  const client = priced ? http : apiClient;
  const { data } = await client.get<Paginated<Product>>('/shop/products', { params });
  return data;
}

export type ProductFetchOpts = { lang?: string; priced?: boolean; currency?: string };

/** Пагінує будь-яку категорію до кінця (page_size у бекенді обрізається до 100). */
export async function getAllInCategory(
  category: string,
  opts: ProductFetchOpts = {},
): Promise<Product[]> {
  const { lang, priced, currency } = opts;
  const first = await getProducts({
    category,
    page_size: 100,
    page: 1,
    lang,
    priced,
    currency,
  });
  const pages = Math.ceil(first.count / 100);
  if (pages <= 1) return first.results;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      getProducts({
        category,
        page_size: 100,
        page: i + 2,
        lang,
        priced,
        currency,
      }),
    ),
  );
  return [...first.results, ...rest.flatMap(r => r.results)];
}

/** Увесь каталог: потрібен там, де назву треба знайти за довільним product_id. */
export async function getAllProducts(opts: ProductFetchOpts = {}): Promise<Product[]> {
  const [crystals, privileges, items] = await Promise.all([
    getAllInCategory('crystals', opts),
    getAllInCategory('privileges', opts),
    getAllInCategory('items', opts),
  ]);
  return [...crystals, ...privileges, ...items];
}

/** Усі блоки категорії items. */
export async function getAllGameItems(
  lang?: string,
  opts: Omit<ProductFetchOpts, 'lang'> = {},
): Promise<Product[]> {
  return getAllInCategory('items', { lang, ...opts });
}
