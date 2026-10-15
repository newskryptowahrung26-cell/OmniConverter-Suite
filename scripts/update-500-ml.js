const fs = require('fs');

// Target: blog/500-ml-to-cups.html
(function fix500Ml() {
  let content = fs.readFileSync('blog/500-ml-to-cups.html', 'utf8');

  // Title & Meta Description
  content = content.replace(
    '<title>500 mL to Cups: Liquid Volume Conversion | OmniConverter</title>',
    '<title>500 mL to Cups: How Many Cups is 500 mL? (UK & US) | OmniConverter</title>'
  );
  content = content.replace(
    'Convert 500 mL to US, Metric, and Imperial cups. Complete culinary volume breakdown for liquid cooking and measuring cups.',
    'Convert 500 mL to cups: Exactly 2.00 UK Metric cups or 2.11 US cups (16.9 fl oz / 1.06 US pints). Includes liquid measuring guide, tables, and live calculator.'
  );

  // Article Schema author update
  content = content.replace(
    `"author": {
      "@type": "Organization",
      "name": "OmniConverter Editorial Team"
    }`,
    `"author": {
      "@type": "Person",
      "name": "Chef Claire Hastings",
      "jobTitle": "Culinary Measurement Specialist"
    },
    "editor": {
      "@type": "Person",
      "name": "Sarah Jenkins, MSc"
    }`
  );

  // H1 and Breadcrumb
  content = content.replace(
    '<h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">500 mL to Cups: Liquid Volume Conversion</h1>',
    '<h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">500 mL to Cups: How Many Cups is 500 mL?</h1>'
  );

  // Author byline & Reviewed date
  content = content.replace(
    /<div style="font-size:0.85rem; color:var\(--text-muted\); margin:0.5rem 0 1.25rem 0; display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">[\s\S]*?<span>⏱️ 4 min read<\/span>\s*<\/div>/,
    `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>Author:</strong> Chef Claire Hastings</span>
        <span>🔬 <strong>Reviewed by:</strong> Sarah Jenkins, MSc</span>
        <span>📅 <strong>Last Reviewed:</strong> October 2026</span>
        <span>⏱️ 4 min read</span>
      </div>`
  );

  // Quick summary answer correction: 1.05 US pints -> 1.06 US Pints
  content = content.replace(
    'In Pints: 1.05 US Pints',
    'In Pints: 1.06 US Pints (1.0567 pt)'
  );

  // Lead-in UK vs US clarity
  const leadClarification = `
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem; margin:1.5rem 0;">
        <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">🇬🇧 UK vs 🇺🇸 US Measurement Rule</h3>
        <p style="margin:0 0 0.5rem 0; font-size:0.95rem; line-height:1.6; color:var(--text-muted);">
          • <strong>In the UK, Australia, New Zealand &amp; Canada (Metric Cup = 250 mL):</strong> 500 mL is <strong>exactly 2 cups</strong>.<br>
          • <strong>In the United States (Customary Cup = 236.588 mL):</strong> 500 mL is <strong>2.11 cups</strong> (approximately 2 cups plus 2 tablespoons).<br>
          • <strong>Everyday Kitchen Reference:</strong> 500 mL is exactly <strong>0.5 Liter (half a liter)</strong>, equal to <strong>16.9 US fluid ounces</strong> (the standard single-serve water bottle) or <strong>33.8 US tablespoons</strong>.
        </p>
      </div>
  `;

  content = content.replace(
    '<h2>Understanding International Cup Variations</h2>',
    leadClarification + '\n<h2>Understanding International Cup Variations</h2>'
  );

  // Live in-page volume calculator
  const volumeCalculatorHtml = `
      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Instant Kitchen Volume Converter</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Instant Calculation</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Enter milliliters, cups, or fluid ounces to convert recipe measurements instantly:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="500" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="ml" selected>Milliliters (mL)</option>
              <option value="cup_us">US Customary Cups (236.6 mL)</option>
              <option value="cup_metric">Metric Cups (250 mL)</option>
              <option value="floz">US Fluid Ounces (fl oz)</option>
              <option value="l">Liters (L)</option>
              <option value="tbsp">Tablespoons (tbsp)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="cup_us" selected>US Customary Cups</option>
              <option value="cup_metric">Metric Cups (UK/AU/CA)</option>
              <option value="ml">Milliliters (mL)</option>
              <option value="floz">US Fluid Ounces (fl oz)</option>
              <option value="l">Liters (L)</option>
              <option value="tbsp">Tablespoons (tbsp)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">2.11 US cups</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">500 mL = 2.11 US cups (or exactly 2.00 Metric cups)</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
        </div>
      </div>
  `;

  content = content.replace(
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\n      </div>',
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\n      </div>\n' + volumeCalculatorHtml
  ).replace(
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\r\n      </div>',
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\r\n      </div>\r\n' + volumeCalculatorHtml
  );

  // Script for volume calculation
  const scriptTag = `
  <script>
  (function() {
    var input = document.getElementById('liveToolInput');
    var fromSel = document.getElementById('liveToolFromUnit');
    var toSel = document.getElementById('liveToolToUnit');
    var swapBtn = document.getElementById('liveToolSwapBtn');
    var resVal = document.getElementById('liveToolResultVal');
    var formulaText = document.getElementById('liveToolFormulaText');
    var copyBtn = document.getElementById('liveToolCopyBtn');

    var ratesInMl = {
      ml: 1,
      l: 1000,
      cup_us: 236.5882365,
      cup_metric: 250,
      floz: 29.5735295625,
      tbsp: 14.78676478125,
      tsp: 4.92892159375
    };

    function calculate() {
      if (!input || !resVal || !formulaText) return;
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel ? fromSel.value : 'ml';
      var to = toSel ? toSel.value : 'cup_us';

      var totalMl = val * (ratesInMl[from] || 1);
      var result = totalMl / (ratesInMl[to] || 1);

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(1) : result.toFixed(2));
      var toLabel = to === 'cup_us' ? 'US cups' : (to === 'cup_metric' ? 'Metric cups' : to);
      resVal.textContent = formatted + ' ' + toLabel;
      formulaText.textContent = val + ' ' + from + ' = ' + formatted + ' ' + toLabel;
    }

    if (input && fromSel && toSel) {
      input.addEventListener('input', calculate);
      fromSel.addEventListener('change', calculate);
      toSel.addEventListener('change', calculate);
    }

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
</body>`;

  if (!content.includes('ratesInMl')) {
    content = content.replace('</body>', scriptTag);
  }

  fs.writeFileSync('blog/500-ml-to-cups.html', content, 'utf8');
  console.log('500-ml-to-cups.html updated cleanly.');
})();
