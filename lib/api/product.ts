import type { Product } from './types';

interface TranslationNode {
  name?: string;
  title?: string;
  description?: string;
  language_code?: string;
}

// `translations` приходить рядком невідомого формату (JSON або простий текст).
// Парсимо толерантно: підтримуємо { en: {...} }, [{ language_code, ... }] і plain string.
export function parseTranslations(
  raw: string | undefined,
  lang = 'en'
): { name: string; description?: string } {
  if (!raw) return { name: '' };

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      const node: TranslationNode =
        parsed.find(t => t?.language_code === lang) ?? parsed[0] ?? {};
      return { name: node.name ?? node.title ?? '', description: node.description };
    }

    if (parsed && typeof parsed === 'object') {
      const node: TranslationNode =
        (parsed[lang] as TranslationNode) ??
        (Object.values(parsed)[0] as TranslationNode) ??
        {};
      if (typeof node === 'string') return { name: node };
      return { name: node.name ?? node.title ?? '', description: node.description };
    }
  } catch {
    // Не JSON — повертаємо як є.
  }

  return { name: raw };
}

export function productName(product: Product, lang = 'en'): string {
  // Реальний бекенд віддає title; translations — фолбек для сумісності зі Swagger.
  if (product.title) return product.title;
  return parseTranslations(product.translations, lang).name || 'Item';
}
