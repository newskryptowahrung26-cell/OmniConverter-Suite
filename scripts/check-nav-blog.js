const fs = require('fs');
const path = require('path');

const blogDir = 'blog';
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  let missing = 0;
  blogFiles.forEach(f => {
    const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
    if (content.includes('nav-tabs') && !content.includes('indian-units')) {
      missing++;
    }
  });
  console.log(`Blog files with nav-tabs missing indian-units: ${missing} / ${blogFiles.length}`);
}
