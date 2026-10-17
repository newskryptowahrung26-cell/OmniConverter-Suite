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
console.log('Total HTML files found:', allHtml.length);
let count = 0;

for (const file of allHtml) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add manifest if not present
  if (!content.includes('manifest.json')) {
    content = content.replace('</head>', '  <link rel="manifest" href="/manifest.json">\n  <meta name="theme-color" content="#4f46e5">\n</head>');
    changed = true;
  }

  // Add pwa-installer.js if not present
  if (!content.includes('pwa-installer.js')) {
    content = content.replace('</body>', '  <script src="/pwa-installer.js" defer></script>\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}

console.log('Successfully updated HTML files with PWA support:', count);
