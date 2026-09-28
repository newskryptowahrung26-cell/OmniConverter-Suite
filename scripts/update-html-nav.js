const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const items = [
  { href: '/', label: 'Home' },
  { href: '/currency', label: 'Currency' },
  { href: '/length', label: 'Length' },
  { href: '/temperature', label: 'Temperature' },
  { href: '/weight-mass', label: 'Weight' },
  { href: '/volume-capacity', label: 'Volume' },
  { href: '/time-duration', label: 'Time' },
  { href: '/area', label: 'Area' },
  { href: '/speed', label: 'Speed' },
  { href: '/file-media', label: 'Files' },
  { href: '/blog', label: 'Blog' }
];

function determineActiveHref(filePath, currentNavContent) {
  const normPath = filePath.replace(/\\/g, '/');
  if (normPath === 'index.html') return '/';
  if (normPath === 'currency.html') return '/currency';
  if (normPath === 'length.html') return '/length';
  if (normPath === 'temperature.html') return '/temperature';
  if (normPath === 'weight-mass.html') return '/weight-mass';
  if (normPath === 'volume-capacity.html') return '/volume-capacity';
  if (normPath === 'time-duration.html') return '/time-duration';
  if (normPath === 'area.html') return '/area';
  if (normPath === 'speed.html') return '/speed';
  if (normPath === 'file-media.html') return '/file-media';
  if (normPath === 'blog.html' || normPath.startsWith('blog/')) return '/blog';
  return null; // informational pages (about, contact, privacy-policy, terms, sitemap)
}

function buildNavTabs(activeHref, indent = '      ') {
  const linkLines = items.map(item => {
    const isActive = item.href === activeHref;
    const cls = isActive ? 'tab-btn active' : 'tab-btn';
    return `${indent}  <a href="${item.href}" class="${cls}">${item.label}</a>`;
  });

  return `${indent}<nav class="nav-tabs" aria-label="Converter category navigation">\n` +
         linkLines.join('\n') +
         `\n${indent}</nav>`;
}

const files = getHtmlFiles('.');
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const navRegex = /([ \t]*)<nav class="nav-tabs"[^>]*>([\s\S]*?)<\/nav>/;
  const match = content.match(navRegex);

  if (match) {
    const indent = match[1] || '      ';
    const activeHref = determineActiveHref(file, match[2]);
    const newNav = buildNavTabs(activeHref, indent);
    content = content.replace(navRegex, newNav);
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`[OK] Updated nav in ${file} (active: ${activeHref || 'none'})`);
  } else {
    console.warn(`[WARN] No nav-tabs found in ${file}`);
  }
});

console.log(`\nSuccessfully updated navigation tabs across ${updatedCount} HTML files!`);
