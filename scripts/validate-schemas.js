const fs = require('fs');
const path = require('path');

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => path.join('blog', f));
const allFiles = rootFiles.concat(blogFiles);

let totalSchemas = 0;
let errors = 0;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    totalSchemas++;
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.error(`[ERROR] JSON-LD syntax error in ${file}: ${e.message}`);
      errors++;
    }
  }
});

if (errors > 0) {
  console.error(`[FAILED] Found ${errors} invalid JSON-LD schemas.`);
  process.exit(1);
} else {
  console.log(`[PASS] Validated ${totalSchemas} JSON-LD schemas across ${allFiles.length} HTML files with 0 errors.`);
}
