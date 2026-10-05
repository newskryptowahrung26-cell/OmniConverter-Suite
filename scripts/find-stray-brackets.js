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
console.log(`Checking ${files.length} files for stray '>'...`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '&gt;' || line === '>' || line.startsWith('> ') || line.endsWith(' >>') || line === '>>') {
      console.log(`[STRAY] ${file}:${i + 1} -> "${line}"`);
    }
    // Also check for >> or unclosed tags
    if (/>{2,}/.test(line) && !line.includes('>>')) {
      console.log(`[DOUBLE >] ${file}:${i + 1} -> "${line}"`);
    }
  }
}
