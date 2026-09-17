/**
 * OmniConverter Auto-Publisher — Complete Permanent Rewrite
 * Fixes: missing rebuild_blog_data.js, stale model names, variable scope errors,
 * header row keyword injection, and all runtime crashes.
 */

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Unit synonym map — normalize variant spellings to canonical forms
const UNIT_SYNONYMS = {
  'fahrenheit': 'f', 'celsius': 'c', 'centigrade': 'c', 'kelvin': 'k',
  'kilogram': 'kg', 'kilograms': 'kg', 'kilo': 'kg', 'kilos': 'kg',
  'pound': 'lb', 'pounds': 'lb', 'lbs': 'lb',
  'gram': 'g', 'grams': 'g',
  'ounce': 'oz', 'ounces': 'oz',
  'stone': 'st', 'stones': 'st',
  'litre': 'l', 'litres': 'l', 'liter': 'l', 'liters': 'l',
  'milliliter': 'ml', 'milliliters': 'ml', 'millilitre': 'ml', 'millilitres': 'ml',
  'gallon': 'gal', 'gallons': 'gal',
  'cup': 'cup', 'cups': 'cup',
  'teaspoon': 'tsp', 'teaspoons': 'tsp',
  'tablespoon': 'tbsp', 'tablespoons': 'tbsp',
  'mile': 'mi', 'miles': 'mi', 'mph': 'mph',
  'kilometer': 'km', 'kilometers': 'km', 'kilometre': 'km', 'kilometres': 'km', 'kmh': 'kmh',
  'meter': 'm', 'meters': 'm', 'metre': 'm', 'metres': 'm',
  'foot': 'ft', 'feet': 'ft',
  'inch': 'in', 'inches': 'in',
  'psi': 'psi', 'bar': 'bar',
  'dollar': 'usd', 'dollars': 'usd', 'usd': 'usd',
  'euro': 'eur', 'euros': 'eur',
  'pound': 'gbp', 'gbp': 'gbp',
  'aud': 'aud', 'vnd': 'vnd', 'krw': 'krw',
};

const STOP_WORDS = new Set([
  'a','an','the','to','in','is','of','for','into','how','many',
  'much','what','convert','from','are','does','between','and','or',
  'i','my','do','get','make','use','with','at','by','as','on'
]);

function getTopicSignature(text) {
  return text.toLowerCase()
    // Normalize fractions like 1/3 -> 1-3
    .replace(/(\d+)\/(\d+)/g, '$1-$2')
    // Normalize number words
    .replace(/\bone\b/g, '1').replace(/\btwo\b/g, '2').replace(/\bthree\b/g, '3')
    .replace(/\bfour\b/g, '4').replace(/\bfive\b/g, '5').replace(/\bten\b/g, '10')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
    // Normalize unit synonyms
    .map(w => UNIT_SYNONYMS[w] || w)
    // Remove stop words
    .filter(w => !STOP_WORDS.has(w) && w.length > 0)
    .sort()
    .join('-');
}

function fetchUrl(url, redirects) {
  if (redirects === undefined) redirects = 8;
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, redirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function getUnsplashPhoto(query, accessKey) {
  return new Promise((resolve) => {
    const fallback = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';
    if (!accessKey) return resolve(fallback);
    const searchUrl = `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${encodeURIComponent(query)}&client_id=${accessKey}`;
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) return resolve(parsed.results[0].urls.regular);
        } catch (e) {}
        resolve(fallback);
      });
    }).on('error', () => resolve(fallback));
  });
}

// ─── REBUILD blog-data.js AND sitemap.xml INLINE ─────────────────────────────

