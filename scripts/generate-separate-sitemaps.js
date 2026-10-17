import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getLastModFromFile(filePath, defaultDate = '2026-10-12') {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const pubMatch = raw.match(/<meta\s+(?:name|property)="article:published_time"\s+content="([^"]+)"/i);
    if (pubMatch && pubMatch[1]) return pubMatch[1].split('T')[0];
    const modMatch = raw.match(/"dateModified":\s*"([^"]+)"/);
    if (modMatch && modMatch[1]) return modMatch[1].split('T')[0];
    const datePubMatch = raw.match(/"datePublished":\s*"([^"]+)"/);
    if (datePubMatch && datePubMatch[1]) return datePubMatch[1].split('T')[0];
  } catch (e) {}
  return defaultDate;
}

function isIndexable(filePath) {
  const base = path.basename(filePath);
  if (base === '404.html') return false;
  const raw = fs.readFileSync(filePath, 'utf8');
  if (/http-equiv="refresh"/i.test(raw)) return false;
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(raw)) return false;
  return true;
}

function buildUrlSet(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const { url, lastmod } of entries) {
    let prio = '0.8';
    let freq = 'weekly';
    if (url === 'https://www.omniconverter.co.uk/' || url.endsWith('/es/') || url.endsWith('/de/') || url.endsWith('/pt/')) {
      prio = '1.0';
      freq = 'daily';
    } else if (url.endsWith('/blog')) {
      prio = '0.9';
      freq = 'daily';
    } else if (url.includes('/privacy-policy') || url.includes('/terms') || url.includes('/sitemap') || url.includes('/about') || url.includes('/contact')) {
      prio = '0.5';
      freq = 'monthly';
    }
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

function collectLocaleEntries(localePrefix, dirRel, blogDirRel) {
  const entries = [];
  const seen = new Set();
  const fullDir = path.join(rootDir, dirRel);
  const htmls = fs.readdirSync(fullDir).filter(f => f.endsWith('.html'));
  htmls.forEach(f => {
    const fp = path.join(fullDir, f);
    if (!isIndexable(fp)) return;
    const p = f === 'index.html'
      ? (localePrefix ? `/${localePrefix}/` : '/')
      : (localePrefix ? `/${localePrefix}/${f.replace('.html', '')}` : `/${f.replace('.html', '')}`);
    const url = `https://www.omniconverter.co.uk${p}`;
    if (!seen.has(url)) {
      seen.add(url);
      const isStaticPolicy = /privacy-policy|terms|about|contact|sitemap/.test(f);
      const defDate = f === 'index.html' || f === 'currency.html' || f === 'blog.html' ? '2026-10-16' : isStaticPolicy ? '2026-09-25' : '2026-10-14';
      entries.push({ url, lastmod: getLastModFromFile(fp, defDate) });
    }
  });

  const fullBlogDir = path.join(rootDir, blogDirRel);
  if (fs.existsSync(fullBlogDir)) {
    const blogHtmls = fs.readdirSync(fullBlogDir).filter(f => f.endsWith('.html'));
    blogHtmls.forEach(f => {
      const fp = path.join(fullBlogDir, f);
      if (!isIndexable(fp)) return;
      const p = localePrefix
        ? `/${localePrefix}/blog/${f.replace('.html', '')}`
        : `/blog/${f.replace('.html', '')}`;
      const url = `https://www.omniconverter.co.uk${p}`;
      if (!seen.has(url)) {
        seen.add(url);
        entries.push({ url, lastmod: getLastModFromFile(fp, '2026-10-08') });
      }
    });
  }
  return entries;
}

const enEntries = collectLocaleEntries('', '.', 'blog');
fs.writeFileSync(path.join(rootDir, 'sitemap-en.xml'), buildUrlSet(enEntries), 'utf8');
console.log(`sitemap-en.xml generated with ${enEntries.length} URLs!`);

const esEntries = collectLocaleEntries('es', 'es', 'es/blog');
fs.writeFileSync(path.join(rootDir, 'sitemap-es.xml'), buildUrlSet(esEntries), 'utf8');
console.log(`sitemap-es.xml generated with ${esEntries.length} URLs!`);

const deEntries = collectLocaleEntries('de', 'de', 'de/blog');
fs.writeFileSync(path.join(rootDir, 'sitemap-de.xml'), buildUrlSet(deEntries), 'utf8');
console.log(`sitemap-de.xml generated with ${deEntries.length} URLs!`);

const ptEntries = collectLocaleEntries('pt', 'pt', 'pt/blog');
fs.writeFileSync(path.join(rootDir, 'sitemap-pt.xml'), buildUrlSet(ptEntries), 'utf8');
console.log(`sitemap-pt.xml generated with ${ptEntries.length} URLs!`);
