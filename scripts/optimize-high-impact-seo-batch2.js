/**
 * Batch 2: Optimize Remaining Priority Articles & Tool Hubs
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
// 11. 50-fahrenheit-to-celsius: Weather, clothing, oven & fever comparison
// ─────────────────────────────────────────────────────────────
patchFile('blog/50-fahrenheit-to-celsius.html', (html) => {
  if (html.includes('id="temp-weather-guide"')) return html;

  const tempTable = `
<div id="temp-weather-guide" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Temperature &amp; Weather Guide: 30°F to 90°F in Celsius</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Exact formula: <strong>°C = (°F &minus; 32) &times; 5/9</strong>. 50°F equals exactly <strong>10.0°C</strong> (283.15 Kelvin):</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Fahrenheit (°F)</th>
          <th style="padding:0.75rem 1rem;">Celsius (°C)</th>
          <th style="padding:0.75rem 1rem;">What It Feels Like</th>
          <th style="padding:0.75rem 1rem;">Recommended Clothing</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">32°F</td><td style="padding:0.7rem 1rem;">0.0°C</td><td style="padding:0.7rem 1rem;">Freezing point of water</td><td style="padding:0.7rem 1rem;">Heavy winter coat, scarf, gloves</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">40°F</td><td style="padding:0.7rem 1rem;">4.4°C</td><td style="padding:0.7rem 1rem;">Cold winter / late autumn morning</td><td style="padding:0.7rem 1rem;">Winter jacket, warm layers</td></tr>
        <tr style="background:rgba(59,130,246,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">50°F ★</td><td style="padding:0.75rem 1rem;">10.0°C</td><td style="padding:0.7rem 1rem;">Cool spring / crisp UK autumn day</td><td style="padding:0.7rem 1rem;">Fleece, light jacket or sweater with jeans</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">60°F</td><td style="padding:0.7rem 1rem;">15.6°C</td><td style="padding:0.7rem 1rem;">Mild, comfortable spring weather</td><td style="padding:0.7rem 1rem;">Long sleeves, cardigan or light windbreaker</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">68°F</td><td style="padding:0.7rem 1rem;">20.0°C</td><td style="padding:0.7rem 1rem;">Standard indoor room temperature</td><td style="padding:0.7rem 1rem;">Standard indoor everyday attire</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">75°F</td><td style="padding:0.7rem 1rem;">23.9°C</td><td style="padding:0.7rem 1rem;">Warm, pleasant summer afternoon</td><td style="padding:0.7rem 1rem;">T-shirt, shorts or light trousers</td></tr>
        <tr><td style="padding:0.7rem 1rem;">85°F</td><td style="padding:0.7rem 1rem;">29.4°C</td><td style="padding:0.7rem 1rem;">Hot summer weather / beach conditions</td><td style="padding:0.7rem 1rem;">Breathable summer clothing, sun protection</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${tempTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 12. 104-kg-pounds: Add 90-110 kg table + stone breakdown
// ─────────────────────────────────────────────────────────────
patchFile('blog/104-kg-pounds.html', (html) => {
  if (html.includes('id="table-104-kg"')) return html;

  const kgTable = `
<div id="table-104-kg" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Weight Reference Table: 95 kg to 110 kg in Pounds &amp; Stone</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">104 kg equals exactly <strong>229.28 pounds (229 lbs 4.5 oz)</strong> or <strong>16 stone 5.3 pounds (16.38 st)</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">Pounds (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Grams (g)</th>
          <th style="padding:0.75rem 1rem;">Fitness &amp; Health Category</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">95 kg</td><td style="padding:0.7rem 1rem;">209.44 lbs</td><td style="padding:0.7rem 1rem;">14 st 13.4 lb</td><td style="padding:0.7rem 1rem;">95,000 g</td><td style="padding:0.7rem 1rem;">Sub-15 stone athletic benchmark</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">100 kg</td><td style="padding:0.7rem 1rem;">220.46 lbs</td><td style="padding:0.7rem 1rem;">15 st 10.5 lb</td><td style="padding:0.7rem 1rem;">100,000 g</td><td style="padding:0.7rem 1rem;">Centurion weight milestone</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">104 kg ★</td><td style="padding:0.75rem 1rem;">229.28 lbs</td><td style="padding:0.75rem 1rem;">16 st 5.3 lb</td><td style="padding:0.75rem 1rem;">104,000 g</td><td style="padding:0.75rem 1rem;">Exact Current Conversion Target</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">105 kg</td><td style="padding:0.7rem 1rem;">231.49 lbs</td><td style="padding:0.7rem 1rem;">16 st 7.5 lb</td><td style="padding:0.7rem 1rem;">105,000 g</td><td style="padding:0.7rem 1rem;">Olympic weightlifting category</td></tr>
        <tr><td style="padding:0.7rem 1rem;">110 kg</td><td style="padding:0.7rem 1rem;">242.51 lbs</td><td style="padding:0.7rem 1rem;">17 st 4.5 lb</td><td style="padding:0.7rem 1rem;">110,000 g</td><td style="padding:0.7rem 1rem;">Heavyweight rugby prop forward</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${kgTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 13. 170lbs-in-stone: Add height & BMI context specifically for 170 lbs
// ─────────────────────────────────────────────────────────────
patchFile('blog/170lbs-in-stone.html', (html) => {
  if (html.includes('id="bmi-height-170"')) return html;

  const bmiTable170 = `
<div id="bmi-height-170" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">170 Pounds BMI &amp; Height Health Classification Table</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">170 lbs equals exactly <strong>12 stone 2 pounds (12.14 st)</strong> or <strong>77.11 kg</strong>. See how your height determines the official NHS &amp; WHO BMI classification for this weight:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(16,185,129,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Height (Imperial)</th>
          <th style="padding:0.75rem 1rem;">Height (Metric)</th>
          <th style="padding:0.75rem 1rem;">Calculated BMI at 170 lbs</th>
          <th style="padding:0.75rem 1rem;">WHO / NHS Health Status</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">5 feet 6 inches</td><td style="padding:0.7rem 1rem;">168 cm</td><td style="padding:0.7rem 1rem;">27.4</td><td style="padding:0.7rem 1rem;">Overweight range</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">5 feet 8 inches</td><td style="padding:0.7rem 1rem;">173 cm</td><td style="padding:0.7rem 1rem;">25.8</td><td style="padding:0.7rem 1rem;">Slightly above normal (muscular/athletic)</td></tr>
        <tr style="background:rgba(16,185,129,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">5 feet 10 inches ★</td><td style="padding:0.75rem 1rem;">178 cm</td><td style="padding:0.7rem 1rem;">24.4</td><td style="padding:0.7rem 1rem;">Healthy / Normal Weight range (&lt; 25.0)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">6 feet 0 inches</td><td style="padding:0.7rem 1rem;">183 cm</td><td style="padding:0.7rem 1rem;">23.1</td><td style="padding:0.7rem 1rem;">Optimal healthy weight parameter</td></tr>
        <tr><td style="padding:0.7rem 1rem;">6 feet 2 inches</td><td style="padding:0.7rem 1rem;">188 cm</td><td style="padding:0.7rem 1rem;">21.8</td><td style="padding:0.7rem 1rem;">Lean / athletic healthy frame</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${bmiTable170}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 14. 2000-dollars-in-pounds: High-value foreign transfer table
// ─────────────────────────────────────────────────────────────
patchFile('blog/2000-dollars-in-pounds.html', (html) => {
  if (html.includes('id="large-fx-table"')) return html;

  const fxTable2000 = `
<div id="large-fx-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Bank vs Specialist Provider Comparison for $2,000 USD to GBP</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">At a representative mid-market rate of 0.7700 to 0.7900, $2,000 USD yields <strong>£1,540 to £1,580 GBP</strong>. On a $2,000 transfer, provider fees create significant differences in your final payout:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(16,185,129,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Provider</th>
          <th style="padding:0.75rem 1rem;">Exchange Rate Margin</th>
          <th style="padding:0.75rem 1rem;">Total Hidden &amp; Upfront Fee</th>
          <th style="padding:0.75rem 1rem;">Net Pounds Received (£)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:rgba(16,185,129,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Mid-Market Interbank (Zero Fee)</td><td style="padding:0.7rem 1rem;">0.00%</td><td style="padding:0.7rem 1rem;">£0.00</td><td style="padding:0.7rem 1rem;">~£1,560.00</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Wise (Low-cost direct transfer)</td><td style="padding:0.7rem 1rem;">0.35% - 0.45%</td><td style="padding:0.7rem 1rem;">~£6.80</td><td style="padding:0.7rem 1rem;">~£1,553.20</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Major UK High-Street Bank (Wire)</td><td style="padding:0.7rem 1rem;">2.50% - 3.50%</td><td style="padding:0.7rem 1rem;">£15 wire + £45 spread</td><td style="padding:0.7rem 1rem;">~£1,500.00</td></tr>
        <tr><td style="padding:0.7rem 1rem;">PayPal Personal International</td><td style="padding:0.7rem 1rem;">4.00% markup</td><td style="padding:0.7rem 1rem;">~£62.00 fee loss</td><td style="padding:0.7rem 1rem;">~£1,498.00</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${fxTable2000}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 15. 1-cup-milk-in-milliliters: Whole vs skim milk density table
// ─────────────────────────────────────────────────────────────
patchFile('blog/1-cup-milk-in-milliliters.html', (html) => {
  if (html.includes('id="milk-density-guide"')) return html;

  const milkTable = `
<div id="milk-density-guide" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Milk Density &amp; Weight Guide by Variety (1 Cup in mL &amp; Grams)</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Because cow's milk contains dissolved butterfats and milk solids, it has a specific gravity of <strong>1.030 to 1.035 g/mL</strong>, making 1 cup of milk slightly heavier than pure water:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Milk Variety</th>
          <th style="padding:0.75rem 1rem;">US Cup (mL)</th>
          <th style="padding:0.75rem 1rem;">Metric Cup (mL)</th>
          <th style="padding:0.75rem 1rem;">Weight in Grams (g)</th>
          <th style="padding:0.75rem 1rem;">Fluid Ounces (fl oz)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Whole Milk (3.25% - 3.5% fat)</td><td style="padding:0.7rem 1rem;">236.59 mL</td><td style="padding:0.7rem 1rem;">250.00 mL</td><td style="padding:0.7rem 1rem;">244.0 g (US) / 257.5 g (Metric)</td><td style="padding:0.7rem 1rem;">8.0 fl oz</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Semi-Skimmed / 2% Milk</td><td style="padding:0.7rem 1rem;">236.59 mL</td><td style="padding:0.7rem 1rem;">250.00 mL</td><td style="padding:0.7rem 1rem;">243.5 g (US) / 257.0 g (Metric)</td><td style="padding:0.7rem 1rem;">8.0 fl oz</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Skimmed / Non-Fat Milk</td><td style="padding:0.7rem 1rem;">236.59 mL</td><td style="padding:0.7rem 1rem;">250.00 mL</td><td style="padding:0.7rem 1rem;">245.0 g (US) / 258.8 g (Metric)</td><td style="padding:0.7rem 1rem;">8.0 fl oz</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Heavy Cream / Double Cream</td><td style="padding:0.7rem 1rem;">236.59 mL</td><td style="padding:0.7rem 1rem;">250.00 mL</td><td style="padding:0.7rem 1rem;">238.0 g (US) / 251.5 g (Metric)</td><td style="padding:0.7rem 1rem;">8.0 fl oz</td></tr>
        <tr><td style="padding:0.7rem 1rem;">Evaporated Milk</td><td style="padding:0.7rem 1rem;">236.59 mL</td><td style="padding:0.7rem 1rem;">250.00 mL</td><td style="padding:0.7rem 1rem;">252.0 g (US) / 266.2 g (Metric)</td><td style="padding:0.7rem 1rem;">8.0 fl oz</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${milkTable}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 16. 1-tsp-is-ml: US vs Metric vs Medical spoon safety note
// ─────────────────────────────────────────────────────────────
patchFile('blog/1-tsp-is-ml.html', (html) => {
  if (html.includes('id="medical-teaspoon-safety"')) return html;

  const tspSafety = `
<div id="medical-teaspoon-safety" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Teaspoon Volume Standards: Kitchen vs Medical Dosage Safety</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Accurate spoon volumes differ subtly between countries and scientific standards:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(236,72,153,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Standard / System</th>
          <th style="padding:0.75rem 1rem;">Exact Volume in mL</th>
          <th style="padding:0.75rem 1rem;">Fluid Ounces (fl oz)</th>
          <th style="padding:0.75rem 1rem;">Primary Use Case</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:rgba(236,72,153,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Metric / Nutrition Teaspoon ★</td><td style="padding:0.7rem 1rem;">5.000 mL</td><td style="padding:0.7rem 1rem;">0.169 fl oz</td><td style="padding:0.7rem 1rem;">UK, Commonwealth, Food Labels &amp; Medicine dosing</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">US Customary Teaspoon</td><td style="padding:0.7rem 1rem;">4.929 mL</td><td style="padding:0.7rem 1rem;">0.167 fl oz</td><td style="padding:0.7rem 1rem;">American recipes &amp; culinary measuring spoons</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Imperial Teaspoon (UK Old)</td><td style="padding:0.7rem 1rem;">5.919 mL</td><td style="padding:0.7rem 1rem;">0.208 fl oz</td><td style="padding:0.7rem 1rem;">Historical British cookbooks (pre-metrication)</td></tr>
        <tr><td style="padding:0.7rem 1rem;">Household Table Cutlery Teaspoon</td><td style="padding:0.7rem 1rem;">3.0 to 7.0 mL (Variable)</td><td style="padding:0.7rem 1rem;">Variable</td><td style="padding:0.7rem 1rem;">Tea/Coffee stirring (NEVER use for medication dosing)</td></tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top:1rem; padding:0.75rem 1rem; background:rgba(239,68,68,0.08); border-left:4px solid #ef4444; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-main);">
    ⚠️ <strong>Medical Safety Note:</strong> The American Academy of Pediatrics (AAP) and NHS strictly advise against using ordinary household silverware teaspoons to administer liquid cough syrups or pediatric antibiotics. Household spoons vary from 3 mL to over 7 mL in capacity. Always use the calibrated oral syringe or measuring cup provided with the medication.
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${tspSafety}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 17. 100-kg-to-lbs & 80-kilo-lbs: Dedicated Gym & Bodyweight Tables
// ─────────────────────────────────────────────────────────────
patchFile('blog/100-kg-to-lbs.html', (html) => {
  if (html.includes('id="hundred-kg-table"')) return html;

  const table100 = `
<div id="hundred-kg-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">80 kg to 120 kg Reference Table in Pounds &amp; Stone</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">100 Kilograms equals exactly <strong>220.462 pounds (220 lbs 7.4 oz)</strong> or <strong>15 stone 10.5 pounds</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">Pounds (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Olympic Barbell Breakdown (45 lb bar)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">80 kg</td><td style="padding:0.7rem 1rem;">176.37 lbs</td><td style="padding:0.7rem 1rem;">12 st 8.4 lb</td><td style="padding:0.7rem 1rem;">Bar + two 45 lb + two 10 lb + two 5 lb plates</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">90 kg</td><td style="padding:0.7rem 1rem;">198.42 lbs</td><td style="padding:0.7rem 1rem;">14 st 2.4 lb</td><td style="padding:0.7rem 1rem;">Bar + two 45 lb + two 25 lb + two 5 lb plates</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">100 kg ★</td><td style="padding:0.75rem 1rem;">220.46 lbs</td><td style="padding:0.75rem 1rem;">15 st 10.5 lb</td><td style="padding:0.75rem 1rem;">Bar + four 45 lb plates (Two plates per side = "2-plate" lift)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">110 kg</td><td style="padding:0.7rem 1rem;">242.51 lbs</td><td style="padding:0.7rem 1rem;">17 st 4.5 lb</td><td style="padding:0.7rem 1rem;">Bar + four 45 lb + two 10 lb plates</td></tr>
        <tr><td style="padding:0.7rem 1rem;">120 kg</td><td style="padding:0.7rem 1rem;">264.55 lbs</td><td style="padding:0.7rem 1rem;">18 st 12.6 lb</td><td style="padding:0.7rem 1rem;">Bar + four 45 lb + two 25 lb plates</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${table100}\n</article>`);
});

patchFile('blog/80-kilo-lbs.html', (html) => {
  if (html.includes('id="eighty-kg-table"')) return html;

  const table80 = `
<div id="eighty-kg-table" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">70 kg to 90 kg Weight Range: Kilograms, Pounds &amp; Stone</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">80 Kilograms equals exactly <strong>176.370 pounds (176 lbs 5.9 oz)</strong> or <strong>12 stone 8.4 pounds</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">Pounds (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Typical Health Milestone</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">70 kg</td><td style="padding:0.7rem 1rem;">154.32 lbs</td><td style="padding:0.7rem 1rem;">11 st 0.3 lb</td><td style="padding:0.7rem 1rem;">Ideal average for 5'9" adult</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">75 kg</td><td style="padding:0.7rem 1rem;">165.35 lbs</td><td style="padding:0.7rem 1rem;">11 st 11.4 lb</td><td style="padding:0.7rem 1rem;">Middleweight boxer benchmark</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">80 kg ★</td><td style="padding:0.75rem 1rem;">176.37 lbs</td><td style="padding:0.75rem 1rem;">12 st 8.4 lb</td><td style="padding:0.75rem 1rem;">Global adult male benchmark average</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">85 kg</td><td style="padding:0.7rem 1rem;">187.39 lbs</td><td style="padding:0.7rem 1rem;">13 st 5.4 lb</td><td style="padding:0.7rem 1rem;">Light-heavyweight athletic frame</td></tr>
        <tr><td style="padding:0.7rem 1rem;">90 kg</td><td style="padding:0.7rem 1rem;">198.42 lbs</td><td style="padding:0.7rem 1rem;">14 st 2.4 lb</td><td style="padding:0.7rem 1rem;">14-stone landmark boundary</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${table80}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 18. es/blog/1-3-taza-a-gramos: Per-ingredient Spanish baking table
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/1-3-taza-a-gramos.html', (html) => {
  if (html.includes('id="tabla-ingredientes-1-3"')) return html;

  const esBaking = `
<div id="tabla-ingredientes-1-3" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Tabla de 1/3 Taza en Gramos Según el Ingrediente</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">1/3 taza de volumen líquido son <strong>78.9 mL</strong>. En repostería, los gramos varían según la densidad de cada ingrediente:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(236,72,153,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Ingrediente de Cocina</th>
          <th style="padding:0.75rem 1rem;">Peso en Gramos (g)</th>
          <th style="padding:0.75rem 1rem;">Mililitros (mL)</th>
          <th style="padding:0.75rem 1rem;">Cucharadas Soperas</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Agua / Leche líquida</td><td style="padding:0.7rem 1rem;">78.9 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5 cucharadas + 1 cucharadita</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Harina de Trigo (común/repostería)</td><td style="padding:0.7rem 1rem;">40.0 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Azúcar Blanco Granulado</td><td style="padding:0.7rem 1rem;">66.7 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Azúcar Moreno (apretado)</td><td style="padding:0.7rem 1rem;">73.3 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Mantequilla o Margarina</td><td style="padding:0.7rem 1rem;">75.6 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas (1/3 de paquete)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">Cacao en Polvo puro</td><td style="padding:0.7rem 1rem;">33.3 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas</td></tr>
        <tr><td style="padding:0.7rem 1rem;">Miel pura o Sirope de Arce</td><td style="padding:0.7rem 1rem;">113.3 g</td><td style="padding:0.7rem 1rem;">78.9 mL</td><td style="padding:0.7rem 1rem;">5.3 cucharadas</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${esBaking}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 19. es/blog/4-metros-a-pies: Spanish 1-10m table
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/4-metros-a-pies.html', (html) => {
  if (html.includes('id="tabla-metros-pies"')) return html;

  const esMetros = `
<div id="tabla-metros-pies" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Tabla de Metros a Pies y Pulgadas (1 m a 10 m)</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Fórmula: <strong>pies = metros &times; 3.28084</strong>. 4 metros equivalen exactamente a <strong>13.1234 pies (13 pies 1.5 pulgadas)</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Metros (m)</th>
          <th style="padding:0.75rem 1rem;">Pies Decimales (ft)</th>
          <th style="padding:0.75rem 1rem;">Pies y Pulgadas</th>
          <th style="padding:0.75rem 1rem;">Referencia en Arquitectura / Hogar</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">1 m</td><td style="padding:0.7rem 1rem;">3.28 ft</td><td style="padding:0.7rem 1rem;">3 ft 3.4 in</td><td style="padding:0.7rem 1rem;">Anchura estándar de puerta grande</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">2 m</td><td style="padding:0.7rem 1rem;">6.56 ft</td><td style="padding:0.7rem 1rem;">6 ft 6.7 in</td><td style="padding:0.7rem 1rem;">Altura estándar de marco de puerta</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">3 m</td><td style="padding:0.7rem 1rem;">9.84 ft</td><td style="padding:0.7rem 1rem;">9 ft 10.1 in</td><td style="padding:0.7rem 1rem;">Altura de techo residencial alto</td></tr>
        <tr style="background:rgba(59,130,246,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">4 m ★</td><td style="padding:0.75rem 1rem;">13.12 ft</td><td style="padding:0.7rem 1rem;">13 ft 1.5 in</td><td style="padding:0.7rem 1rem;">Largo típico de salón o coche compacto</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">5 m</td><td style="padding:0.7rem 1rem;">16.40 ft</td><td style="padding:0.7rem 1rem;">16 ft 4.9 in</td><td style="padding:0.7rem 1rem;">Largo de plaza de aparcamiento estándar</td></tr>
        <tr><td style="padding:0.7rem 1rem;">10 m</td><td style="padding:0.7rem 1rem;">32.81 ft</td><td style="padding:0.7rem 1rem;">32 ft 9.7 in</td><td style="padding:0.7rem 1rem;">Largo de autobús urbano / camión mediano</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${esMetros}\n</article>`);
});

console.log('\n✅ Batch 2 optimization complete!');
