const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'dist', 'scripts'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Mimic Ahrefs text extractor: remove scripts, styles, header, footer, nav
function getAhrefsWordCount(html) {
  let text = html;
  // Remove head
  text = text.replace(/<head[\s\S]*?<\/head>/gi, ' ');
  // Remove scripts & styles
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  // Ahrefs often discounts header and footer
  text = text.replace(/<header[\s\S]*?<\/header>/gi, ' ');
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text.replace(/&[a-z0-9#]+;/gi, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  if (!text) return 0;
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

const files = getAllHtmlFiles('.');
const lowCountPages = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const count = getAhrefsWordCount(content);
  if (count < 280) { // target >= 280 (Ahrefs threshold is 250)
    lowCountPages.push({ file, count });
  }
}

lowCountPages.sort((a, b) => a.count - b.count);

console.log(`Found ${lowCountPages.length} pages with word count < 280 (Ahrefs style):`);
lowCountPages.forEach(p => {
  console.log(`  ${p.file}: ${p.count} words`);
});
