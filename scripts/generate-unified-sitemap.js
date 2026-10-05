import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Collect all URLs from sitemap-en.xml, sitemap-es.xml, sitemap-de.xml, sitemap-pt.xml
const sitemaps = ['sitemap-en.xml', 'sitemap-es.xml', 'sitemap-de.xml', 'sitemap-pt.xml'];
const allUrls = [];

for (const sm of sitemaps) {
  const filePath = path.join(rootDir, sm);
  const content = fs.readFileSync(filePath, 'utf8');
  const urlMatches = content.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const m of urlMatches) {
    allUrls.push(m.trim());
  }
}

console.log(`Total URLs collected across all 4 languages: ${allUrls.length}`);

// Generate unified sitemap.xml
let unifiedXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const entry of allUrls) {
  unifiedXml += `  ${entry}\n`;
}
unifiedXml += `</urlset>\n`;

const targetFile = path.join(rootDir, 'sitemap.xml');
fs.writeFileSync(targetFile, unifiedXml, 'utf8');
console.log(`Successfully generated unified sitemap.xml with ${allUrls.length} URLs!`);
