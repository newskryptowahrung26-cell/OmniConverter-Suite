const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

console.log('=== STARTING PERMANENT AHREFS FIX ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1: FIX ORPHAN PAGES
// The 5 Indian unit articles need internal links:
// - Added into blog.html directory and grid
// - Added into indian-units.html with dedicated cards & links
// - Cross-linked within each other and back to /indian-units
// ─────────────────────────────────────────────────────────────────────────────

const indianSlugs = [
  '1-bigha-in-square-feet',
  '1-crore-in-millions',
  '1-gaj-in-square-feet',
  '1-guntha-in-sq-ft',
  '1-tola-in-grams'
];

console.log('--- 1. Fixing Orphan Pages for Indian Unit Guides ---');

// 1.1 In indian-units.html, add comprehensive guide cards pointing to all 5 articles
if (fs.existsSync('indian-units.html')) {
  let indianHtml = fs.readFileSync('indian-units.html', 'utf8');

  // Also remove broken hreflangs from indian-units.html (<head>)
  indianHtml = indianHtml.replace(
    /<link\s+rel="alternate"\s+hreflang="es"\s+href="https:\/\/www\.omniconverter\.co\.uk\/es\/blog">\s*/g,
    ''
  );
  indianHtml = indianHtml.replace(
    /<link\s+rel="alternate"\s+hreflang="de"\s+href="https:\/\/www\.omniconverter\.co\.uk\/de\/blog">\s*/g,
    ''
  );
  indianHtml = indianHtml.replace(
    /<link\s+rel="alternate"\s+hreflang="pt"\s+href="https:\/\/www\.omniconverter\.co\.uk\/pt\/blog">\s*/g,
    ''
  );

  const guideSectionHtml = `
    <!-- Comprehensive Related Indian Unit Guides -->
    <section class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:0.75rem; color:var(--text-main);">🇮🇳 Official Indian Land & Weight Conversion Guides</h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6;">
        Explore our exhaustive, verified state-wise measurement guides covering revenue records, real estate plot calculations, and bullion trade standards:
      </p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
        <a href="/blog/1-bigha-in-square-feet" style="text-decoration:none; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; display:block; transition:transform 0.2s, box-shadow 0.2s;">
          <div style="font-size:1.25rem; margin-bottom:0.4rem;">🌾</div>
          <h3 style="margin:0 0 0.35rem 0; font-size:1.05rem; font-weight:700; color:var(--text-main);">1 Bigha in Square Feet</h3>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">State-wise conversion benchmarks for UP, Bihar, Punjab, Rajasthan, Haryana, and West Bengal.</p>
        </a>
        <a href="/blog/1-guntha-in-sq-ft" style="text-decoration:none; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; display:block; transition:transform 0.2s, box-shadow 0.2s;">
          <div style="font-size:1.25rem; margin-bottom:0.4rem;">📐</div>
          <h3 style="margin:0 0 0.35rem 0; font-size:1.05rem; font-weight:700; color:var(--text-main);">1 Guntha in Sq Ft</h3>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Exact square feet formula for Maharashtra, Gujarat, Karnataka, Telangana, and Andhra Pradesh.</p>
        </a>
        <a href="/blog/1-gaj-in-square-feet" style="text-decoration:none; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; display:block; transition:transform 0.2s, box-shadow 0.2s;">
          <div style="font-size:1.25rem; margin-bottom:0.4rem;">📏</div>
          <h3 style="margin:0 0 0.35rem 0; font-size:1.05rem; font-weight:700; color:var(--text-main);">1 Gaj in Square Feet</h3>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Standard urban land and plot measurement comparison with Square Yards and Square Meters.</p>
        </a>
        <a href="/blog/1-tola-in-grams" style="text-decoration:none; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; display:block; transition:transform 0.2s, box-shadow 0.2s;">
          <div style="font-size:1.25rem; margin-bottom:0.4rem;">⚖️</div>
          <h3 style="margin:0 0 0.35rem 0; font-size:1.05rem; font-weight:700; color:var(--text-main);">1 Tola in Grams</h3>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Traditional Indian gold & silver jewellery bullion weights: 11.6638 grams standard vs metric 10g tola.</p>
        </a>
        <a href="/blog/1-crore-in-millions" style="text-decoration:none; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; display:block; transition:transform 0.2s, box-shadow 0.2s;">
          <div style="font-size:1.25rem; margin-bottom:0.4rem;">💰</div>
          <h3 style="margin:0 0 0.35rem 0; font-size:1.05rem; font-weight:700; color:var(--text-main);">1 Crore in Millions</h3>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Indian numbering system conversion: Lakh, Crore, Million, Billion, and International currency exchange.</p>
        </a>
      </div>
    </section>
  `;

  if (!indianHtml.includes('1-bigha-in-square-feet')) {
    // Insert before </main>
    indianHtml = indianHtml.replace('</main>', `${guideSectionHtml}\n  </main>`);
    fs.writeFileSync('indian-units.html', indianHtml, 'utf8');
    console.log('  [OK] Added related guide cards to indian-units.html');
  } else {
    // Replace guide cards section if existing
    fs.writeFileSync('indian-units.html', indianHtml, 'utf8');
    console.log('  [OK] Updated indian-units.html head & guides');
  }
}

// 1.2 In blog.html, add all 5 to the directory list
if (fs.existsSync('blog.html')) {
  let blogHtml = fs.readFileSync('blog.html', 'utf8');
  
  // Update header count if present
  blogHtml = blogHtml.replace(/Complete Directory of Conversion Guides \(\d+ Guides\)/g, 'Complete Directory of Conversion Guides (55 Guides)');

  const indianBlogLinks = `        <li><a href="/blog/1-bigha-in-square-feet" style="color:var(--primary-600); font-weight:600;">1 Bigha in Square Feet: State-Wise Land Guide</a></li>
        <li><a href="/blog/1-guntha-in-sq-ft" style="color:var(--primary-600); font-weight:600;">1 Guntha in Sq Ft: Plot Measurement Guide</a></li>
        <li><a href="/blog/1-gaj-in-square-feet" style="color:var(--primary-600); font-weight:600;">1 Gaj in Square Feet: Land & Square Yard Guide</a></li>
        <li><a href="/blog/1-tola-in-grams" style="color:var(--primary-600); font-weight:600;">1 Tola in Grams: Gold & Silver Jewellery Guide</a></li>
        <li><a href="/blog/1-crore-in-millions" style="color:var(--primary-600); font-weight:600;">1 Crore in Millions: Indian Number System Guide</a></li>`;

  if (!blogHtml.includes('/blog/1-bigha-in-square-feet')) {
    blogHtml = blogHtml.replace(
      '<li><a href="/blog/1500-usd-to-aud"',
      `${indianBlogLinks}\n        <li><a href="/blog/1500-usd-to-aud"`
    );
    fs.writeFileSync('blog.html', blogHtml, 'utf8');
    console.log('  [OK] Added 5 Indian guides to blog.html directory');
  }
}

// 1.3 Update each of the 5 Indian unit articles:
// - Ensure links to /indian-units and cross-links to each other
// - Remove false hreflang tags to /es/blog, /de/blog, /pt/blog
// - Add valid Article Schema with datePublished, dateModified, author, publisher, image
// - Shorten title to <= 60 chars
const indianTitles = {
  '1-bigha-in-square-feet': '1 Bigha in Square Feet (Land Guide) | OmniConverter',
  '1-crore-in-millions': '1 Crore in Millions (Number Guide) | OmniConverter',
  '1-gaj-in-square-feet': '1 Gaj in Square Feet (Land Guide) | OmniConverter',
  '1-guntha-in-sq-ft': '1 Guntha in Sq Ft (Land Guide) | OmniConverter',
  '1-tola-in-grams': '1 Tola in Grams (Gold Weight Guide) | OmniConverter'
};

indianSlugs.forEach(slug => {
  const filePath = path.join('blog', `${slug}.html`);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Clean false hreflang tags
  content = content.replace(/<link\s+rel="alternate"\s+hreflang="es"\s+href="https:\/\/www\.omniconverter\.co\.uk\/es\/blog">\s*/g, '');
  content = content.replace(/<link\s+rel="alternate"\s+hreflang="de"\s+href="https:\/\/www\.omniconverter\.co\.uk\/de\/blog">\s*/g, '');
  content = content.replace(/<link\s+rel="alternate"\s+hreflang="pt"\s+href="https:\/\/www\.omniconverter\.co\.uk\/pt\/blog">\s*/g, '');

  // Ensure title is <= 60 chars
  if (indianTitles[slug]) {
    content = content.replace(/<title>([^<]+)<\/title>/i, `<title>${indianTitles[slug]}</title>`);
  }

  // Cross links section for Indian units
  const crossLinksHtml = `
    <!-- Indian Units Cross-Navigation -->
    <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main);">🇮🇳 Related Indian Measurement Guides & Tools</h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted);">Calculate real estate land area, gold weight, and numbering conversions with our verified tools:</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
        <a href="/indian-units" style="display:inline-block; padding:0.4rem 0.85rem; background:rgba(99,102,241,0.1); color:var(--primary-600); border-radius:var(--radius-md); font-weight:700; text-decoration:none; font-size:0.85rem;">⚡ Interactive Indian Units Converter</a>
        <a href="/blog/1-bigha-in-square-feet" style="display:inline-block; padding:0.4rem 0.85rem; background:var(--bg-surface); border:1px solid var(--card-border); color:var(--text-main); border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.85rem;">1 Bigha in Sq Ft</a>
        <a href="/blog/1-guntha-in-sq-ft" style="display:inline-block; padding:0.4rem 0.85rem; background:var(--bg-surface); border:1px solid var(--card-border); color:var(--text-main); border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.85rem;">1 Guntha in Sq Ft</a>
        <a href="/blog/1-gaj-in-square-feet" style="display:inline-block; padding:0.4rem 0.85rem; background:var(--bg-surface); border:1px solid var(--card-border); color:var(--text-main); border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.85rem;">1 Gaj in Sq Ft</a>
        <a href="/blog/1-tola-in-grams" style="display:inline-block; padding:0.4rem 0.85rem; background:var(--bg-surface); border:1px solid var(--card-border); color:var(--text-main); border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.85rem;">1 Tola in Grams</a>
        <a href="/blog/1-crore-in-millions" style="display:inline-block; padding:0.4rem 0.85rem; background:var(--bg-surface); border:1px solid var(--card-border); color:var(--text-main); border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.85rem;">1 Crore in Millions</a>
      </div>
    </div>
  `;

  if (!content.includes('⚡ Interactive Indian Units Converter')) {
    content = content.replace('</article>', `</article>\n${crossLinksHtml}`);
  }

  // Ensure JSON-LD Schema is complete
  const schemaArticleMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (schemaArticleMatch) {
    try {
      let schemaObj = JSON.parse(schemaArticleMatch[1]);
      if (schemaObj['@type'] === 'Article') {
        schemaObj.datePublished = schemaObj.datePublished || '2026-10-05';
        schemaObj.dateModified = '2026-10-05';
        schemaObj.image = schemaObj.image || 'https://www.omniconverter.co.uk/logo.png';
        schemaObj.publisher = {
          "@type": "Organization",
          "name": "OmniConverter",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.omniconverter.co.uk/logo.png"
          }
        };
        schemaObj.author = {
          "@type": "Organization",
          "name": "OmniConverter Editorial Team"
        };
        content = content.replace(schemaArticleMatch[0], `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`);
      }
    } catch (e) {}
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  [OK] Updated ${filePath}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// FIX 2: FIX HREFLANG RECIPROCALS ON STATIC PAGES
// Symmetrical 4-way hreflang links across:
// about, contact, privacy-policy, sitemap, terms in en, es, de, pt
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 2. Fixing Reciprocal Hreflang Tags on Static Pages ---');

const staticSlugs = ['about', 'contact', 'privacy-policy', 'sitemap', 'terms'];

staticSlugs.forEach(slug => {
  const enPath = `${slug}.html`;
  const esPath = path.join('es', `${slug}.html`);
  const dePath = path.join('de', `${slug}.html`);
  const ptPath = path.join('pt', `${slug}.html`);

  const hreflangBlock = `  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/${slug}">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/${slug}">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/${slug}">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/${slug}">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/${slug}">`;

  [enPath, esPath, dePath, ptPath].forEach(fp => {
    if (!fs.existsSync(fp)) return;
    let c = fs.readFileSync(fp, 'utf8');

    // Remove existing hreflang tags
    c = c.replace(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]*">\s*/g, '');

    // Insert clean symmetrical block right before </head>
    c = c.replace('</head>', `${hreflangBlock}\n</head>`);
    fs.writeFileSync(fp, c, 'utf8');
  });
  console.log(`  [OK] Synchronized 4-way hreflang for ${slug}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// FIX 3: NORMALIZE ALL ARTICLE STRUCTURED DATA
// Ensure datePublished, dateModified, author, publisher, and image exist
// on every Article schema across all blog pages
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 3. Normalizing Structured Data Across All Articles ---');

const allHtml = getAllHtmlFiles('.');
let schemaFixCount = 0;

allHtml.forEach(fp => {
  let content = fs.readFileSync(fp, 'utf8');
  let modified = false;

  const scriptMatches = [...content.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const match of scriptMatches) {
    try {
      let parsed = JSON.parse(match[1]);
      let changed = false;

      function fixItem(item) {
        if (item && item['@type'] === 'Article') {
          if (!item.datePublished) { item.datePublished = '2026-10-05'; changed = true; }
          if (!item.dateModified) { item.dateModified = '2026-10-05'; changed = true; }
          if (!item.author) { item.author = { "@type": "Organization", "name": "OmniConverter Editorial Team" }; changed = true; }
          if (!item.publisher) {
            item.publisher = {
              "@type": "Organization",
              "name": "OmniConverter",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.omniconverter.co.uk/logo.png"
              }
            };
            changed = true;
          }
          if (!item.image) {
            item.image = "https://www.omniconverter.co.uk/logo.png";
            changed = true;
          }
        }
      }

      if (Array.isArray(parsed)) {
        parsed.forEach(fixItem);
      } else {
        fixItem(parsed);
      }

      if (changed) {
        const newJson = `<script type="application/ld+json">\n${JSON.stringify(parsed, null, 2)}\n</script>`;
        content = content.replace(match[0], newJson);
        modified = true;
        schemaFixCount++;
      }
    } catch (e) {}
  }

  if (modified) {
    fs.writeFileSync(fp, content, 'utf8');
  }
});
console.log(`  [OK] Fixed schemas in ${schemaFixCount} files.`);

// ─────────────────────────────────────────────────────────────────────────────
// FIX 4: SHORTEN TITLES > 60 CHARS & DESCRIPTIONS > 160 CHARS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 4. Optimizing Title & Meta Description Lengths ---');

let titleFixCount = 0;
let descFixCount = 0;

allHtml.forEach(fp => {
  let content = fs.readFileSync(fp, 'utf8');
  let modified = false;

  // Title optimization
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1];
    if (title.length > 60) {
      let orig = title;
      // Strip redundant prefixes/suffixes
      title = title.replace(' | OmniConverter', '');
      title = title.replace(': Exact Exchange Rate, Calculation Steps & FX Guide', ' Exchange Rate & Guide');
      title = title.replace(': State-Wise Land Measurement Guide', ' Land Guide');
      title = title.replace(': Conversion Formula, Table & Number Guide', ' Guide');
      title = title.replace(' & Square Yard: Real Estate Land Guide', ' Land Guide');
      title = title.replace(' (Square Feet) Land Measurement Guide', ' Land Guide');
      title = title.replace(': Gold & Silver Jewellery Weight Guide', ' Guide');
      title = title.replace(': Liquid Volume Guide', ' Guide');
      title = title.replace(': Body Weight Conversion Guide', ' Guide');
      title = title.replace(': Teaspoon Volume Guide', ' Guide');
      title = title.replace(': Temperature Guide', ' Guide');
      title = title.replace(': Kilograms to Pounds Guide', ' Guide');
      title = title.replace(': Liquid Volume Conversion', ' Guide');
      title = title.replace(': Speed Conversion Guide', ' Guide');
      title = title.replace(': Kitchen & Baking Weight Guide', ' Guide');
      title = title.replace(': Kitchen Volume Guide', ' Guide');
      title = title.replace(' Conversion Formula & Pressure Guide', ' Pressure Guide');
      title = title.replace(': Fluid Volume Conversion Guide', ' Guide');
      title = title.replace(' Exchange Rate & FX Currency Guide', ' FX Guide');
      title = title.replace(' Free Online Unit Converter', '');
      title = title.replace(' Free Online File Converter', '');
      title = title.replace(' - OmniConverter Suite', '');
      title = title.replace(' - OmniConverter', '');

      // Localized cleanups
      title = title.replace(': Guía de Conversión Completa', '');
      title = title.replace(': Umrechnungsratgeber & Formel', '');
      title = title.replace(': Guia Completo de Conversão', '');
      title = title.replace(' | Calculadora OmniConverter', '');
      title = title.replace(' | Umrechner OmniConverter', '');

      // Add concise brand tag if room
      if (title.length <= 44) {
        title = `${title} | OmniConverter`;
      } else if (title.length > 60) {
        title = title.substring(0, 57).trim() + '...';
      }

      if (title !== orig && title.length <= 60) {
        content = content.replace(titleMatch[0], `<title>${title}</title>`);
        modified = true;
        titleFixCount++;
      }
    }
  }

  // Meta description optimization (> 160 chars)
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (descMatch) {
    let desc = descMatch[1];
    if (desc.length > 160) {
      // Trim at last space before 155 chars
      let trimmed = desc.substring(0, 155);
      const lastSpace = trimmed.lastIndexOf(' ');
      if (lastSpace > 120) {
        trimmed = trimmed.substring(0, lastSpace);
      }
      if (!trimmed.endsWith('.')) trimmed += '.';
      content = content.replace(descMatch[0], `<meta name="description" content="${trimmed}">`);
      modified = true;
      descFixCount++;
    }
  }

  if (modified) {
    fs.writeFileSync(fp, content, 'utf8');
  }
});
console.log(`  [OK] Shortened ${titleFixCount} titles to <= 60 chars.`);
console.log(`  [OK] Shortened ${descFixCount} meta descriptions to <= 160 chars.`);

// ─────────────────────────────────────────────────────────────────────────────
// FIX 5: REBUILD SITEMAPS AS SITEMAP INDEX + LANGUAGE SUB-SITEMAPS
// Prevents "Page in multiple sitemaps" error across all 271 URLs permanently
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 5. Generating Clean Multi-Language Sitemaps & Sitemap Index ---');

const today = '2026-10-05';

function buildUrlSet(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const u of urls) {
    let prio = '0.8';
    let freq = 'weekly';
    if (u === 'https://www.omniconverter.co.uk/' || u.endsWith('/es/') || u.endsWith('/de/') || u.endsWith('/pt/')) {
      prio = '1.0';
      freq = 'daily';
    } else if (u.includes('/privacy-policy') || u.includes('/terms') || u.includes('/sitemap') || u.includes('/about') || u.includes('/contact')) {
      prio = '0.5';
      freq = 'monthly';
    }
    xml += `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

// 1. English URLs (Only English URLs in sitemap-en.xml)
const enUrls = new Set();
fs.readdirSync('.').filter(f => f.endsWith('.html')).forEach(f => {
  const p = f === 'index.html' ? '/' : `/${f.replace('.html', '')}`;
  enUrls.add(`https://www.omniconverter.co.uk${p}`);
});
fs.readdirSync('blog').filter(f => f.endsWith('.html')).forEach(f => {
  enUrls.add(`https://www.omniconverter.co.uk/blog/${f.replace('.html', '')}`);
});
fs.writeFileSync('sitemap-en.xml', buildUrlSet(enUrls), 'utf8');
console.log(`  [OK] sitemap-en.xml generated with ${enUrls.size} URLs.`);

// 2. Spanish URLs (Only Spanish URLs in sitemap-es.xml)
const esUrls = new Set();
fs.readdirSync('es').filter(f => f.endsWith('.html')).forEach(f => {
  const p = f === 'index.html' ? '/es/' : `/es/${f.replace('.html', '')}`;
  esUrls.add(`https://www.omniconverter.co.uk${p}`);
});
fs.readdirSync(path.join('es', 'blog')).filter(f => f.endsWith('.html')).forEach(f => {
  esUrls.add(`https://www.omniconverter.co.uk/es/blog/${f.replace('.html', '')}`);
});
fs.writeFileSync('sitemap-es.xml', buildUrlSet(esUrls), 'utf8');
console.log(`  [OK] sitemap-es.xml generated with ${esUrls.size} URLs.`);

// 3. German URLs (Only German URLs in sitemap-de.xml)
const deUrls = new Set();
fs.readdirSync('de').filter(f => f.endsWith('.html')).forEach(f => {
  const p = f === 'index.html' ? '/de/' : `/de/${f.replace('.html', '')}`;
  deUrls.add(`https://www.omniconverter.co.uk${p}`);
});
fs.readdirSync(path.join('de', 'blog')).filter(f => f.endsWith('.html')).forEach(f => {
  deUrls.add(`https://www.omniconverter.co.uk/de/blog/${f.replace('.html', '')}`);
});
fs.writeFileSync('sitemap-de.xml', buildUrlSet(deUrls), 'utf8');
console.log(`  [OK] sitemap-de.xml generated with ${deUrls.size} URLs.`);

// 4. Portuguese URLs (Only Portuguese URLs in sitemap-pt.xml)
const ptUrls = new Set();
fs.readdirSync('pt').filter(f => f.endsWith('.html')).forEach(f => {
  const p = f === 'index.html' ? '/pt/' : `/pt/${f.replace('.html', '')}`;
  ptUrls.add(`https://www.omniconverter.co.uk${p}`);
});
fs.readdirSync(path.join('pt', 'blog')).filter(f => f.endsWith('.html')).forEach(f => {
  ptUrls.add(`https://www.omniconverter.co.uk/pt/blog/${f.replace('.html', '')}`);
});
fs.writeFileSync('sitemap-pt.xml', buildUrlSet(ptUrls), 'utf8');
console.log(`  [OK] sitemap-pt.xml generated with ${ptUrls.size} URLs.`);

// 5. MASTER SITEMAP INDEX (sitemap.xml is a clean <sitemapindex>, NO URL duplication)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-en.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-es.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-de.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-pt.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/news-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync('sitemap.xml', sitemapIndexXml, 'utf8');
console.log('  [OK] Master sitemap.xml configured as standard <sitemapindex>.');

// 6. Update robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.omniconverter.co.uk/sitemap.xml
Sitemap: https://www.omniconverter.co.uk/news-sitemap.xml
`;
fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('  [OK] robots.txt updated with master sitemap index.');

// ─────────────────────────────────────────────────────────────────────────────
// FIX 6: SYNC blog-data.js WITH ALL 55 ARTICLES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 6. Rebuilding blog-data.js with all 55 articles ---');
const { rebuildBlogData } = require('./vertex-publisher.js');
rebuildBlogData();

console.log('\n=== AHREFS FIX COMPLETE! ===\n');
