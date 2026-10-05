const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scratch') res = res.concat(getAllHtml(fp));
    } else if (f.endsWith('.html')) res.push(fp);
  }
  return res;
}

const files = getAllHtml('.');
const lowWordCount = [];
const lowRatio = [];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const cleanText = body
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = cleanText ? cleanText.split(/\s+/).length : 0;
  const ratio = (cleanText.length / html.length);

  if (words < 250) {
    lowWordCount.push({ file: f, words, ratio: ratio.toFixed(2) });
  }
  if (ratio < 0.10) {
    lowRatio.push({ file: f, ratio: ratio.toFixed(2), words });
  }
});

console.log(`Low Word Count (< 250 words): ${lowWordCount.length}`);
lowWordCount.forEach(x => console.log(' ', x.file, `(${x.words} words)`));

console.log(`\nLow Text/HTML Ratio (< 0.10): ${lowRatio.length}`);
lowRatio.forEach(x => console.log(' ', x.file, `(ratio: ${x.ratio}, words: ${x.words})`));
