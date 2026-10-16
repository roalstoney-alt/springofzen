import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(siteRoot, "public");
const failures = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function fail(message) {
  failures.push(message);
}

const files = walk(publicRoot);
const textFiles = files.filter((file) => /\.(?:css|html|js|txt|xml)$/.test(file));
const htmlFiles = files.filter((file) => file.endsWith(".html"));

for (const required of ["index.html", "ocean/index.html", "space/index.html", "forest/index.html", "404/index.html", "robots.txt", "sitemap.xml"]) {
  if (!fs.existsSync(path.join(publicRoot, required))) fail(`Missing required file: ${required}`);
}

for (const file of textFiles) {
  const relative = path.relative(publicRoot, file);
  const source = fs.readFileSync(file, "utf8");
  if (/springofzen\.com/i.test(source)) fail(`${relative} links to SpringOfZen`);
  if (/\b(?:XMLHttpRequest|WebSocket|indexedDB|localStorage)\b|\bfetch\s*\(/.test(source) && !relative.endsWith("src/worker.js")) {
    const adultOnly = relative === "assets/shared/parents-v04.js";
    const calls = [...source.matchAll(/\bfetch\s*\(\s*(["'])([^"']+)\1/g)].map(match => match[2]);
    if (!adultOnly || calls.length !== 2 || calls.some(url => !["/api/inquiry-token", "/api/inquiries"].includes(url)) || /XMLHttpRequest|WebSocket|indexedDB|localStorage/.test(source)) fail(`${relative} contains an unapproved browser data/network dependency`);
  }
  if (/\b(?:pilot|research|prototype)\b/i.test(source) && /\.(?:html|js)$/.test(file)) {
    fail(`${relative} exposes internal testing language`);
  }
  if (/\b(?:floorVariant|data-floor|A\/B)\b/.test(source) && /\.(?:html|js)$/.test(file)) {
    fail(`${relative} exposes Forest variant logic`);
  }
}

for (const file of htmlFiles) {
  const relative = path.relative(publicRoot, file);
  const source = fs.readFileSync(file, "utf8");
  if (!/<html\s+lang="en"/.test(source)) fail(`${relative} is missing lang=en`);
  if (relative !== "404/index.html" && !/<link\s+rel="canonical"\s+href="https:\/\/mykidsnest\.com\//.test(source)) {
    fail(`${relative} is missing an apex canonical URL`);
  }
  for (const match of source.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      if (["Product", "Offer"].includes(schema["@type"])) fail(`${relative} contains commerce schema`);
    } catch {
      fail(`${relative} contains invalid JSON-LD`);
    }
  }
}

for (const file of files.filter((candidate) => /\.(?:html|css)$/.test(candidate))) {
  const relative = path.relative(publicRoot, file);
  const source = fs.readFileSync(file, "utf8");
  const references = [];
  for (const match of source.matchAll(/(?:src|href|srcset|data-src|data-srcset)="([^"]+)"/g)) {
    references.push(match[1].split(/\s+/)[0]);
  }
  for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/g)) references.push(match[1]);

  for (const reference of references) {
    if (/^(?:https?:|data:|#|mailto:)/.test(reference)) continue;
    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;
    let target = clean.startsWith("/")
      ? path.join(publicRoot, clean)
      : path.resolve(path.dirname(file), clean);
    if (clean.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) fail(`${relative} references missing ${reference}`);
  }
}

const result = {
  files: files.length,
  html: htmlFiles.length,
  images: files.filter((file) => /\.(?:jpe?g|png|webp)$/i.test(file)).length,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
