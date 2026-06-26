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

// Maps each English country name to a stable camelCase key used in message files
// (settings.countries.*). The stored value stays as the English name.
export const COUNTRY_KEYS: Readonly<Record<string, string>> = {
  'United Kingdom': 'unitedKingdom',
  'United States': 'unitedStates',
  'Canada': 'canada',
  'Australia': 'australia',
  'New Zealand': 'newZealand',
  'Ukraine': 'ukraine',
  'Austria': 'austria',
  'Belgium': 'belgium',
  'Cyprus': 'cyprus',
  'Estonia': 'estonia',
  'Finland': 'finland',
  'France': 'france',
  'Germany': 'germany',
  'Greece': 'greece',
  'Ireland': 'ireland',
  'Italy': 'italy',
  'Latvia': 'latvia',
  'Lithuania': 'lithuania',
  'Luxembourg': 'luxembourg',
  'Malta': 'malta',
  'Netherlands': 'netherlands',
  'Portugal': 'portugal',
  'Slovakia': 'slovakia',
  'Slovenia': 'slovenia',
  'Spain': 'spain',
};
