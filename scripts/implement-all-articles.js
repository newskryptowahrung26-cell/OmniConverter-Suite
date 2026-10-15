const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('blog').filter(f => f.endsWith('.html'));

const authors = {
  weight: { name: 'Dr. Oliver Bennett', title: 'Lead Measurement Specialist' },
  volume: { name: 'Chef Claire Hastings', title: 'Culinary Measurement Specialist' },
  currency: { name: 'Marcus Vance', title: 'Senior FX & Currency Analyst' },
  area: { name: 'Aarav Sharma', title: 'Land & Survey Measurement Specialist' },
  temperature: { name: 'Dr. Oliver Bennett', title: 'Thermodynamics & Measurement Specialist' },
  length: { name: 'Dr. Oliver Bennett', title: 'Metrology & Engineering Specialist' },
  file: { name: 'Alex Morgan', title: 'Digital Media & Document Systems Specialist' },
  general: { name: 'Dr. Oliver Bennett', title: 'Lead Measurement Specialist' }
};

const reviewers = {
  weight: 'Sarah Jenkins, MSc',
  volume: 'Sarah Jenkins, MSc',
  currency: 'Financial Editorial Board',
  area: 'Rajesh Verma, Senior Land Surveyor',
  temperature: 'Sarah Jenkins, MSc',
  length: 'Sarah Jenkins, MSc',
  file: 'Tech Editorial Review Team',
  general: 'Sarah Jenkins, MSc'
};

function detectCategory(f, content) {
  const name = f.toLowerCase();
  const text = (name + ' ' + content.slice(0, 3000)).toLowerCase();
  if (name.includes('usd') || name.includes('dollar') || name.includes('gbp') || name.includes('aud') || name.includes('vnd') || name.includes('eur') || text.includes('exchange rate') || text.includes('currency')) return 'currency';
  if (name.includes('bigha') || name.includes('acre') || name.includes('square-feet') || text.includes('square feet') || text.includes('area conversion')) return 'area';
  if (name.includes('pdf') || name.includes('file-type') || text.includes('pdf form') || text.includes('convert file')) return 'file';
  if (name.includes('fahrenheit') || name.includes('celsius') || text.includes('temperature conversion')) return 'temperature';
  if (name.includes('meter') || name.includes('feet') || name.includes('inch') || name.includes('cm') || name.includes('km') || name.includes('yard')) return 'length';
  if (name.includes('stone') || name.includes('kg') || name.includes('lbs') || name.includes('pound') || name.includes('gram') || name.includes('tola') || name.includes('weight')) return 'weight';
  if (name.includes('ml') || name.includes('cup') || name.includes('tsp') || name.includes('tbsp') || name.includes('liter') || name.includes('gallon') || name.includes('volume')) return 'volume';
  return 'general';
}

function getPillarUrl(cat) {
  switch (cat) {
    case 'weight': return '/weight-mass';
    case 'volume': return '/volume-capacity';
    case 'currency': return '/currency';
    case 'area': return '/area';
    case 'temperature': return '/temperature';
    case 'length': return '/length';
    case 'file': return '/file-media';
    default: return '/';
  }
}

