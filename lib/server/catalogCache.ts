// Кеш публічного каталогу в пам'яті процесу. Бекенд не кешує нічого (три
// ідентичні запити підряд дають однакові ~0.5с) і обробляє запити по одному,
// тож повний список з 441 позиції коштує ~1.6с на кожне відкриття магазину.
//
// Живе в одному процесі pm2 — це не розподілений кеш і не претендує на нього.

const FRESH_MS = 5 * 60 * 1000;
// Після FRESH віддаємо старі дані й оновлюємо у фоні: каталог змінюється рідко,
// тому краще показати вчорашню ціну миттєво, ніж змусити чекати 1.6с.
const STALE_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 200;

type Entry = { at: number; data: unknown };

const entries = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

function store(key: string, data: unknown): void {
  // Map тримає порядок вставки, тож перший ключ — найдавніший.
  if (!entries.has(key) && entries.size >= MAX_ENTRIES) {
    const oldest = entries.keys().next().value;
    if (oldest !== undefined) entries.delete(oldest);
  }
  entries.set(key, { at: Date.now(), data });
}

/** Один запит до бекенду на ключ, скільком би паралельним читачам він не був потрібен. */
function refresh<T>(key: string, load: () => Promise<T>): Promise<T> {
  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = load()
    .then(data => {
      store(key, data);
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

export async function withCatalogCache<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = entries.get(key);
  const age = hit ? Date.now() - hit.at : Infinity;

  if (hit && age < FRESH_MS) return hit.data as T;

  if (hit && age < STALE_MS) {
    refresh(key, load).catch(() => {
      // Фонове оновлення: клієнт уже отримав дані, помилку ковтаємо.
    });
    return hit.data as T;
  }

  return refresh(key, load);
}

export function catalogCacheKey(lang: string, params: Record<string, string>): string {
  const parts = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`);
  return [lang, ...parts].join('&');
}
