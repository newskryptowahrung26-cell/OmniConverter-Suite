const fs = require('fs');
const path = require('path');

function getAllHtml(dir, list = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scripts') getAllHtml(full, list);
    } else if (f.endsWith('.html')) list.push(full);
  });
  return list;
}

const all = getAllHtml('.');
let cleanedCount = 0;

for (const file of all) {
  // Never touch index.html (where SoftwareApplication is valid)
  if (file === 'index.html' || file.endsWith('index.html')) continue;

  let content = fs.readFileSync(file, 'utf8');

  // Match and remove aggregateRating block nested inside Article schemas
  if (content.includes('"aggregateRating"') && content.includes('"@type": "Article"')) {
    const regex = /,\s*"aggregateRating":\s*\{\s*"@type":\s*"AggregateRating",\s*"ratingValue":\s*"[^"]*",\s*"reviewCount":\s*"[^"]*",\s*"bestRating":\s*"5",\s*"worstRating":\s*"1"\s*\}/g;
    if (regex.test(content)) {
      content = content.replace(regex, '');
      fs.writeFileSync(file, content, 'utf8');
      cleanedCount++;
    }
  }
}

console.log('Successfully hardened and removed Article AggregateRating from blog files:', cleanedCount);
