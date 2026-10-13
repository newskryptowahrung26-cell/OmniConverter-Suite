const fs = require('fs');
const path = require('path');

const HIGH_CTR_LOCALIZED = {
  es: {
    bannerTitle: '⚡ Ofertas Exclusivas de Cambio de Divisas y Transferencias Rápidas',
    bannerBtn: 'Ver Ofertas en Vivo &rarr;',
    actionBarTitle: '¿Necesita la Tabla de Fórmulas y Tasas en Vivo?',
    actionBarDesc: 'Descargue tablas sin conexión verificadas, fórmulas de cálculo rápido y descuentos.',
    dlBtn: '📥 Descargar Tabla (Gratis)',
    dealsBtn: '⚡ Ofertas en Vivo &rarr;'
  },
  de: {
    bannerTitle: '⚡ Schnelle Überweisungen & Exklusive Wechselkurs-Angebote Verfügbar',
    bannerBtn: 'Live-Angebote Prüfen &rarr;',
    actionBarTitle: 'Benötigen Sie die Formeltabelle & Live-Kurse?',
    actionBarDesc: 'Laden Sie verifizierte Offline-Tabellen, Schnellrechenformeln und Rabatte herunter.',
    dlBtn: '📥 Tabelle Herunterladen (Kostenlos)',
    dealsBtn: '⚡ Live-Angebote &rarr;'
  },
  pt: {
    bannerTitle: '⚡ Transferências Rápidas e Cotações Exclusivas Disponíveis',
    bannerBtn: 'Ver Ofertas em Tempo Real &rarr;',
    actionBarTitle: 'Precisa da Tabela de Fórmulas e Taxas ao Vivo?',
    actionBarDesc: 'Baixe tabelas offline verificadas, fórmulas de cálculo rápido e descontos.',
    dlBtn: '📥 Baixar Tabela (Grátis)',
    dealsBtn: '⚡ Ofertas ao Vivo &rarr;'
  }
};

const DIRECT_LINK = 'https://www.profitableratecpmnetwork.com/i0kutdjeyt?key=9d9947dbd4ce803398c37bcc0ee3e887';

function injectMonetizationIntoArticle(file, lang) {
  let content = fs.readFileSync(file, 'utf8');
  const loc = HIGH_CTR_LOCALIZED[lang];
  if (!loc) return;

  // 1. Inject global ad scripts in head if missing
  if (!content.includes('profitableratecpmnetwork.com/d3/9c/38/d39c3845f6a74f2270e62943eb3fea85.js')) {
    const scripts = `  <!-- Ad Network Global Monetizers -->\n  <script src="https://pl31760930.profitableratecpmnetwork.com/d3/9c/38/d39c3845f6a74f2270e62943eb3fea85.js"></script>\n  <script src="https://pl31760933.profitableratecpmnetwork.com/8f/40/d8/8f40d83d31f82674514161eeb921e8b1.js"></script>\n`;
    content = content.replace('</head>', scripts + '</head>');
  }

  // 2. High-CTR Top Action Bar right after <h1...> or article header
  if (!content.includes('high-ctr-action-card')) {
    const actionBarHtml = `\n      <!-- High-CTR Utility Action Bar -->
      <div class="high-ctr-action-card" style="margin: 1.25rem 0 1.75rem 0; padding: 1.15rem 1.35rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(6, 182, 212, 0.08)); border: 1.5px solid rgba(79, 70, 229, 0.25); border-radius: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
          <div>
            <div style="font-size: 1rem; font-weight: 800; color: var(--text-main, #0f172a); display: flex; align-items: center; gap: 0.5rem;">
              <span style="display:inline-block; width:10px; height:10px; background:#10b981; border-radius:50%; box-shadow: 0 0 8px #10b981;"></span>
              <span>${loc.actionBarTitle}</span>
            </div>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.88rem; color: var(--text-muted, #64748b);">${loc.actionBarDesc}</p>
          </div>
          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <a href="${DIRECT_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.15rem; background: #4f46e5; color: #ffffff; font-weight: 700; font-size: 0.88rem; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35); transition: transform 0.15s ease;">
              <span>${loc.dlBtn}</span>
            </a>
            <a href="${DIRECT_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.15rem; background: #0f172a; color: #ffffff; font-weight: 700; font-size: 0.88rem; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25); transition: transform 0.15s ease;">
              <span>${loc.dealsBtn}</span>
            </a>
          </div>
        </div>
      </div>\n`;

    // Insert after the published time metadata or after h1
    if (content.includes('</span>\n      </div>')) {
      content = content.replace('</span>\n      </div>', '</span>\n      </div>' + actionBarHtml);
    } else if (content.includes('</h1>')) {
      content = content.replace('</h1>', '</h1>' + actionBarHtml);
    }
  }

  // 3. Sponsored Banner & Ad Slot at bottom of article
  if (!content.includes('sponsored-smartlink-box')) {
    const bottomAdHtml = `\n      <!-- Sponsored High-CTR Direct Link Banner -->
      <div class="sponsored-smartlink-box" style="margin: 2rem 0 1.5rem 0; padding: 1rem 1.25rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08)); border: 1px dashed var(--primary-500, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main, #1e293b);">
          <span style="display:inline-block; margin-right:6px;">⚡</span> ${loc.bannerTitle}
        </div>
        <a href="${DIRECT_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display: inline-block; padding: 0.55rem 1.15rem; background: var(--primary-600, #4f46e5); color: #ffffff; font-size: 0.9rem; font-weight: 700; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
          ${loc.bannerBtn}
        </a>
      </div>

      <!-- High-CPM 728x90 Banner -->
      <div class="ad-banner-slot" style="margin: 2rem auto; text-align: center; min-height: 90px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
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

      <!-- In-Content Native Ad Container -->
      <div class="ad-native-slot" style="margin: 2rem auto 1rem auto; text-align: center; max-width: 100%; min-height: 120px;">
        <script async="async" data-cfasync="false" src="https://pl31760931.profitableratecpmnetwork.com/6af35b8a30cb38f675be2353f8953c6b/invoke.js"></script>
        <div id="container-6af35b8a30cb38f675be2353f8953c6b"></div>
      </div>\n`;

    content = content.replace('</article>', bottomAdHtml + '</article>');
  }

  fs.writeFileSync(file, content, 'utf8');
}

['es', 'de', 'pt'].forEach(lang => {
  const blogDir = path.join(lang, 'blog');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
    files.forEach(f => {
      injectMonetizationIntoArticle(path.join(blogDir, f), lang);
    });
    console.log(`Injected High-CTR CRO monetization into ${files.length} ${lang.toUpperCase()} blog articles.`);
  }
});
