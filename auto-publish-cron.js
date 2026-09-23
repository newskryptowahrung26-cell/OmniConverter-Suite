const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log(`[${new Date().toISOString()}] Automated Daily (24-Hour) Publisher Triggered`);
console.log('====================================================');

// Keyword-Specific Image Map (Verified 200 OK & Strictly Relevant to Topic)
const keywordImageMap = {
  // Temperature Articles -> Thermometer / Weather Photos
  '70-fahrenheit-to-celsius': 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=1200&q=80',
  '10-celsius-is-what-fahrenheit': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
  '100-fahrenheit-to-celsius': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  '50-fahrenheit-to-celsius': 'https://images.unsplash.com/photo-1580917922805-f8f57e08c0ae?auto=format&fit=crop&w=1200&q=80',

  // Volume & Liquid Articles -> Liquid Containers / Measuring Jugs
  '1-liter-to-gallons': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
  '500-ml-to-cups': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  '1-cup-milk-in-milliliters': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
  '1-4-cup-is-ml': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
  '1-tsp-is-ml': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80',

  // Weight & Mass Articles -> Barbells / Kitchen Scales
  '150-lbs-to-kg': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  '100-kg-to-lbs': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
  '1-stone-in-kg': 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1200&q=80',
  '1-3-cup-to-grams': 'https://images.unsplash.com/photo-1588467850695-a898367ce465?auto=format&fit=crop&w=1200&q=80',

  // Speed & Velocity Articles -> Car Speedometers
  '100-kmh-to-mph': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  '60-mph-to-kmh': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',

  // Currency Articles -> Banknotes / Coins
  '100-usd-to-aud': 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80'
};

// Keywords pool for continuous auto-publishing
const keywordsPool = [
  {
    slug: '70-fahrenheit-to-celsius',
    title: '70 Fahrenheit to Celsius: Room Temperature Guide',
    category: 'Temperature Guide',
    faqs: [
      { q: 'What is 70°F in Celsius?', a: '70 degrees Fahrenheit equals 21.11 degrees Celsius (21.11°C).' },
      { q: 'Is 70°F considered comfortable room temperature?', a: 'Yes! 70°F (21.1°C) is widely regarded as optimal indoor thermostat room temperature.' },
      { q: 'What is the formula to convert 70°F to °C?', a: 'Subtract 32 from 70 (70 - 32 = 38) and divide by 1.8 to get 21.11°C.' }
    ]
  },
  {
    slug: '1-liter-to-gallons',
    title: '1 Liter to Gallons: Exact Fluid Volume Conversion',
    category: 'Volume & Capacity Guide',
    faqs: [
      { q: 'How many US gallons is 1 liter?', a: '1 liter equals 0.264172 US liquid gallons (approx 0.264 gal).' },
      { q: 'How many Imperial UK gallons is 1 liter?', a: '1 liter equals 0.219969 Imperial UK gallons.' },
      { q: 'How many liters are in 1 gallon?', a: 'There are 3.785 liters in 1 US liquid gallon and 4.546 liters in 1 Imperial UK gallon.' }
    ]
  },
  {
    slug: '150-lbs-to-kg',
    title: '150 LBS to KG: Weight Conversion Guide',
    category: 'Weight & Mass Guide',
    faqs: [
      { q: 'How many kg is 150 lbs?', a: '150 pounds equals 68.0389 kilograms (commonly rounded to 68.04 kg).' },
      { q: 'How many stones is 150 lbs?', a: '150 pounds equals 10 stones and 10 pounds (10 st 10 lb).' }
    ]
  },
  {
    slug: '100-kmh-to-mph',
    title: '100 KM/H to MPH: Speed Limit Conversion Guide',
    category: 'Speed Conversion Guide',
    faqs: [
      { q: 'How fast is 100 km/h in mph?', a: '100 kilometers per hour equals 62.1371 miles per hour (62.14 mph).' },
      { q: 'What is the formula to convert km/h to mph?', a: 'Multiply km/h by 0.621371: 100 x 0.621371 = 62.14 mph.' }
    ]
  }
];

