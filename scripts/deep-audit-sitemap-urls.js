const fs = require('fs');
const path = require('path');

console.log('=== RIGOROUS SITEMAP URL & CANONICAL AUDIT ===\n');

// 1. Read sitemap.xml
if (!fs.existsSync('sitemap.xml')) {
  console.error('FATAL: sitemap.xml does not exist!');
  process.exit(1);
}

const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());

console.log(`Total URLs found in sitemap.xml: ${locMatches.length}`);

// 2. Check for Duplicate URLs in sitemap.xml
const seenUrls = new Map();
const duplicates = [];

for (let i = 0; i < locMatches.length; i++) {
  const u = locMatches[i];
  if (seenUrls.has(u)) {
    duplicates.push({ url: u, firstIndex: seenUrls.get(u), secondIndex: i });
  } else {
    seenUrls.set(u, i);
  }
}

if (duplicates.length > 0) {
  console.error(`\n[CRITICAL ERROR] Found ${duplicates.length} duplicate URLs in sitemap.xml:`);
  duplicates.forEach(d => console.error(`  - "${d.url}" at positions ${d.firstIndex} and ${d.secondIndex}`));
} else {
  console.log(`[PASS] 0 Duplicate URLs found in sitemap.xml! Every single URL is 100% UNIQUE.`);
}

// 3. Check for Near-Duplicates (e.g. trailing slash variations or uppercase/lowercase differences)
const normalizedUrls = new Map();
const nearDuplicates = [];

for (const u of locMatches) {
  // Normalize: lower case, remove trailing slash (except domain root)
  let norm = u.toLowerCase();
  if (norm.endsWith('/') && norm !== 'https://www.omniconverter.co.uk/' && norm !== 'https://www.omniconverter.co.uk/es/' && norm !== 'https://www.omniconverter.co.uk/de/' && norm !== 'https://www.omniconverter.co.uk/pt/') {
    norm = norm.slice(0, -1);
  }
  norm = norm.replace(/\.html$/, '');

  if (normalizedUrls.has(norm)) {
    nearDuplicates.push({ original: u, conflictWith: normalizedUrls.get(norm) });
  } else {
    normalizedUrls.set(norm, u);
  }
}

if (nearDuplicates.length > 0) {
  console.error(`\n[WARNING] Found ${nearDuplicates.length} near-duplicate/case/slash variations:`);
  nearDuplicates.forEach(d => console.error(`  - "${d.original}" conflicts with "${d.conflictWith}"`));
} else {
  console.log(`[PASS] 0 Near-duplicate or slash/casing variations!`);
}

// 4. Check for Protocol and Domain Consistency
const invalidDomainOrProtocol = [];
for (const u of locMatches) {
  if (!u.startsWith('https://www.omniconverter.co.uk')) {
    invalidDomainOrProtocol.push(u);
  }
  if (u.includes('http://') || u.includes('://omniconverter.co.uk')) {
    invalidDomainOrProtocol.push(u);
  }
}

if (invalidDomainOrProtocol.length > 0) {
  console.error(`\n[CRITICAL ERROR] Found ${invalidDomainOrProtocol.length} URLs with non-canonical domain or http:`);
  invalidDomainOrProtocol.forEach(u => console.error(`  - ${u}`));
} else {
  console.log(`[PASS] All ${locMatches.length} URLs strictly use "https://www.omniconverter.co.uk" with 0 HTTP/non-www leaks.`);
}

// 5. Check 1-to-1 Mapping: Does every URL correspond to a real HTML file on disk?
const missingFiles = [];
const canonicalMismatches = [];
const seenCanonicals = new Map();

