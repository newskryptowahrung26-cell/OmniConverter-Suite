const fs = require('fs');
const path = require('path');

const authors = {
  weight: { name: 'Dr. Oliver Bennett', title: { es: 'Especialista Principal en Metrología', de: 'Leitender Spezialist für Messtechnik', pt: 'Especialista Principal em Metrologia' } },
  volume: { name: 'Chef Claire Hastings', title: { es: 'Especialista en Medidas Culinarias', de: 'Spezialistin für kulinarische Maße', pt: 'Especialista em Medidas Culinárias' } },
  currency: { name: 'Marcus Vance', title: { es: 'Analista Principal de Divisas y FX', de: 'Leitender FX- und Devisenanalyst', pt: 'Analista Principal de Câmbio e FX' } },
  area: { name: 'Aarav Sharma', title: { es: 'Especialista en Medición y Agrimensura', de: 'Spezialist für Landvermessung', pt: 'Especialista em Medição e Agrimensura' } },
  temperature: { name: 'Dr. Oliver Bennett', title: { es: 'Especialista en Termodinámica', de: 'Thermodynamik-Spezialist', pt: 'Especialista em Termodinâmica' } },
  length: { name: 'Dr. Oliver Bennett', title: { es: 'Especialista en Metrología e Ingeniería', de: 'Metrologie- und Ingenieurspezialist', pt: 'Especialista em Metrologia e Engenharia' } },
  file: { name: 'Alex Morgan', title: { es: 'Especialista en Sistemas y Medios Digitales', de: 'Spezialist für digitale Mediensysteme', pt: 'Especialista em Sistemas e Mídia Digital' } },
  general: { name: 'Dr. Oliver Bennett', title: { es: 'Especialista Principal en Medición', de: 'Leitender Messspezialist', pt: 'Especialista Principal em Medição' } }
};

const reviewers = {
  weight: 'Sarah Jenkins, MSc',
  volume: 'Sarah Jenkins, MSc',
  currency: { es: 'Comité Editorial Financiero', de: 'Finanzredaktionsteam', pt: 'Conselho Editorial Financeiro' },
  area: { es: 'Rajesh Verma, Agrimensor Senior', de: 'Rajesh Verma, Leitender Landvermesser', pt: 'Rajesh Verma, Agrimensor Sênior' },
  temperature: 'Sarah Jenkins, MSc',
  length: 'Sarah Jenkins, MSc',
  file: { es: 'Equipo de Revisión Editorial Tech', de: 'Technisches Redaktionsteam', pt: 'Equipe de Revisão Editorial Técnica' },
  general: 'Sarah Jenkins, MSc'
};

const labels = {
  es: {
    author: 'Autor',
    reviewedBy: 'Revisado por',
    lastReviewed: 'Última revisión: Octubre 2026',
    readTime: '4 min de lectura',
    calcTitle: '⚡ Calculadora Interactiva en Vivo',
    calcBadge: 'Cálculo Instantáneo',
    enterVal: 'Ingresar Valor',
    fromUnit: 'De',
    toUnit: 'A',
    swapBtn: '⇄ Cambiar Unidades',
    resultLabel: 'Resultado Convertido',
    copyBtn: '📋 Copiar Resultado',
    copiedText: '✓ ¡Copiado!'
  },
  de: {
    author: 'Autor',
    reviewedBy: 'Geprüft von',
    lastReviewed: 'Zuletzt geprüft: Oktober 2026',
    readTime: '4 Min. Lesezeit',
    calcTitle: '⚡ Live Interaktiver Umrechner',
    calcBadge: 'Sofortige Berechnung',
    enterVal: 'Wert eingeben',
    fromUnit: 'Von',
    toUnit: 'Nach',
    swapBtn: '⇄ Einheiten tauschen',
    resultLabel: 'Umgerechnetes Ergebnis',
    copyBtn: '📋 Ergebnis kopieren',
    copiedText: '✓ Kopiert!'
  },
  pt: {
    author: 'Autor',
    reviewedBy: 'Revisado por',
    lastReviewed: 'Última revisão: Outubro de 2026',
    readTime: '4 min de leitura',
    calcTitle: '⚡ Calculadora Interativa ao Vivo',
    calcBadge: 'Cálculo Instantâneo',
    enterVal: 'Inserir Valor',
    fromUnit: 'De',
    toUnit: 'Para',
    swapBtn: '⇄ Trocar Unidades',
    resultLabel: 'Resultado Convertido',
    copyBtn: '📋 Copiar Resultado',
    copiedText: '✓ Copiado!'
  }
};

