import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PRODUCTS_DIR = 'public/products';
const ASSETS_DIR =
  process.env.CURSOR_ASSETS ??
  'C:/Users/pozni/.cursor/projects/c-Users-pozni-Documents-GitHub-codectum-minecraft/assets';
const OUTPUT_SIZE = 512;
const CANONICAL_BG = [19, 62, 61];

function rgbDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function cornerBg(data, width, height) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return [Math.round(r / 4), Math.round(g / 4), Math.round(b / 4)];
}

function toleranceForBg(bg) {
  return luminance(bg) < 38 ? 52 : 40;
}

function isBackgroundPixel(px, bg, tolerance) {
  if (rgbDistance(px, bg) > tolerance) return false;
  return luminance(px) <= luminance(bg) + 22;
}

function removeEdgeBackground(data, width, height, bg, tolerance) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const tryPush = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (data[i + 3] === 0) return;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (!isBackgroundPixel(px, bg, tolerance)) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const i = idx * 4;
    data[i + 3] = 0;

    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) tryPush(x - 1, y);
    if (x < width - 1) tryPush(x + 1, y);
    if (y > 0) tryPush(x, y - 1);
    if (y < height - 1) tryPush(x, y + 1);
  }
}

function removeGlobalBackground(data, bg, tolerance) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (!isBackgroundPixel(px, bg, tolerance)) continue;
    data[i + 3] = 0;
  }
}

function removeLegacyCanonical(data, bg) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const px = [data[i], data[i + 1], data[i + 2]];
    if (rgbDistance(px, CANONICAL_BG) > 10) continue;
    if (luminance(px) > luminance(bg) + 22) continue;
    data[i + 3] = 0;
  }
}

async function loadRaw512(sourcePath) {
  const { data, info } = await sharp(readFileSync(sourcePath))
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

async function normalizeIcon(sourcePath, outPath) {
  const { data, info } = await loadRaw512(sourcePath);
  const bg = cornerBg(data, info.width, info.height);
  const tolerance = toleranceForBg(bg);

  removeEdgeBackground(data, info.width, info.height, bg, tolerance);
  removeGlobalBackground(data, bg, tolerance);
  removeLegacyCanonical(data, bg);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 0) continue;
    data[i] = CANONICAL_BG[0];
    data[i + 1] = CANONICAL_BG[1];
    data[i + 2] = CANONICAL_BG[2];
    data[i + 3] = 255;
  }

  for (let i = 0; i < data.length; i += 4) {
    const px = [data[i], data[i + 1], data[i + 2]];
    if (rgbDistance(px, CANONICAL_BG) > 6) continue;
    if (luminance(px) > luminance(bg) + 22) continue;
    data[i] = CANONICAL_BG[0];
    data[i + 1] = CANONICAL_BG[1];
    data[i + 2] = CANONICAL_BG[2];
    data[i + 3] = 255;
  }

  // PNG: lossless — WebP спотворює суцільний #133e3d у «темні»/«світлі» плями.
  const out = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  writeFileSync(outPath, out);

  return { bg, tolerance, total: info.width * info.height };
}

const catalog = JSON.parse(
  readFileSync('technical/product-prices-image-names.json', 'utf8'),
).products;
const names = [...new Set(catalog.map(p => p.image_name))].sort();

let processed = 0;
const samples = [];

for (const name of names) {
  const pngPath = join(ASSETS_DIR, `${name}.png`);
  const legacyWebp = join(PRODUCTS_DIR, `${name}.webp`);
  const outPath = join(PRODUCTS_DIR, `${name}.png`);
  const sourcePath = existsSync(pngPath) ? pngPath : legacyWebp;
  if (!existsSync(sourcePath)) continue;

  const result = await normalizeIcon(sourcePath, outPath);
  processed++;

  if (existsSync(legacyWebp)) {
    unlinkSync(legacyWebp);
  }

  if (['granite', 'gold-ore', 'andesite', 'acacia-leaves', 'acacia-wood'].includes(name)) {
    samples.push({ name, ...result });
  }
}

const leftoverWebp = readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.webp'));
for (const file of leftoverWebp) {
  unlinkSync(join(PRODUCTS_DIR, file));
}

console.log(`normalized ${processed}/${names.length} icons → PNG (baked bg #133e3d)`);
for (const s of samples) {
  console.log(`  ${s.name}: src bg rgb(${s.bg.join(',')}), tol ${s.tolerance}`);
}
