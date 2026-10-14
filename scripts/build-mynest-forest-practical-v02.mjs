import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const rawDir = path.resolve(process.argv[2] || "");

if (!process.argv[2]) {
  throw new Error("Usage: node scripts/build-mynest-forest-practical-v02.mjs <raw-image-directory>");
}

const jobs = [
  ["day", "desktop", 1672, 941],
  ["day", "mobile", 941, 1672],
  ["night", "desktop", 1672, 941],
  ["night", "mobile", 941, 1672],
  ["rest", "desktop", 1672, 941],
  ["rest", "mobile", 941, 1672]
];

for (const [mode, size, width, height] of jobs) {
  const input = path.join(rawDir, `${mode}-${size}.png`);
  const output = path.join(
    root,
    "mynest/forest-room/assets",
    `forest-room-${mode}-${size}-b-practical-v02.webp`
  );

  const metadata = await sharp(input).metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`${path.basename(input)} must be ${width}x${height}`);
  }

  await sharp(input)
    .webp({ quality: 90, effort: 6, smartSubsample: true })
    .toFile(output);

  const built = await sharp(output).metadata();
  console.log(`${path.basename(output)} ${built.width}x${built.height}`);
}