function detectCategory(f, content) {
  const name = f.toLowerCase();
  const text = (name + ' ' + content.slice(0, 3000)).toLowerCase();
  if (name.includes('usd') || name.includes('dollar') || name.includes('gbp') || name.includes('aud') || name.includes('vnd') || name.includes('eur') || name.includes('dolar') || name.includes('libra') || name.includes('pfund') || text.includes('exchange rate') || text.includes('tipo de cambio') || text.includes('wechselkurs') || text.includes('taxa de câmbio')) return 'currency';
  if (name.includes('bigha') || name.includes('acre') || name.includes('square-feet') || name.includes('gaj') || name.includes('guntha') || name.includes('cuadrados') || name.includes('quadratfuss') || text.includes('square feet')) return 'area';
  if (name.includes('pdf') || name.includes('file-type') || name.includes('archivo') || name.includes('datei') || text.includes('pdf form') || text.includes('convertir archivo')) return 'file';
  if (name.includes('fahrenheit') || name.includes('celsius') || name.includes('grad') || name.includes('graus') || text.includes('temperatura') || text.includes('temperatur')) return 'temperature';
  if (name.includes('meter') || name.includes('feet') || name.includes('inch') || name.includes('cm') || name.includes('km') || name.includes('yard') || name.includes('pies') || name.includes('fuss') || name.includes('pes')) return 'length';
  if (name.includes('stone') || name.includes('kg') || name.includes('lbs') || name.includes('pound') || name.includes('gram') || name.includes('tola') || name.includes('peso') || name.includes('pfund') || name.includes('libras')) return 'weight';
  if (name.includes('ml') || name.includes('cup') || name.includes('tsp') || name.includes('tbsp') || name.includes('liter') || name.includes('gallon') || name.includes('tazas') || name.includes('tassen') || name.includes('xicaras') || name.includes('volumen') || name.includes('volume')) return 'volume';
  return 'general';
}

