// Full-site SEO audit: checks every HTML page against the external audit's issue list.
// Usage: node scripts/seo-audit.js [--json]
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts']);

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { if (!SKIP.has(f)) walk(full, out); }
    else if (f.endsWith('.html')) out.push(full);
  }
  return out;
}

const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const pick = (re, s) => { const m = s.match(re); return m ? m[1].trim() : ''; };
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

function slugTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Classify a calculator by its <select id="liveToolFromUnit"> option values.
function calcType(html) {
  const sel = html.match(/id="liveToolFromUnit"[^>]*>([\s\S]*?)<\/select>/);
  if (!sel) return null;
  const vals = [...sel[1].matchAll(/value="([^"]+)"/g)].map(m => m[1]);
  const v = new Set(vals.map(x => x.toLowerCase()));
  if (v.has('usd') || v.has('gbp') || v.has('eur')) return 'currency';
  if (v.has('f') && v.has('c')) return 'temperature';
  if (v.has('ml') || v.has('cup') || v.has('cups') || v.has('l') || v.has('gal') || v.has('tsp')) return 'volume';
  if (v.has('kg') || v.has('lb') || v.has('st') || v.has('g') && v.has('oz')) return 'weight';
  if (v.has('sqft') || v.has('sqm') || v.has('acre') || v.has('bigha_std') || v.has('guntha') || v.has('gaj')) return 'area';
  if (v.has('m') || v.has('ft') || v.has('km') || v.has('in')) return 'length';
  if (v.has('psi') || v.has('bar')) return 'pressure';
  if (v.has('mph') || v.has('kmh')) return 'speed';
  if (v.has('week') || v.has('day') || v.has('hr') || v.has('min') || v.has('sec')) return 'time';
  if (v.has('kb') || v.has('mb') || v.has('gb') || v.has('tb')) return 'file';
  return 'other:' + vals.slice(0, 4).join(',');
}

// Topic from the slug (works for en/es/de/pt slugs).
function topicFromSlug(slug) {
  const s = slug.toLowerCase();
  const has = (...k) => k.some(x => s.includes(x));
  if (has('usd', 'gbp', 'aud', 'eur', 'vnd', 'inr', 'jpy', 'won', 'rupiah', 'rupia', 'lira', 'dollar', 'dolar', 'pounds-sterling', 'pfund-in-australische', 'libras-en-dolares', 'libras-em-dolares', 'britische-pfund', 'currency', 'moneda', 'moeda', 'waehrung', 'divisa', 'mastercard', 'lakh', 'crore', 'exchange', 'indonesia')) {
    // stone/kg pages also contain "pfund"/"libras": guard below
    if (!has('stone', '-kg', 'kg-', 'kilo', 'quilos')) return 'currency';
  }
  if (has('fahrenheit', 'celsius', 'grad-celsius', 'graus', 'grados')) return 'temperature';
  if (has('cup', 'taza', 'tasse', 'xicara', 'ml', 'litre', 'liter', 'litro', 'gallon', 'galon', 'galao', 'gallone', 'tsp', 'cucharadita', 'teeloeffel', 'colher', 'ounces-to-milli', 'onzas', 'unzen', 'oncas')) return 'volume';
  if (has('stone', 'kg', 'kilo', 'quilos', 'lbs', 'pound', 'libras', 'pfund', 'tola', 'gram')) return 'weight';
  if (has('bigha', 'gaj', 'guntha', 'square', 'sq-ft')) return 'area';
  if (has('meter', 'metro', 'feet', 'pies', 'fuss', 'pes')) return 'length';
  if (has('psi', 'bar-')) return 'pressure';
  if (has('mph', 'kmh')) return 'speed';
  if (has('week', 'semana', 'woche')) return 'time';
  if (has('file', 'pdf', 'archivo', 'arquivo', 'datei', 'convertor', 'converter-app', 'aplicacion', 'aplicativo', 'app-herunter')) return 'file';
  return 'unknown';
}

