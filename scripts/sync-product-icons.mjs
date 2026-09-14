import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const assets = process.env.CURSOR_ASSETS
  ?? 'C:/Users/pozni/.cursor/projects/c-Users-pozni-Documents-GitHub-codectum-minecraft/assets';
const dest = 'public/products';
const catalog = JSON.parse(await readFile('technical/product-prices-image-names.json', 'utf8')).products;
const needed = new Set(catalog.map(p => p.image_name));
let n = 0;
for (const f of readdirSync(assets)) {
  if (!f.endsWith('.png')) continue;
  const name = f.replace(/\.png$/, '');
  if (!needed.has(name)) continue;
  const out = join(dest, `${name}.webp`);
  if (existsSync(out)) continue;
  await sharp(join(assets, f)).resize(512, 512, { fit: 'cover' }).webp({ quality: 82, effort: 4 }).toFile(out);
  n++;
}
const have = readdirSync(dest).filter(f => f.endsWith('.webp')).length;
console.log(`synced ${n} new → total ${have}/441`);
