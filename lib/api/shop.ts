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
