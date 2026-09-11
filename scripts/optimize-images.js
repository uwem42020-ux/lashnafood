// scripts/optimize-images.js
// Compresses PNGs from ../lashnafood-assets/ into WebP inside public/images/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', '..', 'lashnafood-assets');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');

// Full-size max width (product page hero)
const FULL_WIDTH = 800;
// Thumbnail width (grids, cart)
const THUMB_WIDTH = 400;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.png$/i, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function processImage(file) {
  const inputPath = path.join(INPUT_DIR, file);
  const baseName = slugify(file);

  const fullOut = path.join(OUTPUT_DIR, `${baseName}.webp`);
  const thumbOut = path.join(OUTPUT_DIR, `${baseName}-thumb.webp`);

  try {
    // Full size
    await sharp(inputPath)
      .resize({ width: FULL_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(fullOut);

    // Thumbnail
    await sharp(inputPath)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbOut);

    const fullSize = (fs.statSync(fullOut).size / 1024).toFixed(1);
    const thumbSize = (fs.statSync(thumbOut).size / 1024).toFixed(1);
    const origSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);

    console.log(
      `✅ ${file.padEnd(45)} ${origSize}MB → ${fullSize}KB / ${thumbSize}KB`
    );
  } catch (err) {
    console.error(`❌ Failed on ${file}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Input folder not found: ${INPUT_DIR}`);
    console.error('   Make sure lashnafood-assets is next to lashnafood.');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  if (files.length === 0) {
    console.log('No PNG/JPG files found in assets folder.');
    return;
  }

  console.log(`\n📂 Input:  ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);
  console.log(`Processing ${files.length} images...\n`);

  for (const file of files) {
    await processImage(file);
  }

  console.log('\n✅ Done.\n');
}

main();