// Єдине джерело правди для обраної валюти магазину (зберігається між сесіями).
// Бекенд тримає ціну в EUR і раз на день перераховує в інші валюти, тож фронт
// лише передає обрану валюту — конвертацію робить бекенд.
export const CURRENCY_STORAGE_KEY = 'shop:currency';
export const DEFAULT_CURRENCY = 'EUR';

export function getStoredCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  try {
    return window.localStorage.getItem(CURRENCY_STORAGE_KEY) || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function setStoredCurrency(currency: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    // localStorage недоступний (приватний режим тощо) — ігноруємо.
  }
}

// Форматує суму в заданій валюті. Невалідний ISO-код → простий фолбек "12.00 ABC".
export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}
