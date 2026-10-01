/**
 * OmniConverter Auto-Publisher — Complete Permanent Rewrite
 * Fixes: missing rebuild_blog_data.js, stale model names, variable scope errors,
 * header row keyword injection, and all runtime crashes.
 */

const { GoogleGenAI } = require('@google/genai');
let google = null;
try {
  google = require('googleapis').google;
} catch (e) {
  // Optional on environments without googleapis installed
}
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Global Date & Year - available across all functions and template scopes permanently
const today = new Date().toISOString().split('T')[0];
const year = new Date().getFullYear();

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function sanitizeLatexMath(text) {
  if (!text) return text;
  let s = text;
  // Convert fractions \frac{a}{b} -> (a / b)
  while (/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/.test(s)) {
    s = s.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1 / $2)');
  }
  // Convert delimiters
  s = s.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  // Convert formatting
  s = s.replace(/\\mathbf\s*\{([^{}]+)\}/g, '<strong>$1</strong>');
  s = s.replace(/\\text\s*\{([^{}]+)\}/g, '$1');
  // Convert symbols
  s = s.replace(/\\times\b/g, '×');
  s = s.replace(/\\div\b/g, '÷');
  s = s.replace(/\\approx\b/g, '≈');
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\cdot\b/g, '·');
  s = s.replace(/\\thrice\b/g, '×');
  s = s.replace(/\\Delta\b/g, 'Δ');
  // Subscripts & Superscripts inside formulas
  s = s.replace(/([A-Za-z0-9])_\{([^{}]+)\}/g, '$1<sub>$2</sub>');
  s = s.replace(/([A-Za-z0-9])\^\{([^{}]+)\}/g, '$1<sup>$2</sup>');
  s = s.replace(/([A-Za-z0-9])\^([0-9]+)/g, '$1<sup>$2</sup>');
  // Strip LaTeX math delimiters $$...$$ and \( \)
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  s = s.replace(/\\\(/g, '').replace(/\\\)/g, '');
  // Strip inline $...$ wrappers if they wrap math formulas
  s = s.replace(/\$([^\$\n]+?)\$/g, (m, p1) => {
    if (/^\d[\d,\.]*$/.test(p1.trim())) return `$${p1}`;
    return p1;
  });
  s = s.replace(/\\\$/g, '$');

  // Convert any accidental "— Error: +0.2%" into positive accuracy phrases
  s = s.replace(/—\s*Error:\s*(\+|-)?(\d+(?:\.\d+)?%)/gi, (m, sign, pct) => {
    const num = parseFloat(pct);
    const acc = (100 - num).toFixed(1).replace(/\.0$/, '');
    return `, ${acc}% accurate`;
  });
  s = s.replace(/<em>The Error:<\/em>/g, '<em>The Common Mistake:</em>');

  return s;
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
  let s = text.toLowerCase();
  s = s.replace(/[\/\\_-]/g, ' ');
  s = s.replace(/[^a-z0-9\s]/g, ' ');

  // Separate numbers from letters (e.g. 170lbs -> 170 lbs, 100f -> 100 f, 1/3 -> 1 3)
  s = s.replace(/([0-9]+)([a-z]+)/g, '$1 $2').replace(/([a-z]+)([0-9]+)/g, '$1 $2');

  // Strip filler words, articles, and generic converter suffixes
  s = s.replace(/\b(a|an|the|of|for|to|in|into|is|as|at|by|per|from|and|or|how|many|much|what|is what|equal|equals|conversion|converter|calculator|calculate|converting|converted|guide|steps|formula|difference|today|now)\b/g, ' ');

  // Standardize number words
  s = s.replace(/\bone\b/g, '1')
       .replace(/\btwo\b/g, '2')
       .replace(/\bthree\b/g, '3')
       .replace(/\bfour\b/g, '4')
       .replace(/\bfive\b/g, '5')
       .replace(/\bsix\b/g, '6')
       .replace(/\bseven\b/g, '7')
       .replace(/\beight\b/g, '8')
       .replace(/\bnine\b/g, '9')
       .replace(/\bten\b/g, '10')
       .replace(/\bhalf\b/g, '1 2')
       .replace(/\bquarter\b/g, '1 4')
       .replace(/\bthird\b/g, '3');

  // Standardize units & currencies
  const unitMap = [
    [/\b(fahrenheit|deg f|degrees f|degree f)\b/g, 'f'],
    [/\b(celsius|centigrade|celcius|deg c|degrees c|degree c)\b/g, 'c'],
    [/\b(kilograms|kilogram|kilos|kilo)\b/g, 'kg'],
    [/\b(pounds|pound|lbs|lb)\b/g, 'lbs'],
    [/\b(stones|stone|st)\b/g, 'stone'],
    [/\b(grams|gram|g)\b/g, 'g'],
    [/\b(ounces|ounce|oz)\b/g, 'oz'],
    [/\b(milliliters|milliliter|millilitres|millilitre)\b/g, 'ml'],
    [/\b(liters|liter|litres|litre|l)\b/g, 'liters'],
    [/\b(quarts|quart|qt)\b/g, 'quart'],
    [/\b(gallons|gallon|gal)\b/g, 'gallon'],
    [/\b(cups|cup)\b/g, 'cup'],
    [/\b(teaspoons|teaspoon|tsp)\b/g, 'tsp'],
    [/\b(tablespoons|tablespoon|tbsp)\b/g, 'tbsp'],
    [/\b(fluid ounces|fluid ounce|fl oz)\b/g, 'fl oz'],
    [/\b(meters|meter|metres|metre|mtr|m)\b/g, 'meter'],
    [/\b(centimeters|centimeter|centimetres|centimetre)\b/g, 'cm'],
    [/\b(millimeters|millimeter|millimetres|millimetre)\b/g, 'mm'],
    [/\b(inches|inch|in)\b/g, 'inch'],
    [/\b(feet|foot|ft)\b/g, 'feet'],
    [/\b(yards|yard|yd)\b/g, 'yard'],
    [/\b(miles|mile)\b/g, 'miles'],
    [/\b(kilometers|kilometer|kilometres|kilometre|km)\b/g, 'km'],
    [/\b(miles per hour)\b/g, 'mph'],
    [/\b(kilometers per hour)\b/g, 'kmh'],
    [/\b(pounds per square inch)\b/g, 'psi'],
    [/\b(bars|bar)\b/g, 'bar'],
    [/\b(australian dollars|australian dollar|aussie dollar|aussie dollars)\b/g, 'aud'],
    [/\b(us dollars|us dollar|american dollar|american dollars|dollars|dollar)\b/g, 'usd'],
    [/\b(british pounds|british pound|pound sterling|pounds sterling)\b/g, 'gbp'],
    [/\b(korean won|krw)\b/g, 'won'],
    [/\b(turkish lira|try)\b/g, 'lira'],
    [/\b(indonesian rupiah|idr)\b/g, 'rupiah'],
    [/\b(japanese yen|jpy)\b/g, 'yen'],
    [/\b(euros|euro)\b/g, 'eur'],
    [/\b(canadian dollars|canadian dollar)\b/g, 'cad'],
    [/\b(egyptian pounds|egyptian pound)\b/g, 'egp'],
    [/\b(time zones|time zone|timezones|timezone)\b/g, 'timezone']
  ];

  for (const [pattern, replacement] of unitMap) {
    s = s.replace(pattern, replacement);
  }

  // Tokenize, sort, dedupe
  const tokens = [...new Set(s.split(/\s+/).filter(t => t.length > 0))].sort();
  return tokens.join('-');
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
    } else if (s.includes('meter') || s.includes('inch') || s.includes('feet') || s.includes('foot') || s.includes('cm') || s.includes('mm') || s.includes('yard') || s.includes('length') || s.includes('height')) {
      category = "Length & Distance";
      icon = "📏";
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
  <url><loc>https://www.omniconverter.co.uk/currency</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.omniconverter.co.uk/length</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
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

  // Update blog.html static links block so search engines discover all articles directly in raw HTML
  if (fs.existsSync('blog.html')) {
    try {
      let blogHtml = fs.readFileSync('blog.html', 'utf8');
      const staticListHtml = posts.map(p => `        <li><a href="/blog/${p.slug}" style="color:var(--primary-600); font-weight:600;">${p.fullTitle}</a></li>`).join('\n');
      blogHtml = blogHtml.replace(
        /<!-- ORPHAN_LINKS_BLOCK -->[\s\S]*?<\/section>/i,
        `<!-- ORPHAN_LINKS_BLOCK -->\n    <section class="content-section" style="margin-top:2rem;">\n      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">Complete Directory of Conversion Guides (${posts.length} Guides)</h2>\n      <ul style="line-height:1.9; color:var(--text-muted); padding-left:1.5rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:0.4rem;">\n${staticListHtml}\n      </ul>\n    </section>`
      );
      fs.writeFileSync('blog.html', blogHtml, 'utf8');
      console.log(`[OK] blog.html synchronized with ${posts.length} static links.`);
    } catch (e) {
      console.warn(`Could not sync blog.html: ${e.message}`);
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

  // Generate official Google News Sitemap (news-sitemap.xml) for articles published in the last 48 hours
  try {
    const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
    // Filter posts from last 48 hours, or at least the 3 most recent articles
    let recentNewsPosts = posts.filter(p => new Date(p.pubDate).getTime() >= twoDaysAgo);
    if (recentNewsPosts.length === 0) {
      recentNewsPosts = posts.slice(0, 3);
    }

    const newsEntries = recentNewsPosts.map(p => {
      const cleanTitle = p.fullTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const pubDateIso = new Date(p.pubDate).toISOString().split('T')[0];
      return `  <url>
    <loc>https://www.omniconverter.co.uk/blog/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>OmniConverter</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDateIso}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
    </news:news>
  </url>`;
    }).join('\n');

    const newsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries}
</urlset>
`;
    fs.writeFileSync('news-sitemap.xml', newsSitemapXml, 'utf8');
    console.log(`[OK] news-sitemap.xml synchronized with ${recentNewsPosts.length} articles for Google News.`);
  } catch (e) {
    console.warn(`Could not sync news-sitemap.xml: ${e.message}`);
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
- [/currency](https://www.omniconverter.co.uk/currency): Currency Converter & Forex Calculator (USD, AUD, EUR, GBP, CAD, JPY, and 35+ currencies).
- [/length](https://www.omniconverter.co.uk/length): Length & Distance Converter (meters, feet, inches, cm, mm, yards, height).
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

// ─── INTERACTIVE IN-PAGE CONVERTER GENERATOR ──────────────────────────────────
function getInteractiveWidget(rawKw, category, toolLink) {
  const kw = rawKw.toLowerCase();
  let units = [];
  let defaultFrom = '';
  let defaultTo = '';
  let defaultVal = '1';

  const numMatch = kw.match(/\b(\d+(?:\.\d+)?)\b/);
  if (numMatch) {
    defaultVal = numMatch[1];
  }

  if (kw.includes('fahrenheit') || kw.includes('celsius') || kw.includes('kelvin') || category.toLowerCase().includes('temperature')) {
    units = [
      { id: 'F', name: 'Fahrenheit (°F)' },
      { id: 'C', name: 'Celsius (°C)' },
      { id: 'K', name: 'Kelvin (K)' },
      { id: 'R', name: 'Rankine (°R)' }
    ];
    defaultFrom = kw.includes('celsius') && !kw.startsWith('fahrenheit') ? 'C' : 'F';
    defaultTo = defaultFrom === 'F' ? 'C' : 'F';
    if (!numMatch) defaultVal = '50';
  } else if (kw.includes('kg') || kw.includes('pound') || kw.includes('lbs') || kw.includes('gram') || kw.includes('ounce') || kw.includes('stone') || category.toLowerCase().includes('weight')) {
    units = [
      { id: 'kg', name: 'Kilograms (kg)' },
      { id: 'lb', name: 'Pounds (lbs)' },
      { id: 'oz', name: 'Ounces (oz)' },
      { id: 'g', name: 'Grams (g)' },
      { id: 'st', name: 'Stones (st)' }
    ];
    defaultFrom = (kw.includes('pound') || kw.includes('lbs')) ? 'lb' : 'kg';
    defaultTo = defaultFrom === 'kg' ? 'lb' : 'kg';
    if (!numMatch) defaultVal = '100';
  } else if (kw.includes('cup') || kw.includes('liter') || kw.includes('litre') || kw.includes('ml') || kw.includes('gallon') || category.toLowerCase().includes('volume')) {
    units = [
      { id: 'ml', name: 'Milliliters (mL)' },
      { id: 'l', name: 'Liters (L)' },
      { id: 'cup', name: 'US Cups (cup)' },
      { id: 'gal', name: 'US Gallons (gal)' },
      { id: 'floz', name: 'Fluid Ounces (fl oz)' },
      { id: 'tbsp', name: 'Tablespoons (tbsp)' },
      { id: 'tsp', name: 'Teaspoons (tsp)' }
    ];
    defaultFrom = kw.includes('cup') ? 'cup' : (kw.includes('liter') || kw.includes('litre') ? 'l' : 'ml');
    defaultTo = defaultFrom === 'ml' ? 'cup' : 'ml';
    if (!numMatch) defaultVal = '500';
  } else if (kw.includes('mph') || kw.includes('kmh') || kw.includes('knot') || category.toLowerCase().includes('speed')) {
    units = [
      { id: 'mph', name: 'Miles per hour (mph)' },
      { id: 'kmh', name: 'Kilometers per hour (km/h)' },
      { id: 'ms', name: 'Meters per second (m/s)' },
      { id: 'knot', name: 'Knots (kn)' }
    ];
    defaultFrom = kw.includes('mph') ? 'mph' : 'kmh';
    defaultTo = defaultFrom === 'kmh' ? 'mph' : 'kmh';
    if (!numMatch) defaultVal = '100';
  } else if (kw.includes('meter') || kw.includes('feet') || kw.includes('foot') || kw.includes('inch') || kw.includes('cm') || kw.includes('mile') || category.toLowerCase().includes('length')) {
    units = [
      { id: 'm', name: 'Meters (m)' },
      { id: 'km', name: 'Kilometers (km)' },
      { id: 'ft', name: 'Feet (ft)' },
      { id: 'in', name: 'Inches (in)' },
      { id: 'cm', name: 'Centimeters (cm)' },
      { id: 'mm', name: 'Millimeters (mm)' },
      { id: 'yd', name: 'Yards (yd)' },
      { id: 'mi', name: 'Miles (mi)' }
    ];
    defaultFrom = (kw.includes('feet') || kw.includes('foot')) ? 'ft' : (kw.includes('inch') ? 'in' : 'm');
    defaultTo = defaultFrom === 'm' ? 'ft' : 'm';
    if (!numMatch) defaultVal = '10';
  } else if (kw.includes('hour') || kw.includes('minute') || kw.includes('second') || category.toLowerCase().includes('time')) {
    units = [
      { id: 'hr', name: 'Hours (hr)' },
      { id: 'min', name: 'Minutes (min)' },
      { id: 'sec', name: 'Seconds (sec)' },
      { id: 'day', name: 'Days (day)' }
    ];
    defaultFrom = kw.includes('hour') ? 'hr' : 'min';
    defaultTo = defaultFrom === 'hr' ? 'min' : 'hr';
    if (!numMatch) defaultVal = '24';
  } else if (kw.includes('usd') || kw.includes('aud') || kw.includes('vnd') || kw.includes('gbp') || kw.includes('won') || kw.includes('rupiah') || kw.includes('currency') || kw.includes('forex') || category.toLowerCase().includes('currency')) {
    units = [
      { id: 'USD', name: 'US Dollar ($)' },
      { id: 'AUD', name: 'Australian Dollar (A$)' },
      { id: 'EUR', name: 'Euro (€)' },
      { id: 'GBP', name: 'British Pound (£)' },
      { id: 'CAD', name: 'Canadian Dollar (C$)' },
      { id: 'JPY', name: 'Japanese Yen (¥)' },
      { id: 'INR', name: 'Indian Rupee (₹)' },
      { id: 'VND', name: 'Vietnamese Dong (₫)' }
    ];
    defaultFrom = kw.includes('aud') && !kw.includes('to aud') ? 'AUD' : (kw.includes('gbp') ? 'GBP' : (kw.includes('eur') ? 'EUR' : 'USD'));
    defaultTo = defaultFrom === 'USD' ? (kw.includes('aud') ? 'AUD' : (kw.includes('gbp') ? 'GBP' : 'EUR')) : 'USD';
    if (!numMatch) defaultVal = '5';
  } else {
    units = [
      { id: 'sqm', name: 'Square Meters (m²)' },
      { id: 'sqft', name: 'Square Feet (sq ft)' },
      { id: 'acre', name: 'Acres (ac)' },
      { id: 'ha', name: 'Hectares (ha)' }
    ];
    defaultFrom = 'sqm';
    defaultTo = 'sqft';
    if (!numMatch) defaultVal = '100';
  }

  const widgetHtml = `
      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Live In-Page Conversion Calculator</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Instant Calculation</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Type any number below to calculate instant results with certified conversion ratios:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="${defaultVal}" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${units.map(u => `<option value="${u.id}" ${u.id === defaultFrom ? 'selected' : ''}>${u.name}</option>`).join('\n              ')}
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${units.map(u => `<option value="${u.id}" ${u.id === defaultTo ? 'selected' : ''}>${u.name}</option>`).join('\n              ')}
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">--</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Live formula calculation</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
        </div>
      </div>`;

  const widgetScript = `
  <script>
  (function() {
    const input = document.getElementById('liveToolInput');
    const fromSel = document.getElementById('liveToolFromUnit');
    const toSel = document.getElementById('liveToolToUnit');
    const swapBtn = document.getElementById('liveToolSwapBtn');
    const resVal = document.getElementById('liveToolResultVal');
    const formulaText = document.getElementById('liveToolFormulaText');
    const copyBtn = document.getElementById('liveToolCopyBtn');

    const rates = {
      g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125, st: 6350.29318,
      ml: 1, l: 1000, cup: 236.5882365, gal: 3785.411784, floz: 29.5735295625, tbsp: 14.78676478125, tsp: 4.92892159375,
      m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,
      kmh: 1, mph: 1.609344, ms: 3.6, knot: 1.852,
      sec: 1, min: 60, hr: 3600, day: 86400,
      sqm: 1, sqft: 0.09290304, acre: 4046.8564224, ha: 10000
    };

    function convertTemp(val, from, to) {
      let k;
      if (from === 'C') k = val + 273.15;
      else if (from === 'F') k = (val - 32) * 5/9 + 273.15;
      else if (from === 'K') k = val;
      else if (from === 'R') k = val * 5/9;

      if (to === 'C') return k - 273.15;
      if (to === 'F') return (k - 273.15) * 9/5 + 32;
      if (to === 'K') return k;
      if (to === 'R') return k * 9/5;
      return k;
    }

    function calculate() {
      if (!input || !resVal || !formulaText) return;
      const val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      const from = fromSel ? fromSel.value : '';
      const to = toSel ? toSel.value : '';

      let result;
      if (['F','C','K','R'].includes(from) && ['F','C','K','R'].includes(to)) {
        result = convertTemp(val, from, to);
        formulaText.textContent = val + ' ' + from + ' = ' + result.toFixed(2) + ' ' + to;
      } else if (['USD','AUD','EUR','GBP','CAD','JPY','INR','VND'].includes(from) && ['USD','AUD','EUR','GBP','CAD','JPY','INR','VND'].includes(to)) {
        const fx = { USD: 1, AUD: 1.4258, EUR: 0.8784, GBP: 0.7556, CAD: 1.4149, JPY: 157.49, INR: 95.93, VND: 25936.55 };
        const rate = fx[to] / fx[from];
        result = val * rate;
        formulaText.textContent = '1 ' + from + ' = ' + (rate >= 1 ? rate.toFixed(4) : rate.toPrecision(4)) + ' ' + to;
      } else if (rates[from] && rates[to]) {
        const inBase = val * rates[from];
        result = inBase / rates[to];
        formulaText.textContent = val + ' ' + from + ' × (' + rates[from] + ' / ' + rates[to] + ') = ' + result.toFixed(4) + ' ' + to;
      } else {
        result = val;
        formulaText.textContent = val + ' ' + from + ' = ' + result + ' ' + to;
      }

      const formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(2) : result.toFixed(4));
      resVal.textContent = formatted + ' ' + to;
    }

    if (input && fromSel && toSel) {
      input.addEventListener('input', calculate);
      fromSel.addEventListener('change', calculate);
      toSel.addEventListener('change', calculate);
    }

    if (swapBtn) {
      swapBtn.addEventListener('click', function() {
        const temp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = temp;
        calculate();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(resVal.textContent);
          const orig = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyBtn.textContent = orig; }, 2000);
        } catch(e) {}
      });
    }

    calculate();
  })();
  </script>`;

  return { widgetHtml, widgetScript };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== OmniConverter Auto-Publisher ===');

  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();

  const apiKey = process.env.GEMINI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is missing.');
    process.exit(1);
  }

// ─── CSV KEYWORD PLAN PARSER ──────────────────────────────────────────────────

function parseKeywordPlanCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headerLine = lines[0];
  const isMultiColumn = headerLine.includes(',') && (
    headerLine.toLowerCase().includes('canonical') || 
    headerLine.toLowerCase().includes('content_type') || 
    headerLine.toLowerCase().includes('role')
  );

  if (!isMultiColumn) {
    return lines
      .map(l => l.replace(/^"|"$/g, '').trim())
      .filter(l => l.length > 0 && l.toLowerCase() !== 'keyword')
      .map(kw => ({
        rawKw: kw,
        slug: slugify(kw),
        category: null,
        priority: 'P2',
        toolLink: null,
        snippetStrategy: null,
        lsiKeywords: []
      }));
  }

  function parseLine(line) {
    const row = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    row.push(cur.trim());
    return row;
  }

  const rows = lines.slice(1).map(parseLine);
  const clusters = new Map();

  for (const r of rows) {
    if (r.length < 5) continue;
    const [kw, category, cluster, contentType, targetSlug, role, action, intent, priority, toolLink, snippetStrategy] = r;
    const cleanSlug = (targetSlug || '').replace(/^\/blog\//, '').replace(/\.html$/, '').trim() || slugify(kw);
    if (!cleanSlug) continue;

    if (!clusters.has(cleanSlug)) {
      clusters.set(cleanSlug, {
        rawKw: kw,
        slug: cleanSlug,
        category: category || null,
        cluster: cluster || null,
        priority: priority || 'P2',
        toolLink: toolLink ? toolLink.replace('https://www.omniconverter.co.uk', '') : null,
        snippetStrategy: snippetStrategy || null,
        lsiKeywords: []
      });
    }

    if ((contentType && contentType.includes('LSI')) || (role && role.includes('LSI'))) {
      clusters.get(cleanSlug).lsiKeywords.push(kw);
    } else if ((contentType && contentType.includes('High-Priority')) || (role && role.includes('Primary'))) {
      clusters.get(cleanSlug).rawKw = kw;
    }
  }

  return Array.from(clusters.values());
}

  // 1. Load keywords
  const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/1ViVyX1fdyJqIoA-qMoz9-jrPjR-IFHCT/export?format=csv';
  console.log('Fetching keywords from Google Sheet...');

  let targetClusters = [];
  try {
    const csvData = await fetchUrl(sheetCsvUrl);
    targetClusters = parseKeywordPlanCsv(csvData);
    console.log(`Loaded ${targetClusters.length} candidate clusters from Google Sheet.`);
  } catch (e) {
    console.warn(`Sheet fetch failed: ${e.message}`);
  }

  if (targetClusters.length === 0 && fs.existsSync('keywords.csv')) {
    const csvData = fs.readFileSync('keywords.csv', 'utf8');
    targetClusters = parseKeywordPlanCsv(csvData);
    console.log(`Loaded ${targetClusters.length} candidate clusters from local backup.`);
  }

  if (targetClusters.length === 0) {
    console.error('ERROR: No keywords found.');
    process.exit(1);
  }

  // 2. Anti-cannibalization with Priority Selection
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
  for (const target of targetClusters) {
    const slug = target.slug;
    const sig = getTopicSignature(target.rawKw);
    if (!publishedSlugs.has(slug) && !publishedSignatures.has(sig)) {
      eligibleTargets.push(target);
    }
  }

  console.log(`Found ${eligibleTargets.length} eligible unpublished keyword candidates.`);

  if (eligibleTargets.length === 0) {
    console.log('All keywords already covered or cannibalized. Nothing to publish.');
    return;
  }

  // Priority selection: Pick from P1 (High Volume / Quick Win) first if available!
  const p1Candidates = eligibleTargets.filter(t => (t.priority || '').includes('P1'));
  const pool = p1Candidates.length > 0 ? p1Candidates : eligibleTargets;
  console.log(`Selecting candidate from pool of ${pool.length} ${p1Candidates.length > 0 ? 'P1 Quick-Win' : 'eligible'} targets.`);

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedTarget = pool[randomIndex];
  console.log(`[OK] Selected: "${selectedTarget.rawKw}" -> /blog/${selectedTarget.slug} (${selectedTarget.priority})`);
  if (selectedTarget.lsiKeywords && selectedTarget.lsiKeywords.length > 0) {
    console.log(`[LSI] Integrated secondary keywords (${selectedTarget.lsiKeywords.length}): ${selectedTarget.lsiKeywords.join(', ')}`);
  }

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

  const prompt = `You are a world-class technical SEO copywriter and expert mathematician writing an authoritative reference guide for the search query: "${selectedTarget.rawKw}".

