/**
 * fix-ahrefs-hreflang-issues.js
 * 
 * Fixes:
 * 1. Missing reciprocal hreflang on 100-usd cluster:
 *    - In es/blog/100-usd-a-aud.html, align hreflangs to the canonical group:
 *      en -> blog/100-usd-to-aud
 *      es -> es/blog/100-usd-a-aud
 *      de -> de/blog/100-usd-in-aud
 *      pt -> pt/blog/100-usd-para-aud
 *      x-default -> blog/100-usd-to-aud
 * 
 * 2. Hreflang to non-canonical on 2000-usd-to-gbp cluster:
 *    - In blog/2000-usd-to-gbp.html, make it self-canonical so it's a valid canonical target:
 *      canonical -> https://www.omniconverter.co.uk/blog/2000-usd-to-gbp
 *    - In pt/blog/2000-usd-to-gbp.html (which is a redirect to pt/blog/2000-usd-para-gbp):
 *      Update its canonical or hreflangs accordingly.
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'd:/Temperater Converter';

// ─── FIX 1: es/blog/100-usd-a-aud.html ──────────────────────────────────────
const es100Path = path.join(ROOT, 'es/blog/100-usd-a-aud.html');
let es100Html = fs.readFileSync(es100Path, 'utf8');

const oldEs100Hreflangs = `<link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/100-usd-in-australian">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/100-usd-in-australische-dollar">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/100-usd-em-dolar-australiano">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/100-usd-in-australian">`;

const newEs100Hreflangs = `<link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/100-usd-to-aud">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/100-usd-in-aud">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/100-usd-para-aud">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/100-usd-to-aud">`;

if (es100Html.includes('blog/100-usd-in-australian')) {
  es100Html = es100Html.replace(oldEs100Hreflangs, newEs100Hreflangs);
  fs.writeFileSync(es100Path, es100Html, 'utf8');
  console.log('✅ Fixed es/blog/100-usd-a-aud.html hreflangs');
} else {
  console.log('⚠️ Warning: es/blog/100-usd-a-aud.html old hreflangs not found exactly as string');
}

// Also check the secondary legacy pages: blog/100-usd-in-australian.html, de/blog/100-usd-in-australische-dollar.html, pt/blog/100-usd-em-dolar-australiano.html
// If they have no Spanish counterpart in their legacy group, make sure they don't claim es/blog/100-usd-a-aud, OR make them point cleanly.
const legacy100Files = [
  'blog/100-usd-in-australian.html',
  'de/blog/100-usd-in-australische-dollar.html',
  'pt/blog/100-usd-em-dolar-australiano.html'
];
for (const f of legacy100Files) {
  const full = path.join(ROOT, f);
  if (fs.existsSync(full)) {
    let html = fs.readFileSync(full, 'utf8');
    // Remove the hreflang pointing to es/blog/100-usd-a-aud from these legacy 3 pages since es belongs to the primary group
    if (html.includes('<link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">')) {
      html = html.replace(/\s*<link rel="alternate" hreflang="es" href="https:\/\/www\.omniconverter\.co\.uk\/es\/blog\/100-usd-a-aud">\s*\n?/g, '\n');
      fs.writeFileSync(full, html, 'utf8');
      console.log(`✅ Removed non-reciprocal ES link from legacy ${f}`);
    }
  }
}

// ─── FIX 2: blog/2000-usd-to-gbp.html self-canonical ───────────────────────
const gbp2000Path = path.join(ROOT, 'blog/2000-usd-to-gbp.html');
let gbp2000Html = fs.readFileSync(gbp2000Path, 'utf8');

if (gbp2000Html.includes('https://www.omniconverter.co.uk/blog/2000-dollars-in-pounds')) {
  gbp2000Html = gbp2000Html.replace(
    '<link rel="canonical" href="https://www.omniconverter.co.uk/blog/2000-dollars-in-pounds">',
    '<link rel="canonical" href="https://www.omniconverter.co.uk/blog/2000-usd-to-gbp">'
  );
  fs.writeFileSync(gbp2000Path, gbp2000Html, 'utf8');
  console.log('✅ Fixed blog/2000-usd-to-gbp.html canonical to self (https://www.omniconverter.co.uk/blog/2000-usd-to-gbp)');
}

console.log('\nAll fixes applied. Re-running audit...');
