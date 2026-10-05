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
let fixed = 0;

const btnTemplate = `      <button type="button" class="mobile-menu-btn" onclick="const n=this.nextElementSibling||document.querySelector('.nav-tabs');if(n)n.classList.toggle('is-open');" aria-label="Toggle navigation menu">
        <span>Menu</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>\n`;

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('<header>') && !c.includes('mobile-menu-btn')) {
    c = c.replace(/(<\/a>\s*)(<nav class="nav-tabs")/i, `$1${btnTemplate}$2`);
    fs.writeFileSync(f, c, 'utf8');
    fixed++;
    console.log(`[FIXED] Added mobile-menu-btn to: ${f}`);
  }
});

console.log(`Total files updated with mobile-menu-btn: ${fixed}`);
