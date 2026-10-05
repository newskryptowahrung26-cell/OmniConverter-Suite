const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getHtmlFiles('.');
console.log(`Found ${allFiles.length} HTML files.`);

let langCounts = { en: 0, es: 0, de: 0, pt: 0 };
let missingNav = [];

allFiles.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  let lang = 'en';
  if (norm.startsWith('es/')) lang = 'es';
  else if (norm.startsWith('de/')) lang = 'de';
  else if (norm.startsWith('pt/')) lang = 'pt';
  langCounts[lang]++;

  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('class="nav-tabs"')) {
    missingNav.push(norm);
  }
});

console.log('Language file distribution:', langCounts);
console.log('Files missing nav-tabs:', missingNav.length, missingNav);
