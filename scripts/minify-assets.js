const fs = require('fs');
const path = require('path');

// 1. Minify blog-data.js files (pt/blog-data.js, es/blog-data.js, de/blog-data.js)
const blogDataFiles = ['pt/blog-data.js', 'es/blog-data.js', 'de/blog-data.js'];
for (const file of blogDataFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Extract the array
    const match = content.match(/const\s+BLOG_POSTS\s*=\s*(\[[\s\S]*?\]);?/);
    if (match) {
      try {
        const json = JSON.parse(match[1]);
        const minified = `const BLOG_POSTS=${JSON.stringify(json)};window.BLOG_POSTS=BLOG_POSTS;window.blogArticles=BLOG_POSTS;`;
        fs.writeFileSync(file, minified, 'utf8');
        console.log(`Minified ${file}: ${content.length} -> ${minified.length} bytes (${Math.round((1 - minified.length/content.length)*100)}% reduction)`);
      } catch (e) {
        console.error(`Failed to JSON parse ${file}`, e);
      }
    }
  }
}

// 2. Minify temperature-interactive.js
if (fs.existsSync('temperature-interactive.js')) {
  let content = fs.readFileSync('temperature-interactive.js', 'utf8');
  const originalLength = content.length;
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single-line comments (be careful with URLs)
  content = content.replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  // Collapse multiple newlines and spaces
  content = content.replace(/[ \t]+/g, ' ');
  content = content.replace(/\s*([\{\}\(\)\=\;\:\,\<\>\+\-\*\/\?\&\|\!])\s*/g, '$1');
  content = content.replace(/;\s*}/g, '}');
  content = content.trim();
  fs.writeFileSync('temperature-interactive.js', content, 'utf8');
  console.log(`Minified temperature-interactive.js: ${originalLength} -> ${content.length} bytes (${Math.round((1 - content.length/originalLength)*100)}% reduction)`);
}

// 3. Minify styles.css
if (fs.existsSync('styles.css')) {
  let css = fs.readFileSync('styles.css', 'utf8');
  const origCss = css.length;
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
  css = css.replace(/\s+/g, ' '); // collapse whitespace
  css = css.replace(/\s*([\{\}\;\:\,])\s*/g, '$1'); // collapse syntax symbols
  css = css.replace(/;}/g, '}'); // remove trailing semicolon in block
  css = css.trim();
  fs.writeFileSync('styles.css', css, 'utf8');
  console.log(`Minified styles.css: ${origCss} -> ${css.length} bytes (${Math.round((1 - css.length/origCss)*100)}% reduction)`);
}