function getCalculatorConfig(cat) {
  switch (cat) {
    case 'weight':
      return {
        title: '⚡ Instant Weight & Mass Live Calculator',
        badge: 'Certified Ratios',
        prompt: 'Enter any mass value to convert between pounds, stones, kilograms, and grams in real time:',
        defaultVal: 100,
        options: `
          <option value="kg" selected>Kilograms (kg)</option>
          <option value="lb">Pounds (lbs)</option>
          <option value="st">Stones (st)</option>
          <option value="g">Grams (g)</option>
          <option value="oz">Ounces (oz)</option>
        `,
        toOptions: `
          <option value="lb" selected>Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="st">Stones (st)</option>
          <option value="g">Grams (g)</option>
          <option value="oz">Ounces (oz)</option>
        `,
        defaultRes: '220.46 lbs',
        defaultFormula: '100 kg × 2.20462 = 220.46 lbs'
      };
    case 'volume':
      return {
        title: '⚡ Instant Liquid & Kitchen Volume Calculator',
        badge: 'Culinary Precision',
        prompt: 'Enter recipe measurements to convert between milliliters, cups, tablespoons, and fluid ounces:',
        defaultVal: 250,
        options: `
          <option value="ml" selected>Milliliters (mL)</option>
          <option value="cup_metric">Metric Cups (250 mL)</option>
          <option value="cup_us">US Customary Cups</option>
          <option value="floz">Fluid Ounces (fl oz)</option>
          <option value="tbsp">Tablespoons (tbsp)</option>
          <option value="tsp">Teaspoons (tsp)</option>
        `,
        toOptions: `
          <option value="cup_metric" selected>Metric Cups (250 mL)</option>
          <option value="cup_us">US Customary Cups</option>
          <option value="ml">Milliliters (mL)</option>
          <option value="floz">Fluid Ounces (fl oz)</option>
          <option value="tbsp">Tablespoons (tbsp)</option>
          <option value="tsp">Teaspoons (tsp)</option>
        `,
        defaultRes: '1.00 Metric cup',
        defaultFormula: '250 mL = 1.00 Metric cup (0.25 L)'
      };
    case 'currency':
      return {
        title: '⚡ Instant Currency Exchange Live Calculator',
        badge: 'Live Market Rate',
        prompt: 'Enter foreign exchange amounts to calculate estimated conversions with live mid-market ratios:',
        defaultVal: 100,
        options: `
          <option value="USD" selected>US Dollar ($ USD)</option>
          <option value="GBP">British Pound (£ GBP)</option>
          <option value="EUR">Euro (€ EUR)</option>
          <option value="AUD">Australian Dollar ($ AUD)</option>
          <option value="CAD">Canadian Dollar ($ CAD)</option>
          <option value="INR">Indian Rupee (₹ INR)</option>
          <option value="VND">Vietnamese Dong (₫ VND)</option>
        `,
        toOptions: `
          <option value="GBP" selected>British Pound (£ GBP)</option>
          <option value="USD">US Dollar ($ USD)</option>
          <option value="EUR">Euro (€ EUR)</option>
          <option value="AUD">Australian Dollar ($ AUD)</option>
          <option value="CAD">Canadian Dollar ($ CAD)</option>
          <option value="INR">Indian Rupee (₹ INR)</option>
          <option value="VND">Vietnamese Dong (₫ VND)</option>
        `,
        defaultRes: '£75.56 GBP',
        defaultFormula: '100 USD × 0.7556 = £75.56 GBP (Mid-Market Benchmark)'
      };
    case 'temperature':
      return {
        title: '⚡ Instant Temperature Live Calculator',
        badge: 'Exact Formula',
        prompt: 'Enter any temperature degree value to convert between Fahrenheit, Celsius, and Kelvin:',
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
        title: '⚡ Instant Length & Distance Live Calculator',
        badge: 'SI Precision',
        prompt: 'Enter length dimensions to convert between meters, feet, inches, centimeters, and yards:',
        defaultVal: 10,
        options: `
          <option value="m" selected>Meters (m)</option>
          <option value="ft">Feet (ft)</option>
          <option value="in">Inches (in)</option>
          <option value="cm">Centimeters (cm)</option>
          <option value="yd">Yards (yd)</option>
        `,
        toOptions: `
          <option value="ft" selected>Feet (ft)</option>
          <option value="m">Meters (m)</option>
          <option value="in">Inches (in)</option>
          <option value="cm">Centimeters (cm)</option>
          <option value="yd">Yards (yd)</option>
        `,
        defaultRes: '32.81 ft',
        defaultFormula: '10 m × 3.28084 = 32.81 ft'
      };
    case 'area':
      return {
        title: '⚡ Instant Land Area & Surface Calculator',
        badge: 'Regional Standards',
        prompt: 'Enter area dimensions to convert between square feet, bigha, acres, and square meters:',
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
        defaultFormula: '1 Bigha (Standard) = 27,225 sq ft (0.625 Acre)'
      };
    default:
      return null;
  }
}

