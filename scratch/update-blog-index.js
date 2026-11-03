/**
 * update-blog-index.js
 * Rebuilds the blog.html article listing with all 87 articles categorized.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = './blog';

// Read all blog articles and extract metadata
const articles = [];
fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).forEach(file => {
  const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const slug = file.replace('.html', '');
  const title = titleMatch ? titleMatch[1].replace(/ \| OmniConverter$/, '').replace(/&amp;/g, '&').trim() : slug;
  const desc = descMatch ? descMatch[1].replace(/&amp;/g, '&').trim() : '';
  articles.push({ slug, title, desc, file });
});

// Categorize articles
const categories = {
  'Currency & Exchange': [],
  'Weight & Mass': [],
  'Temperature': [],
  'Volume & Cooking': [],
  'Length & Distance': [],
  'Area & Land': [],
  'Speed': [],
  'Time': [],
  'Files & Media': [],
  'Indian Units': [],
  'General Guides': []
};

articles.forEach(a => {
  const s = a.slug.toLowerCase();
  const t = a.title.toLowerCase();
  if (s.includes('usd') || s.includes('gbp') || s.includes('aud') || s.includes('eur') || s.includes('vnd') || s.includes('idr') || s.includes('won') || s.includes('krw') || s.includes('jpy') || s.includes('inr') || s.includes('lira') || s.includes('try') || s.includes('dollar') || s.includes('pound') || s.includes('rupiah') || s.includes('korean') || s.includes('rupee') || s.includes('mastercard') || s.includes('lakh-to-usd') || s.includes('foreign')) {
    categories['Currency & Exchange'].push(a);
  } else if (s.includes('kg') || s.includes('lbs') || s.includes('stone') || s.includes('gram') || s.includes('ounce') || s.includes('kilo') || s.includes('pound') || s.includes('weight') || t.includes('pounds') || t.includes('kilograms') || t.includes('stone') || t.includes('tola')) {
    categories['Weight & Mass'].push(a);
  } else if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || s.includes('-f-') || s.includes('-c-') || s.includes('degrees')) {
    categories['Temperature'].push(a);
  } else if (s.includes('cup') || s.includes('ml') || s.includes('litre') || s.includes('gallon') || s.includes('oz') || s.includes('tbsp') || s.includes('tsp') || s.includes('volume') || t.includes('milliliter')) {
    categories['Volume & Cooking'].push(a);
  } else if (s.includes('meter') || s.includes('feet') || s.includes('mile') || s.includes('inch') || s.includes('km') || s.includes('length') || t.includes('meters') || t.includes('feet')) {
    categories['Length & Distance'].push(a);
  } else if (s.includes('bigha') || s.includes('guntha') || s.includes('gaj') || s.includes('area') || s.includes('acre') || s.includes('sq-ft') || s.includes('square')) {
    categories['Area & Land'].push(a);
  } else if (s.includes('mph') || s.includes('kmh') || s.includes('speed') || s.includes('knot')) {
    categories['Speed'].push(a);
  } else if (s.includes('week') || s.includes('time') || s.includes('duration') || s.includes('hour') || s.includes('minute')) {
    categories['Time'].push(a);
  } else if (s.includes('file') || s.includes('pdf') || s.includes('convert-file') || s.includes('format') || s.includes('file-changer') || s.includes('pwa') || s.includes('download') || s.includes('offline')) {
    categories['Files & Media'].push(a);
  } else if (s.includes('crore') || s.includes('lakh') || s.includes('tola') || s.includes('indian') || s.includes('bigha') || s.includes('gaj') || s.includes('guntha')) {
    categories['Indian Units'].push(a);
  } else {
    categories['General Guides'].push(a);
  }
});

// Generate HTML for article cards grid
function buildGrid(arts) {
  if (!arts.length) return '<p style="color:var(--text-muted);">No articles in this category yet.</p>';
  return `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; margin-bottom:0.5rem;">
    ${arts.map(a => `    <a href="/blog/${a.slug}" style="display:block; padding:1rem 1.1rem; background:#fff; border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:inherit; transition:box-shadow 0.15s;">
      <div style="font-size:0.95rem; font-weight:700; color:var(--primary-600); margin-bottom:0.3rem; line-height:1.4;">${a.title.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      ${a.desc ? `<div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${a.desc.substring(0,100).replace(/</g,'&lt;').replace(/>/g,'&gt;')}${a.desc.length>100?'…':''}</div>` : ''}
    </a>`).join('\n    ')}
  </div>`;
}

// Count total
const total = Object.values(categories).reduce((s,a)=>s+a.length,0);

// Read blog.html
let blogHtml = fs.readFileSync('blog.html','utf8');

// Replace the main <main> content
const newMain = `  <main>

    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Blog</span>
    </nav>

    <section class="content-section" style="margin-top:1rem;">
      <h1>Conversion Guides &amp; Articles</h1>
      <p style="font-size:1.05rem; color:var(--text-muted); margin-bottom:2rem;">
        ${total} in-depth conversion guides covering currency exchange, weight &amp; mass, temperature, volume, length, area, speed, time, and more. Each guide includes exact formulas, comparison tables, and a live calculator.
      </p>

      ${Object.entries(categories).filter(([,arts])=>arts.length>0).map(([cat,arts])=>`
      <h2 style="font-size:1.35rem; font-weight:800; margin:2rem 0 0.75rem 0; padding-bottom:0.4rem; border-bottom:2px solid var(--primary-600);">${cat} <span style="font-size:0.9rem; font-weight:500; color:var(--text-muted);">(${arts.length} guides)</span></h2>
      ${buildGrid(arts)}`).join('\n')}

      <div style="margin-top:2.5rem; padding:1.25rem 1.5rem; background:var(--primary-light); border-radius:var(--radius-md); border:1px solid var(--card-border);">
        <strong>Looking for a specific conversion?</strong> Use our live converters:
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.75rem;">
          <a href="/currency" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Currency</a>
          <a href="/weight-mass" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Weight</a>
          <a href="/temperature" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Temperature</a>
          <a href="/length" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Length</a>
          <a href="/volume-capacity" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Volume</a>
          <a href="/area" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Area</a>
          <a href="/speed" style="padding:0.35rem 0.85rem; background:#fff; border:1px solid var(--card-border); border-radius:20px; font-size:0.875rem; color:var(--primary-600); text-decoration:none; font-weight:500;">Speed</a>
        </div>
      </div>
    </section>
  </main>`;

blogHtml = blogHtml.replace(/<main>[\s\S]*?<\/main>/i, newMain);
fs.writeFileSync('blog.html', blogHtml, 'utf8');
console.log(`✅ blog.html updated with ${total} articles in ${Object.keys(categories).filter(k=>categories[k].length>0).length} categories.`);
