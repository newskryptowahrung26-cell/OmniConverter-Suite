const fs = require('fs');
const path = require('path');

const HEAD_AD_SCRIPTS = `  <!-- Ad Network Global Monetizers -->
  <script src="https://pl31760930.profitableratecpmnetwork.com/d3/9c/38/d39c3845f6a74f2270e62943eb3fea85.js"></script>
  <script src="https://pl31760933.profitableratecpmnetwork.com/8f/40/d8/8f40d83d31f82674514161eeb921e8b1.js"></script>
`;

const AD_BANNER_HTML = `
    <!-- Bottom Monetization Section -->
    <section class="bottom-monetization" style="margin: 3rem auto 1.5rem auto; max-width: 900px;">
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

      <!-- Recommended Sponsored Content -->
      <div class="ad-native-slot" style="margin: 2rem auto; text-align: center; max-width: 100%; min-height: 120px;">
        <script async="async" data-cfasync="false" src="https://pl31760931.profitableratecpmnetwork.com/6af35b8a30cb38f675be2353f8953c6b/invoke.js"></script>
        <div id="container-6af35b8a30cb38f675be2353f8953c6b"></div>
      </div>
    </section>
`;

const STICKY_PILL_CONFIG = {
  es: {
    text: '⚡ Ver Ofertas en Vivo',
    link: 'https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887'
  },
  de: {
    text: '⚡ Live-Angebote Prüfen',
    link: 'https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887'
  },
  pt: {
    text: '⚡ Ofertas em Tempo Real',
    link: 'https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887'
  }
};

const languages = ['es', 'de', 'pt'];
let totalToolsUpdated = 0;

languages.forEach(lang => {
  if (!fs.existsSync(lang)) return;

  const files = fs.readdirSync(lang).filter(f => f.endsWith('.html') && f !== '404.html');
  files.forEach(file => {
    const fullPath = path.join(lang, file);
    let html = fs.readFileSync(fullPath, 'utf8');

    // 1. Inject Head Monetizer scripts
    if (!html.includes('pl31760930.profitableratecpmnetwork.com')) {
      html = html.replace('</head>', `${HEAD_AD_SCRIPTS}</head>`);
    }

    // 2. Inject Bottom 728x90 Banner + Native ad container right before </main>
    if (!html.includes('2ca98c99e53d3a8c6988fb21535d63d9') && html.includes('</main>')) {
      html = html.replace('</main>', `${AD_BANNER_HTML}</main>`);
    }

    // 3. Inject Floating Mobile Sticky Utility Pill before </body> if not present
    if (!html.includes('sticky-utility-pill')) {
      const pillCfg = STICKY_PILL_CONFIG[lang];
      const pillHtml = `\n  <!-- Mobile Sticky High-CTR Utility Pill -->
  <div class="sticky-utility-pill" style="position:fixed; bottom:16px; right:16px; z-index:9999; display:flex; align-items:center;">
    <a href="${pillCfg.link}" target="_blank" rel="noopener noreferrer sponsored" style="display:flex; align-items:center; gap:0.5rem; background:#4f46e5; color:#ffffff; font-weight:700; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:9999px; text-decoration:none; box-shadow:0 10px 25px rgba(79, 70, 229, 0.45); border:1.5px solid rgba(255,255,255,0.2); transition:transform 0.2s ease;">
      <span>${pillCfg.text}</span>
      <span style="font-size:1rem;">&rarr;</span>
    </a>
  </div>\n`;
      html = html.replace('</body>', `${pillHtml}</body>`);
    }

    fs.writeFileSync(fullPath, html, 'utf8');
    totalToolsUpdated++;
  });
});

console.log(`Successfully injected full monetization suite (Head Scripts, 728x90 Banner, Native Container, Sticky Pill) across ${totalToolsUpdated} localized pages.`);
