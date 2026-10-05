const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item !== 'node_modules' && item !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
const summary = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<header>([\s\S]*?)<\/header>/);
  if (m) {
    const hasLogo = m[1].includes('class="logo"');
    const hasBtn = m[1].includes('class="mobile-menu-btn"');
    const hasNav = m[1].includes('class="nav-tabs"');
    const hasLang = m[1].includes('class="lang-switcher"');
    summary.add(JSON.stringify({ hasLogo, hasBtn, hasNav, hasLang }));
  } else {
    summary.add('NO_HEADER');
  }
});

console.log('Audited', files.length, 'HTML files:');
console.log(Array.from(summary));
