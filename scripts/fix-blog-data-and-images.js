const fs = require('fs');
const path = require('path');

console.log('=== FIXING MULTILINGUAL BLOG HUBS AND ARTICLE IMAGES ===\n');

// 1. Fix es/blog-data.js, de/blog-data.js, pt/blog-data.js
const localizedDataFiles = ['es/blog-data.js', 'de/blog-data.js', 'pt/blog-data.js'];

for (const file of localizedDataFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Ensure window.BLOG_POSTS is explicitly set
    if (!content.includes('window.BLOG_POSTS')) {
      content = content.trim();
      if (!content.endsWith(';')) content += ';';
      content += '\nwindow.BLOG_POSTS=BLOG_POSTS;window.blogArticles=BLOG_POSTS;';
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[FIXED] Added window.BLOG_POSTS export to ${file}`);
    } else {
      console.log(`[OK] ${file} already contains window.BLOG_POSTS`);
    }
  }
}

// 2. Fix images in blog-data.js for the 5 Indian unit articles
const imageMap = {
  '1-bigha-in-square-feet': {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    alt: 'Green agricultural land farm field in India'
  },
  '1-crore-in-millions': {
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Banknotes currency exchange representing Indian crore in millions'
  },
  '1-gaj-in-square-feet': {
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Architectural blueprint and construction measuring tools for land surveying'
  },
  '1-guntha-in-sq-ft': {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Rural land surveying and property plots for Guntha measurement'
  },
  '1-tola-in-grams': {
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pure gold bars and precision weighing scale for Tola in grams'
  }
};

// Update blog-data.js
if (fs.existsSync('blog-data.js')) {
  let blogDataContent = fs.readFileSync('blog-data.js', 'utf8');
  for (const [id, meta] of Object.entries(imageMap)) {
    // Replace the dog image specifically for this article block
    const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"image":\\s*")[^"]+(")`, 'g');
    if (regex.test(blogDataContent)) {
      blogDataContent = blogDataContent.replace(regex, `$1${meta.image}$2`);
      console.log(`[FIXED IMAGE] Updated blog-data.js image for ${id}`);
    }
  }
  fs.writeFileSync('blog-data.js', blogDataContent, 'utf8');
}

// Update the 5 HTML article files with their new professional hero image, og:image, twitter:image, and schema
for (const [id, meta] of Object.entries(imageMap)) {
  const htmlFile = `blog/${id}.html`;
  if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Replace og:image and twitter:image
    html = html.replace(/(<meta\s+property=["']og:image["']\s+content=["'])[^"']+["']/gi, `$1${meta.image}"`);
    html = html.replace(/(<meta\s+name=["']twitter:image["']\s+content=["'])[^"']+["']/gi, `$1${meta.image}"`);
    html = html.replace(/("image":\s*")[^"]+(")/gi, `$1${meta.image}$2`);

    // Add hero image if missing right after <h1>
    if (!html.includes('<img src="' + meta.image + '"')) {
      // Check if there is an existing hero <img> tag
      if (html.includes('<img src="https://images.unsplash.com')) {
        html = html.replace(/<img\s+src="https:\/\/images\.unsplash\.com[^"]*"\s+alt="[^"]*"/gi, `<img src="${meta.image}" alt="${meta.alt}"`);
      } else {
        // Insert hero image right after <h1>
        const heroImgHtml = `\n      <img src="${meta.image}" alt="${meta.alt}" style="width:100%;max-height:360px;object-fit:cover;border-radius:var(--radius-xl);margin:0.5rem 0 1.5rem 0;border:1px solid var(--card-border);" loading="eager">\n`;
        html = html.replace(/(<\/h1>)/i, `$1${heroImgHtml}`);
      }
    }

    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log(`[FIXED ARTICLE] Updated images in ${htmlFile}`);
  }
}

// Also update scripts/minify-assets.js to preserve window exports permanently!
if (fs.existsSync('scripts/minify-assets.js')) {
  let minifier = fs.readFileSync('scripts/minify-assets.js', 'utf8');
  minifier = minifier.replace(
    'const minified = `const BLOG_POSTS=${JSON.stringify(json)};`;',
    'const minified = `const BLOG_POSTS=${JSON.stringify(json)};window.BLOG_POSTS=BLOG_POSTS;window.blogArticles=BLOG_POSTS;`;'
  );
  fs.writeFileSync('scripts/minify-assets.js', minifier, 'utf8');
  console.log(`[FIXED MINIFIER] Updated scripts/minify-assets.js so future minifications preserve window exports.`);
}

console.log('\n=== FIXES APPLIED SUCCESSFULLY ===');
