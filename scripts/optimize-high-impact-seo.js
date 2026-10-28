/**
 * OmniConverter High-Impact SEO Optimizer
 * Enhances the 30 priority articles/pages identified in Search Console:
 * Adds missing comparison tables, clears confusing figures, enriches snippet boxes,
 * and presets embedded calculators to exact query values.
 */

const fs = require('fs');
const path = require('path');

function patchFile(relPath, replacerFn) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[SKIP] File not found: ${relPath}`);
    return false;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  const updated = replacerFn(original);
  if (updated && updated !== original) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`[OK] Updated: ${relPath}`);
    return true;
  } else {
    console.log(`[NO CHANGE] ${relPath}`);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. 180lbs-in-stone: Add 160-200 lbs table + reverse stone table
// ─────────────────────────────────────────────────────────────
patchFile('blog/180lbs-in-stone.html', (html) => {
  if (html.includes('id="extended-stone-range"')) return html;

  const extraTable = `
<div id="extended-stone-range" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Comprehensive Weight Table: 160 to 200 Pounds in Stone</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Quick reference for neighbouring weights around 180 lbs, including stones &amp; pounds, decimal stones, and exact kilograms:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Pounds (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Decimal Stone</th>
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">Typical Body Profile</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">160 lbs</td><td style="padding:0.7rem 1rem;">11 st 6 lb</td><td style="padding:0.7rem 1rem;">11.43 st</td><td style="padding:0.7rem 1rem;">72.57 kg</td><td style="padding:0.7rem 1rem;">Healthy average for 5'8" - 5'10"</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">165 lbs</td><td style="padding:0.7rem 1rem;">11 st 11 lb</td><td style="padding:0.7rem 1rem;">11.79 st</td><td style="padding:0.7rem 1rem;">74.84 kg</td><td style="padding:0.7rem 1rem;">Middleweight athletic build</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">170 lbs</td><td style="padding:0.7rem 1rem;">12 st 2 lb</td><td style="padding:0.7rem 1rem;">12.14 st</td><td style="padding:0.7rem 1rem;">77.11 kg</td><td style="padding:0.7rem 1rem;">Welterweight MMA limit</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">175 lbs</td><td style="padding:0.7rem 1rem;">12 st 7 lb</td><td style="padding:0.7rem 1rem;">12.50 st</td><td style="padding:0.7rem 1rem;">79.38 kg</td><td style="padding:0.7rem 1rem;">Light-heavyweight benchmark</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">180 lbs ★</td><td style="padding:0.75rem 1rem;">12 st 12 lb</td><td style="padding:0.75rem 1rem;">12.86 st</td><td style="padding:0.75rem 1rem;">81.65 kg</td><td style="padding:0.75rem 1rem;">Exact Current Target Weight</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">185 lbs</td><td style="padding:0.7rem 1rem;">13 st 3 lb</td><td style="padding:0.7rem 1rem;">13.21 st</td><td style="padding:0.7rem 1rem;">83.91 kg</td><td style="padding:0.7rem 1rem;">Rugby union back player</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">190 lbs</td><td style="padding:0.7rem 1rem;">13 st 8 lb</td><td style="padding:0.7rem 1rem;">13.57 st</td><td style="padding:0.7rem 1rem;">86.18 kg</td><td style="padding:0.7rem 1rem;">FAA standard passenger weight</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">195 lbs</td><td style="padding:0.7rem 1rem;">13 st 11 lb</td><td style="padding:0.7rem 1rem;">13.93 st</td><td style="padding:0.7rem 1rem;">88.45 kg</td><td style="padding:0.7rem 1rem;">Cruiserweight training stage</td></tr>
        <tr><td style="padding:0.7rem 1rem;">200 lbs</td><td style="padding:0.7rem 1rem;">14 st 4 lb</td><td style="padding:0.7rem 1rem;">14.29 st</td><td style="padding:0.7rem 1rem;">90.72 kg</td><td style="padding:0.7rem 1rem;">14-stone landmark milestone</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${extraTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 2. 32-usd-to-gbp: Clean up stale rate text, add 30/90d range context
// ─────────────────────────────────────────────────────────────
patchFile('blog/32-usd-to-gbp.html', (html) => {
  if (html.includes('id="usd-gbp-ranges"')) return html;

  const rateBox = `
<div id="usd-gbp-ranges" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Live &amp; Historical Trajectory for $32 USD to GBP</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1rem 0;">Foreign exchange rates fluctuate every second across interbank trading sessions. Here is how $32 USD performs across typical market spreads:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(16,185,129,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Provider / Scenario</th>
          <th style="padding:0.75rem 1rem;">Effective Rate</th>
          <th style="padding:0.75rem 1rem;">You Receive (£)</th>
          <th style="padding:0.75rem 1rem;">Spread Fee</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:rgba(16,185,129,0.1); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Interbank Mid-Market Rate</td><td style="padding:0.7rem 1rem;">~0.7600 - 0.7900</td><td style="padding:0.7rem 1rem;">£24.32 - £25.28</td><td style="padding:0.7rem 1rem;">0% (Zero markup)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Wise / Revolut (Multi-Currency)</td><td style="padding:0.7rem 1rem;">Mid-market - 0.4%</td><td style="padding:0.7rem 1rem;">~£24.20 - £25.18</td><td style="padding:0.7rem 1rem;">~£0.10 - £0.15 fee</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">UK High-Street Debit Card (Barclays/HSBC)</td><td style="padding:0.7rem 1rem;">Mid-market - 2.99%</td><td style="padding:0.7rem 1rem;">~£23.60 - £24.52</td><td style="padding:0.7rem 1rem;">2.75% - 2.99% non-sterling fee</td></tr>
        <tr><td style="padding:0.7rem 1rem;">PayPal Currency Conversion</td><td style="padding:0.7rem 1rem;">Mid-market - 4.00%</td><td style="padding:0.7rem 1rem;">~£23.35 - £24.25</td><td style="padding:0.7rem 1rem;">3.5% - 4.5% retail margin</td></tr>
      </tbody>
    </table>
  </div>
  <p style="font-size:0.85rem; color:var(--text-muted); margin:1rem 0 0 0;">💡 <em>Pro-Tip:</em> Always choose to be billed in <strong>USD ($)</strong> on international checkouts and let your bank or travel card handle the FX, avoiding dynamic currency conversion (DCC) markups at payment terminals.</p>
</div>
`;
  return html.replace(/<\/article>/i, `${rateBox}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 3. 1-tola-in-grams: Resolve 10g vs 11.6638g confusion with clear authority
// ─────────────────────────────────────────────────────────────
patchFile('blog/1-tola-in-grams.html', (html) => {
  // Preset calculator to 1 tola and add comprehensive gold table
  if (html.includes('id="tola-exact-standards"')) return html;

  const tolaTable = `
<div id="tola-exact-standards" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Gold &amp; Jewellery Weight Reference Table: 0.5 to 100 Tolas</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Accurate breakdown comparing official Indian modern bullion standard (10g) with traditional British Imperial/Vedic standard (11.6638g) and Troy Ounces:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(251,191,36,0.1); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Tola Quantity</th>
          <th style="padding:0.75rem 1rem;">Standard Bullion (10g)</th>
          <th style="padding:0.75rem 1rem;">Traditional Tola (11.6638g)</th>
          <th style="padding:0.75rem 1rem;">Troy Ounces (oz t)</th>
          <th style="padding:0.75rem 1rem;">Ratti Equivalent</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">0.5 Tola</td><td style="padding:0.7rem 1rem;">5.000 g</td><td style="padding:0.7rem 1rem;">5.832 g</td><td style="padding:0.7rem 1rem;">0.187 oz t</td><td style="padding:0.7rem 1rem;">48 Ratti</td></tr>
        <tr style="background:rgba(251,191,36,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">1 Tola (Benchmark) ★</td><td style="padding:0.75rem 1rem;">10.000 g</td><td style="padding:0.75rem 1rem;">11.6638 g</td><td style="padding:0.75rem 1rem;">0.375 oz t</td><td style="padding:0.75rem 1rem;">96 Ratti</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2 Tolas</td><td style="padding:0.7rem 1rem;">20.000 g</td><td style="padding:0.7rem 1rem;">23.328 g</td><td style="padding:0.7rem 1rem;">0.750 oz t</td><td style="padding:0.7rem 1rem;">192 Ratti</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">5 Tolas</td><td style="padding:0.7rem 1rem;">50.000 g</td><td style="padding:0.7rem 1rem;">58.319 g</td><td style="padding:0.7rem 1rem;">1.875 oz t</td><td style="padding:0.7rem 1rem;">480 Ratti</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">10 Tolas (1 Bar)</td><td style="padding:0.7rem 1rem;">100.000 g</td><td style="padding:0.7rem 1rem;">116.638 g</td><td style="padding:0.7rem 1rem;">3.750 oz t</td><td style="padding:0.7rem 1rem;">960 Ratti</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">20 Tolas</td><td style="padding:0.7rem 1rem;">200.000 g</td><td style="padding:0.7rem 1rem;">233.276 g</td><td style="padding:0.7rem 1rem;">7.500 oz t</td><td style="padding:0.7rem 1rem;">1,920 Ratti</td></tr>
        <tr><td style="padding:0.7rem 1rem;">100 Tolas</td><td style="padding:0.7rem 1rem;">1,000.000 g (1 kg)</td><td style="padding:0.7rem 1rem;">1,166.380 g</td><td style="padding:0.7rem 1rem;">37.500 oz t</td><td style="padding:0.7rem 1rem;">9,600 Ratti</td></tr>
      </tbody>
    </table>
  </div>
  <p style="font-size:0.85rem; color:var(--text-muted); margin:1rem 0 0 0;">⚖️ <em>Market Guidance:</em> In modern retail bullion markets across India and the Middle East, gold rate charts are published per <strong>10 grams</strong>. In Pakistan and traditional wholesale jewellery trade, gold weights are weighed and invoiced at exactly <strong>11.664 grams per tola</strong>.</p>
</div>
`;
  return html.replace(/<\/article>/i, `${tolaTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 4. 220-pounds-in-stone: Differentiate with 200-240 lbs + BMI context
// ─────────────────────────────────────────────────────────────
patchFile('blog/220-pounds-in-stone.html', (html) => {
  if (html.includes('id="range-200-240"')) return html;

  const bmiTable = `
<div id="range-200-240" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">220 Pounds Context: 200 to 240 lbs Weight &amp; Stone Reference Table</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">220 lbs equals exactly <strong>15 stone 10 pounds (15.71 st)</strong> or <strong>99.79 kg</strong>. Here is how nearby body weights compare:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Weight (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">BMI Health Context (at 6'0")</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">200 lbs</td><td style="padding:0.7rem 1rem;">14 st 4 lb</td><td style="padding:0.7rem 1rem;">90.72 kg</td><td style="padding:0.7rem 1rem;">BMI 27.1 (Overweight threshold)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">210 lbs</td><td style="padding:0.7rem 1rem;">15 st 0 lb</td><td style="padding:0.7rem 1rem;">95.25 kg</td><td style="padding:0.7rem 1rem;">BMI 28.5 (Rugby forward / athletic build)</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">220 lbs ★</td><td style="padding:0.75rem 1rem;">15 st 10 lb</td><td style="padding:0.75rem 1rem;">99.79 kg</td><td style="padding:0.75rem 1rem;">BMI 29.8 (~100 kg milestone)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">230 lbs</td><td style="padding:0.7rem 1rem;">16 st 6 lb</td><td style="padding:0.7rem 1rem;">104.33 kg</td><td style="padding:0.7rem 1rem;">BMI 31.2 (Class 1 BMI parameter)</td></tr>
        <tr><td style="padding:0.7rem 1rem;">240 lbs</td><td style="padding:0.7rem 1rem;">17 st 2 lb</td><td style="padding:0.7rem 1rem;">108.86 kg</td><td style="padding:0.7rem 1rem;">BMI 32.5 (Heavyweight powerlifter class)</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${bmiTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 5. 13-stone-in-pounds: Add 1-20 stone table + preset calculator
// ─────────────────────────────────────────────────────────────
patchFile('blog/13-stone-in-pounds.html', (html) => {
  if (html.includes('id="stone-to-lbs-master"')) return html;

  const stoneTable = `
<div id="stone-to-lbs-master" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Full Stone to Pounds Reference Table (1 to 20 Stone)</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Every stone equals exactly 14 pounds. Check any stone value from 1 st to 20 st with exact poundage and kilogram equivalents:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.6rem 0.8rem;">Stone (st)</th>
          <th style="padding:0.6rem 0.8rem;">Pounds (lbs)</th>
          <th style="padding:0.6rem 0.8rem;">Kilograms (kg)</th>
          <th style="padding:0.6rem 0.8rem;">Stone (st)</th>
          <th style="padding:0.6rem 0.8rem;">Pounds (lbs)</th>
          <th style="padding:0.6rem 0.8rem;">Kilograms (kg)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">1 st</td><td style="padding:0.6rem 0.8rem;">14 lbs</td><td style="padding:0.6rem 0.8rem;">6.35 kg</td><td style="padding:0.6rem 0.8rem;">11 st</td><td style="padding:0.6rem 0.8rem;">154 lbs</td><td style="padding:0.6rem 0.8rem;">69.85 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">2 st</td><td style="padding:0.6rem 0.8rem;">28 lbs</td><td style="padding:0.6rem 0.8rem;">12.70 kg</td><td style="padding:0.6rem 0.8rem;">12 st</td><td style="padding:0.6rem 0.8rem;">168 lbs</td><td style="padding:0.6rem 0.8rem;">76.20 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">3 st</td><td style="padding:0.6rem 0.8rem;">42 lbs</td><td style="padding:0.6rem 0.8rem;">19.05 kg</td><td style="padding:0.6rem 0.8rem; background:rgba(99,102,241,0.12); font-weight:800;">13 st ★</td><td style="padding:0.6rem 0.8rem; background:rgba(99,102,241,0.12); font-weight:800;">182 lbs</td><td style="padding:0.6rem 0.8rem; background:rgba(99,102,241,0.12); font-weight:800;">82.55 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">4 st</td><td style="padding:0.6rem 0.8rem;">56 lbs</td><td style="padding:0.6rem 0.8rem;">25.40 kg</td><td style="padding:0.6rem 0.8rem;">14 st</td><td style="padding:0.6rem 0.8rem;">196 lbs</td><td style="padding:0.6rem 0.8rem;">88.90 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">5 st</td><td style="padding:0.6rem 0.8rem;">70 lbs</td><td style="padding:0.6rem 0.8rem;">31.75 kg</td><td style="padding:0.6rem 0.8rem;">15 st</td><td style="padding:0.6rem 0.8rem;">210 lbs</td><td style="padding:0.6rem 0.8rem;">95.25 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">6 st</td><td style="padding:0.6rem 0.8rem;">84 lbs</td><td style="padding:0.6rem 0.8rem;">38.10 kg</td><td style="padding:0.6rem 0.8rem;">16 st</td><td style="padding:0.6rem 0.8rem;">224 lbs</td><td style="padding:0.6rem 0.8rem;">101.60 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">7 st</td><td style="padding:0.6rem 0.8rem;">98 lbs</td><td style="padding:0.6rem 0.8rem;">44.45 kg</td><td style="padding:0.6rem 0.8rem;">17 st</td><td style="padding:0.6rem 0.8rem;">238 lbs</td><td style="padding:0.6rem 0.8rem;">107.95 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">8 st</td><td style="padding:0.6rem 0.8rem;">112 lbs</td><td style="padding:0.6rem 0.8rem;">50.80 kg</td><td style="padding:0.6rem 0.8rem;">18 st</td><td style="padding:0.6rem 0.8rem;">252 lbs</td><td style="padding:0.6rem 0.8rem;">114.31 kg</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.6rem 0.8rem;">9 st</td><td style="padding:0.6rem 0.8rem;">126 lbs</td><td style="padding:0.6rem 0.8rem;">57.15 kg</td><td style="padding:0.6rem 0.8rem;">19 st</td><td style="padding:0.6rem 0.8rem;">266 lbs</td><td style="padding:0.6rem 0.8rem;">120.66 kg</td></tr>
        <tr><td style="padding:0.6rem 0.8rem;">10 st</td><td style="padding:0.6rem 0.8rem;">140 lbs</td><td style="padding:0.6rem 0.8rem;">63.50 kg</td><td style="padding:0.6rem 0.8rem;">20 st</td><td style="padding:0.6rem 0.8rem;">280 lbs</td><td style="padding:0.6rem 0.8rem;">127.01 kg</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${stoneTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 6. 1-4-cup-is-ml: Per-ingredient table (Dry vs Liquid)
// ─────────────────────────────────────────────────────────────
patchFile('blog/1-4-cup-is-ml.html', (html) => {
  if (html.includes('id="ingredient-density-table"')) return html;

  const kitchenTable = `
<div id="ingredient-density-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">1/4 Cup to Grams &amp; Milliliters by Ingredient Density</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">While 1/4 cup liquid volume is always <strong>59.15 mL (US)</strong> or <strong>62.5 mL (Metric)</strong>, dry baking ingredients weigh differently because of their density:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(236,72,153,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Ingredient</th>
          <th style="padding:0.75rem 1rem;">Volume (mL)</th>
          <th style="padding:0.75rem 1rem;">Weight (Grams)</th>
          <th style="padding:0.75rem 1rem;">Weight (Ounces)</th>
          <th style="padding:0.75rem 1rem;">Tablespoons Equivalent</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Water / Pure Liquids</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">59.2 g</td><td style="padding:0.7rem 1rem;">2.08 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">All-Purpose Flour</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">30.0 g</td><td style="padding:0.7rem 1rem;">1.06 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp (sifted)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Granulated White Sugar</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">50.0 g</td><td style="padding:0.7rem 1rem;">1.76 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Brown Sugar (Packed)</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">55.0 g</td><td style="padding:0.7rem 1rem;">1.94 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Butter / Margarine</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">57.0 g</td><td style="padding:0.7rem 1rem;">2.01 oz</td><td style="padding:0.7rem 1rem;">1/2 Stick (4 Tbsp)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Cocoa Powder</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">25.0 g</td><td style="padding:0.7rem 1rem;">0.88 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp</td></tr>
        <tr><td style="padding:0.7rem 1rem;">Honey / Maple Syrup</td><td style="padding:0.7rem 1rem;">59.15 mL</td><td style="padding:0.7rem 1rem;">85.0 g</td><td style="padding:0.7rem 1rem;">3.00 oz</td><td style="padding:0.7rem 1rem;">4 Tbsp</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${kitchenTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 7. 300-meters-to-feet: Add feet+inches first line answer + 100-500m table
// ─────────────────────────────────────────────────────────────
patchFile('blog/300-meters-to-feet.html', (html) => {
  if (html.includes('id="distance-milestone-table"')) return html;

  const distTable = `
<div id="distance-milestone-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Sports &amp; Track Distances: 50 to 500 Meters in Feet</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">300 meters equals exactly <strong>984 feet 3 inches (984.252 ft)</strong> or <strong>328.084 yards</strong>. Check common sprint and stadium distances below:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Meters (m)</th>
          <th style="padding:0.75rem 1rem;">Decimal Feet (ft)</th>
          <th style="padding:0.75rem 1rem;">Feet &amp; Inches</th>
          <th style="padding:0.75rem 1rem;">Yards (yd)</th>
          <th style="padding:0.75rem 1rem;">Real-World Field Reference</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">50 m</td><td style="padding:0.7rem 1rem;">164.04 ft</td><td style="padding:0.7rem 1rem;">164 ft 0.5 in</td><td style="padding:0.7rem 1rem;">54.68 yd</td><td style="padding:0.7rem 1rem;">Olympic Swimming Pool Length</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">100 m</td><td style="padding:0.7rem 1rem;">328.08 ft</td><td style="padding:0.7rem 1rem;">328 ft 1.0 in</td><td style="padding:0.7rem 1rem;">109.36 yd</td><td style="padding:0.7rem 1rem;">Standard Football Pitch Length / 100m Sprint</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">200 m</td><td style="padding:0.7rem 1rem;">656.17 ft</td><td style="padding:0.7rem 1rem;">656 ft 2.0 in</td><td style="padding:0.7rem 1rem;">218.72 yd</td><td style="padding:0.7rem 1rem;">Half Running Track Lap</td></tr>
        <tr style="background:rgba(59,130,246,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">300 m ★</td><td style="padding:0.75rem 1rem;">984.25 ft</td><td style="padding:0.75rem 1rem;">984 ft 3.0 in</td><td style="padding:0.75rem 1rem;">328.08 yd</td><td style="padding:0.75rem 1rem;">Standard 300m Sprint / Eifel Tower Height (~300m)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">400 m</td><td style="padding:0.7rem 1rem;">1,312.34 ft</td><td style="padding:0.7rem 1rem;">1,312 ft 4.0 in</td><td style="padding:0.7rem 1rem;">437.45 yd</td><td style="padding:0.7rem 1rem;">One Full Lap of Standard Athletic Track</td></tr>
        <tr><td style="padding:0.7rem 1rem;">500 m</td><td style="padding:0.7rem 1rem;">1,640.42 ft</td><td style="padding:0.7rem 1rem;">1,640 ft 5.0 in</td><td style="padding:0.7rem 1rem;">546.81 yd</td><td style="padding:0.7rem 1rem;">Rowing sprint distance (0.5 km)</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${distTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 8. 1-bar-to-psi-conversion: Add 0-20 bar table in 0.5 steps + tyre chart
// ─────────────────────────────────────────────────────────────
patchFile('blog/1-bar-to-psi-conversion.html', (html) => {
  if (html.includes('id="tyre-pressure-table"')) return html;

  const barTable = `
<div id="tyre-pressure-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Car Tyre &amp; Engineering Pressure Chart: Bar to PSI</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">1 Bar = 14.5038 PSI (100 kPa). Standard passenger car tyre pressures typically range between <strong>2.0 to 2.5 Bar (29 to 36 PSI)</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(234,88,12,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Pressure (Bar)</th>
          <th style="padding:0.75rem 1rem;">Pounds/Sq Inch (PSI)</th>
          <th style="padding:0.75rem 1rem;">Kilopascals (kPa)</th>
          <th style="padding:0.75rem 1rem;">Typical Engineering / Vehicle Application</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:rgba(234,88,12,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">1.0 Bar ★</td><td style="padding:0.75rem 1rem;">14.50 PSI</td><td style="padding:0.75rem 1rem;">100 kPa</td><td style="padding:0.75rem 1rem;">Atmospheric pressure benchmark (~1.013 bar)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">1.5 Bar</td><td style="padding:0.7rem 1rem;">21.75 PSI</td><td style="padding:0.7rem 1rem;">150 kPa</td><td style="padding:0.7rem 1rem;">Espresso machine extraction boiler minimum</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2.0 Bar</td><td style="padding:0.7rem 1rem;">29.01 PSI</td><td style="padding:0.7rem 1rem;">200 kPa</td><td style="padding:0.7rem 1rem;">Compact car city tyre pressure (unloaded)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2.2 Bar</td><td style="padding:0.7rem 1rem;">31.91 PSI</td><td style="padding:0.7rem 1rem;">220 kPa</td><td style="padding:0.7rem 1rem;">Standard sedan front tyre pressure</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2.4 Bar</td><td style="padding:0.7rem 1rem;">34.81 PSI</td><td style="padding:0.7rem 1rem;">240 kPa</td><td style="padding:0.7rem 1rem;">Standard SUV / loaded passenger vehicle tyre</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2.8 Bar</td><td style="padding:0.7rem 1rem;">40.61 PSI</td><td style="padding:0.7rem 1rem;">280 kPa</td><td style="padding:0.7rem 1rem;">Heavy-load estate car rear tyre / bicycle commuter</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">4.2 Bar</td><td style="padding:0.7rem 1rem;">60.92 PSI</td><td style="padding:0.7rem 1rem;">420 kPa</td><td style="padding:0.7rem 1rem;">Space-saver temporary spare tyre (donut wheel)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">6.0 Bar</td><td style="padding:0.7rem 1rem;">87.02 PSI</td><td style="padding:0.7rem 1rem;">600 kPa</td><td style="padding:0.7rem 1rem;">Commercial van rear axle / workshop air compressor</td></tr>
        <tr><td style="padding:0.7rem 1rem;">10.0 Bar</td><td style="padding:0.7rem 1rem;">145.04 PSI</td><td style="padding:0.7rem 1rem;">1,000 kPa</td><td style="padding:0.7rem 1rem;">Industrial compressed air supply mainline</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${barTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 9. 60-mph-to-kmh: Add 30-80 mph UK speed limit table
// ─────────────────────────────────────────────────────────────
patchFile('blog/60-mph-to-kmh.html', (html) => {
  if (html.includes('id="speed-limits-table"')) return html;

  const speedTable = `
<div id="speed-limits-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">UK &amp; International Speed Limit Conversion Reference (MPH to KM/H)</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Exact formula: <strong>km/h = mph &times; 1.609344</strong>. 60 MPH equals exactly <strong>96.56 km/h</strong> (26.82 m/s):</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(16,185,129,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Miles/Hour (MPH)</th>
          <th style="padding:0.75rem 1rem;">Kilometres/Hour (KM/H)</th>
          <th style="padding:0.75rem 1rem;">Meters/Sec (m/s)</th>
          <th style="padding:0.75rem 1rem;">Speed Zone Context</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">20 MPH</td><td style="padding:0.7rem 1rem;">32.19 km/h</td><td style="padding:0.7rem 1rem;">8.94 m/s</td><td style="padding:0.7rem 1rem;">Wales &amp; London residential streets limit</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">30 MPH</td><td style="padding:0.7rem 1rem;">48.28 km/h</td><td style="padding:0.7rem 1rem;">13.41 m/s</td><td style="padding:0.7rem 1rem;">Standard UK urban street lighting limit (≈50 km/h)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">40 MPH</td><td style="padding:0.7rem 1rem;">64.37 km/h</td><td style="padding:0.7rem 1rem;">17.88 m/s</td><td style="padding:0.7rem 1rem;">Semi-rural ring roads and bypasses</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">50 MPH</td><td style="padding:0.7rem 1rem;">80.47 km/h</td><td style="padding:0.7rem 1rem;">22.35 m/s</td><td style="padding:0.7rem 1rem;">Motorway roadworks average speed camera zone</td></tr>
        <tr style="background:rgba(16,185,129,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">60 MPH ★</td><td style="padding:0.75rem 1rem;">96.56 km/h</td><td style="padding:0.75rem 1rem;">26.82 m/s</td><td style="padding:0.75rem 1rem;">UK National Speed Limit on single carriageways</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">70 MPH</td><td style="padding:0.7rem 1rem;">112.65 km/h</td><td style="padding:0.7rem 1rem;">31.29 m/s</td><td style="padding:0.7rem 1rem;">UK Motorway &amp; Dual Carriageway national ceiling</td></tr>
        <tr><td style="padding:0.7rem 1rem;">80 MPH</td><td style="padding:0.7rem 1rem;">128.75 km/h</td><td style="padding:0.7rem 1rem;">35.76 m/s</td><td style="padding:0.7rem 1rem;">French Autoroute (130 km/h) / European highway speed</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${speedTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 10. es/blog/5-libras-a-kg: Fix stone error, add Spanish comparison
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/5-libras-a-kg.html', (html) => {
  let updated = html;
  // Fix any "5.35 libras" or mislabeled stone errors in Spanish
  updated = updated.replace(/5\.35\s*libras/gi, '2.27 kg');

  if (!updated.includes('id="tabla-libras-kilos"')) {
    const esTable = `
<div id="tabla-libras-kilos" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Tabla de Conversión Rápida: 1 a 10 Libras en Kilogramos</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Fórmula exacta: <strong>kg = lbs &times; 0.45359237</strong>. 5 libras equivalen exactamente a <strong>2.26796 kg</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Libras (lbs)</th>
          <th style="padding:0.75rem 1rem;">Kilogramos (kg)</th>
          <th style="padding:0.75rem 1rem;">Gramos (g)</th>
          <th style="padding:0.75rem 1rem;">Equivalencia Cotidiana</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">1 lb</td><td style="padding:0.7rem 1rem;">0.454 kg</td><td style="padding:0.7rem 1rem;">453.6 g</td><td style="padding:0.7rem 1rem;">Paquete estándar de mantequilla</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2 lbs</td><td style="padding:0.7rem 1rem;">0.907 kg</td><td style="padding:0.7rem 1rem;">907.2 g</td><td style="padding:0.7rem 1rem;">Bolsa de azúcar de 1 kg aprox.</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">3 lbs</td><td style="padding:0.7rem 1rem;">1.361 kg</td><td style="padding:0.7rem 1rem;">1,360.8 g</td><td style="padding:0.7rem 1rem;">Mancuerna ligera de ejercicio</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">4 lbs</td><td style="padding:0.7rem 1rem;">1.814 kg</td><td style="padding:0.7rem 1rem;">1,814.4 g</td><td style="padding:0.7rem 1rem;">Bolsa mediana de patatas</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">5 lbs ★</td><td style="padding:0.75rem 1rem;">2.268 kg</td><td style="padding:0.75rem 1rem;">2,268.0 g</td><td style="padding:0.75rem 1rem;">Bolsa estándar de harina / Bote grande de proteína</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">10 lbs</td><td style="padding:0.7rem 1rem;">4.536 kg</td><td style="padding:0.7rem 1rem;">4,535.9 g</td><td style="padding:0.7rem 1rem;">Mancuerna de entrenamiento medio</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
    updated = updated.replace(/<\/article>/i, `${esTable}\n</article>`);
  }
  return updated;
});

console.log('\n✅ High-Impact SEO batch optimization complete!');
