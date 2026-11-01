const fs = require('fs');

console.log('--- 100-usd-to-aud family ---');
const group1 = [
  'blog/100-usd-to-aud.html',
  'de/blog/100-usd-in-aud.html',
  'pt/blog/100-usd-para-aud.html'
];
group1.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<link[^>]+hreflang=["']es["'][^>]*>/i);
  console.log(f, 'points to ES:', m ? m[0] : 'none');
});

console.log('\n--- es/blog/100-usd-a-aud.html ---');
const esContent = fs.readFileSync('es/blog/100-usd-a-aud.html', 'utf8');
const esHreflangs = [...esContent.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
esHreflangs.forEach(h => console.log(' ', h));
