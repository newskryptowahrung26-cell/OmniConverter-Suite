const fs = require('fs');

const slugs = [
  'indonesia-cu',
  'convert-pdf-form',
  'convert-file-type-to-pdf',
  'converter-application-download',
  'file-changer',
  'how-to-change-file-format'
];

let sitemapHtml = fs.readFileSync('sitemap.html', 'utf8');
slugs.forEach(slug => {
  const re = new RegExp(`\\s*<li><a href="/blog/${slug}"[\\s\\S]*?<\\/li>`, 'g');
  sitemapHtml = sitemapHtml.replace(re, '');
});
fs.writeFileSync('sitemap.html', sitemapHtml, 'utf8');
console.log('Cleaned sitemap.html of noindexed articles.');
