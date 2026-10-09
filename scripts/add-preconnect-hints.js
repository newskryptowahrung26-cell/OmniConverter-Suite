const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'scratch'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getAllHtmlFiles('.');
let patchedCount = 0;

const preconnectSnippet = `  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin>
  <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://images.unsplash.com">`;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('rel="preconnect"') && content.includes('googlesyndication.com')) {
    return;
  }

  // Insert right after <head> or after <meta charset="UTF-8">
  if (content.includes('<meta charset="UTF-8">')) {
    content = content.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + preconnectSnippet);
    fs.writeFileSync(file, content, 'utf8');
    patchedCount++;
  } else if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>\n' + preconnectSnippet);
    fs.writeFileSync(file, content, 'utf8');
    patchedCount++;
  }
});

console.log(`Successfully added preconnect & dns-prefetch to ${patchedCount} HTML files!`);
