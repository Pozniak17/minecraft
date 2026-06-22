import { http } from './http';
import { apiClient } from './client';
import type {
  CategoryItem,
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

export async function getCategories(lang?: string) {
  const { data } = await apiClient.get<CategoryItem[]>('/shop/categories', {
    params: lang ? { lang } : undefined,
  });
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

export async function getProduct(
  id: string,
  opts: { priced?: boolean; currency?: string; lang?: string } = {}
) {
  const params: Record<string, string | number> = {};
  if (opts.priced) params.priced = 1;
  if (opts.currency) params.currency = opts.currency;
  if (opts.lang) params.lang = opts.lang;

  const client = opts.priced ? http : apiClient;
  const { data } = await client.get<Product>(`/shop/products/${id}`, { params });
  return data;
}