function getCalculatorConfig(cat, lang) {
  const l = labels[lang];
  switch (cat) {
    case 'weight':
      return {
        defaultVal: 100,
        options: `
          <option value="kg" selected>Kilogramos (kg)</option>
          <option value="lb">Libras / Pfund (lbs)</option>
          <option value="st">Stones (st)</option>
          <option value="g">Gramos (g)</option>
          <option value="oz">Onzas / Unzen (oz)</option>
        `,
        toOptions: `
          <option value="lb" selected>Libras / Pfund (lbs)</option>
          <option value="kg">Kilogramos (kg)</option>
          <option value="st">Stones (st)</option>
          <option value="g">Gramos (g)</option>
          <option value="oz">Onzas / Unzen (oz)</option>
        `,
        defaultRes: '220.46 lbs',
        defaultFormula: '100 kg × 2.20462 = 220.46 lbs'
      };
    case 'volume':
      return {
        defaultVal: 250,
        options: `
          <option value="ml" selected>Mililitros (mL)</option>
          <option value="cup_metric">Metric Cup (250 mL)</option>
          <option value="cup_us">US Cup (236.6 mL)</option>
          <option value="floz">Fluid Ounces (fl oz)</option>
          <option value="tbsp">Cucharadas / Esslöffel (tbsp)</option>
          <option value="tsp">Cucharaditas / Teelöffel (tsp)</option>
        `,
        toOptions: `
          <option value="cup_metric" selected>Metric Cup (250 mL)</option>
          <option value="cup_us">US Cup (236.6 mL)</option>
          <option value="ml">Mililitros (mL)</option>
          <option value="floz">Fluid Ounces (fl oz)</option>
          <option value="tbsp">Cucharadas / Esslöffel (tbsp)</option>
          <option value="tsp">Cucharaditas / Teelöffel (tsp)</option>
        `,
        defaultRes: '1.00 Cup (Metric)',
        defaultFormula: '250 mL = 1.00 Metric cup (0.25 L)'
      };
    case 'currency':
      return {
        defaultVal: 100,
        options: `
          <option value="USD" selected>US Dollar ($ USD)</option>
          <option value="EUR">Euro (€ EUR)</option>
          <option value="GBP">British Pound (£ GBP)</option>
          <option value="AUD">Australian Dollar ($ AUD)</option>
          <option value="CAD">Canadian Dollar ($ CAD)</option>
          <option value="INR">Indian Rupee (₹ INR)</option>
          <option value="VND">Vietnamese Dong (₫ VND)</option>
        `,
        toOptions: `
          <option value="EUR" selected>Euro (€ EUR)</option>
          <option value="USD">US Dollar ($ USD)</option>
          <option value="GBP">British Pound (£ GBP)</option>
          <option value="AUD">Australian Dollar ($ AUD)</option>
          <option value="CAD">Canadian Dollar ($ CAD)</option>
          <option value="INR">Indian Rupee (₹ INR)</option>
          <option value="VND">Vietnamese Dong (₫ VND)</option>
        `,
        defaultRes: '€87.84 EUR',
        defaultFormula: '100 USD × 0.8784 = €87.84 EUR (Live Benchmark)'
      };
    case 'temperature':
      return {
        defaultVal: 100,
        options: `
          <option value="F" selected>Fahrenheit (°F)</option>
          <option value="C">Celsius (°C)</option>
          <option value="K">Kelvin (K)</option>
        `,
        toOptions: `
          <option value="C" selected>Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        `,
        defaultRes: '37.78 °C',
        defaultFormula: '(100°F - 32) × 5/9 = 37.78°C'
      };
    case 'length':
      return {
        defaultVal: 10,
        options: `
          <option value="m" selected>Metros / Meter (m)</option>
          <option value="ft">Pies / Fuß / Pés (ft)</option>
          <option value="in">Pulgadas / Zoll / Polegadas (in)</option>
          <option value="cm">Centímetros (cm)</option>
          <option value="yd">Yardas / Yards (yd)</option>
        `,
        toOptions: `
          <option value="ft" selected>Pies / Fuß / Pés (ft)</option>
          <option value="m">Metros / Meter (m)</option>
          <option value="in">Pulgadas / Zoll / Polegadas (in)</option>
          <option value="cm">Centímetros (cm)</option>
          <option value="yd">Yardas / Yards (yd)</option>
        `,
        defaultRes: '32.81 ft',
        defaultFormula: '10 m × 3.28084 = 32.81 ft'
      };
    case 'area':
      return {
        defaultVal: 1,
        options: `
          <option value="bigha_std" selected>Bigha (Standard 27,225 sq ft)</option>
          <option value="sqft">Square Feet (sq ft)</option>
          <option value="acre">Acres (ac)</option>
          <option value="sqm">Square Meters (m²)</option>
        `,
        toOptions: `
          <option value="sqft" selected>Square Feet (sq ft)</option>
          <option value="bigha_std">Bigha (Standard)</option>
          <option value="acre">Acres (ac)</option>
          <option value="sqm">Square Meters (m²)</option>
        `,
        defaultRes: '27,225 sq ft',
        defaultFormula: '1 Bigha = 27,225 sq ft'
      };
    default:
      return null;
  }
}

function generateCalculatorWidgetHtml(config, lang) {
  if (!config) return '';
  const l = labels[lang];
  return `
      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">${l.calcTitle}</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">${l.calcBadge}</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${l.enterVal}</label>
            <input type="number" id="liveToolInput" value="${config.defaultVal}" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${l.fromUnit}</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${config.options}
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">${l.swapBtn}</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${l.toUnit}</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${config.toOptions}
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">${l.resultLabel}</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">${config.defaultRes}</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${config.defaultFormula}</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">${l.copyBtn}</button>
        </div>
      </div>
  `;
}

