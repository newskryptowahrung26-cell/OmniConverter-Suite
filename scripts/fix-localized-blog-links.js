const fs = require('fs');
const path = require('path');

// 1. In localized directories (es, de, pt), update all nav / footer links so "Blog" links to /<lang>/blog
const languages = ['es', 'de', 'pt'];

languages.forEach(lang => {
  const dir = lang;
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    let html = fs.readFileSync(fullPath, 'utf8');

    // Replace tab-btn Blog link: href="/blog" -> href="/es/blog"
    html = html.replace(/<a href="\/blog" class="tab-btn">Blog<\/a>/g, `<a href="/${lang}/blog" class="tab-btn">Blog</a>`);
    html = html.replace(/<a href="\/blog" class="tab-btn active">Blog<\/a>/g, `<a href="/${lang}/blog" class="tab-btn active">Blog</a>`);

    // Replace footer Blog link: href="/blog" -> href="/es/blog"
    html = html.replace(/<a href="\/blog"/g, `<a href="/${lang}/blog"`);

    fs.writeFileSync(fullPath, html, 'utf8');
  });

  // Also in localized blog articles (e.g. es/blog/*.html), ensure breadcrumb & nav link to /<lang>/blog
  const blogSubDir = path.join(dir, 'blog');
  if (fs.existsSync(blogSubDir)) {
    const blogFiles = fs.readdirSync(blogSubDir).filter(f => f.endsWith('.html'));
    blogFiles.forEach(file => {
      const fullPath = path.join(blogSubDir, file);
      let html = fs.readFileSync(fullPath, 'utf8');

      html = html.replace(/<a href="\/blog" class="tab-btn">Blog<\/a>/g, `<a href="/${lang}/blog" class="tab-btn">Blog</a>`);
      html = html.replace(/<a href="\/blog" class="tab-btn active">Blog<\/a>/g, `<a href="/${lang}/blog" class="tab-btn active">Blog</a>`);
      html = html.replace(/<a href="\/blog">Blog<\/a>/g, `<a href="/${lang}/blog">Blog</a>`);

      fs.writeFileSync(fullPath, html, 'utf8');
    });
  }
  console.log(`Updated all Blog links in /${lang}/ to /${lang}/blog`);
});

// 2. In English blog.html, add language switcher to header
let blogHtml = fs.readFileSync('blog.html', 'utf8');
if (!blogHtml.includes('class="lang-switcher"')) {
  const switcherHtml = `      <div class="lang-switcher" aria-label="Language Selector">
        <span class="active" title="English">EN</span>
        <span class="lang-sep">|</span>
        <a href="/es/blog" title="Español">ES</a>
        <span class="lang-sep">|</span>
        <a href="/de/blog" title="Deutsch">DE</a>
        <span class="lang-sep">|</span>
        <a href="/pt/blog" title="Português">PT</a>
      </div>`;

  blogHtml = blogHtml.replace(
    /<a href="\/blog" class="tab-btn active">Blog<\/a>\s*<\/nav>/,
    `<a href="/blog" class="tab-btn active">Blog</a>\n      </nav>\n${switcherHtml}`
  );
  fs.writeFileSync('blog.html', blogHtml, 'utf8');
  console.log('Added language switcher to blog.html');
}
