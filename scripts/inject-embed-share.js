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
console.log('Total HTML files:', allHtml.length);
let count = 0;

for (const file of allHtml) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add embed-share-engine.js if not present
  if (!content.includes('embed-share-engine.js')) {
    content = content.replace('</body>', '  <script src="/embed-share-engine.js" defer></script>\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}

console.log('Successfully injected embed-share-engine.js into HTML files:', count);
