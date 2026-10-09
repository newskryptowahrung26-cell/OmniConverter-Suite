const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getAllHtmlFiles('.');
console.log(`Analyzing ${allFiles.length} HTML files...`);

// 1. Check Internal Links (Inlinks) to find Orphan pages
const urlToInlinks = new Map();
const fileToUrl = new Map();

allFiles.forEach(f => {
  let rel = path.relative('.', f).replace(/\\/g, '/');
  let urlPath;
  if (rel === 'index.html') urlPath = '/';
  else if (rel.endsWith('/index.html')) urlPath = '/' + rel.replace('/index.html', '/');
  else urlPath = '/' + rel.replace('.html', '');
  
  fileToUrl.set(f, urlPath);
  urlToInlinks.set(urlPath, new Set());
});

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const sourceUrl = fileToUrl.get(f);
  // Match hrefs
  const matches = content.matchAll(/href="([^"#:]+)"/g);
  for (const match of matches) {
    let target = match[1];
    if (target.startsWith('//') || target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('tel:')) continue;
    if (!target.startsWith('/')) {
      target = '/' + target;
    }
    // Clean trailing .html if any
    target = target.replace(/\.html$/, '');
    if (urlToInlinks.has(target)) {
      urlToInlinks.get(target).add(sourceUrl);
    }
  }
});

const orphanPages = [];
urlToInlinks.forEach((inlinks, url) => {
  if (inlinks.size === 0 && url !== '/' && url !== '/404') {
    orphanPages.push({ url, inlinks: inlinks.size });
  }
});
console.log(`\n=== 1. ORPHAN PAGES (${orphanPages.length}) ===`);
orphanPages.forEach(p => console.log(`  ${p.url} (inlinks: ${p.inlinks})`));

// 2. Check Hreflang Reciprocal Consistency
console.log('\n=== 2. HREFLANG RECIPROCAL ANALYSIS ===');
const urlHreflangs = new Map();

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const url = fileToUrl.get(f);
  const hreflangs = [];
  const matches = content.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="https:\/\/www\.omniconverter\.co\.uk([^"]*)"/g);
  for (const m of matches) {
    hreflangs.push({ lang: m[1], target: m[2] || '/' });
  }
  urlHreflangs.set(url, hreflangs);
});

let brokenHreflangs = [];
urlHreflangs.forEach((links, sourceUrl) => {
  links.forEach(l => {
    if (l.lang === 'x-default') return;
    const targetUrl = l.target;
    const targetHreflangs = urlHreflangs.get(targetUrl);
    if (!targetHreflangs) {
      brokenHreflangs.push({ sourceUrl, error: `Target URL ${targetUrl} (${l.lang}) does not exist!` });
    } else {
      // Find return tag
      const returnTag = targetHreflangs.find(t => t.target === sourceUrl);
      if (!returnTag) {
        brokenHreflangs.push({
          sourceUrl,
          targetUrl,
          lang: l.lang,
          error: `Target ${targetUrl} does NOT link back to ${sourceUrl}`
        });
      }
    }
  });
});
console.log(`Total broken / missing reciprocal hreflangs: ${brokenHreflangs.length}`);
brokenHreflangs.forEach(b => console.log(' ', b));

// 3. Structured Data JSON-LD Errors
console.log('\n=== 3. STRUCTURED DATA VALIDATION ===');
let schemaErrors = [];
allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const url = fileToUrl.get(f);
  const matches = content.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  for (const m of matches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => validateSchemaItem(item, url, schemaErrors));
      } else {
        validateSchemaItem(parsed, url, schemaErrors);
      }
    } catch (e) {
      schemaErrors.push({ url, error: `JSON Parse error: ${e.message}` });
    }
  }
});

function validateSchemaItem(item, url, errors) {
  if (!item['@context']) errors.push({ url, error: 'Missing @context' });
  if (!item['@type']) errors.push({ url, error: 'Missing @type' });
  if (item['@type'] === 'Article') {
    if (!item.headline) errors.push({ url, error: 'Article missing headline' });
    if (!item.datePublished) errors.push({ url, error: 'Article missing datePublished' });
    if (!item.author) errors.push({ url, error: 'Article missing author' });
    if (!item.publisher) errors.push({ url, error: 'Article missing publisher' });
    if (!item.image) errors.push({ url, error: 'Article missing image' });
  }
  if (item['@type'] === 'SoftwareApplication') {
    if (!item.name) errors.push({ url, error: 'SoftwareApplication missing name' });
    if (!item.applicationCategory) errors.push({ url, error: 'SoftwareApplication missing applicationCategory' });
  }
}
console.log(`Total schema validation issues: ${schemaErrors.length}`);
schemaErrors.slice(0, 15).forEach(e => console.log(' ', e));

// 4. Title and Meta Description lengths
console.log('\n=== 4. TITLE & META DESCRIPTION LENGTHS ===');
let titleTooLong = [];
let descTooShort = [];
let descTooLong = [];

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const url = fileToUrl.get(f);
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length > 60) titleTooLong.push({ url, len: title.length, title });
  }
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length < 50) descTooShort.push({ url, len: desc.length, desc });
    if (desc.length > 160) descTooLong.push({ url, len: desc.length, desc });
  }
});
console.log(`Title too long (> 60 chars): ${titleTooLong.length}`);
console.log(`Meta description too short (< 50 chars): ${descTooShort.length}`);
console.log(`Meta description too long (> 160 chars): ${descTooLong.length}`);
