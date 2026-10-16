const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const enOfftopic = [
  'indonesia-cu',
  'convert-pdf-form',
  'convert-file-type-to-pdf',
  'converter-application-download',
  'file-changer',
  'how-to-change-file-format'
];

// 1. Clean blog.html
let blogHtml = fs.readFileSync(path.join(rootDir, 'blog.html'), 'utf8');

// Filter out off-topic <li> links from directory
enOfftopic.forEach(slug => {
  const liRegex = new RegExp(`\\s*<li><a href="/blog/${slug}"[\\s\\S]*?<\\/li>`, 'g');
  blogHtml = blogHtml.replace(liRegex, '');
});

// Update Directory header and counts
blogHtml = blogHtml.replace(
  /Complete Directory of Conversion Guides \(\d+ Guides\)/,
  'Complete Directory of Conversion Guides (61 Guides)'
);

fs.writeFileSync(path.join(rootDir, 'blog.html'), blogHtml, 'utf8');
console.log('Cleaned blog.html directory list to 61 guides.');

// 2. Update index.html count
let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(
  /Full HTML Sitemap \(All \d+ Guides\)/,
  'Full HTML Sitemap (All 61 Guides)'
);
fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml, 'utf8');
console.log('Updated index.html sitemap link to 61 Guides.');
