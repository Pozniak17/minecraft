import { http } from './http';
import type { OrderListItem, Paginated } from './types';

export async function getOrders(page = 1, pageSize?: number) {
  const params: Record<string, number> = { page };
  if (pageSize) params.page_size = pageSize;
  const { data } = await http.get<Paginated<OrderListItem>>('/orders', { params });
  return data;
}
