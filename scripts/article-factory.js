/**
 * article-factory.js
 * Universal standard generator for OmniConverter articles.
 * Enforces high-CTR architecture:
 * 1. Title: <60 chars with direct answer
 * 2. Description: <155 chars, starts with direct answer + '→' CTA
 * 3. Structured Data: Article + BreadcrumbList + FAQPage (min 3 questions)
 * 4. Interactive Widget: Full liveToolFromUnit & liveToolInput standard calculator
 * 5. Related Articles internal linking grid
 * 6. Multi-language canonical & hreflang tags
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function buildArticle(options) {
  const {
    slug,          // e.g. "blog/50-kg-in-lbs.html"
    lang = 'en',
    title,         // e.g. "50 kg to lbs: Exactly 110.23 lbs [Gym Reference]" (<60 chars)
    metaDesc,      // starts with answer, <155 chars, has '→'
    h1,            // clear semantic title
    quickAnswer,   // "50 kg = 110.23 lbs (110 lbs 3.7 oz)"
    intro,         // 2-3 engaging sentences
    category,      // 'weight', 'length', 'temperature', 'currency', 'volume', 'speed', 'area', 'time'
    formula,       // math step
    tableHeaders,  // e.g. ['kg', 'lbs', 'Stone & lb']
    tableRows,     // array of arrays
    faqList,       // [{ q: '...', a: '...' }, ...] min 3
    relatedLinks,  // [{ url: '...', text: '...' }, ...]
    calcConfig     // { fromUnit: 'kg', defaultVal: 50, units: [{val: 'kg', label: 'Kilograms (kg)'}, ...] }
  } = options;

  // Validation
  if (title.length > 60) console.warn(`⚠️ Warning: Title is ${title.length} chars (Target <60): "${title}"`);
  if (metaDesc.length > 155) console.warn(`⚠️ Warning: Description is ${metaDesc.length} chars (Target <155): "${metaDesc}"`);
  if (!metaDesc.includes('→')) console.warn(`⚠️ Warning: Description missing '→' CTA`);
  if (!faqList || faqList.length < 3) console.warn(`⚠️ Warning: Article should have at least 3 FAQ items`);

  const canonicalUrl = `https://www.omniconverter.co.uk/${slug.replace(/\.html$/, '')}`;

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  }, null, 2);

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": metaDesc,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "OmniConverter",
      "url": "https://www.omniconverter.co.uk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.omniconverter.co.uk/logo.png"
      }
    }
  }, null, 2);

  const breadcrumbsSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.omniconverter.co.uk/blog" },
      { "@type": "ListItem", "position": 3, "name": h1, "item": canonicalUrl }
    ]
  }, null, 2);

  const optionsHTML = calcConfig.units.map(u => 
    `<option value="${u.val}" ${u.val === calcConfig.fromUnit ? 'selected' : ''}>${u.label}</option>`
  ).join('\n              ');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="${lang}" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="stylesheet" href="/style.css">

  <script type="application/ld+json">
${articleSchema}
  </script>
  <script type="application/ld+json">
${faqSchema}
  </script>
  <script type="application/ld+json">
${breadcrumbsSchema}
  </script>
</head>
<body>
  <header class="header-container">
    <a href="/" class="logo" aria-label="OmniConverter Home">
      <img src="/logo.png" alt="OmniConverter Logo" style="width:32px;height:32px;border-radius:6px;">
      <span>OmniConverter</span>
    </a>
  </header>

  <main style="max-width:800px;width:100%;margin:0 auto;padding:1rem;">
    <nav aria-label="Breadcrumb" style="font-size:0.8rem;color:#888;margin-bottom:1rem;">
      <a href="/">Home</a> › <a href="/blog">Blog</a> › ${h1}
    </nav>

    <article>
      <h1 style="font-size:1.9rem;font-weight:700;margin-bottom:0.5rem;">${h1}</h1>

      <div style="background:#4f46e5;color:#fff;padding:1rem 1.5rem;border-radius:12px;margin:1rem 0;font-size:1.25rem;font-weight:700;">
        🎯 Quick Answer: ${quickAnswer}
      </div>

      <p>${intro}</p>

      <!-- Interactive Calculator Widget -->
      <section class="calculator-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.5rem; margin:1.5rem 0;">
        <h2 style="margin-top:0; font-size:1.25rem;">Live Calculator</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">Amount / Value</label>
            <input type="number" id="liveToolInput" value="${calcConfig.defaultVal}" step="any" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
              ${optionsHTML}
            </select>
          </div>
        </div>
        <div style="padding:1rem; background:#ede9fe; border-radius:8px; font-weight:700; color:#4f46e5; font-size:1.1rem;" id="calcOutput">
          ${quickAnswer}
        </div>
      </section>

      <h2>Conversion Formula</h2>
      <div style="background:#f3f4f6;border-left:4px solid #4f46e5;padding:1rem;border-radius:0 8px 8px 0;font-family:monospace;margin:1rem 0;">
        ${formula}
      </div>

      <h2>Reference Table</h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin:1rem 0;">
          <thead>
            <tr style="background:#4f46e5;color:#fff;">
              ${tableHeaders.map(h => `<th style="padding:0.6rem;text-align:left;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows.map((r, i) => `
              <tr style="${i % 2 === 0 ? 'background:#f9fafb;' : ''}">
                ${r.map(col => `<td style="padding:0.6rem;border-bottom:1px solid #e5e7eb;">${col}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h2>Frequently Asked Questions</h2>
      ${faqList.map(f => `
        <h3 style="margin-bottom:0.25rem;">${f.q}</h3>
        <p style="margin-top:0.25rem;color:#4b5563;">${f.a}</p>
      `).join('')}

      <!-- Contextual Internal Links -->
      <section class="related-articles" style="margin:2rem 0;padding:1.5rem;background:#f8f9fa;border-radius:12px;border-left:4px solid #4f46e5;">
        <h3 style="margin:0 0 1rem;font-size:1rem;color:#374151;font-weight:600;">📚 Related Conversions</h3>
        <ul style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:0.5rem;">
          ${relatedLinks.map(l => `<li><a href="${l.url}" style="display:inline-block;padding:0.35rem 0.75rem;background:#fff;border:1px solid #e5e7eb;border-radius:20px;font-size:0.875rem;color:#4f46e5;text-decoration:none;font-weight:500;">${l.text} →</a></li>`).join('\n          ')}
        </ul>
      </section>
    </article>
  </main>

  <footer style="text-align:center;padding:2rem;color:#888;font-size:0.8rem;border-top:1px solid #e5e7eb;margin-top:2rem;">
    <p>&copy; 2026 OmniConverter. <a href="/privacy-policy">Privacy Policy</a> | <a href="/about">About</a></p>
  </footer>
</body>
</html>`;
}

function saveArticle(options) {
  const fullPath = path.join(ROOT, options.slug);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = buildArticle(options);
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`✅ Successfully generated: ${options.slug}`);
}

module.exports = { buildArticle, saveArticle };
