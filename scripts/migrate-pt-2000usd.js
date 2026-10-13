const fs = require('fs');

const ptPath = 'pt/blog/2000-usd-to-gbp.html';
const newPtPath = 'pt/blog/2000-usd-para-gbp.html';

// 1. Read existing file
let html = fs.readFileSync(ptPath, 'utf8');

// 2. Update canonical, og:url, schemas, and hreflangs inside the file
html = html.replace(/https:\/\/www\.omniconverter\.co\.uk\/pt\/blog\/2000-usd-to-gbp/g, 'https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp');
html = html.replace(/\/pt\/blog\/2000-usd-to-gbp/g, '/pt/blog/2000-usd-para-gbp');

// 3. Save as new native slug file
fs.writeFileSync(newPtPath, html, 'utf8');
console.log('[OK] Created', newPtPath);

// 4. Create an SEO 301-equivalent client redirect file at old slug location: pt/blog/2000-usd-to-gbp.html
const redirectHtml = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp">
  <link rel="canonical" href="https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp">
  <title>Redirecionando...</title>
  <script>window.location.replace("https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp");</script>
</head>
<body>
  <p>Redirecionando para <a href="https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp">2000 USD para GBP</a>...</p>
</body>
</html>`;
fs.writeFileSync(ptPath, redirectHtml, 'utf8');
console.log('[OK] Created 301-equivalent meta redirect at', ptPath);

// 5. Update reciprocal links in English, Spanish, and German articles
['blog/2000-usd-to-gbp.html', 'es/blog/2000-usd-a-gbp.html', 'de/blog/2000-usd-in-gbp.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/https:\/\/www\.omniconverter\.co\.uk\/pt\/blog\/2000-usd-to-gbp/g, 'https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp');
    c = c.replace(/\/pt\/blog\/2000-usd-to-gbp/g, '/pt/blog/2000-usd-para-gbp');
    fs.writeFileSync(f, c, 'utf8');
    console.log('[OK] Updated reciprocal links in', f);
  }
});