Your mission is to definitively rank #1 on Google by performing a comprehensive competitor content gap audit against top competing search results (such as Study.com, Cuemath, RapidTables, Calculator.net, and MetricConversions), and answering every primary, secondary, and semantic intent that competitors leave unanswered.

CRITICAL INSTRUCTIONS & FORMATTING RULES:
1. Return ONLY raw HTML body content starting with an introductory <p> tag. Do NOT include markdown code fences (\`\`\`html).
2. DO NOT include <h1>, <head>, or <body> tags (they are provided by the template).

3. SECTION 1: INTRODUCTION & DIRECT FEATURED SNIPPET ANSWER BOX:
   - Start with 1-2 introductory sentences defining the conversion, its origin systems (metric, US customary, or British imperial), and why people calculate it.
   - IMMEDIATELY follow with this exact Quick Summary Answer box (engineered to capture Google Position 0 / Featured Snippets):
     <div style="background:var(--bg-elevated); border-left:4px solid var(--accent); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
       <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-primary);">Quick Summary Answer</h3>
       <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--text-primary);">
         [Target Query] = [Exact Direct Answer with Unit]
       </p>
       <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-secondary);">
         [Alternative standard units, fractions/decimals, or key benchmark context]
       </p>
     </div>

4. SECTION 2: STEP-BY-STEP MATHEMATICAL FORMULA & CALCULATION:
   - Use <h2>The Exact Mathematical Conversion Formula</h2>.
   - Provide the certified conversion formula in a styled code box:
     <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0;">...</div>
   - Provide clear, numbered step-by-step calculations (<ol> with <li>) showing the arithmetic breakdown.
   - Show BOTH decimal division/multiplication and rational fraction calculation methods where applicable.

5. SECTION 3: TRAVELER'S / RAPID MENTAL MATH SHORTCUT (COMPETITOR GAP #1):
   - Provide a practical mental arithmetic trick or rule-of-thumb that people can calculate in their head without a calculator. State how accurate it is using positive wording (e.g. "99.8% accurate" or "within 0.2% of exact calculation"). NEVER use the phrase "Error:" or "— Error:" as visitors mistake it for a software failure.

6. SECTION 4: COMPREHENSIVE MULTI-POINT CONVERSION REFERENCE TABLE:
   - Use <h2>Comprehensive Conversion Reference Table</h2>.
   - Include an HTML table wrapped in <div class="table-wrapper"><table class="conversion-table">...</table></div>.
   - Map at least 8 to 10 milestone values around the target keyword, with columns for: Input Unit, Converted Unit, Secondary Common Unit, and Practical Real-World Benchmark Context for each row.

7. SECTION 5: REAL-WORLD SENSORY, PRACTICAL OR INDUSTRY CONTEXT (COMPETITOR GAP #2):
   - What does this value mean in practical daily life?
   - If temperature: What does it feel like? What should you wear? Athletic running performance? Cold water shock or food storage danger zones? Thermostat heating savings?
   - If weight/mass: Body weight benchmarks, gym barbell plate standards, airline luggage limits, culinary cooking substitutions?
   - If volume/liquid: Kitchen recipe cups/spoons, baking density differences (water vs milk vs flour), fluid ounce standards?
   - If speed/distance: Highway speed limits, braking stopping distances, walking/running paces, aviation knots?

8. SECTION 6: COMMON CALCULATION MISTAKES & HOW TO AVOID THEM (COMPETITOR GAP #3):
   - Highlight common conversion pitfalls (e.g. confusing US customary vs UK imperial units, rounding errors too early, reversing multiplication and division, fluid oz vs dry weight oz).
   - Label each item "The Common Mistake:" and "The Solution:" (do NOT label it "The Error:").

9. SECTION 7: FREQUENTLY ASKED QUESTIONS (FAQS) (COMPETITOR GAP #4):
   - Use <h2>Frequently Asked Questions (FAQs)</h2>.
   - Container: <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin:1.5rem 0;">
   - Provide 4 to 6 in-depth FAQs addressing real "People Also Ask" search queries.
   - Each FAQ must strictly use <h4> for the question and <p> for the answer.

10. SECTION 8: CONCLUSION:
    - A brief, helpful 2-sentence summary reiterating the conversion ratio and encouraging the reader to bookmark or use the calculator.

11. MANDATORY FORMULA & MATHEMATICAL TYPOGRAPHY RULES:
    - NEVER output raw LaTeX formatting (NO \\frac, NO \\text, NO \\times, NO \\mathbf, NO \\approx, NO $, NO $$).
    - Standard web browsers CANNOT render LaTeX syntax and will display broken code to users.
    - ALWAYS format mathematical formulas and equations using clean Unicode and native semantic HTML:
      * Use '×' (multiplication symbol) for multiplication (e.g. 5 × 100,000).
      * Use '÷' or '/' for division (e.g. 500,000 ÷ 83.50 or (A / B)).
      * Use '≈' for approximation.
      * Use '±' for tolerance.
      * Use <sup> for exponents and powers (e.g. 10<sup>5</sup>).
      * Use <sub> for subscripts (e.g. R<sub>INR/USD</sub>).
      * Use <strong> and <em> for variables and emphasis.

Minimum length: 1,000+ words. Written with absolute authority, clean HTML, and engaging human editorial tone.
${selectedTarget.lsiKeywords && selectedTarget.lsiKeywords.length > 0 ? `
12. MANDATORY LSI & SEMANTIC KEYWORDS TO INTEGRATE:
    You MUST naturally integrate these secondary search queries as H2/H3 subheadings, conversion table entries, or FAQ questions to dominate related search variants:
    ${selectedTarget.lsiKeywords.map(k => `* "${k}"`).join('\n    ')}
` : ''}
${selectedTarget.snippetStrategy ? `
13. FEATURED SNIPPET STRATEGY FOR POSITION #1:
    ${selectedTarget.snippetStrategy}
` : ''}`;

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
  articleBodyHtml = sanitizeLatexMath(articleBodyHtml);

  // 5. Build HTML page
  const title = selectedTarget.rawKw.replace(/\b\w/g, l => l.toUpperCase());

  // Detect appropriate converter tool link based on keyword
  let toolLink = '/';
  let toolTitle = 'OmniConverter Universal Conversion Tools Suite';
  let toolDesc = 'Perform instant weight, volume, temperature, duration, speed, and unit conversions with zero ads or tracking.';
  let toolBtnText = 'Explore All Converters &rarr;';
  let category = 'General Guide';

  const kwLower = selectedTarget.rawKw.toLowerCase();
  if (kwLower.includes('usd') || kwLower.includes('aud') || kwLower.includes('vnd') || kwLower.includes('gbp') || kwLower.includes('won') || kwLower.includes('rupiah') || kwLower.includes('currency') || kwLower.includes('forex') || kwLower.includes('exchange rate') || kwLower.includes('lakh') || kwLower.includes('crore') || kwLower.includes('inr') || kwLower.includes('rupee') || kwLower.includes('pkr') || kwLower.includes('bdt')) {
    toolLink = '/currency';
    category = 'Currency & Forex';
    toolTitle = 'Interactive Real-Time Currency Converter';
    toolDesc = 'Convert USD, AUD, EUR, GBP, CAD, JPY, and 35+ world currencies with live mid-market exchange rates and dynamic conversion tables.';
    toolBtnText = 'Open Currency Converter &rarr;';
  } else if (kwLower.includes('fahrenheit') || kwLower.includes('celsius') || kwLower.includes('kelvin') || kwLower.includes('temperature')) {
    toolLink = '/temperature';
    category = 'Temperature';
    toolTitle = 'Interactive Temperature & Heat Unit Converter';
    toolDesc = 'Convert Fahrenheit, Celsius, Kelvin, and Rankine with instant thermodynamic formulas and live calculations.';
    toolBtnText = 'Open Temperature Converter &rarr;';
  } else if (kwLower.includes('kg') || kwLower.includes('pound') || kwLower.includes('lbs') || kwLower.includes('gram') || kwLower.includes('ounce') || kwLower.includes('stone') || kwLower.includes('weight') || kwLower.includes('mass')) {
    toolLink = '/weight-mass';
    category = 'Weight & Mass';
    toolTitle = 'Interactive Weight & Mass Converter Calculator';
    toolDesc = 'Convert kilograms, pounds, ounces, stones, and grams instantly with verified conversion ratios.';
    toolBtnText = 'Open Weight & Mass Converter &rarr;';
  } else if (kwLower.includes('cup') || kwLower.includes('liter') || kwLower.includes('litre') || kwLower.includes('ml') || kwLower.includes('gallon') || kwLower.includes('tsp') || kwLower.includes('tbsp') || kwLower.includes('volume')) {
    toolLink = '/volume-capacity';
    category = 'Volume & Capacity';
    toolTitle = 'Interactive Kitchen Volume & Mass Converter';
    toolDesc = 'Switch between cups, grams, milliliters, fluid ounces, and kilograms instantly with our live calculator.';
    toolBtnText = 'Open Volume Converter &rarr;';
  } else if (kwLower.includes('mph') || kwLower.includes('kmh') || kwLower.includes('speed') || kwLower.includes('knot') || kwLower.includes('velocity')) {
    toolLink = '/speed';
    category = 'Speed';
    toolTitle = 'Interactive Speed & Velocity Converter Calculator';
    toolDesc = 'Convert miles per hour, kilometers per hour, knots, and meters per second instantly with real-time speed formulas.';
    toolBtnText = 'Open Speed Converter &rarr;';
  } else if (kwLower.includes('hour') || kwLower.includes('minute') || kwLower.includes('second') || kwLower.includes('time') || kwLower.includes('day')) {
    toolLink = '/time-duration';
    category = 'Time & Duration';
    toolTitle = 'Interactive Time & Duration Converter Calculator';
    toolDesc = 'Convert hours, minutes, seconds, milliseconds, days, and weeks accurately.';
    toolBtnText = 'Open Time Converter &rarr;';
  } else if (kwLower.includes('area') || kwLower.includes('acre') || kwLower.includes('hectare') || kwLower.includes('sq ft') || kwLower.includes('square')) {
    toolLink = '/area';
    category = 'Area';
    toolTitle = 'Interactive Area & Land Measure Converter';
    toolDesc = 'Convert square feet, square meters, acres, hectares, and square kilometers with live precision.';
    toolBtnText = 'Open Area Converter &rarr;';
  } else if (kwLower.includes('meter') || kwLower.includes('feet') || kwLower.includes('foot') || kwLower.includes('inch') || kwLower.includes('yard') || kwLower.includes('mile') || kwLower.includes('mm') || kwLower.includes('cm') || kwLower.includes('length') || kwLower.includes('height') || kwLower.includes('distance')) {
    toolLink = '/length';
    category = 'Length & Distance';
    toolTitle = 'Interactive Length & Distance Converter';
    toolDesc = 'Convert meters, feet, inches, centimeters, millimeters, yards, and height measurements instantly with exact formulas.';
  } else if (kwLower.includes('time zone') || kwLower.includes('timezone') || kwLower.includes('gmt') || kwLower.includes('utc') || kwLower.includes('clock') || kwLower.includes('time is') || kwLower.includes('current time')) {
    toolLink = '/time-zone';
    category = 'Time Zone & World Clock';
    toolTitle = 'Interactive Worldwide Time Zone & Clock Converter';
    toolDesc = 'Convert time zones, compare country hours, plan international meetings, and view live world clocks.';
    toolBtnText = 'Open Time Zone Converter &rarr;';
  }

  // Use explicit toolLink and category from keyword plan if available
  if (selectedTarget.toolLink) {
    toolLink = selectedTarget.toolLink;
  }
  if (selectedTarget.category) {
    category = selectedTarget.category;
  }

  // Generate in-page live converter widget
  const { widgetHtml, widgetScript } = getInteractiveWidget(selectedTarget.rawKw, category, toolLink);

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

  // Inject tool callout box and in-page live widget after the quick summary box or first heading
  if (articleBodyHtml.includes('</div>')) {
    const firstDivClose = articleBodyHtml.indexOf('</div>') + 6;
    articleBodyHtml = articleBodyHtml.slice(0, firstDivClose) + '\n' + toolCalloutHtml + '\n' + widgetHtml + '\n' + articleBodyHtml.slice(firstDivClose);
  } else {
    articleBodyHtml = toolCalloutHtml + '\n' + widgetHtml + '\n' + articleBodyHtml;
  }

  // Extract FAQs for Schema.org FAQPage
  const faqList = [];
  const faqRegex = /<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let fMatch;
  while ((fMatch = faqRegex.exec(articleBodyHtml)) !== null) {
    const q = fMatch[1].replace(/<[^>]+>/g, '').trim();
    const a = fMatch[2].replace(/<[^>]+>/g, '').trim();
    if (q && a) {
      faqList.push({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      });
    }
  }

  const jsonLdSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": `Comprehensive conversion guide for ${selectedTarget.rawKw} with formulas, tables, mental math shortcuts, and interactive calculator.`,
      "url": `https://www.omniconverter.co.uk/blog/${selectedTarget.slug}`,
      "datePublished": today,
      "dateModified": today,
      "image": [imageUrl],
      "author": { "@type": "Organization", "name": "OmniConverter Editorial Team" },
      "publisher": {
        "@type": "Organization",
        "name": "OmniConverter",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.omniconverter.co.uk/logo.png"
        }
      }
    }
  ];

  if (faqList.length > 0) {
    jsonLdSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqList
    });
  }

  jsonLdSchemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.omniconverter.co.uk/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.omniconverter.co.uk/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://www.omniconverter.co.uk/blog/${selectedTarget.slug}`
      }
    ]
  });

  const fullPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4766868021895107" crossorigin="anonymous"></script>
  <meta name="google-adsense-account" content="ca-pub-4766868021895107">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="msvalidate.01" content="25038A8801D42437BBC34723A41AC6C4" />
  <meta name="google-site-verification" content="Cpl786DxZO0l5hjxd_D5KE5RGWKFuJ9EVSh5n6Msm7M" />
  <meta name="google-site-verification" content="aoZ6vOmLyc0slj01NK1N91iwSnk2of6HUO_JjMskszE" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KPY6T7PFD"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0KPY6T7PFD');</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | OmniConverter</title>
  <meta name="description" content="Convert ${selectedTarget.rawKw} accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/blog/${selectedTarget.slug}">
  <link rel="alternate" type="application/rss+xml" title="OmniConverter Blog RSS Feed" href="https://www.omniconverter.co.uk/feed.xml">
  <meta name="article:published_time" content="${today}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="stylesheet" href="/styles.css">

  <!-- OpenGraph & Social Cards -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://www.omniconverter.co.uk/blog/${selectedTarget.slug}">
  <meta property="og:title" content="${title} | OmniConverter">
  <meta property="og:description" content="Convert ${selectedTarget.rawKw} accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.">
  <meta property="og:site_name" content="OmniConverter">
  <meta property="og:image" content="${imageUrl || 'https://www.omniconverter.co.uk/logo.png'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} | OmniConverter">
  <meta name="twitter:description" content="Convert ${selectedTarget.rawKw} accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.">
  <meta name="twitter:image" content="${imageUrl || 'https://www.omniconverter.co.uk/logo.png'}">

  <script type="application/ld+json">
  ${JSON.stringify(jsonLdSchemas, null, 2)}
  </script>
