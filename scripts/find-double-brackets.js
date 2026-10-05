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

console.log('Searching all HTML files for stray > in head or double >>...');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('>>')) {
      console.log(`[FOUND >>] ${f}:${idx + 1} -> ${line.trim()}`);
    }
    // Also check if any line ends with '> >' or '>  >'
    if (/>\s*>/.test(line) && !line.includes('->') && !line.includes('=>')) {
      console.log(`[FOUND > >] ${f}:${idx + 1} -> ${line.trim()}`);
    }
  });
});
