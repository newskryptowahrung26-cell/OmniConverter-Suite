const fs = require('fs');

const files = [
  'sitemap.xml',
  'sitemap-en.xml',
  'sitemap-es.xml',
  'sitemap-de.xml',
  'sitemap-pt.xml',
  'news-sitemap.xml'
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`MISSING: ${file}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for BOM or invisible characters before <?xml
  if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.log(`WARNING: ${file} does not start cleanly with XML declaration!`);
  }
  
  // Check closing tags matching
  const urlOpen = (content.match(/<url>/g) || []).length;
  const urlClose = (content.match(/<\/url>/g) || []).length;
  const locOpen = (content.match(/<loc>/g) || []).length;
  const locClose = (content.match(/<\/loc>/g) || []).length;
  
  const sitemapOpen = (content.match(/<sitemap>/g) || []).length;
  const sitemapClose = (content.match(/<\/sitemap>/g) || []).length;

  console.log(`${file}:`);
  if (urlOpen > 0 || urlClose > 0) {
    console.log(`  <url> count: ${urlOpen}, </url> count: ${urlClose}`);
    console.log(`  <loc> count: ${locOpen}, </loc> count: ${locClose}`);
    if (urlOpen !== urlClose || locOpen !== locClose) {
      console.log(`  ERROR: Mismatched tags in ${file}!`);
    }
  }
  if (sitemapOpen > 0 || sitemapClose > 0) {
    console.log(`  <sitemap> count: ${sitemapOpen}, </sitemap> count: ${sitemapClose}`);
    if (sitemapOpen !== sitemapClose) {
      console.log(`  ERROR: Mismatched sitemap tags in ${file}!`);
    }
  }

  // Check for any unescaped & (ampersand)
  const ampersands = content.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  if (ampersands) {
    console.log(`  ERROR: Found unescaped ampersands: ${ampersands.length}`);
  } else {
    console.log(`  Ampersands valid.`);
  }

  // Check last line
  const endsWithUrlset = content.trim().endsWith('</urlset>') || content.trim().endsWith('</sitemapindex>');
  console.log(`  Ends cleanly: ${endsWithUrlset}`);
}
