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
  let content = fs.readFileSync(f, 'utf8');
  // Check between <head> and </head>
  const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[0];
    // Remove all HTML comments <!-- ... -->
    let cleaned = headContent.replace(/<!--[\s\S]*?-->/g, '');
    // Remove all valid tags: <script[\s\S]*?<\/script>, <style[\s\S]*?<\/style>, <[^>]+>
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
    cleaned = cleaned.replace(/<[^>]+>/g, '');
    // If there is any non-whitespace left
    if (cleaned.trim().length > 0) {
      console.log(`[STRAY TEXT IN HEAD] ${f}: "${cleaned.trim()}"`);
    }
  }
});
