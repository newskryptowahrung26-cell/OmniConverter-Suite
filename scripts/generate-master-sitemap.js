const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getAllValidUrls() {
  const urls = [];
  
  // 1. English Root HTML files
  const rootFiles = fs.readdirSync(rootDir);
  for (const f of rootFiles) {
    if (f.endsWith('.html') && f !== '404.html') {
      const pageName = f === 'index.html' ? '' : f.replace('.html', '');
      const url = `https://www.omniconverter.co.uk/${pageName}`;
      urls.push({
        loc: url,
        priority: f === 'index.html' ? '1.0' : (['about.html', 'contact.html', 'terms.html', 'privacy-policy.html', 'sitemap.html'].includes(f) ? '0.5' : '0.8'),
        changefreq: f === 'index.html' ? 'daily' : (['about.html', 'contact.html', 'terms.html', 'privacy-policy.html', 'sitemap.html'].includes(f) ? 'monthly' : 'weekly')
      });
    }
  }

  // 2. English Blog HTML files
  const blogDir = path.join(rootDir, 'blog');
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir);
    for (const f of blogFiles) {
      if (f.endsWith('.html')) {
        const slug = f.replace('.html', '');
        urls.push({
          loc: `https://www.omniconverter.co.uk/blog/${slug}`,
          priority: '0.8',
          changefreq: 'weekly'
        });
      }
    }
  }

  // 3. Localized Tools & Blogs (ES, DE, PT)
  const languages = ['es', 'de', 'pt'];
  for (const lang of languages) {
    const langDir = path.join(rootDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      for (const f of files) {
        if (f.endsWith('.html') && f !== '404.html' && f !== 'blog.html') {
          const pageName = f === 'index.html' ? '' : f.replace('.html', '');
          const url = pageName ? `https://www.omniconverter.co.uk/${lang}/${pageName}` : `https://www.omniconverter.co.uk/${lang}/`;
          urls.push({
            loc: url,
            priority: f === 'index.html' ? '0.9' : (['about.html', 'contact.html', 'terms.html', 'privacy-policy.html', 'sitemap.html'].includes(f) ? '0.4' : '0.7'),
            changefreq: f === 'index.html' ? 'daily' : (['about.html', 'contact.html', 'terms.html', 'privacy-policy.html', 'sitemap.html'].includes(f) ? 'monthly' : 'weekly')
          });
        }
      }
      const langBlogDir = path.join(langDir, 'blog');
      if (fs.existsSync(langBlogDir)) {
        const blogFiles = fs.readdirSync(langBlogDir);
        for (const f of blogFiles) {
          if (f.endsWith('.html')) {
            const slug = f.replace('.html', '');
            urls.push({
              loc: `https://www.omniconverter.co.uk/${lang}/blog/${slug}`,
              priority: '0.8',
              changefreq: 'weekly'
            });
          }
        }
      }
    }
  }

  return urls.sort((a, b) => a.loc.localeCompare(b.loc));
}

const urls = getAllValidUrls();
console.log(`Found ${urls.length} URLs for master sitemap.xml.`);

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const u of urls) {
  xml += `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>\n`;
}
xml += `</urlset>\n`;

const sitemapFile = path.join(rootDir, 'sitemap.xml');
fs.writeFileSync(sitemapFile, xml, 'utf8');
console.log(`Generated master sitemap.xml successfully with ${urls.length} URLs!`);
