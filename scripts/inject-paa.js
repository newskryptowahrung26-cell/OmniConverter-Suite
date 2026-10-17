const fs = require('fs');
const path = require('path');

function getAllHtml(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scripts') {
        getAllHtml(full, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const allHtml = getAllHtml('.');
let count = 0;

for (const file of allHtml) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add paa-matrix.js if not present
  if (!content.includes('paa-matrix.js')) {
    content = content.replace('</body>', '  <script src="/paa-matrix.js" defer></script>\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}

console.log('Successfully injected paa-matrix.js into HTML files:', count);
