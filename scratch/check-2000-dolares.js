const fs = require('fs');

const files = [
  'es/blog/2000-dolares-en-libras.html',
  'de/blog/2000-dollar-in-pfund.html',
  'pt/blog/2000-dolares-em-libras.html'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const canon = (content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
  const hreflangs = [...content.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
  console.log('=== ' + f + ' ===');
  console.log(' Canonical:', canon);
  console.log(' Hreflangs:');
  hreflangs.forEach(h => console.log('   ' + h));
}