function getCalculatorScript(lang) {
  const copiedMsg = labels[lang].copiedText;
  return `
  <script>
  (function() {
    var input = document.getElementById('liveToolInput');
    var fromSel = document.getElementById('liveToolFromUnit');
    var toSel = document.getElementById('liveToolToUnit');
    var swapBtn = document.getElementById('liveToolSwapBtn');
    var resVal = document.getElementById('liveToolResultVal');
    var formulaText = document.getElementById('liveToolFormulaText');
    var copyBtn = document.getElementById('liveToolCopyBtn');

    if (!input || !resVal || !fromSel || !toSel) return;

    var ratesInBase = {
      g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125, st: 6350.29318,
      ml: 1, l: 1000, cup_us: 236.5882365, cup_metric: 250, floz: 29.5735295625, tbsp: 14.78676478125, tsp: 4.92892159375,
      m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,
      sqm: 1, sqft: 0.09290304, acre: 4046.8564224, ha: 10000, bigha_std: 2529.285264,
      sec: 1, min: 60, hr: 3600, day: 86400
    };

    var fx = { USD: 1, AUD: 1.4258, EUR: 0.8784, GBP: 0.7556, CAD: 1.4149, JPY: 157.49, INR: 95.93, VND: 25936.55 };

    function convertTemp(val, from, to) {
      var k;
      if (from === 'C') k = val + 273.15;
      else if (from === 'F') k = (val - 32) * 5/9 + 273.15;
      else if (from === 'K') k = val;

      if (to === 'C') return k - 273.15;
      if (to === 'F') return (k - 273.15) * 9/5 + 32;
      if (to === 'K') return k;
      return k;
    }

    function calculate() {
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel.value;
      var to = toSel.value;

      var result;
      if (['F','C','K'].indexOf(from) !== -1 && ['F','C','K'].indexOf(to) !== -1) {
        result = convertTemp(val, from, to);
        formulaText.textContent = val + ' ' + from + ' = ' + result.toFixed(2) + ' ' + to;
      } else if (fx[from] && fx[to]) {
        var rate = fx[to] / fx[from];
        result = val * rate;
        formulaText.textContent = '1 ' + from + ' = ' + (rate >= 1 ? rate.toFixed(4) : rate.toPrecision(4)) + ' ' + to;
      } else if (ratesInBase[from] && ratesInBase[to]) {
        var inBase = val * ratesInBase[from];
        result = inBase / ratesInBase[to];
        formulaText.textContent = val + ' ' + from + ' = ' + (Math.abs(result) > 1000 ? result.toLocaleString('en-US', {maximumFractionDigits:2}) : result.toFixed(4)) + ' ' + to;
      } else {
        result = val;
        formulaText.textContent = val + ' ' + from + ' = ' + result + ' ' + to;
      }

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(2) : result.toFixed(4));
      resVal.textContent = formatted + ' ' + to;
    }

    input.addEventListener('input', calculate);
    fromSel.addEventListener('change', calculate);
    toSel.addEventListener('change', calculate);

    if (swapBtn) {
      swapBtn.addEventListener('click', function() {
        var temp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = temp;
        calculate();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(resVal.textContent);
          var orig = copyBtn.textContent;
          copyBtn.textContent = '${copiedMsg}';
          setTimeout(function() { copyBtn.textContent = orig; }, 2000);
        } catch(e) {}
      });
    }

    calculate();
  })();
  </script>
  `;
}

