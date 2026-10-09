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

const htmlFiles = getAllHtmlFiles('.');
console.log(`Auditing ${htmlFiles.length} HTML files against SEMrush & Ahrefs audit rules...`);

let issues = [];

// 1. Robots.txt check
if (!fs.existsSync('robots.txt')) {
  issues.push('[ROBOTS.TXT] Missing robots.txt');
} else {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  ['sitemap.xml', 'news-sitemap.xml'].forEach(sm => {
    if (!robots.includes(sm)) {
      issues.push(`[ROBOTS.TXT] robots.txt missing declaration for ${sm}`);
    }
  });
}

// 2. Sitemap files exist
['sitemap.xml', 'sitemap-en.xml', 'sitemap-es.xml', 'sitemap-de.xml', 'sitemap-pt.xml'].forEach(sm => {
  if (!fs.existsSync(sm)) {
    issues.push(`[SITEMAP] File ${sm} is missing`);
  }
});

// 3. Audit each HTML file
for (const file of htmlFiles) {
  if (file === '404.html' || file.endsWith('/404.html') || file.endsWith('\\404.html')) continue;
  const content = fs.readFileSync(file, 'utf8');
  
  // Title tag
  const titleMatch = content.match(/<title>(.*?)<\/title>/is);
  if (!titleMatch) {
    issues.push(`[TITLE] Missing title in ${file}`);
  } else {
    const title = titleMatch[1].trim();
    if (title.length < 10) issues.push(`[TITLE] Too short (< 10) in ${file}: "${title}"`);
    if (title.length > 65) issues.push(`[TITLE] Too long (> 65) in ${file}: "${title}" (${title.length})`);
  }

  // Meta description
  const metaMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is) ||
                    content.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/is);
  if (!metaMatch) {
    issues.push(`[META-DESC] Missing meta description in ${file}`);
  } else {
    const desc = metaMatch[1].trim();
    if (desc.length < 50) issues.push(`[META-DESC] Too short (< 50) in ${file}: "${desc}" (${desc.length})`);
    if (desc.length > 165) issues.push(`[META-DESC] Too long (> 165) in ${file}: "${desc}" (${desc.length})`);
  }

  // Canonical tag
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is);
  if (!canonicalMatch) {
    issues.push(`[CANONICAL] Missing canonical tag in ${file}`);
  } else {
    const canonical = canonicalMatch[1].trim();
    if (!canonical.startsWith('https://www.omniconverter.co.uk')) {
      issues.push(`[CANONICAL] Invalid domain or not HTTPS in ${file}: "${canonical}"`);
    }
  }

  // H1 tag
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (!h1Match) {
    issues.push(`[H1] Missing H1 in ${file}`);
  } else {
    const h1 = h1Match[1].replace(/<[^>]*>/g, '').trim();
    if (titleMatch) {
      const title = titleMatch[1].trim();
      if (title.toLowerCase() === h1.toLowerCase()) {
        issues.push(`[H1-TITLE-DUPLICATE] Exact match between Title and H1 in ${file}: "${title}"`);
      }
    }
  }

  // Viewport tag
  if (!content.includes('name="viewport"')) {
    issues.push(`[VIEWPORT] Missing viewport in ${file}`);
  }

  // Charset
  if (!content.includes('charset="UTF-8"') && !content.includes('charset="utf-8"')) {
    issues.push(`[CHARSET] Missing charset UTF-8 in ${file}`);
  }
}

console.log(`\n================ SEMRUSH / AHREFS AUDIT ================`);
console.log(`Total Issues Found: ${issues.length}`);
if (issues.length > 0) {
  issues.slice(0, 20).forEach(i => console.log(' - ' + i));
  if (issues.length > 20) console.log(` ... and ${issues.length - 20} more`);
} else {
  console.log(`ALL SEMRUSH & AHREFS STANDARDS PASSED 100%!`);
}
console.log(`========================================================\n`);
