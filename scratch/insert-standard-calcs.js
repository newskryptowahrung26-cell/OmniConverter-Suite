const fs = require('fs');

// Weight widget for blog/22-kg-in-stone.html
const weightCalc = `
    <!-- Weight Converter Widget -->
    <section class="calculator-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.5rem; margin:1.5rem 0;">
      <h2 style="margin-top:0; font-size:1.25rem;">Live kg to Stone Converter</h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
        <div>
          <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">Value</label>
          <input type="number" id="liveToolInput" value="22" step="any" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
        </div>
        <div>
          <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">From Unit</label>
          <select id="liveToolFromUnit" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
            <option value="kg" selected>Kilograms (kg)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="st">Stone (st)</option>
          </select>
        </div>
      </div>
      <div style="padding:1rem; background:#ede9fe; border-radius:8px; font-weight:700; color:#4f46e5; font-size:1.1rem;" id="calcOutput">
        3 st 6.5 lb (48.50 lbs)
      </div>
      <script>
        document.getElementById('liveToolInput').addEventListener('input', updateCalc);
        document.getElementById('liveToolFromUnit').addEventListener('change', updateCalc);
        function updateCalc() {
          const val = parseFloat(document.getElementById('liveToolInput').value) || 0;
          const unit = document.getElementById('liveToolFromUnit').value;
          let lbs = 0;
          if (unit === 'kg') lbs = val * 2.20462;
          else if (unit === 'lb') lbs = val;
          else if (unit === 'st') lbs = val * 14;
          const st = Math.floor(lbs / 14);
          const rem = (lbs - st * 14).toFixed(1);
          document.getElementById('calcOutput').textContent = st + ' st ' + rem + ' lb (' + lbs.toFixed(2) + ' lbs)';
        }
      </script>
    </section>
`;

// Currency widget for blog/700-gbp-to-aud.html
const currencyCalc = `
    <!-- Currency Converter Widget -->
    <section class="calculator-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.5rem; margin:1.5rem 0;">
      <h2 style="margin-top:0; font-size:1.25rem;">Live GBP to AUD Converter</h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
        <div>
          <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">Amount</label>
          <input type="number" id="liveToolInput" value="700" step="any" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
        </div>
        <div>
          <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">From Currency</label>
          <select id="liveToolFromUnit" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; box-sizing:border-box;">
            <option value="gbp" selected>British Pound (GBP)</option>
            <option value="usd">US Dollar (USD)</option>
            <option value="eur">Euro (EUR)</option>
          </select>
        </div>
      </div>
      <div style="padding:1rem; background:#ede9fe; border-radius:8px; font-weight:700; color:#4f46e5; font-size:1.1rem;" id="calcOutput">
        A$1,341.06 AUD
      </div>
      <script>
        document.getElementById('liveToolInput').addEventListener('input', updateCalc);
        document.getElementById('liveToolFromUnit').addEventListener('change', updateCalc);
        function updateCalc() {
          const val = parseFloat(document.getElementById('liveToolInput').value) || 0;
          const curr = document.getElementById('liveToolFromUnit').value;
          let audRate = 1.9158;
          if (curr === 'usd') audRate = 1.5234;
          if (curr === 'eur') audRate = 1.6321;
          const res = (val * audRate).toFixed(2);
          document.getElementById('calcOutput').textContent = 'A$' + parseFloat(res).toLocaleString('en-AU', {minimumFractionDigits:2}) + ' AUD';
        }
      </script>
    </section>
`;

// Patch 22-kg-in-stone.html
let h1 = fs.readFileSync('blog/22-kg-in-stone.html', 'utf8');
// replace any existing section calc
h1 = h1.replace(/<!-- Calculator Widget -->[\s\S]*?<\/section>/, '');
h1 = h1.replace(/<section id="calc"[\s\S]*?<\/section>/, '');
h1 = h1.replace('<h2>Conversion Table</h2>', weightCalc + '\n      <h2>Conversion Table</h2>');
fs.writeFileSync('blog/22-kg-in-stone.html', h1, 'utf8');
console.log('Patched blog/22-kg-in-stone.html');

// Patch 700-gbp-to-aud.html
let h2 = fs.readFileSync('blog/700-gbp-to-aud.html', 'utf8');
h2 = h2.replace(/<section id="calc"[\s\S]*?<\/section>/, '');
h2 = h2.replace('<h2>Formula</h2>', currencyCalc + '\n      <h2>Formula</h2>');
fs.writeFileSync('blog/700-gbp-to-aud.html', h2, 'utf8');
console.log('Patched blog/700-gbp-to-aud.html');
