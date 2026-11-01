/**
 * audit-all-hreflangs.js
 * Scans every HTML file in the project for:
 * 1. Hreflang pointing to non-canonical URL
 * 2. Missing reciprocal hreflang (A points to B, but B does not point back to A with correct lang)
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'd:/Temperater Converter';

function getAllHtml(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'scratch') continue;
      getAllHtml(full, list);
    } else if (ent.name.endsWith('.html')) {
      list.push(path.relative(ROOT, full).replace(/\\/g, '/'));
    }
  }
  return list;
}

const allFiles = getAllHtml(ROOT);

// Step 1: Collect canonical and hreflangs of every page
const pageMap = new Map();

for (const file of allFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const canonMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const canon = canonMatch ? canonMatch[1] : null;

  const hreflangs = [];
  const matches = content.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi);
  for (const m of matches) {
    hreflangs.push({ lang: m[1], href: m[2] });
  }

  // Also catch reverse attribute order: href then hreflang
  const matchesRev = content.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*hreflang=["']([^"']+)["']/gi);
  for (const m of matchesRev) {
    if (!hreflangs.some(h => h.lang === m[2])) {
      hreflangs.push({ lang: m[2], href: m[1] });
    }
  }

  const url = 'https://www.omniconverter.co.uk/' + (file === 'index.html' ? '' : file.replace(/\.html$/, ''));

  pageMap.set(url, { file, canon, hreflangs });
}

console.log(`Total indexed pages mapped: ${pageMap.size}`);

// Step 2: Check Hreflang to non-canonical
console.log('\n=== ISSUE: Hreflang to Non-Canonical ===');
let nonCanonCount = 0;
for (const [url, data] of pageMap) {
  for (const h of data.hreflangs) {
    const target = pageMap.get(h.href);
    if (target && target.canon && target.canon !== h.href) {
      console.log(`[${data.file}] hreflang "${h.lang}" points to ${h.href}`);
      console.log(`  -> but that target's canonical is: ${target.canon}`);
      nonCanonCount++;
    }
  }
}
if (nonCanonCount === 0) console.log('  None found!');

// Step 3: Check Missing reciprocal hreflang
console.log('\n=== ISSUE: Missing Reciprocal Hreflang ===');
let missingReciprocalCount = 0;
for (const [url, data] of pageMap) {
  for (const h of data.hreflangs) {
    if (h.lang === 'x-default') continue;
    const target = pageMap.get(h.href);
    if (!target) continue;
    // Check if target points back to url (or url's canonical)
    const pointsBack = target.hreflangs.some(th => th.href === url || (data.canon && th.href === data.canon));
    if (!pointsBack) {
      console.log(`[${data.file}] has hreflang "${h.lang}" -> ${h.href}`);
      console.log(`  -> but ${target.file} does NOT point back to ${url}`);
      missingReciprocalCount++;
    }
  }
}
if (missingReciprocalCount === 0) console.log('  None found!');
