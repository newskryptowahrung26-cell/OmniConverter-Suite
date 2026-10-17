import fs from 'fs';

const list = [
  'blog/1-guntha-in-sq-ft.html',
  'es/blog/1-bar-a-psi.html',
  'de/blog/16-unzen-in-milliliter.html',
  'de/blog/300-dollar-in-gbp.html',
  'pt/blog/converter-lakh-para-usd.html',
  'pt/blog/moeda-jpy-para-inr.html',
  'pt/blog/300-dolares-em-gbp.html',
  'pt/blog/1-4-xicara-em-ml.html'
];

list.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(`=== ${f} ===`);
  const cat = c.match(/class="formula-badge">([^<]+)<\/span>/i);
  console.log(`  Badge: ${cat ? cat[1] : 'NONE'}`);
  const sel = c.match(/<select id="liveToolFromUnit"[\s\S]*?<\/select>/i);
  if (sel) {
    const opts = [...sel[0].matchAll(/value="([^"]+)"/g)].map(m => m[1]);
    console.log(`  Calc Options: ${opts.join(', ')}`);
  }
  const author = c.match(/(?:Autor|Author):<\/strong>\s*([^<]+)<\/span>/i);
  console.log(`  Author: ${author ? author[1].trim() : 'NONE'}`);
});
