import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
    xml += `  <url><loc>${u}</loc><lastmod>2026-10-05</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

// 1. English URLs
const enUrls = new Set();
const rootHtmls = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootHtmls.forEach(f => {
  const p = f === 'index.html' ? '/' : `/${f.replace('.html', '')}`;
  enUrls.add(`https://www.omniconverter.co.uk${p}`);
});
const enBlog = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));
enBlog.forEach(f => {
  enUrls.add(`https://www.omniconverter.co.uk/blog/${f.replace('.html', '')}`);
});

fs.writeFileSync(path.join(rootDir, 'sitemap-en.xml'), buildUrlSet(enUrls), 'utf8');
console.log(`sitemap-en.xml generated with ${enUrls.size} URLs!`);

// 2. Spanish URLs
const esUrls = new Set();
const esHtmls = fs.readdirSync(path.join(rootDir, 'es')).filter(f => f.endsWith('.html'));
esHtmls.forEach(f => {
  const p = f === 'index.html' ? '/es/' : `/es/${f.replace('.html', '')}`;
  esUrls.add(`https://www.omniconverter.co.uk${p}`);
});
const esBlog = fs.readdirSync(path.join(rootDir, 'es', 'blog')).filter(f => f.endsWith('.html'));
esBlog.forEach(f => {
  esUrls.add(`https://www.omniconverter.co.uk/es/blog/${f.replace('.html', '')}`);
});

fs.writeFileSync(path.join(rootDir, 'sitemap-es.xml'), buildUrlSet(esUrls), 'utf8');
console.log(`sitemap-es.xml generated with ${esUrls.size} URLs!`);

// 3. German URLs
const deUrls = new Set();
const deHtmls = fs.readdirSync(path.join(rootDir, 'de')).filter(f => f.endsWith('.html'));
deHtmls.forEach(f => {
  const p = f === 'index.html' ? '/de/' : `/de/${f.replace('.html', '')}`;
  deUrls.add(`https://www.omniconverter.co.uk${p}`);
});
const deBlog = fs.readdirSync(path.join(rootDir, 'de', 'blog')).filter(f => f.endsWith('.html'));
deBlog.forEach(f => {
  deUrls.add(`https://www.omniconverter.co.uk/de/blog/${f.replace('.html', '')}`);
});

fs.writeFileSync(path.join(rootDir, 'sitemap-de.xml'), buildUrlSet(deUrls), 'utf8');
console.log(`sitemap-de.xml generated with ${deUrls.size} URLs!`);

// 4. Portuguese URLs
const ptUrls = new Set();
const ptHtmls = fs.readdirSync(path.join(rootDir, 'pt')).filter(f => f.endsWith('.html'));
ptHtmls.forEach(f => {
  const p = f === 'index.html' ? '/pt/' : `/pt/${f.replace('.html', '')}`;
  ptUrls.add(`https://www.omniconverter.co.uk${p}`);
});
const ptBlog = fs.readdirSync(path.join(rootDir, 'pt', 'blog')).filter(f => f.endsWith('.html'));
ptBlog.forEach(f => {
  ptUrls.add(`https://www.omniconverter.co.uk/pt/blog/${f.replace('.html', '')}`);
});

fs.writeFileSync(path.join(rootDir, 'sitemap-pt.xml'), buildUrlSet(ptUrls), 'utf8');
console.log(`sitemap-pt.xml generated with ${ptUrls.size} URLs!`);

// 5. Master Unified Sitemap Index (sitemap.xml is a clean <sitemapindex>, NO duplicate URLs)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-en.xml</loc>
    <lastmod>2026-10-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-es.xml</loc>
    <lastmod>2026-10-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-de.xml</loc>
    <lastmod>2026-10-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/sitemap-pt.xml</loc>
    <lastmod>2026-10-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.omniconverter.co.uk/news-sitemap.xml</loc>
    <lastmod>2026-10-05</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapIndexXml, 'utf8');
console.log('Master sitemap.xml configured as standard <sitemapindex>!');

