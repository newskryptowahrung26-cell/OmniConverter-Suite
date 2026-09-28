const fs = require('fs');
const path = require('path');

const rootFiles = [
  'index.html',
  'currency.html',
  'length.html',
  'temperature.html',
  'weight-mass.html',
  'volume-capacity.html',
  'time-duration.html',
  'area.html',
  'speed.html',
  'file-media.html',
  'blog.html',
  'about.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'sitemap.html'
];

// 1. Update navigation tabs across all root HTML files
rootFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Check if currency link already exists in nav-tabs
  if (!html.includes('href="/currency"')) {
    const navRegex = /(<a href="\/" class="tab-btn(?: active)?">Home<\/a>)(\r?\n\s*)/;
    if (navRegex.test(html)) {
      const activeClass = file === 'currency.html' ? 'tab-btn active' : 'tab-btn';
      html = html.replace(navRegex, `$1$2<a href="/currency" class="${activeClass}">Currency</a>$2`);
      fs.writeFileSync(file, html, 'utf8');
      console.log(`[OK] Added Currency to nav in ${file}`);
    } else {
      console.warn(`[WARN] Could not find Home nav link in ${file}`);
    }
  }
});

// 2. Update navigation tabs across all blog posts
const blogDir = 'blog';
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('href="/currency"')) {
      const navRegex = /(<a href="\/" class="tab-btn(?: active)?">Home<\/a>)(\r?\n\s*)/;
      if (navRegex.test(html)) {
        html = html.replace(navRegex, `$1$2<a href="/currency" class="tab-btn">Currency</a>$2`);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`[OK] Added Currency to nav in blog/${file}`);
      }
    }
  });
}

// 3. Update index.html hero tools grid and hero description
if (fs.existsSync('index.html')) {
  let indexHtml = fs.readFileSync('index.html', 'utf8');

  if (!indexHtml.includes('smallpdf-tool-card') || !indexHtml.includes('href="/currency"')) {
    const currencyCard = `      <a href="/currency" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-emerald">💱</div>
          <div class="smallpdf-card-title">Currency Converter</div>
          <div class="smallpdf-card-desc">Real-time exchange rates for USD, AUD, EUR, GBP, CAD, JPY, and 35+ world currencies with live market data.</div>
        </div>
        <div class="smallpdf-card-action">Convert Currency &rarr;</div>
      </a>\n\n`;

    const targetCardRegex = /(<section class="smallpdf-tools-grid">\r?\n\s*)(<a href="\/length")/i;
    if (targetCardRegex.test(indexHtml)) {
      indexHtml = indexHtml.replace(targetCardRegex, `$1${currencyCard}$2`);
      console.log('[OK] Added Currency Card to index.html hero grid.');
    }
  }

  // Update hero subtitle
  if (indexHtml.includes('All the tools you need to convert temperature, weight')) {
    indexHtml = indexHtml.replace(
      'All the tools you need to convert temperature, weight',
      'All the tools you need to convert currency, temperature, weight'
    );
  }

  fs.writeFileSync('index.html', indexHtml, 'utf8');
}

// 4. Update currency-related blog posts to point their tool callouts to /currency
const currencyBlogSlugs = [
  '100-usd-to-aud.html',
  '199-usd-in-aud.html',
  '32-usd-to-gbp.html',
  '1-aud-to-vnd.html',
  'korean-to-aud.html',
  'rupiah-to-aud.html'
];

currencyBlogSlugs.forEach(slug => {
  const filePath = path.join('blog', slug);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace tool callout title and link if pointing to generic home /
    content = content.replace(
      /<h3[^>]*>OmniConverter Universal Tool Suite<\/h3>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<a href="\/" class="tab-btn active"[^>]*>Explore All Tools &rarr;<\/a>/s,
      `<h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; color: var(--text-main); font-weight: 800;">Interactive Currency Converter</h3>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">Convert USD, AUD, EUR, GBP, CAD, and 35+ global currencies with real-time mid-market exchange rates.</p>
        </div>
        <a href="/currency" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Currency Converter &rarr;</a>`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] Updated tool callout in blog/${slug}`);
  }
});

// 5. Update sitemap.html with Currency and Length tools
if (fs.existsSync('sitemap.html')) {
  let sitemapHtml = fs.readFileSync('sitemap.html', 'utf8');
  if (!sitemapHtml.includes('href="/currency"')) {
    const unitListTarget = /(<h2>1\. Unit & File Converters<\/h2>\s*<ul[^>]*>)/i;
    const currencyEntry = `\n        <li><a href="/currency" style="color:var(--primary-600); font-weight:600;">Currency Converter Tool</a> (Live foreign exchange rates for USD, AUD, EUR, GBP, CAD, JPY, and 35+ currencies)</li>\n        <li><a href="/length" style="color:var(--primary-600); font-weight:600;">Length & Distance Converter Tool</a> (Meters, Feet, Inches, Centimeters, Millimeters, Yards, Miles)</li>`;
    sitemapHtml = sitemapHtml.replace(unitListTarget, `$1${currencyEntry}`);
    fs.writeFileSync('sitemap.html', sitemapHtml, 'utf8');
    console.log('[OK] Added Currency & Length to sitemap.html');
  }
}

console.log('=== All currency navigation synchronization completed successfully! ===');
