import { http } from './http';
import type { OrderListItem, Paginated } from './types';

function getOrderTimestamp(order: OrderListItem): number {
  const times = (order.order_item ?? [])
    .map(item => new Date(item.created).getTime())
    .filter(time => !Number.isNaN(time));

  return times.length ? Math.max(...times) : 0;
}

function sortOrdersByDateDesc(orders: OrderListItem[]): OrderListItem[] {
  return [...orders].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
}

export async function getOrders(page = 1, pageSize?: number) {
  const params: Record<string, number> = { page };
  if (pageSize) params.page_size = pageSize;
  const { data } = await http.get<Paginated<OrderListItem>>('/orders', { params });
  return { ...data, results: sortOrdersByDateDesc(data.results) };
}

function parseFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8?.[1]) return decodeURIComponent(utf8[1]);
  const plain = /filename="([^"]+)"/i.exec(contentDisposition);
  return plain?.[1] ?? null;
}

async function fetchOrderBill(orderId: string): Promise<{ blob: Blob; filename: string }> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/bill`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(err?.detail ?? 'Could not load receipt.');
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get('content-disposition')) ?? `receipt-${orderId}.pdf`;
  return { blob, filename };
}

export function orderHasBill(order: Pick<OrderListItem, 'has_bill'>): boolean {
  const value = order.has_bill;
  if (value == null) return true;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

export type OrderPaymentStatus = 'paid' | 'failed';

export function mapOrderStatus(order: Pick<OrderListItem, 'has_bill'>): OrderPaymentStatus {
  return orderHasBill(order) ? 'paid' : 'failed';
}

export async function downloadOrderBill(orderId: string): Promise<void> {
  const { blob, filename } = await fetchOrderBill(orderId);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function openOrderBill(orderId: string): Promise<void> {
  const { blob } = await fetchOrderBill(orderId);
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, '_blank', 'noopener,noreferrer');
  if (!tab) {
    URL.revokeObjectURL(url);
    throw new Error('Pop-up blocked. Allow pop-ups to open the receipt.');
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