</head>
<body>
  <header>
    <div class="header-container">
      <a href="/" class="logo" aria-label="OmniConverter Home">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px;height:32px;border-radius:6px;object-fit:cover;">
        <span>OmniConverter</span>
      </a>
      <button type="button" class="mobile-menu-btn" onclick="const n=this.nextElementSibling||document.querySelector('.nav-tabs');if(n)n.classList.toggle('is-open');" aria-label="Toggle navigation menu">
        <span>Menu</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <nav class="nav-tabs" aria-label="Converter category navigation">
        <a href="/" class="tab-btn">Home</a>
        <a href="/currency" class="tab-btn">Currency</a>
        <a href="/length" class="tab-btn">Length</a>
        <a href="/temperature" class="tab-btn">Temperature</a>
        <a href="/weight-mass" class="tab-btn">Weight</a>
        <a href="/volume-capacity" class="tab-btn">Volume</a>
        <a href="/time-duration" class="tab-btn">Time</a>
        <a href="/area" class="tab-btn">Area</a>
        <a href="/speed" class="tab-btn">Speed</a>
        <a href="/file-media" class="tab-btn">Files</a>
        <a href="/blog" class="tab-btn active">Blog</a>
      </nav>
    </div>
  </header>
  <main class="main-container">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <a href="/blog">Blog</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${title}</span>
    </nav>
    <article class="content-section" style="margin-top:0.75rem;">
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
  ${widgetScript}
