#!/usr/bin/env node
/**
 * Додає до каталогу блоків 1.12.2 поле image_name — ключ, за яким фронт шукає
 * картинку товару. Результат віддаємо бекенду: він зберігає image_name у товарі,
 * ми віддаємо /product-image/{image_name}.webp, і жодних списків у коді.
 *
 * Чому не registry: воно спільне для всіх meta-варіантів (7 позицій мають
 * registry "stone"), тож 441 товар звівся б до 251 картинки.
 * Чому не orig_name: унікальне, але "252:9" нечитабельне й двокрапка недопустима
 * в іменах файлів.
 *
 * Розширення у значенні НЕ зберігаємо: формат картинки — наша зона
 * відповідальності, і зміна webp → avif не має чіпати базу бекенду.
 *
 * Використання: node scripts/build-product-image-names.mjs [--in=...] [--out=...]
 */
import { readFile, writeFile } from 'node:fs/promises';

const DEFAULT_IN = '_incoming/minecraft_1_12_2_products_prices_only.json';
const DEFAULT_OUT = 'technical/product-prices-image-names.json';

/* Мінкрафт дає двом різним блокам однакове ім'я "Grass": id 2 — це блок землі
   з травою, id 31:1 — висока трава. Розводимо руками, бо автоматичний суфікс
   ("grass", "grass-2") не сказав би нічого ні бекенду, ні дизайнеру. */
const OVERRIDES = {
  '2': 'grass-block',
  '31:1': 'tall-grass',
};

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function arg(flag, fallback) {
  const hit = process.argv.find(a => a.startsWith(`--${flag}=`));
  return hit ? hit.slice(flag.length + 3) : fallback;
}

const inPath = arg('in', DEFAULT_IN);
const outPath = arg('out', DEFAULT_OUT);

const source = JSON.parse(await readFile(inPath, 'utf8'));

/* Каталог приходить у двох виглядах: голий масив (minecraft_blocks_1_12_2.json)
   і обгортка з метаданими (…_products_prices_only.json). Обгортку зберігаємо
   як є, щоб бекенд не втратив minecraft_version і currency. */
const blocks = Array.isArray(source) ? source : source.products;
if (!Array.isArray(blocks)) {
  throw new Error(`У ${inPath} немає ні масиву верхнього рівня, ні поля products`);
}

const withImageName = blocks.map(block => ({
  ...block,
  image_name: OVERRIDES[block.orig_name] ?? slugify(block.name),
}));

const enriched = Array.isArray(source)
  ? withImageName
  : { ...source, products: withImageName };

/* Дублікат image_name означав би, що два товари показують одну картинку —
   рівно той баг, який ми ловили в блозі. Краще впасти тут, ніж у проді. */
const seen = new Map();
const collisions = [];
for (const block of withImageName) {
  if (!VALID_SLUG.test(block.image_name)) {
    throw new Error(`Некоректний slug "${block.image_name}" для ${block.orig_name} (${block.name})`);
  }
  const previous = seen.get(block.image_name);
  if (previous) collisions.push(`${block.image_name}: ${previous.orig_name} (${previous.name}) vs ${block.orig_name} (${block.name})`);
  else seen.set(block.image_name, block);
}

if (collisions.length > 0) {
  console.error('Знайдено дублікати image_name — додай їх до OVERRIDES:');
  for (const line of collisions) console.error('  ' + line);
  process.exit(1);
}

await writeFile(outPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

console.log(`${withImageName.length} позицій → ${outPath}`);
console.log(`унікальних image_name: ${seen.size}`);
console.log(`перевизначено вручну: ${Object.keys(OVERRIDES).length}`);
