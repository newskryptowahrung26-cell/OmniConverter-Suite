const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const navMatch = content.match(/<nav class="nav-tabs"[\s\S]*?<\/nav>/);
  if (!navMatch) return false;

  const originalNav = navMatch[0];
  if (originalNav.includes('/indian-units')) {
    return false; // Already has it
  }

  // Find the Home link line and insert Indian Units right after
  const homeLinkRegex = /([ \t]*<a href="\/" class="tab-btn(?: active)?">Home<\/a>)/;
  if (!homeLinkRegex.test(originalNav)) {
    console.warn(`[WARN] Could not find Home link in ${filePath}`);
    return false;
  }

  const updatedNav = originalNav.replace(homeLinkRegex, (match, p1) => {
    const indent = match.match(/^[ \t]*/)[0];
    return `${p1}\n${indent}<a href="/indian-units" class="tab-btn">🇮🇳 Indian Units</a>`;
  });

  content = content.replace(originalNav, updatedNav);
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// 1. Root HTML files
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let updatedCount = 0;

rootFiles.forEach(f => {
  if (processFile(f)) {
    console.log(`[OK] Updated root nav: ${f}`);
    updatedCount++;
  }
});

// 2. Blog HTML files
if (fs.existsSync('blog')) {
  const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html'));
  blogFiles.forEach(f => {
    const p = path.join('blog', f);
    if (processFile(p)) {
      console.log(`[OK] Updated blog nav: ${p}`);
      updatedCount++;
    }
  });
}

console.log(`\nSuccessfully updated navigation in ${updatedCount} files.`);