</body>
</html>`;

  const outPath = path.join('blog', `${selectedTarget.slug}.html`);
  fs.writeFileSync(outPath, fullPageHtml, 'utf8');
  console.log(`[OK] Article saved: ${outPath}`);

  // 6. Rebuild blog-data.js + sitemap.xml inline
  rebuildBlogData();

  // 7. Auto-Notify Google Indexing API for Instant Crawling
  try {
    const keyPath = path.join(__dirname, '..', 'service-account.json');
    if (fs.existsSync(keyPath)) {
      const auth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: ['https://www.googleapis.com/auth/indexing']
      });
      const indexing = google.indexing({ version: 'v3', auth: await auth.getClient() });
      const fullArticleUrl = `https://www.omniconverter.co.uk/blog/${selectedTarget.slug}`;
      const res = await indexing.urlNotifications.publish({
        requestBody: { url: fullArticleUrl, type: 'URL_UPDATED' }
      });
      console.log(`[OK] Instant Indexing Request sent to Google: ${fullArticleUrl}`);
    } else {
      console.log('[INFO] service-account.json not found, skipped Google Indexing API notify.');
    }
  } catch (indexErr) {
    console.warn(`[WARN] Google Indexing API notify error:`, indexErr.message || indexErr);
  }

  // 8. Auto-Notify IndexNow API (Bing, Yandex, Naver, Seznam) for Instant Crawling
  try {
    const fullArticleUrl = `https://www.omniconverter.co.uk/blog/${selectedTarget.slug}`;
    const indexNowPayload = JSON.stringify({
      host: 'www.omniconverter.co.uk',
      key: '25038A8801D42437BBC34723A41AC6C4',
      keyLocation: 'https://www.omniconverter.co.uk/25038A8801D42437BBC34723A41AC6C4.txt',
      urlList: [fullArticleUrl]
    });

    const indexNowReq = https.request({
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(indexNowPayload)
      }
    }, (res) => {
      console.log(`[OK] Instant IndexNow Request sent to Bing/IndexNow: HTTP ${res.statusCode}`);
    });
    indexNowReq.on('error', (e) => console.warn('[WARN] IndexNow notification error:', e.message));
    indexNowReq.write(indexNowPayload);
    indexNowReq.end();
  } catch (inErr) {
    console.warn(`[WARN] IndexNow notification error:`, inErr.message || inErr);
  }

  console.log('=== Auto-Publisher complete! ===');
}

module.exports = { rebuildBlogData, main };

if (require.main === module) {
  main().catch(err => {
    console.error('Execution Error:', err.message || String(err));
    process.exit(1);
  });
}
