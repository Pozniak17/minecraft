/** Бампати після кожної перегенерації іконок: інакше immutable-кеш віддасть старі. */
export const ICON_VERSION = 2;

export function productIconUrl(slug: string): string {
  return `/products/${slug}.webp?v=${ICON_VERSION}`;
}
