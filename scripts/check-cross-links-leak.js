const fs = require('fs');
const path = require('path');

const dirs = [
  { lang: 'es', dir: 'es/blog' },
  { lang: 'de', dir: 'de/blog' },
  { lang: 'pt', dir: 'pt/blog' }
];

let leakCount = 0;
let total = 0;
dirs.forEach(({ lang, dir }) => {
  fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html').forEach(f => {
    total++;
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const blockMatch = content.match(/<!-- CROSS_LINKS_BLOCK -->[\s\S]*?<\/div>/);
    if (blockMatch && blockMatch[0].includes('href="/blog/')) {
      leakCount++;
    }
  });
});
console.log(`Checked ${total} localized articles. Found ${leakCount} with English /blog/ cross-links.`);