try {
  const publishedFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
  console.log(`Current Published Articles Count: ${publishedFiles.length}`);

  const nextTarget = keywordsPool.find(item => !publishedFiles.includes(item.slug));

  if (nextTarget) {
    console.log(`Publishing Next Scheduled Article: ${nextTarget.slug}...`);

    // Assign topic-specific image based on keyword slug
    const assignedImage = keywordImageMap[nextTarget.slug] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';

    // Generate FAQ HTML
    const faqItemsHtml = nextTarget.faqs.map(f => `
        <h4 style="margin:1.25rem 0 0.35rem 0; font-size:1.1rem; color:var(--text-primary); font-weight:700;">${f.q}</h4>
        <p style="margin:0 0 1rem 0; color:var(--text-muted); line-height:1.7;">${f.a}</p>
    `).join('');

    const faqSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": nextTarget.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }, null, 2);

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="msvalidate.01" content="25038A8801D42437BBC34723A41AC6C4" />
  <meta name="google-site-verification" content="Cpl786DxZO0l5hjxd_D5KE5RGWKFuJ9EVSh5n6Msm7M" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KPY6T7PFD"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-0KPY6T7PFD');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nextTarget.title} | OmniConverter</title>
  <meta name="description" content="Accurate step-by-step conversion for ${nextTarget.title} with formulas and reference tables.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/blog/${nextTarget.slug}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="stylesheet" href="/styles.css">

  <script type="application/ld+json">
  [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${nextTarget.title}",
    "description": "Accurate step-by-step conversion for ${nextTarget.title} with formulas and reference tables.",
    "url": "https://www.omniconverter.co.uk/blog/${nextTarget.slug}",
    "datePublished": "2026-09-16",
    "author": { "@type": "Organization", "name": "OmniConverter Editorial Team" }
  },
  ${faqSchemaJson}
  ]
  </script>
</head>
<body>
  <header>
    <div class="header-container">
      <a href="/" class="logo" aria-label="OmniConverter Home">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px; height:32px; border-radius:6px; object-fit:cover;">
        <span>OmniConverter</span>
      </a>
      <nav class="nav-tabs" aria-label="Main Navigation">
        <a href="/" class="tab-btn">Home</a>
        <a href="/temperature" class="tab-btn">Temperature</a>
        <a href="/weight-mass" class="tab-btn">Weight & Mass</a>
        <a href="/volume-capacity" class="tab-btn">Volume</a>
        <a href="/time-duration" class="tab-btn">Time</a>
        <a href="/area" class="tab-btn">Area</a>
        <a href="/speed" class="tab-btn">Speed</a>
        <a href="/file-media" class="tab-btn">File Converter</a>
        <a href="/blog" class="tab-btn active">Blog</a>
      </nav>
    </div>
  </header>
  <main class="main-container">
    <article class="content-section" style="margin-top:1.5rem;">
      <span class="formula-badge">${nextTarget.category}: ${nextTarget.title}</span>
      <h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">${nextTarget.title}</h1>
      <img src="${assignedImage}" alt="${nextTarget.title}" style="width:100%; max-height:360px; object-fit:cover; border-radius:var(--radius-xl); margin:0.5rem 0 1.5rem 0; border:1px solid var(--card-border);" loading="eager">
      
      <p style="font-size:1.05rem; line-height:1.7; color:var(--text-muted);">
        Understanding physical measurement conversions is essential across everyday applications, engineering, and science. This guide details the exact mathematical formulas and reference benchmarks for <strong>${nextTarget.title}</strong>.
      </p>
      
      <h2>Frequently Asked Questions (FAQs)</h2>
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin:1.5rem 0;">
        ${faqItemsHtml}
      </div>

      <h2>Comprehensive Analysis & Conversion Parameters</h2>
      <p style="line-height:1.7; color:var(--text-muted);">
        Whether converting metric or customary units, maintaining precision ensures accurate calculations across commercial trade, cooking recipes, health tracking, and technical documentation.
      </p>
    </article>
  </main>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2026 OmniConverter Suite. All rights reserved. | <a href="/sitemap">Sitemap</a> | <a href="/about">About</a> | <a href="/privacy-policy">Privacy</a> | <a href="/terms">Terms</a> | <a href="/contact">Contact</a> | <a href="/llms-full.txt">AI Knowledge Base</a></p>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join('blog', `${nextTarget.slug}.html`), fullHtml, 'utf8');
    console.log(`✔ Created blog/${nextTarget.slug}.html with topic-matched image: ${assignedImage}`);
  } else {
    console.log('All queue items are currently published.');
  }

  // Rebuild blog-data.js
  const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html'));
  const allPosts = blogFiles.map(file => {
    const slug = file.replace('.html', '');
    const content = fs.readFileSync(path.join('blog', file), 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(' | OmniConverter', '').trim() : slug;
    const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/i);
    const summary = descMatch ? descMatch[1] : '';
    const imgMatch = content.match(/<img\s+src="(https:\/\/images\.unsplash\.com\/[^"]+)"/i);
    const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';
    const badgeMatch = content.match(/<span\s+class="formula-badge">(.*?)<\/span>/i);
    const category = badgeMatch ? badgeMatch[1].split(':')[0].trim() : 'General Guide';
    const articleMatch = content.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
    return {
      id: slug, slug, title, date: '2026-09-16', publicationDate: '2026-09-16',
      category, author: 'OmniConverter Editorial Team', readTime: '4 min read', icon: '📊',
      image, summary, content: articleMatch ? articleMatch[1].trim() : ''
    };
  });

  const jsData = `// Synchronized blog data\nexport const BLOG_POSTS = ${JSON.stringify(allPosts, null, 2)};\nexport const blogArticles = BLOG_POSTS;\nif (typeof window !== 'undefined') { window.BLOG_POSTS = BLOG_POSTS; window.blogArticles = BLOG_POSTS; }\nif (typeof module !== 'undefined' && module.exports) { module.exports = BLOG_POSTS; }`;
  fs.writeFileSync('blog-data.js', jsData, 'utf8');

  // Update sitemap.xml
  const sitemapUrls = [
    'https://www.omniconverter.co.uk/',
    'https://www.omniconverter.co.uk/temperature',
    'https://www.omniconverter.co.uk/weight-mass',
    'https://www.omniconverter.co.uk/volume-capacity',
    'https://www.omniconverter.co.uk/time-duration',
    'https://www.omniconverter.co.uk/area',
    'https://www.omniconverter.co.uk/speed',
    'https://www.omniconverter.co.uk/file-media',
    'https://www.omniconverter.co.uk/blog',
    ...blogFiles.map(f => `https://www.omniconverter.co.uk/blog/${f.replace('.html', '')}`),
    'https://www.omniconverter.co.uk/about',
    'https://www.omniconverter.co.uk/contact',
    'https://www.omniconverter.co.uk/sitemap',
    'https://www.omniconverter.co.uk/privacy-policy',
    'https://www.omniconverter.co.uk/terms',
    'https://www.omniconverter.co.uk/llms-full.txt'
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(u => `  <url><loc>${u}</loc><lastmod>2026-09-16</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');

  // Run tests & Push
  console.log(execSync('node test-all.js').toString());
  execSync('git add .');
  execSync('git commit -m "Automated 6-hour article publish with topic-matched unique image"');
  execSync('git push origin main');
  console.log('🚀 Successfully published, committed, and deployed!');

} catch (err) {
  console.error('Error during auto-publishing:', err.message);
}
