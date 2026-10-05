const fs = require('fs');
const path = require('path');

const sitemaps = {
  de: 'sitemap-de.xml',
  es: 'sitemap-es.xml',
  pt: 'sitemap-pt.xml',
  en: 'sitemap-en.xml'
};

let mismatches = 0;

for (const [lang, sitemapFile] of Object.entries(sitemaps)) {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  
  for (const u of sitemapUrls) {
    const urlObj = new URL(u);
    let filePath = urlObj.pathname.slice(1); // remove leading /
    if (!filePath || filePath === '') {
      filePath = 'index.html';
    } else if (filePath.endsWith('/')) {
      filePath += 'index.html';
    } else if (!filePath.endsWith('.html')) {
      filePath += '.html';
    }
    
    // Check if file exists locally
    if (!fs.existsSync(filePath)) {
      console.log(`[FILE MISSING] Sitemap URL ${u} -> File ${filePath} not found!`);
      mismatches++;
      continue;
    }
    
    // Read file and check canonical
    const content = fs.readFileSync(filePath, 'utf8');
    const canonicalMatch = content.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
    if (!canonicalMatch) {
      console.log(`[NO CANONICAL] File ${filePath} has no canonical tag!`);
      mismatches++;
    } else {
      const canonicalUrl = canonicalMatch[1];
      // Compare clean canonical (without .html) with sitemap URL
      const cleanCanonical = canonicalUrl.replace(/\.html$/, '');
      const cleanSitemapUrl = u.replace(/\.html$/, '');
      if (cleanCanonical !== cleanSitemapUrl) {
        console.log(`[MISMATCH] File: ${filePath}`);
        console.log(`  Canonical:   ${canonicalUrl} (clean: ${cleanCanonical})`);
        console.log(`  Sitemap loc: ${u} (clean: ${cleanSitemapUrl})`);
        mismatches++;
      }
    }
  }
}

console.log(`Total canonical vs sitemap mismatches: ${mismatches}`);
