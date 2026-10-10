const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Leaderboard Banner HTML
const leaderboardBannerHtml = `
      <!-- High-CPM 728x90 Banner -->
      <div class="ad-banner-slot" style="margin: 2.5rem auto 1.5rem auto; text-align: center; min-height: 90px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
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

// Native Container HTML
const nativeContainerHtml = `
      <!-- Recommended Sponsored Content -->
      <div class="ad-native-slot" style="margin: 2rem auto; text-align: center; max-width: 100%; min-height: 120px;">
        <script async="async" data-cfasync="false" src="https://pl31760931.profitableratecpmnetwork.com/6af35b8a30cb38f675be2353f8953c6b/invoke.js"></script>
        <div id="container-6af35b8a30cb38f675be2353f8953c6b"></div>
      </div>
`;

// Sponsored Direct Link Box
const sponsoredSmartLinkHtml = `
      <!-- Sponsored Deals Box -->
      <div class="sponsored-smartlink-box" style="margin: 1.5rem 0; padding: 1rem 1.25rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08)); border: 1px dashed var(--primary-500, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main, #1e293b);">
          <span style="display:inline-block; margin-right:6px;">⚡</span> Fast Transfer & Exclusive Currency Exchange Deals Available
        </div>
        <a href="https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887" target="_blank" rel="noopener noreferrer sponsored" style="display: inline-block; padding: 0.55rem 1.15rem; background: var(--primary-600, #4f46e5); color: #ffffff; font-size: 0.9rem; font-weight: 700; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
          Check Live Deals &rarr;
        </a>
      </div>
`;

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
console.log(`Cleaning and repositioning ads across ${allHtml.length} HTML files...`);

let processed = 0;

for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove ANY existing injected ad blocks from top/header/nav/hero areas
  content = content.replace(/<!-- High-CPM 728x90 Leaderboard Ad -->[\s\S]*?<\/div>/g, '');
  content = content.replace(/<!-- High-CPM 728x90 Banner -->[\s\S]*?<\/div>/g, '');
  content = content.replace(/<!-- In-Content Native Ad Container -->[\s\S]*?<\/div>\s*<\/div>/g, '');
  content = content.replace(/<!-- Recommended Sponsored Content -->[\s\S]*?<\/div>\s*<\/div>/g, '');
  content = content.replace(/<!-- Sponsored High-CTR Direct Link Banner -->[\s\S]*?<\/div>/g, '');
  content = content.replace(/<!-- Sponsored Deals Box -->[\s\S]*?<\/div>/g, '');

  const isBlog = filePath.includes(path.sep + 'blog' + path.sep);
  const isTool = ['currency.html', 'temperature.html', 'length.html', 'weight-mass.html', 'volume-capacity.html', 'time-duration.html', 'time-zone.html', 'area.html', 'speed.html', 'file-media.html', 'indian-units.html', 'index.html'].some(t => filePath.endsWith(t));

  // 2. On Tool pages: Place ads cleanly at the very bottom of <main> before <footer>
  if (isTool) {
    if (content.includes('</main>')) {
      const bottomAdBundle = `\n    <!-- Bottom Monetization Section -->\n    <section class="bottom-monetization" style="margin: 3rem auto 1.5rem auto; max-width: 900px;">\n${sponsoredSmartLinkHtml}\n${leaderboardBannerHtml}\n${nativeContainerHtml}\n    </section>\n`;
      content = content.replace('</main>', `${bottomAdBundle}</main>`);
    }
  }

  // 3. On Blog pages: Place ads at the end of article after conclusion and before footer
  if (isBlog) {
    if (content.includes('</article>')) {
      const blogBottomAdBundle = `\n${sponsoredSmartLinkHtml}\n${leaderboardBannerHtml}\n${nativeContainerHtml}\n`;
      content = content.replace('</article>', `${blogBottomAdBundle}</article>`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    processed++;
  }
}

console.log(`Successfully repositioned ads in ${processed} files! Header & tool views are completely clean.`);