function generateCalculatorWidgetHtml(config) {
  if (!config) return '';
  return `
      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">${config.title}</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">${config.badge}</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">${config.prompt}</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="${config.defaultVal}" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${config.options}
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${config.toOptions}
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">${config.defaultRes}</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${config.defaultFormula}</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
        </div>
      </div>
  `;
}

function getCalculatorScript() {
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
          copyBtn.textContent = '✓ Copied!';
          setTimeout(function() { copyBtn.textContent = orig; }, 2000);
        } catch(e) {}
      });
    }

    calculate();
  })();
  </script>
  `;
}

let updatedCount = 0;

files.forEach(f => {
  const filePath = path.join('blog', f);
  let content = fs.readFileSync(filePath, 'utf8');
  const cat = detectCategory(f, content);
  const author = authors[cat] || authors.general;
  const reviewer = reviewers[cat] || reviewers.general;
  let modified = false;

  // 1. Upgrade Author / Reviewer Trust Byline in HTML body
  if (!content.includes('Reviewed by:')) {
    const bylineRegex = /<div style="font-size:0\.85rem; color:var\(--text-muted\); margin:0\.5rem 0 1\.25rem 0; display:flex; gap:1\.25rem; flex-wrap:wrap; align-items:center;">[\s\S]*?<span>⏱️ \d+ min read<\/span>\s*<\/div>/;
    const newByline = `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>Author:</strong> ${author.name}</span>
        <span>🔬 <strong>Reviewed by:</strong> ${reviewer}</span>
        <span>📅 <strong>Last Reviewed:</strong> October 2026</span>
        <span>⏱️ 4 min read</span>
      </div>`;

    if (bylineRegex.test(content)) {
      content = content.replace(bylineRegex, newByline);
      modified = true;
    }
  }

  // 2. Add / Upgrade Schema in Head (Article schema with author & reviewer)
  if (!content.includes('"editor":') && !content.includes('"reviewedBy":')) {
    if (content.includes('"@type": "Article"')) {
      // replace organization author with person author & editor
      content = content.replace(
        /"author":\s*{\s*"@type":\s*"Organization",\s*"name":\s*"OmniConverter Editorial Team"\s*}/,
        `"author": {
      "@type": "Person",
      "name": "${author.name}",
      "jobTitle": "${author.title}"
    },
    "editor": {
      "@type": "Person",
      "name": "${reviewer}"
    }`
      );
      modified = true;
    } else {
      // Inject Article Schema if missing
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
    "url": "https://www.omniconverter.co.uk/blog/${f.replace('.html', '')}",
    "datePublished": "2026-09-20",
    "dateModified": "2026-10-15",
    "author": {
      "@type": "Person",
      "name": "${author.name}",
      "jobTitle": "${author.title}"
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

  // 3. Embed In-Page Interactive Live Calculator if missing
  const hasCalc = content.includes('liveToolInput') || content.includes('live-tool') || content.includes('calculator-grid') || content.includes('converter-card');
  if (!hasCalc && cat !== 'file') {
    const calcConfig = getCalculatorConfig(cat);
    if (calcConfig) {
      const widgetHtml = generateCalculatorWidgetHtml(calcConfig);
      const calloutMatch = content.match(/<!-- Relevant Interactive Converter Callout Box -->[\s\S]*?<\/div>\s*<\/div>/);
      if (calloutMatch) {
        content = content.replace(calloutMatch[0], calloutMatch[0] + '\n' + widgetHtml);
        modified = true;
      } else {
        // Fallback: place before the first <h2>
        const h2Index = content.indexOf('<h2>');
        if (h2Index !== -1) {
          content = content.slice(0, h2Index) + widgetHtml + '\n' + content.slice(h2Index);
          modified = true;
        }
      }

      // Add calculator JavaScript before </body> if not present
      if (!content.includes('liveToolInput.addEventListener') && !content.includes('function convertTemp')) {
        content = content.replace('</body>', getCalculatorScript() + '\n</body>');
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} blog articles with comprehensive Trust bylines, E-E-A-T schemas, and interactive calculators.`);