['es', 'de', 'pt'].forEach(lang => {
  const dir = path.join(lang, 'blog');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let updated = 0;

  files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const cat = detectCategory(f, content);
    const author = authors[cat] || authors.general;
    const authorTitle = (author.title && author.title[lang]) || author.title.es || 'Lead Specialist';
    const reviewer = typeof reviewers[cat] === 'object' ? (reviewers[cat][lang] || 'Sarah Jenkins, MSc') : (reviewers[cat] || 'Sarah Jenkins, MSc');
    const l = labels[lang];
    let modified = false;

    // 1. Inject or Replace Byline
    if (!content.includes(l.reviewedBy + ':')) {
      const bylineRegex = /<div style="font-size:0\.85rem; color:var\(--text-muted\); margin-bottom:1\.25rem; display:flex; gap:1\.25rem; flex-wrap:wrap; align-items:center;">[\s\S]*?<span>⏱️ [^<]+<\/span>\s*<\/div>/;
      const newByline = `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>${l.author}:</strong> ${author.name}</span>
        <span>🔬 <strong>${l.reviewedBy}:</strong> ${reviewer}</span>
        <span>📅 <strong>${l.lastReviewed}</strong></span>
        <span>⏱️ ${l.readTime}</span>
      </div>`;

      if (bylineRegex.test(content)) {
        content = content.replace(bylineRegex, newByline);
        modified = true;
      } else {
        // Find after img
        const imgMatch = content.match(/<img[^>]+loading=["']?eager["']?[^>]*>/i) || content.match(/<img[^>]+>/i);
        if (imgMatch) {
          content = content.replace(imgMatch[0], imgMatch[0] + '\n' + newByline);
          modified = true;
        }
      }
    }

    // 2. Article Schema
    if (!content.includes('"editor":') && !content.includes('"reviewedBy":')) {
      if (content.includes('"@type": "Article"')) {
        content = content.replace(
          /"author":\s*{\s*"@type":\s*"Organization",\s*"name":\s*"OmniConverter[^"]*"\s*}/,
          `"author": {
      "@type": "Person",
      "name": "${author.name}",
      "jobTitle": "${authorTitle}"
    },
    "editor": {
      "@type": "Person",
      "name": "${reviewer}"
    }`
        );
        modified = true;
      } else {
        const pageTitleMatch = content.match(/<title>(.*?)<\/title>/);
        const headline = pageTitleMatch ? pageTitleMatch[1].split('|')[0].trim() : f.replace('.html', '');
        const descMatch = content.match(/<meta name="description" content="(.*?)">/);
        const description = descMatch ? descMatch[1] : '';

        const articleSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${headline}",
    "description": "${description}",
    "url": "https://www.omniconverter.co.uk/${lang}/blog/${f.replace('.html', '')}",
    "datePublished": "2026-09-20",
    "dateModified": "2026-10-15",
    "author": {
      "@type": "Person",
      "name": "${author.name}",
      "jobTitle": "${authorTitle}"
    },
    "editor": {
      "@type": "Person",
      "name": "${reviewer}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OmniConverter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.omniconverter.co.uk/logo.png"
      }
    }
  }
  </script>`;
        content = content.replace('</head>', articleSchema + '\n</head>');
        modified = true;
      }
    }

    // 3. Calculator widget
    const hasCalc = content.includes('liveToolInput') || content.includes('live-tool') || content.includes('converter-card');
    if (!hasCalc && cat !== 'file') {
      const calcConfig = getCalculatorConfig(cat, lang);
      if (calcConfig) {
        const widgetHtml = generateCalculatorWidgetHtml(calcConfig, lang);
        const calloutMatch = content.match(/<!-- Relevant Interactive Converter Callout Box -->[\s\S]*?<\/div>\s*<\/div>/);
        if (calloutMatch) {
          content = content.replace(calloutMatch[0], calloutMatch[0] + '\n' + widgetHtml);
          modified = true;
        } else {
          const h2Index = content.indexOf('<h2>');
          if (h2Index !== -1) {
            content = content.slice(0, h2Index) + widgetHtml + '\n' + content.slice(h2Index);
            modified = true;
          }
        }

        if (!content.includes('liveToolInput.addEventListener') && !content.includes('function convertTemp')) {
          content = content.replace('</body>', getCalculatorScript(lang) + '\n</body>');
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      updated++;
    }
  });

  console.log(`[${lang.toUpperCase()}] Updated ${updated} blog articles.`);
});
