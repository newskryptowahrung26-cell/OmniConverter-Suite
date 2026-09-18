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
  'mile': 'mi', 'miles': 'mi', 'mph': 'mi',
  'kilometer': 'km', 'kilometers': 'km', 'kilometre': 'km', 'kilometres': 'km', 'kmh': 'km', 'kph': 'km',
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
  // Articles & prepositions
  'a','an','the','to','in','is','of','for','into','how','many',
  'much','what','convert','from','are','does','between','and','or',
  'i','my','do','get','make','use','with','at','by','as','on',
  // Time units used as connectors (e.g. "miles per hour")
  'per','hour','hours','minute','minutes','second','seconds',
  // Generic SEO filler words that don't change the topic
  'conversion','converting','converted','converts',
  'guide','guides','calculator','calculate','calculation','calculations',
  'chart','charts','table','tables','formula','formulas',
  'complete','quick','easy','simple','free','online','fast',
  'exact','accurate','official','standard','reference',
  'vs','versus','compared','comparison','difference',
  'step','steps','way','ways','method','methods',
  'learn','know','find','check','see','understand',
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

function getUnsplashPhoto(query, accessKey, usedPhotoIds = new Set()) {
  return new Promise((resolve) => {
    // Curated high-res unique backup photos across multiple domains
    const fallbackList = [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80'
    ];

    function pickFallback() {
      for (const fb of fallbackList) {
        const idMatch = fb.match(/photo-([a-zA-Z0-9_-]+)/);
        const id = idMatch ? idMatch[1] : fb;
        if (!usedPhotoIds.has(id)) {
          return fb;
        }
      }
      return fallbackList[0];
    }

    if (!accessKey) return resolve(pickFallback());

    // Request up to 10 photos per query so we have choices if top results were already used
    const searchUrl = `https://api.unsplash.com/search/photos?page=1&per_page=10&query=${encodeURIComponent(query)}&client_id=${accessKey}`;
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            // Find the first result whose ID hasn't been used in any existing article
            for (const item of parsed.results) {
              const photoId = item.id;
              const photoUrl = item.urls && (item.urls.regular || item.urls.full);
              if (photoUrl) {
                const idMatch = photoUrl.match(/photo-([a-zA-Z0-9_-]+)/);
                const extractedId = idMatch ? idMatch[1] : photoId;
                if (!usedPhotoIds.has(photoId) && !usedPhotoIds.has(extractedId)) {
                  console.log(`[OK] Selected unique Unsplash photo ID: ${photoId}`);
                  return resolve(photoUrl);
                }
              }
            }
            console.warn('[Notice] All top Unsplash results for this query were already used on the site. Using unused fallback.');
          }
        } catch (e) {}
        resolve(pickFallback());
      });
    }).on('error', () => resolve(pickFallback()));
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

    // Extract true permanent publication date from article metadata
    const metaDateMatch = raw.match(/<meta\s+name="article:published_time"\s+content="([^"]+)"/i);
    const jsonLdDateMatch = raw.match(/"datePublished":\s*"([^"]+)"/);
    const pubDate = (metaDateMatch && metaDateMatch[1]) || (jsonLdDateMatch && jsonLdDateMatch[1]) || today;

    const imgMatch = raw.match(/<img[^>]+src="(https:\/\/images\.unsplash[^"]+)"/i);
    const image = imgMatch
      ? imgMatch[1]
      : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';

    const articleMatch = raw.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    const content = articleMatch ? articleMatch[1].trim() : '';

    // Automatically determine topic category based on slug and title
    const s = slug.toLowerCase();
    const t = fullTitle.toLowerCase();
    let category = "Conversion Guide";
    let icon = "📊";

    if (s.includes('cup') || s.includes('tsp') || s.includes('tbsp') || s.includes('milk') || s.includes('baking') || t.includes('culinary') || t.includes('kitchen')) {
      category = "Kitchen & Culinary";
      icon = "🍳";
    } else if (s.includes('usd') || s.includes('aud') || s.includes('vnd') || s.includes('gbp') || s.includes('won') || s.includes('cu') || s.includes('currency') || s.includes('forex')) {
      category = "Currency & Forex";
      icon = "💱";
    } else if (s.includes('kg') || s.includes('lbs') || s.includes('stone') || s.includes('gram') || s.includes('weight') || s.includes('mass') || t.includes('weight') || t.includes('mass')) {
      category = "Weight & Mass";
      icon = "⚖️";
    } else if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || t.includes('celsius') || t.includes('fahrenheit')) {
      category = "Temperature & Cooking";
      icon = "🌡️";
    } else if (s.includes('gallon') || s.includes('litres') || s.includes('liter') || s.includes('ml') || s.includes('bar-to-psi') || s.includes('volume') || t.includes('volume') || t.includes('pressure')) {
      category = "Volume & Geometry";
      icon = "🧪";
    } else if (s.includes('mph') || s.includes('kmh') || s.includes('speed') || s.includes('velocity')) {
      category = "Product & Tech";
      icon = "⚡";
    } else if (s.includes('file') || s.includes('format') || s.includes('media')) {
      category = "File & Media Tools";
      icon = "📁";
    }

    return { slug, fullTitle, summary, pubDate, image, content, category, icon };
  }).sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const postsJs = posts.map(p => `  {
    "id": ${JSON.stringify(p.slug)},
    "slug": ${JSON.stringify(p.slug)},
    "title": ${JSON.stringify(p.fullTitle)},
    "date": ${JSON.stringify(p.pubDate)},
    "publicationDate": ${JSON.stringify(p.pubDate)},
    "category": ${JSON.stringify(p.category)},
    "author": "OmniConverter Editorial Team",
    "readTime": "4 min read",
    "icon": ${JSON.stringify(p.icon)},
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
    .map(p => `  <url><loc>https://www.omniconverter.co.uk/blog/${p.slug}</loc><lastmod>${p.pubDate}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
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

  // Update sitemap.html blog list if file exists
  if (fs.existsSync('sitemap.html')) {
    try {
      let sitemapHtml = fs.readFileSync('sitemap.html', 'utf8');
      const blogListHtml = posts.map(p => `        <li><a href="/blog/${p.slug}" style="color:var(--primary-600); font-weight:600;">${p.fullTitle}</a></li>`).join('\n');
      sitemapHtml = sitemapHtml.replace(
        /<h2>3\. Blog &.*?<\/h2>[\s\S]*?<\/ul>/i,
        `<h2>3. Blog & Conversion Guides</h2>\n      <ul style="margin-left:1.5rem; margin-bottom:1.5rem; line-height:1.8;">\n        <li><a href="/blog" style="color:var(--primary-600); font-weight:700;">OmniConverter Blog Hub</a></li>\n${blogListHtml}\n      </ul>`
      );
      fs.writeFileSync('sitemap.html', sitemapHtml, 'utf8');
      console.log(`[OK] sitemap.html synchronized with ${posts.length} articles.`);
    } catch (e) {
      console.warn(`Could not sync sitemap.html: ${e.message}`);
    }
  }

  // Update feed.xml RSS for Google News Producer / Publisher Center
  try {
    const feedItems = posts.map(p => {
      const cleanTitle = p.fullTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const cleanSummary = p.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const url = `https://www.omniconverter.co.uk/blog/${p.slug}`;
      const pubDate = new Date().toUTCString();
      return `    <item>
      <title>${cleanTitle}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cleanSummary}</description>
    </item>`;
    }).join('\n');

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OmniConverter Blog &amp; Guides</title>
    <link>https://www.omniconverter.co.uk/blog</link>
    <description>Accurate unit measurement guides, currency exchange rates, culinary conversions, and technology tutorials from OmniConverter.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.omniconverter.co.uk/feed.xml" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>
`;
    fs.writeFileSync('feed.xml', feedXml, 'utf8');
    console.log(`[OK] feed.xml RSS updated for Google News with ${posts.length} articles.`);
  } catch (e) {
    console.warn(`Could not sync feed.xml: ${e.message}`);
  }

  // Update llms.txt AI assistant directory
  try {
    const articlesList = posts.map(p => `- [${p.fullTitle}](https://www.omniconverter.co.uk/blog/${p.slug}): ${p.summary}`).join('\n');
    const llmsContent = `# OmniConverter Web Suite

> OmniConverter is a free, fast, private, zero-dependency, client-side web utility for converting unit measurements (Temperature, Weight & Mass, Volume & Capacity, Time & Duration, Area, Speed) and client-side file media formats (Image, Document, Data).

## Key Features & Capabilities
- **Instant Browser Calculations**: All mathematical unit conversions execute in O(1) time in the user's web browser without server requests.
- **Client-Side Media Conversion**: Convert image formats (PNG, JPEG, WebP, BMP) using HTML5 Canvas & Blob API with 100% data privacy.
- **Document Format Transformation**: Parsing between JSON, CSV, and HTML text formats.
- **Accessibility & SEO**: Semantic HTML5 markup, WCAG AAA contrast ratios, keyboard navigation, and JSON-LD structured data.

## Documentation & Primary Routes
- [/index.html](https://www.omniconverter.co.uk/): Interactive unit converter calculator suite for Temperature, Weight, Volume, Time, Area, and Speed.
- [/temperature](https://www.omniconverter.co.uk/temperature): Temperature Converter (Celsius, Fahrenheit, Kelvin, Rankine, Réaumur).
- [/weight-mass](https://www.omniconverter.co.uk/weight-mass): Weight & Mass Converter (kg, lbs, oz, grams, stones).
- [/volume-capacity](https://www.omniconverter.co.uk/volume-capacity): Volume & Capacity Converter (liters, gallons, cups, ml, fl oz).
- [/time-duration](https://www.omniconverter.co.uk/time-duration): Time & Duration Converter (hours, minutes, seconds, days, weeks).
- [/area](https://www.omniconverter.co.uk/area): Area Converter (square meters, square feet, acres, hectares).
- [/speed](https://www.omniconverter.co.uk/speed): Speed Converter (mph, km/h, knots, m/s).
- [/file-media](https://www.omniconverter.co.uk/file-media): Client-side image and document converter.
- [/blog](https://www.omniconverter.co.uk/blog): Official blog hub and conversion guides.
- [/sitemap.xml](https://www.omniconverter.co.uk/sitemap.xml): XML sitemap for search engines.
- [/feed.xml](https://www.omniconverter.co.uk/feed.xml): RSS 2.0 / Atom feed for Google News.
- [/llms-full.txt](https://www.omniconverter.co.uk/llms-full.txt): Complete, exhaustive technical reference of mathematical pivot formulas and unit definitions.

## Published Articles & Guides Directory (${posts.length} Articles)
${articlesList}

## Core Conversion Formulas Summary

### Temperature
- **Celsius to Fahrenheit**: °F = (°C × 9/5) + 32
- **Fahrenheit to Celsius**: °C = (°F − 32) × 5/9

### Area (Pivot: Square Meters m²)
- **1 Square Kilometer (km²)** = 1,000,000 Square Meters (m²)
- **1 Hectare (ha)** = 10,000 Square Meters (m²)
- **1 Acre (ac)** = 43,560 Square Feet (ft²)

### Speed (Pivot: Meters per Second m/s)
- **1 Kilometer per Hour (km/h)** = 0.277778 m/s
- **1 Mile per Hour (mph)** = 0.44704 m/s
- **1 Mach (sea level)** = 343 m/s
`;
    fs.writeFileSync('llms.txt', llmsContent, 'utf8');
    console.log(`[OK] llms.txt synchronized with ${posts.length} articles.`);
  } catch (e) {
    console.warn(`Could not sync llms.txt: ${e.message}`);
  }
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

  // 2. Anti-cannibalization with Random Selection
  const publishedFiles = fs.readdirSync('blog')
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
  console.log(`Published articles: ${publishedFiles.length}`);

  const publishedSlugs = new Set(publishedFiles);
  const publishedSignatures = new Set(
    publishedFiles.map(f => getTopicSignature(f.replace(/-/g, ' ')))
  );

  // Filter all eligible keywords that pass anti-cannibalization
  const eligibleTargets = [];
  for (const rawKw of rawKeywords) {
    const slug = slugify(rawKw);
    const sig = getTopicSignature(rawKw);
    if (!publishedSlugs.has(slug) && !publishedSignatures.has(sig)) {
      eligibleTargets.push({ rawKw, slug });
    }
  }

  console.log(`Found ${eligibleTargets.length} eligible unpublished keyword candidates.`);

  if (eligibleTargets.length === 0) {
    console.log('All keywords already covered or cannibalized. Nothing to publish.');
    return;
  }

  // Pick a random keyword from eligible candidates
  const randomIndex = Math.floor(Math.random() * eligibleTargets.length);
  const selectedTarget = eligibleTargets[randomIndex];
  console.log(`[OK] Selected: "${selectedTarget.rawKw}" -> ${selectedTarget.slug}`);

  // Collect all currently used Unsplash photo IDs from published articles
  const usedPhotoIds = new Set();
  publishedFiles.forEach(f => {
    try {
      const content = fs.readFileSync(path.join('blog', `${f}.html`), 'utf8');
      const matches = content.matchAll(/<img[^>]+src="([^"]+)"/gi);
      for (const m of matches) {
        if (m[1] && m[1].includes('unsplash.com')) {
          const photoIdMatch = m[1].match(/photo-([a-zA-Z0-9_-]+)/);
          if (photoIdMatch) usedPhotoIds.add(photoIdMatch[1]);
        }
      }
    } catch (e) {}
  });
  console.log(`Tracked ${usedPhotoIds.size} already-used Unsplash photo IDs to prevent duplicate image reuse.`);

  // 3. Unsplash photo (guaranteed unique)
  const imageUrl = await getUnsplashPhoto(selectedTarget.rawKw, unsplashKey, usedPhotoIds);
  console.log(`[OK] Unique photo fetched: ${imageUrl.substring(0, 60)}...`);

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

  // Detect appropriate converter tool link based on keyword
  let toolLink = '/';
  let toolTitle = 'OmniConverter Universal Conversion Tools Suite';
  let toolDesc = 'Perform instant weight, volume, temperature, duration, speed, and unit conversions with zero ads or tracking.';
  let toolBtnText = 'Explore All Converters &rarr;';

  const kwLower = selectedTarget.rawKw.toLowerCase();
  if (kwLower.includes('fahrenheit') || kwLower.includes('celsius') || kwLower.includes('kelvin') || kwLower.includes('temperature')) {
    toolLink = '/temperature';
    toolTitle = 'Interactive Temperature & Heat Unit Converter';
    toolDesc = 'Convert Fahrenheit, Celsius, Kelvin, and Rankine with instant thermodynamic formulas and live calculations.';
    toolBtnText = 'Open Temperature Converter &rarr;';
  } else if (kwLower.includes('kg') || kwLower.includes('pound') || kwLower.includes('lbs') || kwLower.includes('gram') || kwLower.includes('ounce') || kwLower.includes('stone') || kwLower.includes('weight') || kwLower.includes('mass')) {
    toolLink = '/weight-mass';
    toolTitle = 'Interactive Weight & Mass Converter Calculator';
    toolDesc = 'Convert kilograms, pounds, ounces, stones, and grams instantly with verified conversion ratios.';
    toolBtnText = 'Open Weight & Mass Converter &rarr;';
  } else if (kwLower.includes('cup') || kwLower.includes('liter') || kwLower.includes('litre') || kwLower.includes('ml') || kwLower.includes('gallon') || kwLower.includes('tsp') || kwLower.includes('tbsp') || kwLower.includes('volume')) {
    toolLink = '/volume-capacity';
    toolTitle = 'Interactive Kitchen Volume & Mass Converter';
    toolDesc = 'Switch between cups, grams, milliliters, fluid ounces, and kilograms instantly with our live calculator.';
    toolBtnText = 'Open Volume Converter &rarr;';
  } else if (kwLower.includes('mph') || kwLower.includes('kmh') || kwLower.includes('speed') || kwLower.includes('knot') || kwLower.includes('velocity')) {
    toolLink = '/speed';
    toolTitle = 'Interactive Speed & Velocity Converter Calculator';
    toolDesc = 'Convert miles per hour, kilometers per hour, knots, and meters per second instantly with real-time speed formulas.';
    toolBtnText = 'Open Speed Converter &rarr;';
  } else if (kwLower.includes('hour') || kwLower.includes('minute') || kwLower.includes('second') || kwLower.includes('time') || kwLower.includes('day')) {
    toolLink = '/time-duration';
    toolTitle = 'Interactive Time & Duration Converter Calculator';
    toolDesc = 'Convert hours, minutes, seconds, milliseconds, days, and weeks accurately.';
    toolBtnText = 'Open Time Converter &rarr;';
  } else if (kwLower.includes('area') || kwLower.includes('acre') || kwLower.includes('hectare') || kwLower.includes('sq ft') || kwLower.includes('square')) {
    toolLink = '/area';
    toolTitle = 'Interactive Area & Land Measure Converter';
    toolDesc = 'Convert square feet, square meters, acres, hectares, and square kilometers with live precision.';
    toolBtnText = 'Open Area Converter &rarr;';
  }

  const toolCalloutHtml = `
      <!-- Relevant Interactive Converter Callout Box -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08)); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin: 1.75rem 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div style="max-width: 680px;">
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; color: var(--text-main); font-weight: 800;">${toolTitle}</h3>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">${toolDesc}</p>
        </div>
        <a href="${toolLink}" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">${toolBtnText}</a>
      </div>`;

  // Select 3-4 other published articles for cross-linking
  const otherArticles = publishedFiles.filter(f => f !== selectedTarget.slug).slice(0, 4);
  const crossLinksHtml = otherArticles.length > 0 ? `
    <!-- CROSS_LINKS_BLOCK -->
    <div style="margin:2rem 0; padding:1.25rem 1.5rem; background:var(--bg-elevated); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
      <p style="color:var(--text-muted); font-size:0.95rem; margin:0;">
        <strong>Related Conversion Guides:</strong> 
        ${otherArticles.map(s => `<a href="/blog/${s}" style="color:var(--primary-600); font-weight:600; margin:0 0.5rem;">${s.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}</a>`).join(' &bull; ')}
      </p>
    </div>` : '';

  // Inject tool callout box after the quick summary box or first heading
  if (articleBodyHtml.includes('</div>')) {
    const firstDivClose = articleBodyHtml.indexOf('</div>') + 6;
    articleBodyHtml = articleBodyHtml.slice(0, firstDivClose) + '\n' + toolCalloutHtml + '\n' + articleBodyHtml.slice(firstDivClose);
  } else {
    articleBodyHtml = toolCalloutHtml + '\n' + articleBodyHtml;
  }

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
  <meta name="article:published_time" content="${today}">
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
    ${crossLinksHtml}
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

module.exports = { rebuildBlogData, main };

if (require.main === module) {
  main().catch(err => {
    console.error('Execution Error:', err.message || String(err));
    process.exit(1);
  });
}
