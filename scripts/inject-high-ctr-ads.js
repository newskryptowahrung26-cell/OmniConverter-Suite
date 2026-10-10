const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Ad Snippets
const globalHeadScripts = `
  <!-- Ad Network Global Monetizers -->
  <script src="https://pl31760930.profitableratecpmnetwork.com/d3/9c/38/d39c3845f6a74f2270e62943eb3fea85.js"></script>
  <script src="https://pl31760933.profitableratecpmnetwork.com/8f/40/d8/8f40d83d31f82674514161eeb921e8b1.js"></script>
`;

const leaderboardBannerHtml = `
      <!-- High-CPM 728x90 Leaderboard Ad -->
      <div class="ad-banner-slot" style="margin: 1.5rem auto; text-align: center; min-height: 90px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
        <script>
          atOptions = {
            'key' : '2ca98c99e53d3a8c6988fb21535d63d9',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script src="https://www.highrevenueformat.com/2ca98c99e53d3a8c6988fb21535d63d9/invoke.js"></script>
      </div>
`;

const nativeContainerHtml = `
      <!-- In-Content Native Ad Container -->
      <div class="ad-native-slot" style="margin: 2rem auto; text-align: center; max-width: 100%; min-height: 120px;">
        <script async="async" data-cfasync="false" src="https://pl31760931.profitableratecpmnetwork.com/6af35b8a30cb38f675be2353f8953c6b/invoke.js"></script>
        <div id="container-6af35b8a30cb38f675be2353f8953c6b"></div>
      </div>
`;

const sponsoredSmartLinkHtml = `
      <!-- Sponsored High-CTR Direct Link Banner -->
      <div class="sponsored-smartlink-box" style="margin: 1.5rem 0; padding: 1rem 1.25rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08)); border: 1px dashed var(--primary-500, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main, #1e293b);">
          <span style="display:inline-block; margin-right:6px;">⚡</span> Fast Transfer & Exclusive Currency Exchange Deals Available
        </div>
        <a href="https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887" target="_blank" rel="noopener noreferrer sponsored" style="display: inline-block; padding: 0.55rem 1.15rem; background: var(--primary-600, #4f46e5); color: #ffffff; font-size: 0.9rem; font-weight: 700; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
          Check Live Deals &rarr;
        </a>
      </div>
`;

// Get all HTML files
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f === 'blog') results = results.concat(getFiles(full));
    } else if (f.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allHtml = getFiles(rootDir);
console.log(`Processing ${allHtml.length} HTML files...`);

let updatedCount = 0;

for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Inject global monetizer scripts in <head> if not already present
  if (!content.includes('pl31760930.profitableratecpmnetwork.com')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${globalHeadScripts}\n</head>`);
    }
  }

  const isBlog = filePath.includes(path.sep + 'blog' + path.sep);
  const isTool = ['currency.html', 'temperature.html', 'length.html', 'weight-mass.html', 'volume-capacity.html', 'time-duration.html', 'time-zone.html', 'area.html', 'speed.html', 'file-media.html', 'indian-units.html', 'index.html'].some(t => filePath.endsWith(t));

  // 2. Inject Native & Leaderboard into Tool Pages
  if (isTool && !content.includes('container-6af35b8a30cb38f675be2353f8953c6b')) {
    // Insert Leaderboard right after breadcrumb-nav or before converter-card
    if (content.includes('</nav>')) {
      content = content.replace('</nav>', `</nav>\n${leaderboardBannerHtml}`);
    }

    // Insert Native Container + SmartLink after the main converter-card section
    if (content.includes('</section>')) {
      content = content.replace('</section>', `</section>\n${nativeContainerHtml}\n${sponsoredSmartLinkHtml}`);
    }
  }

  // 3. Inject Native & Leaderboard into Blog Posts
  if (isBlog && !content.includes('container-6af35b8a30cb38f675be2353f8953c6b')) {
    // Insert Leaderboard before article or after image
    if (content.includes('loading="eager">')) {
      content = content.replace('loading="eager">', `loading="eager">\n${leaderboardBannerHtml}`);
    } else if (content.includes('<article')) {
      content = content.replace('<article', `${leaderboardBannerHtml}\n<article`);
    }

    // Insert Native Container & SmartLink before Related Guides or before </article>
    if (content.includes('</article>')) {
      content = content.replace('</article>', `${nativeContainerHtml}\n${sponsoredSmartLinkHtml}\n</article>`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log(`Successfully injected high-CTR ad units into ${updatedCount} HTML files!`);
