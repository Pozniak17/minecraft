// Curated billing/tax country list (not a full directory). Ordered as
// priority markets first, then EU/euro markets alphabetically.

// Пріоритетні ринки — фіксований порядок за бізнес-важливістю.
const TOP_MARKETS = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'New Zealand',
  'Ukraine',
] as const;

// Єврозона — сортується за алфавітом автоматично, щоб не підтримувати порядок руками.
const EU_MARKETS = [
  'Austria',
  'Belgium',
  'Cyprus',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Portugal',
  'Slovakia',
  'Slovenia',
  'Spain',
].sort((a, b) => a.localeCompare(b));

export const COUNTRIES = [...TOP_MARKETS, ...EU_MARKETS];
