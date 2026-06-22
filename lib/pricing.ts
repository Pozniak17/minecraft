// Єдиний курс кристалів для всього застосунку.
// ТЗ: 10 кристалів = 0.99 EUR.
export const CRYSTALS_PER_UNIT = 10;
export const EUR_PER_UNIT = 0.99;

// Ціни привілеїв з ТЗ (technical/doc.txt), EUR — до появи товарів у бекенді.
export const PRIVILEGE_EUR_BY_TITLE: Record<string, number> = {
  Silver: 10,
  Supreme: 20,
  Wither: 30,
  Hero: 40,
  Avenger: 50,
  Legend: 100,
  Phantom: 125,
  Phoenix: 150,
};

/** Форматовані ціни тирів для карток привілеїв (fallback, коли API порожній). */
export function buildFallbackPrivilegePrices(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(PRIVILEGE_EUR_BY_TITLE).map(([title, amount]) => [
      title,
      `${amount.toFixed(2)} EUR`,
    ]),
  );
}

// Ціна за кількість кристалів у EUR (без знижок — лінійний курс).
// 500 -> 49.50, 1500 -> 148.50, 5000 -> 495.00, 15000 -> 1485.00
export function crystalsToEur(amount: number): number {
  return (amount / CRYSTALS_PER_UNIT) * EUR_PER_UNIT;
}
