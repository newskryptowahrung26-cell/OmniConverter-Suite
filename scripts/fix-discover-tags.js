/**
 * Google Discover Optimization — fix-discover-tags.js
 * Adds ONLY missing Discover-critical meta tags to all 262 blog articles:
 *   1. max-image-preview:large  (THE #1 Discover requirement)
 *   2. og:image:width / og:image:height  (1200x630 explicit dimensions)
 *   3. og:locale  (language-specific)
 *   4. article:author  (E-E-A-T signal)
 * Zero changes to URLs, titles, descriptions, canonicals, body text, or calculators.
 */

const fs   = require('fs');
const path = require('path');

const LANGS = [
  { lang: 'en', dir: 'blog',    ogLocale: 'en_GB' },
  { lang: 'es', dir: 'es/blog', ogLocale: 'es_ES' },
  { lang: 'de', dir: 'de/blog', ogLocale: 'de_DE' },
  { lang: 'pt', dir: 'pt/blog', ogLocale: 'pt_BR' },
];

let totalFixed = 0;

for (const { lang, dir, ogLocale } of LANGS) {
  const absDir = path.join(__dirname, '..', dir);
  if (!fs.existsSync(absDir)) continue;

  const files = fs.readdirSync(absDir).filter(f => f.endsWith('.html'));
  let langFixed = 0;

  for (const file of files) {
    const filePath = path.join(absDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Skip redirect stubs
    if (html.includes('http-equiv="refresh"')) continue;

    const orig = html;

    // ── 1. max-image-preview:large ──────────────────────────────────────────
    if (!html.includes('max-image-preview')) {
      // Insert right after <meta name="viewport" ...>
      html = html.replace(
        /(<meta\s+name="viewport"[^>]*>)/i,
        `$1\n  <meta name="robots" content="max-image-preview:large, index, follow">`
      );
    }

    // ── 2. og:image dimensions (1200×630) ───────────────────────────────────
    if (!html.includes('og:image:width')) {
      html = html.replace(
        /(<meta\s+property="og:image"[^>]*>)/i,
        `$1\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">`
      );
    }

    // ── 3. og:locale ────────────────────────────────────────────────────────
    if (!html.includes('og:locale')) {
      html = html.replace(
        /(<meta\s+property="og:type"[^>]*>)/i,
        `<meta property="og:locale" content="${ogLocale}">\n  $1`
      );
    }

    // ── 4. article:author (E-E-A-T) ─────────────────────────────────────────
    if (!html.includes('article:author')) {
      html = html.replace(
        /(<meta\s+name="article:published_time"[^>]*>)/i,
        `$1\n  <meta property="article:author" content="OmniConverter Editorial Team">`
      );
    }

    if (html !== orig) {
      fs.writeFileSync(filePath, html, 'utf8');
      langFixed++;
      totalFixed++;
    }
  }

  console.log(`[OK] ${lang.toUpperCase()}: Fixed ${langFixed} articles in ${dir}/`);
}

console.log(`\n✅ DONE: Added Discover optimization tags to ${totalFixed} articles.`);
console.log('   • max-image-preview:large → Google Discover image eligibility');
console.log('   • og:image:width/height   → Explicit 1200×630 dimensions');
console.log('   • og:locale               → Language-specific region signal');
console.log('   • article:author          → E-E-A-T authorship signal');
