const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let list = [];
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', 'scripts'].includes(f)) continue;
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) list = list.concat(getAllHtmlFiles(fp));
    else if (f.endsWith('.html')) list.push(fp);
  }
  return list;
}

const files = getAllHtmlFiles('.');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Look for > directly after a tag closing or as raw text: e.g. >> or > outside tag
  // Remove all valid tags: <[^>]+>
  const stripped = content.replace(/<[^>]+>/g, ' ');
  // Check if stripped text contains stray >
  const matches = stripped.match(/(?:^|\s)>+(?:\s|$)/g);
  if (matches) {
    console.log(`[RAW > in text] ${f}:`, matches);
  }
});
