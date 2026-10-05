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
const dupes = [];
const longTitles = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const tMatch = c.match(/<title>([^<]+)<\/title>/i);
  const h1Match = c.match(/<h1[^>]*>([^<]+)<\/h1>/i);

  if (tMatch) {
    const t = tMatch[1].trim();
    if (t.length > 60) longTitles.push({ file: f, title: t, len: t.length });

    if (h1Match) {
      const h1 = h1Match[1].trim();
      if (t === h1) {
        dupes.push({ file: f, title: t, h1 });
      }
    }
  }
});

console.log(`Duplicate H1 and Title tags (${dupes.length}):`);
dupes.forEach(d => console.log(' ', d.file, '-->', d.title));

console.log(`Titles too long (> 60 chars) (${longTitles.length}):`);
longTitles.forEach(t => console.log(' ', t.file, t.len, '-->', t.title));