function rebuildBlogData() {
  const blogDir = 'blog';
  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();

  const htmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).sort();

  const posts = htmlFiles.map(filename => {
    const slug = filename.replace('.html', '');
    const raw = fs.readFileSync(path.join(blogDir, filename), 'utf8');

    const titleMatch = raw.match(/<title[^>]*>(.*?)<\/title>/i);
    const fullTitle = titleMatch
      ? titleMatch[1].replace(' | OmniConverter', '').trim()
      : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const descMatch = raw.match(/<meta name="description" content="([^"]+)"/i);
    const summary = descMatch ? descMatch[1] : 'Comprehensive conversion guide.';

    const imgMatch = raw.match(/<img[^>]+src="(https:\/\/images\.unsplash[^"]+)"/i);
    const image = imgMatch
      ? imgMatch[1]
      : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';

    const articleMatch = raw.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    const content = articleMatch ? articleMatch[1].trim() : '';

    return { slug, fullTitle, summary, image, content };
  });

  const postsJs = posts.map(p => `  {
    "id": ${JSON.stringify(p.slug)},
    "slug": ${JSON.stringify(p.slug)},
    "title": ${JSON.stringify(p.fullTitle)},
    "date": ${JSON.stringify(today)},
    "publicationDate": ${JSON.stringify(today)},
    "category": "Conversion Guide",
    "author": "OmniConverter Editorial Team",
    "readTime": "4 min read",
    "icon": "📊",
    "image": ${JSON.stringify(p.image)},
    "summary": ${JSON.stringify(p.summary)},
    "content": ${JSON.stringify(p.content)}
  }`).join(',\n');

  const blogDataContent = [
    `// Automatically synchronized blog data (Total: ${posts.length} articles)`,
    `const BLOG_POSTS = [`,
    postsJs,
    `];`,
    ``,
    `// Make articles available globally for blog.html`,
    `window.BLOG_POSTS = BLOG_POSTS;`,
    `window.blogArticles = BLOG_POSTS;`,
    ``
  ].join('\n');

  fs.writeFileSync('blog-data.js', blogDataContent, 'utf8');
  console.log(`[OK] blog-data.js rebuilt with ${posts.length} articles + window globals.`);

  const blogEntries = posts
    .map(p => `  <url><loc>https://www.omniconverter.co.uk/blog/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url><loc>https://www.omniconverter.co.uk/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.omniconverter.co.uk/temperature</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/weight-mass</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/volume-capacity</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/time-duration</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/area</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/speed</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/file-media</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <!-- Blog -->
  <url><loc>https://www.omniconverter.co.uk/blog</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
${blogEntries}
  <!-- Static Pages -->
  <url><loc>https://www.omniconverter.co.uk/about</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.omniconverter.co.uk/contact</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.omniconverter.co.uk/sitemap</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>
  <url><loc>https://www.omniconverter.co.uk/privacy-policy</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.omniconverter.co.uk/terms</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
`;
  fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
  console.log(`[OK] sitemap.xml rebuilt with ${posts.length} blog entries.`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== OmniConverter Auto-Publisher ===');

  const apiKey = process.env.GEMINI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is missing.');
    process.exit(1);
  }

  // 1. Load keywords
  const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/1ViVyX1fdyJqIoA-qMoz9-jrPjR-IFHCT/export?format=csv';
  console.log('Fetching keywords from Google Sheet...');

  let rawKeywords = [];
  try {
    const csvData = await fetchUrl(sheetCsvUrl);
    rawKeywords = csvData.split('\n')
      .map(l => l.replace(/^"|"$/g, '').replace(/\r/g, '').trim())
      .filter(l => l.length > 0 && l.toLowerCase() !== 'keyword');
    console.log(`Loaded ${rawKeywords.length} keywords from Google Sheet.`);
  } catch (e) {
    console.warn(`Sheet fetch failed: ${e.message}`);
  }

  if (rawKeywords.length === 0 && fs.existsSync('keywords.csv')) {
    rawKeywords = fs.readFileSync('keywords.csv', 'utf8')
      .split('\n')
      .map(l => l.replace(/^"|"$/g, '').replace(/\r/g, '').trim())
      .filter(l => l.length > 0 && l.toLowerCase() !== 'keyword');
    console.log(`Loaded ${rawKeywords.length} keywords from local backup.`);
  }

  if (rawKeywords.length === 0) {
    console.error('ERROR: No keywords found.');
    process.exit(1);
  }

  // 2. Anti-cannibalization
  const publishedFiles = fs.readdirSync('blog')
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
  console.log(`Published articles: ${publishedFiles.length}`);

  const publishedSlugs = new Set(publishedFiles);
  const publishedSignatures = new Set(
    publishedFiles.map(f => getTopicSignature(f.replace(/-/g, ' ')))
  );

  let selectedTarget = null;
  for (const rawKw of rawKeywords) {
    const slug = slugify(rawKw);
    const sig = getTopicSignature(rawKw);
    if (!publishedSlugs.has(slug) && !publishedSignatures.has(sig)) {
      selectedTarget = { rawKw, slug };
      break;
    }
  }

  if (!selectedTarget) {
    console.log('All keywords already covered. Nothing to publish.');
    return;
  }
  console.log(`[OK] Selected: "${selectedTarget.rawKw}" -> ${selectedTarget.slug}`);

  // 3. Unsplash photo
  const imageUrl = await getUnsplashPhoto(selectedTarget.rawKw, unsplashKey);
  console.log(`[OK] Photo fetched.`);

  // 4. Generate article — dynamic model discovery + static fallback
  const ai = new GoogleGenAI({ apiKey });

  let modelCandidates = [];
  try {
    const pager = await ai.models.list();
    for await (const model of pager) {
      const name = (model.name || '').replace(/^models\//, '');
      const methods = model.supportedGenerationMethods || [];
      if (
        name.includes('gemini') &&
        !name.includes('embedding') &&
        !name.includes('imagen') &&
        !name.includes('tts') &&
        !name.includes('realtime') &&
        !name.includes('aqa') &&
        methods.includes('generateContent')
      ) {
        modelCandidates.push(name);
      }
    }
    console.log(`Discovered ${modelCandidates.length} usable models.`);
  } catch (e) {
    console.warn(`Model listing failed: ${e.message}`);
  }

  const staticFallbacks = [
    'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-pro-preview',
    'gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash', 'gemini-2.5-pro',
    'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'
  ];

  const allCandidates = [...new Set([...modelCandidates, ...staticFallbacks])];

  const prompt = `Write a professional 1,000-word SEO article for keyword: "${selectedTarget.rawKw}".
Rules:
- Return ONLY raw HTML body content starting with <p> or <h2>.
- No markdown code fences.
- Include a Quick Summary box: <div style="background:var(--bg-elevated); border-left:4px solid var(--accent); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
- Include conversion formulas in: <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0;">
- Include comparison table: <div class="table-wrapper"><table class="conversion-table">...</table></div>
- Include FAQ section with 3 Q&A using <h4> and <p> tags.
- Minimum 900 words.`;

  let response = null;
  let lastError = null;

  for (const model of allCandidates) {
    try {
      console.log(`Trying: ${model}...`);
      response = await ai.models.generateContent({ model, contents: prompt });
      if (response && response.text) {
        console.log(`[OK] Generated with: ${model}`);
        break;
      }
    } catch (err) {
      console.warn(`"${model}" failed: ${(err.message || '').split('\n')[0]}`);
      lastError = err;
    }
  }

  if (!response || !response.text) {
    throw new Error(`All models failed. Last: ${lastError ? lastError.message : 'unknown'}`);
  }

  let articleBodyHtml = response.text
    .replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  // 5. Build HTML page
  const title = selectedTarget.rawKw.replace(/\b\w/g, l => l.toUpperCase());
  const year = new Date().getFullYear();

  const fullPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="msvalidate.01" content="25038A8801D42437BBC34723A41AC6C4" />
  <meta name="google-site-verification" content="Cpl786DxZO0l5hjxd_D5KE5RGWKFuJ9EVSh5n6Msm7M" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KPY6T7PFD"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0KPY6T7PFD');</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | OmniConverter</title>
  <meta name="description" content="Step-by-step conversion guide for ${selectedTarget.rawKw} with formulas, tables, and FAQs.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/blog/${selectedTarget.slug}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <div class="header-container">
      <a href="/" class="logo" aria-label="OmniConverter Home">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px;height:32px;border-radius:6px;object-fit:cover;">
        <span>OmniConverter</span>
      </a>
      <nav class="nav-tabs" aria-label="Main Navigation">
        <a href="/" class="tab-btn">Home</a>
        <a href="/temperature" class="tab-btn">Temperature</a>
        <a href="/weight-mass" class="tab-btn">Weight &amp; Mass</a>
        <a href="/volume-capacity" class="tab-btn">Volume</a>
        <a href="/time-duration" class="tab-btn">Time</a>
        <a href="/area" class="tab-btn">Area</a>
        <a href="/speed" class="tab-btn">Speed</a>
        <a href="/file-media" class="tab-btn">File Converter</a>
        <a href="/blog" class="tab-btn active">Blog</a>
      </nav>
    </div>
  </header>
  <main class="main-container">
    <article class="content-section" style="margin-top:1.5rem;">
      <span class="formula-badge">Conversion Guide: ${title}</span>
      <h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">${title}</h1>
      <img src="${imageUrl}" alt="${title}" style="width:100%;max-height:360px;object-fit:cover;border-radius:var(--radius-xl);margin:0.5rem 0 1.5rem 0;border:1px solid var(--card-border);" loading="eager">
      ${articleBodyHtml}
    </article>
  </main>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; ${year} OmniConverter Suite. All rights reserved. | <a href="/sitemap">Sitemap</a> | <a href="/about">About</a> | <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms">Terms</a> | <a href="/contact">Contact</a></p>
    </div>
  </footer>
</body>
</html>`;

  const outPath = path.join('blog', `${selectedTarget.slug}.html`);
  fs.writeFileSync(outPath, fullPageHtml, 'utf8');
  console.log(`[OK] Article saved: ${outPath}`);

  // 6. Rebuild blog-data.js + sitemap.xml inline
  rebuildBlogData();

  console.log('=== Auto-Publisher complete! ===');
}

main().catch(err => {
  console.error('Execution Error:', err.message || String(err));
  process.exit(1);
});
