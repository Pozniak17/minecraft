import type { OrderListItem } from '@/lib/api/types';

export type ProductMeta = { title: string; isCrystal: boolean };

export function itemLabelFromImage(imageName: string | undefined): string {
  if (!imageName) return 'Item';
  const base = imageName.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const cleaned = base.replace(/[-_]+/g, ' ').trim();
  return cleaned || 'Item';
}

export function orderItemTitle(
  productId: string,
  imageName: string | undefined,
  meta: Map<string, ProductMeta>,
): string {
  return meta.get(productId)?.title || itemLabelFromImage(imageName);
}

export function formatOrderLineItem(
  productId: string,
  imageName: string | undefined,
  amount: number,
  meta: Map<string, ProductMeta>,
): string {
  return `${orderItemTitle(productId, imageName, meta)} ×${amount}`;
}

export function formatActivityTitle(
  order: OrderListItem,
  meta: Map<string, ProductMeta>,
): string {
  const items = order.order_item ?? [];
  if (items.length === 0) return 'Purchase';

  const labels = items.map(item =>
    formatOrderLineItem(item.product_id, item.image_name, item.amount, meta),
  );
  return `Purchased ${labels.join(', ')}`;
}

export function formatOrderAmount(value: string | number | undefined, currency: string): string {
  const num = Number(value) || 0;
  return `${num.toFixed(2)} ${currency}`;
}

export function buildProductMeta(
  products: { id: string; title?: string | null; category_slug?: string | null }[],
): Map<string, ProductMeta> {
  const map = new Map<string, ProductMeta>();
  for (const product of products) {
    map.set(product.id, {
      title: product.title ?? '',
      isCrystal: product.category_slug === 'crystals',
    });
  }
  return map;
}
