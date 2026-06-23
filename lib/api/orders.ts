import { http } from './http';
import type { OrderListItem, Paginated } from './types';

export async function getOrders(page = 1, pageSize?: number) {
  const params: Record<string, number> = { page };
  if (pageSize) params.page_size = pageSize;
  const { data } = await http.get<Paginated<OrderListItem>>('/orders', { params });
  return data;
}

function parseFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8?.[1]) return decodeURIComponent(utf8[1]);
  const plain = /filename="([^"]+)"/i.exec(contentDisposition);
  return plain?.[1] ?? null;
}

export function orderHasBill(order: Pick<OrderListItem, 'has_bill'>): boolean {
  const value = order.has_bill;
  if (value == null) return true;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

export async function downloadOrderBill(orderId: string): Promise<void> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/bill`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(err?.detail ?? 'Could not download receipt.');
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get('content-disposition')) ?? `receipt-${orderId}.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
