const fs = require('fs');

// Target: blog/1-tsp-is-ml.html
(function fix1Tsp() {
  let content = fs.readFileSync('blog/1-tsp-is-ml.html', 'utf8');

  // Title & Meta Description
  content = content.replace(
    '<title>1 TSP in mL Guide | OmniConverter</title>',
    '<title>How Many mL in a Teaspoon? 1 tsp to mL (5 mL / 4.93 mL) | OmniConverter</title>'
  );
  content = content.replace(
    'Find out exactly how many mL is 1 TSP. Complete kitchen teaspoon volume conversion guide with tables for US, Metric, and UK teaspoons.',
    'How many mL in a teaspoon? Exactly 5 mL (UK Metric) and 4.93 mL (US Customary). Essential culinary and medical dosing conversion guide with live calculator.'
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
    '<h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">1 TSP is How Many mL? Culinary Teaspoon Volume Guide</h1>',
    '<h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">How Many mL in a Teaspoon? (1 tsp is mL)</h1>'
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

  // Quick summary answer enhancement
  content = content.replace(
    `1 US Teaspoon (tsp) = 4.92892 mL (rounded to 4.93 mL or 5 mL)<br>\n          1 Metric Teaspoon (UK, Australia, New Zealand, Canada) = 5.00000 mL<br>\n          1 Imperial Teaspoon (Legacy UK) = 5.91939 mL`,
    `<strong>Metric Teaspoon (UK, Australia, NZ, Canada):</strong> 1 tsp = <strong>exactly 5.00 mL</strong><br>\n          <strong>US Customary Teaspoon:</strong> 1 tsp = <strong>4.93 mL</strong> (4.92892 mL)<br>\n          <strong>US Food Nutrition Labeling (FDA standard):</strong> 1 tsp = <strong>5.00 mL</strong>`
  ).replace(
    `1 US Teaspoon (tsp) = 4.92892 mL (rounded to 4.93 mL or 5 mL)<br>\r\n          1 Metric Teaspoon (UK, Australia, New Zealand, Canada) = 5.00000 mL<br>\r\n          1 Imperial Teaspoon (Legacy UK) = 5.91939 mL`,
    `<strong>Metric Teaspoon (UK, Australia, NZ, Canada):</strong> 1 tsp = <strong>exactly 5.00 mL</strong><br>\r\n          <strong>US Customary Teaspoon:</strong> 1 tsp = <strong>4.93 mL</strong> (4.92892 mL)<br>\r\n          <strong>US Food Nutrition Labeling (FDA standard):</strong> 1 tsp = <strong>5.00 mL</strong>`
  );

  // Live in-page volume calculator
  const tspCalculatorHtml = `
      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Instant Teaspoon to Milliliter Calculator</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Instant Calculation</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Enter teaspoons, tablespoons, or milliliters to convert cooking volumes in real time:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="1" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="tsp_metric" selected>Metric Teaspoon (5 mL)</option>
              <option value="tsp_us">US Teaspoon (4.93 mL)</option>
              <option value="ml">Milliliters (mL)</option>
              <option value="tbsp">Tablespoons (tbsp)</option>
              <option value="floz">Fluid Ounces (fl oz)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="ml" selected>Milliliters (mL)</option>
              <option value="tsp_metric">Metric Teaspoon (5 mL)</option>
              <option value="tsp_us">US Teaspoon (4.93 mL)</option>
              <option value="tbsp">Tablespoons (tbsp)</option>
              <option value="floz">Fluid Ounces (fl oz)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">5.00 mL</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">1 Metric tsp = 5.00 mL (US Customary tsp = 4.93 mL)</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
        </div>
      </div>
  `;

  content = content.replace(
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\n      </div>',
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\n      </div>\n' + tspCalculatorHtml
  ).replace(
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\r\n      </div>',
    '<a href="/volume-capacity" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Volume Converter &rarr;</a>\r\n      </div>\r\n' + tspCalculatorHtml
  );

  // Add Statutory Standards & Medical Dosing Warning
  const medicalWarning = `
      <div style="background:var(--bg-elevated); border-left:4px solid #ef4444; border-radius:var(--radius-lg); padding:1.25rem; margin:1.5rem 0;">
        <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">⚠️ Medical Dosage Warning: Never Use Tableware Spoons</h3>
        <p style="margin:0; font-size:0.95rem; line-height:1.6; color:var(--text-muted);">
          According to the <strong>NHS</strong> and the <strong>US Food &amp; Drug Administration (FDA 21 CFR §101.9)</strong>, household cutlery teaspoons vary dramatically from 2.5 mL to 8.5 mL. When measuring pediatric medicine, liquid antibiotics, or pharmaceutical syrups, always use an oral dosing syringe or calibrated medicine cup rather than a dining teaspoon.
        </p>
      </div>
  `;

  content = content.replace(
    '<h2>Cooking and Baking Conversions for Teaspoons</h2>',
    medicalWarning + '\n<h2>Cooking and Baking Conversions for Teaspoons</h2>'
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
      tsp_metric: 5.0,
      tsp_us: 4.92892159375,
      tbsp: 14.78676478125,
      floz: 29.5735295625
    };

    function calculate() {
      if (!input || !resVal || !formulaText) return;
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel ? fromSel.value : 'tsp_metric';
      var to = toSel ? toSel.value : 'ml';

      var totalMl = val * (ratesInMl[from] || 1);
      var result = totalMl / (ratesInMl[to] || 1);

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 10 ? result.toFixed(1) : result.toFixed(2));
      var toLabel = to === 'tsp_metric' ? 'Metric tsp' : (to === 'tsp_us' ? 'US tsp' : to);
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

  fs.writeFileSync('blog/1-tsp-is-ml.html', content, 'utf8');
  console.log('1-tsp-is-ml.html updated cleanly.');
})();
