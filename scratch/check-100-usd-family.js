const fs = require('fs');

const files = [
  'blog/100-usd-to-aud.html',
  'blog/100-usd-in-australian.html',
  'es/blog/100-usd-a-aud.html',
  'de/blog/100-usd-in-aud.html',
  'de/blog/100-usd-in-australische-dollar.html',
  'pt/blog/100-usd-para-aud.html',
  'pt/blog/100-usd-em-dolar-australiano.html'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const canon = (content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
    const hreflangs = [...content.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
    console.log('=== ' + f + ' ===');
    console.log(' Canonical:', canon);
    console.log(' Hreflangs:');
    hreflangs.forEach(h => console.log('   ' + h));
  } else {
    console.log('=== ' + f + ' (MISSING) ===');
  }
}