for (const u of locMatches) {
  const urlObj = new URL(u);
  let relPath = urlObj.pathname.slice(1);
  if (!relPath || relPath === '') {
    relPath = 'index.html';
  } else if (relPath.endsWith('/')) {
    relPath += 'index.html';
  } else if (!relPath.endsWith('.html')) {
    relPath += '.html';
  }

  if (!fs.existsSync(relPath)) {
    missingFiles.push({ url: u, expectedFile: relPath });
    continue;
  }

  // Check the actual file's canonical tag
  const fileContent = fs.readFileSync(relPath, 'utf8');
  const canonicalMatch = fileContent.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is);
  if (!canonicalMatch) {
    canonicalMismatches.push({ url: u, file: relPath, issue: 'No canonical tag in HTML' });
  } else {
    const fileCanonical = canonicalMatch[1].trim();
    // Compare
    const cleanFileCan = fileCanonical.replace(/\.html$/, '');
    const cleanSitemapLoc = u.replace(/\.html$/, '');
    if (cleanFileCan !== cleanSitemapLoc) {
      canonicalMismatches.push({
        url: u,
        file: relPath,
        fileCanonical: fileCanonical,
        issue: 'Mismatch between HTML canonical and Sitemap loc'
      });
    }

    // Check if multiple different files declare the same canonical tag (Canonical cannibalization)
    if (seenCanonicals.has(cleanFileCan)) {
      canonicalMismatches.push({
        url: u,
        file: relPath,
        duplicateOf: seenCanonicals.get(cleanFileCan),
        issue: 'Multiple pages claiming the same canonical URL!'
      });
    } else {
      seenCanonicals.set(cleanFileCan, relPath);
    }
  }
}

if (missingFiles.length > 0) {
  console.error(`\n[CRITICAL ERROR] Found ${missingFiles.length} sitemap URLs with NO corresponding HTML file on disk:`);
  missingFiles.forEach(m => console.error(`  - URL: ${m.url} -> File missing: ${m.expectedFile}`));
} else {
  console.log(`[PASS] All ${locMatches.length} URLs map to real, existing HTML files on disk.`);
}

if (canonicalMismatches.length > 0) {
  console.error(`\n[CRITICAL ERROR] Found ${canonicalMismatches.length} canonical discrepancies:`);
  canonicalMismatches.forEach(c => console.error(`  - ${c.file}: ${c.issue}`));
} else {
  console.log(`[PASS] 0 Canonical discrepancies! Every page has a strictly unique, self-referencing canonical URL matching the sitemap 100%.`);
}

// 6. Check individual sub-sitemaps (sitemap-en, sitemap-es, sitemap-de, sitemap-pt)
const subSitemaps = ['sitemap-en.xml', 'sitemap-es.xml', 'sitemap-de.xml', 'sitemap-pt.xml'];
let subTotal = 0;
const subUrlSet = new Set();
let subDuplicates = 0;

for (const sm of subSitemaps) {
  if (fs.existsSync(sm)) {
    const smContent = fs.readFileSync(sm, 'utf8');
    const urls = [...smContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
    subTotal += urls.length;
    urls.forEach(u => {
      if (subUrlSet.has(u)) {
        console.error(`[CROSS-SITEMAP DUPLICATE] URL "${u}" exists in multiple sub-sitemaps!`);
        subDuplicates++;
      } else {
        subUrlSet.add(u);
      }
    });
  }
}

console.log(`\nSub-sitemaps check:`);
console.log(`  Total URLs across 4 sub-sitemaps: ${subTotal}`);
console.log(`  Cross-sitemap duplicates: ${subDuplicates}`);

// 7. Check if total HTML files on disk matches total URLs in sitemap
function getAllDiskHtml(dir) {
  let list = [];
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', 'scripts'].includes(f)) continue;
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) list = list.concat(getAllDiskHtml(fp));
    else if (f.endsWith('.html')) list.push(fp);
  }
  return list;
}
const diskFiles = getAllDiskHtml('.');
console.log(`\nInventory check:`);
console.log(`  Total HTML files on disk: ${diskFiles.length}`);
console.log(`  Total URLs in sitemap.xml: ${locMatches.length}`);
if (diskFiles.length === locMatches.length) {
  console.log(`  [PERFECT MATCH] Every single HTML file on disk is in sitemap.xml, and no extra orphan files exist!`);
} else {
  console.log(`  [DIFFERENCE] Disk: ${diskFiles.length}, Sitemap: ${locMatches.length}`);
  // Find which ones differ
  const sitemapNormalized = new Set(locMatches.map(u => {
    const urlObj = new URL(u);
    let r = urlObj.pathname.slice(1);
    if (!r || r === '') return 'index.html';
    if (r.endsWith('/')) return r + 'index.html';
    if (!r.endsWith('.html')) return r + '.html';
    return r;
  }));
  const unmappedDiskFiles = diskFiles.filter(f => !sitemapNormalized.has(f.replace(/\\/g, '/')));
  if (unmappedDiskFiles.length > 0) {
    console.log(`  Files on disk not in sitemap:`, unmappedDiskFiles);
  }
}

console.log('\n=== AUDIT COMPLETE ===');
