import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PRODUCTS_DIR = 'public/products';
const ASSETS_DIR =
  process.env.CURSOR_ASSETS ??
  'C:/Users/pozni/.cursor/projects/c-Users-pozni-Documents-GitHub-codectum-minecraft/assets';
const OUTPUT_SIZE = 512;
const CANONICAL_BG = [19, 62, 61];

// Фон подекуди має віньєтку, тож заливка йде за плавним переходом (крок ≤ LOCAL),
// але зупиняється на різкому контурі блока й не відходить від фону далі за BAND.
// Заміри по всьому каталогу: фон відходить від краю щонайбільше на 28
// (віньєтка polished-diorite), а заливка починає їсти блок від 40 (cauldron).
const LOCAL_STEP = 7;
const GLOBAL_BAND = 30;
// Ширина антиаліасного контуру, у якому піксель ще є сумішшю блока й старого фону.
const HALO_TOLERANCE = 70;
const HALO_RADIUS = 2;
const MIN_HALO_ALPHA = 0.2;

function rgbDistance(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/** Медіана по рамці 1px — стійка до шуму й до обʼєктів, що торкаються краю. */
function borderBg(data, width, height) {
  const channels = [[], [], []];
  const sample = (x, y) => {
    const i = (y * width + x) * 4;
    if (data[i + 3] === 0) return;
    channels[0].push(data[i]);
    channels[1].push(data[i + 1]);
    channels[2].push(data[i + 2]);
  };
  for (let x = 0; x < width; x++) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    sample(0, y);
    sample(width - 1, y);
  }
  return channels.map(list => {
    if (!list.length) return 0;
    list.sort((a, b) => a - b);
    return list[list.length >> 1];
  });
}

/**
 * Заливка від краю: знімаємо лише фон, звʼязаний із рамкою.
 * Глобального проходу навмисно немає — він виїдав темні та бірюзові
 * грані блоків (prismarine, cauldron, black-stained-glass тощо).
 */
function floodFillBackground(data, width, height, bg) {
  const total = width * height;
  const mask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  let removed = 0;

  const colorAt = idx => {
    const i = idx * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const push = (idx, from) => {
    if (mask[idx]) return;
    if (data[idx * 4 + 3] !== 0) {
      const px = colorAt(idx);
      if (rgbDistance(px, bg) > GLOBAL_BAND) return;
      if (from !== null && rgbDistance(px, colorAt(from)) > LOCAL_STEP) return;
    }
    mask[idx] = 1;
    removed++;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    push(x, null);
    push((height - 1) * width + x, null);
  }
  for (let y = 1; y < height - 1; y++) {
    push(y * width, null);
    push(y * width + width - 1, null);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) push(idx - 1, idx);
    if (x < width - 1) push(idx + 1, idx);
    if (y > 0) push(idx - width, idx);
    if (y < height - 1) push(idx + width, idx);
  }

  return { mask, removed };
}

/** Середній колір знятого фону поруч — локальна оцінка (фон буває з віньєткою). */
function localBgAround(source, mask, width, height, x, y, radius) {
  const minX = Math.max(0, x - radius);
  const maxX = Math.min(width - 1, x + radius);
  const minY = Math.max(0, y - radius);
  const maxY = Math.min(height - 1, y + radius);
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let ny = minY; ny <= maxY; ny++) {
    for (let nx = minX; nx <= maxX; nx++) {
      const idx = ny * width + nx;
      if (!mask[idx]) continue;
      const i = idx * 4;
      r += source[i];
      g += source[i + 1];
      b += source[i + 2];
      count++;
    }
  }
  if (!count) return null;
  return [r / count, g / count, b / count];
}

/**
 * Контурні пікселі — це суміш блока зі старим фоном. Розкладаємо суміш,
 * щоб при заміні фону на #133e3d не залишався темний або світлий обідок.
 */
function recolorHalo(data, mask, width, height) {
  const source = Uint8ClampedArray.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx]) continue;
      const localBg = localBgAround(source, mask, width, height, x, y, HALO_RADIUS);
      if (!localBg) continue;

      const i = idx * 4;
      const px = [source[i], source[i + 1], source[i + 2]];
      const distance = rgbDistance(px, localBg);
      if (distance >= HALO_TOLERANCE) continue;

      const alpha = Math.max(MIN_HALO_ALPHA, distance / HALO_TOLERANCE);
      for (let c = 0; c < 3; c++) {
        const object = (px[c] - (1 - alpha) * localBg[c]) / alpha;
        const composited = alpha * object + (1 - alpha) * CANONICAL_BG[c];
        data[i + c] = Math.max(0, Math.min(255, Math.round(composited)));
      }
    }
  }
}

function bakeBackground(data, mask) {
  for (let idx = 0; idx < mask.length; idx++) {
    if (!mask[idx]) continue;
    const i = idx * 4;
    data[i] = CANONICAL_BG[0];
    data[i + 1] = CANONICAL_BG[1];
    data[i + 2] = CANONICAL_BG[2];
    data[i + 3] = 255;
  }
}

async function normalizeIcon(sourcePath, outPath) {
  // Обробка у нативній роздільності, ресайз — в кінці: інакше ресемплінг
  // змішує блок зі старим фоном і фон уже не відняти без обідка.
  const { data, info } = await sharp(readFileSync(sourcePath))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const bg = borderBg(data, width, height);

  const total = width * height;
  const { mask, removed } = floodFillBackground(data, width, height, bg);

  recolorHalo(data, mask, width, height);
  bakeBackground(data, mask);

  const out = await sharp(data, { raw: { width, height, channels: 4 } })
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover', kernel: 'lanczos3' })
    .removeAlpha()
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  writeFileSync(outPath, out);

  return { bg, removedPct: (removed / total) * 100 };
}

const onlyArg = process.argv.find(arg => arg.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',')) : null;

const catalog = JSON.parse(
  readFileSync('technical/product-prices-image-names.json', 'utf8'),
).products;
const names = [...new Set(catalog.map(p => p.image_name))]
  .filter(name => !only || only.has(name))
  .sort();

let processed = 0;
const warnings = [];

for (const name of names) {
  const sourcePath = join(ASSETS_DIR, `${name}.png`);
  if (!existsSync(sourcePath)) {
    warnings.push(`${name}: джерело відсутнє в ассетах`);
    continue;
  }

  const result = await normalizeIcon(sourcePath, join(PRODUCTS_DIR, `${name}.png`));
  processed++;

  if (result.removedPct < 20) {
    warnings.push(`${name}: знято лише ${result.removedPct.toFixed(1)}% фону`);
  }
  if (result.removedPct > 97) {
    warnings.push(`${name}: знято ${result.removedPct.toFixed(1)}% — можливе протікання в блок`);
  }
}

if (!only) {
  const leftoverWebp = readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.webp'));
  for (const file of leftoverWebp) unlinkSync(join(PRODUCTS_DIR, file));
}

console.log(`normalized ${processed}/${names.length} icons → PNG (baked bg #133e3d)`);
for (const warning of warnings) console.log(`  ! ${warning}`);
