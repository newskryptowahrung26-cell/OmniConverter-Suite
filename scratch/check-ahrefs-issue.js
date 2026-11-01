const fs = require('fs');

const files = [
  'blog/100-usd-to-aud.html',
  'de/blog/100-usd-in-aud.html',
  'es/blog/100-usd-a-aud.html',
  'pt/blog/100-usd-para-aud.html',
  'blog/2000-dollars-in-pounds.html',
  'blog/2000-usd-to-gbp.html',
  'es/blog/2000-usd-a-gbp.html',
  'de/blog/2000-usd-in-gbp.html',
  'pt/blog/2000-usd-para-gbp.html',
  'pt/blog/2000-usd-to-gbp.html'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const canonMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
    const hreflangs = [...content.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
    console.log('=== ' + f + ' ===');
    console.log(' Canonical:', canonMatch ? canonMatch[0] : 'NONE');
    console.log(' Hreflangs:');
    hreflangs.forEach(h => console.log('   ' + h));
  } else {
    console.log('=== ' + f + ' (DOES NOT EXIST) ===');
  }
}