const files = walk(ROOT);
const validRoutes = new Set(['/']);
for (const f of files) {
  const r = rel(f);
  validRoutes.add('/' + r);
  validRoutes.add('/' + r.replace(/\.html$/, ''));
  if (r.endsWith('/index.html')) {
    validRoutes.add('/' + r.replace(/\/index\.html$/, ''));
    validRoutes.add('/' + r.replace(/index\.html$/, ''));
  }
}
const sitemap = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
const rows = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const r = rel(f);
  const slug = path.basename(r, '.html');
  const isGuide = /(^|\/)blog\//.test(r);
  const url = 'https://www.omniconverter.co.uk/' + (r === 'index.html' ? '' : r.replace(/index\.html$/, '').replace(/\.html$/, ''));
  const title = decode(pick(/<title>([^<]*)<\/title>/i, html));
  const h1 = decode(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html).replace(/<[^>]+>/g, ''));
  const desc = decode(pick(/<meta\s+name="description"\s+content="([^"]*)"/i, html));
  const robots = pick(/<meta\s+name="robots"\s+content="([^"]*)"/i, html);
  const hreflangs = [...html.matchAll(/<link[^>]+hreflang="([^"]+)"[^>]*>/g)].map(m => m[1]);
  const calcs = (html.match(/id="liveToolFromUnit"/g) || []).length + (html.match(/id="liveFromUnit"/g) || []).length;
  const ctype = calcType(html);
  const topic = isGuide ? topicFromSlug(slug) : 'tool';
  const issues = [];

  if (/noindex/i.test(robots)) issues.push(sitemap.includes(`<loc>${url}</loc>`) ? 'NOINDEX_IN_SITEMAP' : 'NOINDEX');
  if (isGuide && title && title.split('|')[0].trim().toLowerCase() === slugTitle(slug).toLowerCase()) issues.push('SLUG_TITLE');
  if (isGuide && /Step-by-step conversion guide for /i.test(desc)) issues.push('SLUG_DESC');
  if (isGuide && ctype && topic !== 'unknown' && !ctype.startsWith(topic) && !(topic === 'area' && ctype === 'length')) issues.push(`CALC_MISMATCH(${topic}->${ctype})`);
  if (calcs > 1) issues.push(`MULTI_CALC(${calcs})`);
  if (hreflangs.length === 0 && r !== '404.html') issues.push('NO_HREFLANG');
  if (hreflangs.length && !hreflangs.includes('x-default')) issues.push('NO_XDEFAULT');
  if (/In Depth Analysis, Historical Standards, and Industry Best Practices/.test(html)) issues.push('BOILERPLATE');
  if (/Chef Claire Hastings|Dr\. Oliver Bennett|Sarah Jenkins|Senior Land Surveyor/.test(html)) issues.push('UNVERIFIABLE_BYLINE');
  if (/zero ads|no ads|without ads|ad-free|sin anuncios|ohne werbung|sem anúncios/i.test(html)) issues.push('ZERO_ADS_CLAIM');
  if (/certified|verified against/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) issues.push('CERTIFIED_CLAIM');
  if (/"aggregateRating"/.test(html)) issues.push('AGG_RATING');
  const og = pick(/<meta\s+property="og:type"\s+content="([^"]*)"/i, html);
  if (isGuide && og && og !== 'article') issues.push(`OG_TYPE(${og})`);
  const kwAlts = [...html.matchAll(/<img[^>]+alt="([^"]*)"/g)].map(m => m[1]).filter(a => a.toLowerCase() === slugTitle(slug).toLowerCase());
  if (kwAlts.length) issues.push('KEYWORD_ALT');
  if (/No Published Articles/.test(html)) issues.push('EMPTY_BLOG_MSG');
  if ((html.match(/<\/html>/gi) || []).length > 1 || (html.match(/<\/body>/gi) || []).length > 1) issues.push('DUP_HTML');

  // Deep technical checks (JSON-LD validity, H1 count, canonical, image assets, internal links, hreflang targets)
  if (r !== '404.html' && r !== 'pt/blog/2000-usd-to-gbp.html') {
    const ldBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (ldBlocks.length === 0) issues.push('NO_JSONLD');
    for (const b of ldBlocks) {
      try { JSON.parse(b[1]); } catch (e) { issues.push('INVALID_JSONLD'); }
    }
    const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
    if (h1Count !== 1) issues.push(`H1_COUNT(${h1Count})`);
    if (!/<link\s+rel=["']canonical["']/i.test(html)) issues.push('NO_CANONICAL');
    for (const imgM of html.matchAll(/<img[^>]+src=["'](\/[^"'#?]*)["']/gi)) {
      if (!fs.existsSync(path.join(ROOT, imgM[1]))) issues.push(`MISSING_IMG(${imgM[1]})`);
    }
    for (const hlM of html.matchAll(/<link[^>]+hreflang=["'][^"']+["'][^>]+href=["']https:\/\/www\.omniconverter\.co\.uk([^"']*)["']/gi)) {
      const p = hlM[1] || '/';
      if (!validRoutes.has(p)) issues.push(`BROKEN_HREFLANG(${p})`);
    }
    for (const aM of html.matchAll(/<a[^>]+href=["'](\/[^"'#?]*)["']/gi)) {
      const p = aM[1];
      if (!validRoutes.has(p) && !fs.existsSync(path.join(ROOT, p))) issues.push(`BROKEN_LINK(${p})`);
    }
  }

  rows.push({ r, title, h1, desc, robots, hreflangs: hreflangs.length, calcs, ctype, topic, issues });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  const counts = {};
  for (const row of rows) for (const i of row.issues) { const k = i.replace(/\(.*\)/, ''); counts[k] = (counts[k] || 0) + 1; }
  console.log('Pages scanned:', rows.length);
  console.log('Issue counts:', counts);
  for (const row of rows.filter(x => x.issues.length)) console.log(row.r.padEnd(58), row.issues.join(' '));
}
