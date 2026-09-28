const fs = require('fs');
const path = require('path');

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => path.join('blog', f));
const allFiles = rootFiles.concat(blogFiles);

let totalLinks = 0;
let brokenLinks = [];

const existingPages = new Set();
rootFiles.forEach(f => {
  existingPages.add('/' + f.replace('.html', ''));
  existingPages.add('/' + f);
  if (f === 'index.html') existingPages.add('/');
});
blogFiles.forEach(f => {
  const norm = '/' + f.replace(/\\/g, '/').replace('.html', '');
  existingPages.add(norm);
  existingPages.add(norm + '.html');
});

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hrefRegex = /href="([^"#:]+)"/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    let target = match[1];
    if (target.startsWith('http') || target.startsWith('mailto') || target.startsWith('tel') || target.startsWith('#') || target.includes('${')) {
      continue;
    }
    totalLinks++;
    let cleanTarget = target.startsWith('/') ? target : '/' + target;
    cleanTarget = cleanTarget.replace(/\.html$/, '');
    if (cleanTarget === '') cleanTarget = '/';

    // Check assets or pages
    if (cleanTarget.endsWith('.css') || cleanTarget.endsWith('.png') || cleanTarget.endsWith('.ico') || cleanTarget.endsWith('.xml') || cleanTarget.endsWith('.txt')) {
      const assetPath = cleanTarget.replace(/^\//, '');
      if (!fs.existsSync(assetPath)) {
        brokenLinks.push({ file, link: target });
      }
    } else {
      if (!existingPages.has(cleanTarget) && !existingPages.has(cleanTarget + '.html')) {
        brokenLinks.push({ file, link: target, cleanTarget });
      }
    }
  }
});

if (brokenLinks.length > 0) {
  console.error(`[FAILED] Found ${brokenLinks.length} broken links:`, brokenLinks.slice(0, 10));
  process.exit(1);
} else {
  console.log(`[PASS] Validated ${totalLinks} internal links across ${allFiles.length} HTML files with 0 broken links.`);
}
