const fs = require('fs');

const slugs = [
  '70kg-in-stone',
  '4-meters-to-feet',
  '1-bigha-in-square-feet',
  '5-usd-to-aud',
  'convert-file-type-to-pdf',
  'convert-pdf-form',
  '1-aud-to-vnd',
  '100-fahrenheit-to-celsius'
];

slugs.forEach(s => {
  const p = 'blog/' + s + '.html';
  if (!fs.existsSync(p)) {
    console.log(s, 'NOT FOUND on disk');
    return;
  }
  const html = fs.readFileSync(p, 'utf8');
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';
  const noindex = html.includes('noindex');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'NONE';
  const hasTable = html.includes('<table');
  const hasFaq = html.includes('FAQPage');
  const hasInteractiveWidget = html.includes('widget') || html.includes('calc') || html.includes('interactive');
  const hreflangs = [...html.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(m => m[1] + ':' + m[2]);
  
  console.log(`\n=== ${s} ===`);
  console.log(`Title: ${title}`);
  console.log(`Canonical: ${canonical}`);
  console.log(`Word Count: ${words} words`);
  console.log(`Noindex: ${noindex}`);
  console.log(`Has Table: ${hasTable} | Has FAQ: ${hasFaq}`);
  console.log(`Hreflangs (${hreflangs.length}): ${hreflangs.join(' | ')}`);
});
