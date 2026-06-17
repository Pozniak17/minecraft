// Єдиний курс кристалів для всього застосунку.
// ТЗ: 10 кристалів = 0.99 EUR.
export const CRYSTALS_PER_UNIT = 10;
export const EUR_PER_UNIT = 0.99;

// Ціна за кількість кристалів у EUR (без знижок — лінійний курс).
// 500 -> 49.50, 1500 -> 148.50, 5000 -> 495.00, 15000 -> 1485.00
export function crystalsToEur(amount: number): number {
  return (amount / CRYSTALS_PER_UNIT) * EUR_PER_UNIT;
}
