// scripts/generate-icons.js
// Generates PWA icons from the master logo

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT = path.join(__dirname, "..", "..", "lashnafood-assets", "logo.png");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "icons");

const SIZES = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 512, name: "icon-maskable-512.png", padding: true },
];

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`❌ Logo not found: ${INPUT}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const { size, name, padding } of SIZES) {
    const out = path.join(OUTPUT_DIR, name);

    // If maskable, add ~15% padding so icon isn't cropped by Android's circle
    if (padding) {
      const inner = Math.round(size * 0.7);
      const offset = Math.round((size - inner) / 2);

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 196, g: 111, b: 36, alpha: 1 }, // brand-500
        },
      })
        .composite([
          {
            input: await sharp(INPUT)
              .resize(inner, inner, { fit: "contain", background: { r: 196, g: 111, b: 36, alpha: 1 } })
              .toBuffer(),
            top: offset,
            left: offset,
          },
        ])
        .png()
        .toFile(out);
    } else {
      await sharp(INPUT)
        .resize(size, size, {
          fit: "contain",
          background: { r: 253, g: 250, b: 245, alpha: 1 }, // cream
        })
        .png()
        .toFile(out);
    }

    const kb = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`✅ ${name.padEnd(28)} ${size}x${size}  ${kb}KB`);
  }

  console.log("\n✅ Icons generated.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});