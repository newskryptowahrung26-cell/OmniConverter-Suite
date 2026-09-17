const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Helper to fetch high-resolution topic-matched photo from Unsplash API
function getUnsplashPhoto(query, accessKey) {
  return new Promise((resolve) => {
    if (!accessKey) {
      console.log('No Unsplash API key provided. Using fallback image.');
      return resolve('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80');
    }

    const searchUrl = `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${encodeURIComponent(query)}&client_id=${accessKey}`;
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            const rawUrl = parsed.results[0].urls.regular;
            console.log(`✔ Found dynamic Unsplash photo for "${query}": ${rawUrl.substring(0, 60)}...`);
            return resolve(rawUrl);
          }
        } catch (e) {}
        console.log('Unsplash search returned no results. Using fallback image.');
        resolve('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80');
      });
    }).on('error', () => {
      resolve('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80');
    });
  });
}

async function main() {
  console.log('=== Running Gemini API + Unsplash Auto-Publisher ===');

  const apiKey = process.env.GEMINI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY environment variable is missing.');
    process.exit(1);
  }

  // Predefined continuous keyword queue
  const keywordQueue = [
    { slug: '70-fahrenheit-to-celsius', title: '70 Fahrenheit to Celsius', category: 'Temperature Guide', searchQuery: 'room thermometer' },
    { slug: '1-liter-to-gallons', title: '1 Liter to Gallons', category: 'Volume & Capacity Guide', searchQuery: 'water jug measuring' },
    { slug: '150-lbs-to-kg', title: '150 LBS to KG', category: 'Weight & Mass Guide', searchQuery: 'barbell gym weights' },
    { slug: '100-kmh-to-mph', title: '100 KM/H to MPH', category: 'Speed Conversion Guide', searchQuery: 'car speedometer' }
  ];

  const publishedFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
  const nextTarget = keywordQueue.find(item => !publishedFiles.includes(item.slug)) || keywordQueue[0];

  console.log(`Targeting Article: ${nextTarget.title} (${nextTarget.slug})`);

  // 1. Fetch topic-matched photo from Unsplash API
  const imageUrl = await getUnsplashPhoto(nextTarget.searchQuery, unsplashKey);

  // 2. Generate Content using Google GenAI SDK (Gemini 1.5 Pro)
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Write a comprehensive, professional 1,000-word SEO article for the keyword: "${nextTarget.title}".
  Requirements:
  - Return ONLY raw HTML article body content starting with paragraphs and headings.
  - Do NOT wrap response in markdown backticks \`\`\`html.
  - Include exact step-by-step mathematical conversion formulas.
  - Include an answer summary box styled with CSS variables: background var(--bg-elevated), border-left 4px solid var(--accent).
  - Include a detailed comparison table with class "conversion-table" inside class "table-wrapper".
  - Include a section titled "Frequently Asked Questions (FAQs)" with 3 Q&A pairs.`;

  console.log('Calling Gemini API via GoogleGenAI SDK...');
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: prompt
  });

  let articleBodyHtml = response.text || '';
  articleBodyHtml = articleBodyHtml.replace(/```html/gi, '').replace(/```/g, '').trim();

  // 3. Assemble complete web page
  const fullPageHtml = `<!DOCTYPE html>
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
  <title>${nextTarget.title}: Conversion Guide | OmniConverter</title>
  <meta name="description" content="Convert ${nextTarget.title} accurately. Detailed step-by-step mathematical conversion formulas, reference tables, and FAQs.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/blog/${nextTarget.slug}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="stylesheet" href="/styles.css">
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
      <img src="${imageUrl}" alt="${nextTarget.title}" style="width:100%; max-height:360px; object-fit:cover; border-radius:var(--radius-xl); margin:0.5rem 0 1.5rem 0; border:1px solid var(--card-border);" loading="eager">
      ${articleBodyHtml}
    </article>
  </main>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2026 OmniConverter Suite. All rights reserved. | <a href="/sitemap">Sitemap</a> | <a href="/about">About</a> | <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms">Terms</a> | <a href="/contact">Contact</a> | <a href="/llms-full.txt">AI Knowledge Base</a></p>
    </div>
  </footer>
</body>
</html>`;

  const outPath = path.join('blog', `${nextTarget.slug}.html`);
  fs.writeFileSync(outPath, fullPageHtml, 'utf8');
  console.log(`✔ Article generated & saved: ${outPath}`);

  // 4. Update blog-data.js and sitemaps
  execSync('node scratch/rebuild_blog_data.js');
  console.log('✔ blog-data.js & sitemaps updated.');
}

main().catch(err => {
  console.error('Execution Error:', err);
  process.exit(1);
});
