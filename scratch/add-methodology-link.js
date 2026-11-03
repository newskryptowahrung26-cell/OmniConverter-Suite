/**
 * add-methodology-link.js
 * Adds Methodology link to footer of ALL root HTML files.
 */
const fs = require('fs');

const ROOT_FILES = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['404.html'].includes(f));

let count = 0;
ROOT_FILES.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // Add Methodology to footer if not already there
  if (!html.includes('/methodology')) {
    html = html.replace(
      /<a href="\/privacy-policy"[^>]*>Privacy<\/a>/g,
      '<a href="/methodology" style="color:var(--primary-600);">Methodology</a> | <a href="/privacy-policy" style="color:var(--primary-600);">Privacy</a>'
    );
    // Also try alternate footer pattern
    html = html.replace(
      /<a href="\/privacy-policy"[^>]*>Privacy Policy<\/a>/g,
      '<a href="/methodology" style="color:var(--primary-600);">Methodology</a> | <a href="/privacy-policy" style="color:var(--primary-600);">Privacy Policy</a>'
    );
    fs.writeFileSync(file, html, 'utf8');
    count++;
    console.log('Updated footer:', file);
  }
});

// Also update blog article footers (sample - update all blog articles)
const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html'));
blogFiles.forEach(file => {
  let html = fs.readFileSync(`blog/${file}`, 'utf8');
  if (!html.includes('/methodology') && html.includes('/privacy-policy')) {
    html = html.replace(
      /<a href="\/privacy-policy"[^>]*>Privacy Policy<\/a>/g,
      '<a href="/methodology" style="color:#4f46e5;">Methodology</a> | <a href="/privacy-policy">Privacy Policy</a>'
    );
    html = html.replace(
      /<a href="\/privacy-policy"[^>]*>Privacy<\/a>/g,
      '<a href="/methodology" style="color:#4f46e5;">Methodology</a> | <a href="/privacy-policy">Privacy</a>'
    );
    fs.writeFileSync(`blog/${file}`, html, 'utf8');
    count++;
  }
});

console.log(`✅ Added Methodology link to ${count} files.`);
