import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const issues = {
  adsense: [],
  seoHead: [],
  socialMeta: [],
  h1: [],
  footerNav: [],
  images: [],
  assets: [],
  rawCode: [],
  sitemap: [],
  schemas: []
};

// 1. Collect all HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Auditing ${htmlFiles.length} HTML files...`);

for (const filePath of htmlFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  // AdSense checks
  const hasAdSenseScript = content.includes('pagead2.googlesyndication.com') && content.includes('ca-pub-4766868021895107');
  const hasAdSenseMeta = content.includes('google-adsense-account') && content.includes('ca-pub-4766868021895107');
  if (!hasAdSenseScript) {
    issues.adsense.push(`${relPath}: Missing AdSense script tag with ca-pub-4766868021895107`);
  }
  if (!hasAdSenseMeta) {
    issues.adsense.push(`${relPath}: Missing AdSense meta tag (google-adsense-account)`);
  }

  // Head checks: title, meta description, viewport, canonical, charset
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.seoHead.push(`${relPath}: Missing or empty <title>`);
  }

  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    issues.seoHead.push(`${relPath}: Missing or empty meta description`);
  }

  const viewportMatch = content.match(/<meta\s+name=["']viewport["']/i);
  if (!viewportMatch) {
    issues.seoHead.push(`${relPath}: Missing meta viewport`);
  }

  const charsetMatch = content.match(/<meta\s+charset=["']utf-8["']/i);
  if (!charsetMatch) {
    issues.seoHead.push(`${relPath}: Missing or non-UTF-8 charset tag`);
  }

  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                         content.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  if (!canonicalMatch || !canonicalMatch[1].trim()) {
    issues.seoHead.push(`${relPath}: Missing canonical tag`);
  } else {
    const canonical = canonicalMatch[1].trim();
    if (!canonical.startsWith('https://www.omniconverter.co.uk')) {
      issues.seoHead.push(`${relPath}: Canonical tag does not point to https://www.omniconverter.co.uk (${canonical})`);
    }
  }

  // Social / OpenGraph checks
  const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(content);
  const hasOgDesc = /<meta\s+property=["']og:description["']/i.test(content);
  const hasOgUrl = /<meta\s+property=["']og:url["']/i.test(content);
  const hasOgImg = /<meta\s+property=["']og:image["']/i.test(content);
  const hasTwitterCard = /<meta\s+name=["']twitter:card["']/i.test(content);

  const missingSocial = [];
  if (!hasOgTitle) missingSocial.push('og:title');
  if (!hasOgDesc) missingSocial.push('og:description');
  if (!hasOgUrl) missingSocial.push('og:url');
  if (!hasOgImg) missingSocial.push('og:image');
  if (!hasTwitterCard) missingSocial.push('twitter:card');

  if (missingSocial.length > 0) {
    issues.socialMeta.push(`${relPath}: Missing social tags: ${missingSocial.join(', ')}`);
  }

  // H1 checks
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    issues.h1.push(`${relPath}: Missing <h1> tag`);
  } else if (h1Matches.length > 1) {
    issues.h1.push(`${relPath}: Multiple <h1> tags (${h1Matches.length} found)`);
  }

  // Footer Navigation checks
  const missingFooter = [];
  if (!content.includes('/privacy-policy')) missingFooter.push('/privacy-policy');
  if (!content.includes('/terms')) missingFooter.push('/terms');
  if (!content.includes('/about')) missingFooter.push('/about');
  if (!content.includes('/contact')) missingFooter.push('/contact');
  if (!content.includes('/sitemap')) missingFooter.push('/sitemap');
  if (!content.includes('/blog')) missingFooter.push('/blog');

  if (missingFooter.length > 0) {
    issues.footerNav.push(`${relPath}: Footer missing links: ${missingFooter.join(', ')}`);
  }

  // Image checks (alt text + asset existence) in static HTML (strip <script> blocks first)
  const contentNoScripts = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  const imgRegex = /<img\s+([^>]+)>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(contentNoScripts)) !== null) {
    const imgAttrs = imgMatch[1];
    const srcMatch = imgAttrs.match(/src=["']([^"']+)["']/i);
    const altMatch = imgAttrs.match(/alt=["']([^"']*)["']/i);

    if (!altMatch) {
      issues.images.push(`${relPath}: Image missing alt attribute: ${imgMatch[0].slice(0, 80)}`);
    }

    if (srcMatch) {
      const src = srcMatch[1];
      if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
        const cleanSrc = src.split('?')[0].split('#')[0];
        const assetPath = cleanSrc.startsWith('/')
          ? path.join(rootDir, cleanSrc.slice(1))
          : path.join(path.dirname(filePath), cleanSrc);
        if (!fs.existsSync(assetPath)) {
          issues.assets.push(`${relPath}: Missing local image asset: ${src}`);
        }
      }
    }
  }

  // Script & Stylesheet local asset checks
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    const src = scriptMatch[1];
    if (!src.startsWith('http') && !src.startsWith('//')) {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const assetPath = cleanSrc.startsWith('/')
        ? path.join(rootDir, cleanSrc.slice(1))
        : path.join(path.dirname(filePath), cleanSrc);
      if (!fs.existsSync(assetPath)) {
        issues.assets.push(`${relPath}: Missing local script asset: ${src}`);
      }
    }
  }

  const cssRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let cssMatch;
  while ((cssMatch = cssRegex.exec(content)) !== null) {
    const href = cssMatch[1];
    if (!href.startsWith('http') && !href.startsWith('//')) {
      const cleanHref = href.split('?')[0].split('#')[0];
      const assetPath = cleanHref.startsWith('/')
        ? path.join(rootDir, cleanHref.slice(1))
        : path.join(path.dirname(filePath), cleanHref);
      if (!fs.existsSync(assetPath)) {
        issues.assets.push(`${relPath}: Missing local stylesheet asset: ${href}`);
      }
    }
  }

  // Raw code & LaTeX checks
  if (content.includes('\\(') || content.includes('\\)')) {
    issues.rawCode.push(`${relPath}: Found raw LaTeX tags \\( or \\)`);
  }
  if (content.includes('[object Object]')) {
    issues.rawCode.push(`${relPath}: Found [object Object]`);
  }

  // JSON-LD validation
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdRegex.exec(content)) !== null) {
    const jsonStr = jsonLdMatch[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!item['@context']) {
          issues.schemas.push(`${relPath}: JSON-LD item missing @context`);
        }
        if (!item['@type'] && !item['@graph']) {
          issues.schemas.push(`${relPath}: JSON-LD item missing @type or @graph`);
        }
      }
    } catch (e) {
      issues.schemas.push(`${relPath}: Invalid JSON in JSON-LD script: ${e.message}`);
    }
  }
}

