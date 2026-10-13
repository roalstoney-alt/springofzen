import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const rawDir = path.resolve(process.argv[2] || "");

if (!process.argv[2]) {
  throw new Error("Usage: node scripts/build-mynest-forest-meadow-variants.mjs <raw-image-directory>");
}

const jobs = [
  ["day", "desktop", "forest-room-day-desktop-v01.jpg", "day-desktop.png"],
  ["day", "mobile", "forest-room-day-mobile-v01.jpg", "day-mobile.png"],
  ["night", "desktop", "forest-room-night-desktop-v01.jpg", "night-desktop.png"],
  ["night", "mobile", "forest-room-night-mobile-v01.jpg", "night-mobile.png"],
  ["rest", "desktop", "forest-room-rest-desktop-v01.jpg", "rest-desktop.png"],
  ["rest", "mobile", "forest-room-rest-mobile-v01.jpg", "rest-mobile.png"],
];

function desktopMask(width, height) {
  return Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 1448 1086" xmlns="http://www.w3.org/2000/svg">
    <rect width="1448" height="1086" fill="black"/>
    <path d="M0 586 L470 570 L690 585 L900 630 L1190 650 L1448 685 L1448 1086 L0 1086 Z" fill="white"/>
    <path d="M590 430 L1305 430 L1345 865 L595 880 Z" fill="black"/>
    <path d="M0 260 L430 410 L465 735 L0 755 Z" fill="black"/>
    <path d="M0 565 L295 580 L310 930 L0 970 Z" fill="black"/>
    <path d="M1260 290 L1448 290 L1448 790 L1245 770 Z" fill="black"/>
    <path d="M1235 720 L1448 720 L1448 1086 L1175 1086 L1195 915 Z" fill="black"/>
    <ellipse cx="278" cy="704" rx="46" ry="58" fill="black"/>
    <ellipse cx="331" cy="770" rx="50" ry="61" fill="black"/>
    <ellipse cx="423" cy="904" rx="75" ry="90" fill="black"/>
    <ellipse cx="486" cy="947" rx="62" ry="79" fill="black"/>
    <ellipse cx="206" cy="1004" rx="92" ry="83" fill="black"/>
    <ellipse cx="1214" cy="897" rx="86" ry="80" fill="black"/>
  </svg>`);
}

function mobileMask(width, height) {
  return Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 941 1672" xmlns="http://www.w3.org/2000/svg">
    <rect width="941" height="1672" fill="black"/>
    <path d="M0 735 L310 720 L500 730 L720 790 L941 815 L941 1672 L0 1672 Z" fill="white"/>
    <path d="M350 300 L941 300 L941 1080 L345 1070 Z" fill="black"/>
    <path d="M0 375 L245 430 L250 835 L0 850 Z" fill="black"/>
    <path d="M0 750 L270 760 L285 1145 L0 1175 Z" fill="black"/>
    <path d="M705 1100 L941 1100 L941 1672 L650 1672 Z" fill="black"/>
    <ellipse cx="119" cy="833" rx="37" ry="47" fill="black"/>
    <ellipse cx="221" cy="918" rx="43" ry="54" fill="black"/>
    <ellipse cx="219" cy="1044" rx="59" ry="66" fill="black"/>
    <ellipse cx="268" cy="1071" rx="61" ry="72" fill="black"/>
    <ellipse cx="117" cy="1250" rx="85" ry="92" fill="black"/>
    <ellipse cx="836" cy="1139" rx="77" ry="83" fill="black"/>
  </svg>`);
}

async function build([mode, size, controlName, generatedName]) {
  const controlPath = path.join(root, "mynest/forest-room/assets", controlName);
  const generatedPath = path.join(rawDir, generatedName);
  const outputPath = path.join(root, "mynest/forest-room/assets", `forest-room-${mode}-${size}-b-meadow-v01.webp`);
  const control = sharp(controlPath).ensureAlpha();
  const metadata = await control.metadata();
  const { width, height } = metadata;
  const maskSvg = size === "desktop" ? desktopMask(width, height) : mobileMask(width, height);
  const mask = await sharp(maskSvg).greyscale().blur(7).raw().toBuffer();
  const generated = await sharp(generatedPath)
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();

  for (let pixel = 0, channel = 3; pixel < mask.length; pixel += 1, channel += 4) {
    generated[channel] = mask[pixel];
  }

  await control
    .composite([{ input: generated, raw: { width, height, channels: 4 }, blend: "over" }])
    .webp({ lossless: true, effort: 5 })
    .toFile(outputPath);

  const protectedPixels = mask.reduce((count, value) => count + (value === 0 ? 1 : 0), 0);
  const [controlPixels, outputPixels] = await Promise.all([
    sharp(controlPath).removeAlpha().raw().toBuffer(),
    sharp(outputPath).removeAlpha().raw().toBuffer()
  ]);
  let protectedMaxDelta = 0;
  for (let pixel = 0, channel = 0; pixel < mask.length; pixel += 1, channel += 3) {
    if (mask[pixel] !== 0) continue;
    for (let offset = 0; offset < 3; offset += 1) {
      protectedMaxDelta = Math.max(protectedMaxDelta, Math.abs(controlPixels[channel + offset] - outputPixels[channel + offset]));
    }
  }
  if (protectedMaxDelta !== 0) throw new Error(`${path.basename(outputPath)} changed protected pixels`);
  return { outputPath, width, height, protectedPixels, protectedMaxDelta };
}

const results = [];
for (const job of jobs) results.push(await build(job));
for (const result of results) {
  console.log(`${path.basename(result.outputPath)} ${result.width}x${result.height} protected=${result.protectedPixels} protectedMaxDelta=${result.protectedMaxDelta}`);
}