// 2. Sitemap checks
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  issues.sitemap.push('sitemap.xml is missing');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  let locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

  if (sitemapContent.includes('<sitemapindex')) {
    const childLocs = [];
    for (const smLoc of locMatches) {
      try {
        const u = new URL(smLoc);
        const smFile = path.join(rootDir, path.basename(u.pathname));
        if (fs.existsSync(smFile)) {
          const subContent = fs.readFileSync(smFile, 'utf8');
          const subLocs = [...subContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
          childLocs.push(...subLocs);
        } else {
          issues.sitemap.push(`Sitemap index references missing file: ${smLoc} -> ${smFile}`);
        }
      } catch (e) {
        issues.sitemap.push(`Invalid sitemap index loc: ${smLoc}`);
      }
    }
    locMatches = childLocs;
  }

  // Check if every HTML page is in sitemap.xml
  for (const filePath of htmlFiles) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    let urlPath;
    if (relPath === 'index.html') {
      urlPath = 'https://www.omniconverter.co.uk/';
    } else if (relPath.endsWith('/index.html')) {
      urlPath = `https://www.omniconverter.co.uk/${relPath.replace(/\/index\.html$/, '/')}`;
    } else if (relPath.endsWith('.html')) {
      urlPath = `https://www.omniconverter.co.uk/${relPath.replace(/\.html$/, '')}`;
    }
    const withHtml = `https://www.omniconverter.co.uk/${relPath}`;

    const found = locMatches.some(loc => loc === urlPath || loc === withHtml || (urlPath === 'https://www.omniconverter.co.uk/' && loc === 'https://www.omniconverter.co.uk') || (urlPath.endsWith('/') && loc === urlPath.slice(0, -1)));
    if (!found) {
      issues.sitemap.push(`Page missing from sitemap.xml: ${relPath} (expected ${urlPath})`);
    }
  }

  // Check if sitemap.xml has dead links that do not correspond to any file
  for (const loc of locMatches) {
    try {
      const u = new URL(loc);
      let p = u.pathname;
      if (p === '/' || p === '') {
        p = '/index.html';
      } else if (p.endsWith('/')) {
        p = p + 'index.html';
      } else if (!p.endsWith('.html')) {
        p = p + '.html';
      }
      const localFile = path.join(rootDir, p.slice(1));
      if (!fs.existsSync(localFile)) {
        issues.sitemap.push(`sitemap.xml contains URL with no corresponding file: ${loc} -> ${localFile}`);
      }
    } catch (e) {
      issues.sitemap.push(`sitemap.xml invalid URL: ${loc}`);
    }
  }
}

// 3. robots.txt and ads.txt checks
const robotsPath = path.join(rootDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  issues.seoHead.push('robots.txt is missing');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('sitemap.xml')) {
    issues.seoHead.push('robots.txt missing sitemap.xml directive');
  }
}

const adsPath = path.join(rootDir, 'ads.txt');
if (!fs.existsSync(adsPath)) {
  issues.adsense.push('ads.txt is missing');
} else {
  const ads = fs.readFileSync(adsPath, 'utf8');
  if (!ads.includes('pub-4766868021895107')) {
    issues.adsense.push('ads.txt missing pub-4766868021895107');
  }
}

// Summary Report
console.log('\n================ AUDIT RESULTS ================');
let totalIssues = 0;
for (const [category, list] of Object.entries(issues)) {
  console.log(`\n[${category.toUpperCase()}] Issues: ${list.length}`);
  if (list.length > 0) {
    list.slice(0, 10).forEach(item => console.log(`  - ${item}`));
    if (list.length > 10) console.log(`  ... and ${list.length - 10} more`);
  }
  totalIssues += list.length;
}

console.log(`\n================================================`);
console.log(`TOTAL ISSUES FOUND: ${totalIssues}`);
