const fs = require('fs');

// ==========================================
// 1. UPDATE blog/50-fahrenheit-to-celsius.html
// ==========================================
let tempFile = 'blog/50-fahrenheit-to-celsius.html';
let tempHtml = fs.readFileSync(tempFile, 'utf8');

// Visual Thermometer Meter to insert right after the answer box
const visualThermometer = `
      <!-- Visual Interactive Temperature Benchmark Bar -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:1.5rem 0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">🌡️ Visual Temperature Spectrum: 50°F (10°C)</span>
          <span style="font-size:0.82rem; background:rgba(59,130,246,0.12); color:#2563eb; font-weight:700; padding:0.2rem 0.6rem; border-radius:999px;">Cool / Autumn Weather</span>
        </div>
        
        <!-- Gradient Spectrum Bar -->
        <div style="position:relative; height:18px; border-radius:9px; background:linear-gradient(to right, #38bdf8 0%, #3b82f6 25%, #10b981 50%, #f59e0b 75%, #ef4444 100%); margin:1rem 0 0.5rem 0;">
          <!-- Pin pointer at 50°F (approx 36% along scale from 0°F to 140°F) -->
          <div style="position:absolute; left:36%; top:-6px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center;">
            <div style="width:12px; height:12px; background:#ffffff; border:3px solid #2563eb; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
            <div style="width:2px; height:18px; background:#2563eb;"></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); font-weight:600; margin-top:0.4rem;">
          <span>0°F (-18°C) Extreme Freezing</span>
          <span>32°F (0°C) Ice Point</span>
          <span style="color:#2563eb; font-weight:800;">50°F (10°C) &#9650;</span>
          <span>70°F (21°C) Room Temp</span>
          <span>100°F (38°C) Hot</span>
        </div>

        <div style="margin-top:0.85rem; padding:0.75rem 1rem; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.88rem; color:var(--text-muted); display:flex; gap:0.6rem; align-items:center;">
          <span style="font-size:1.2rem;">🧥</span>
          <span><strong>Clothing Recommendation:</strong> 50°F feels brisk. A medium jacket, fleece hoodie, or layered sweater is recommended for outdoor comfort.</span>
        </div>
      </div>
`;

// Reverse Conversion Card to insert right before Related In-Depth Guides
const reverseTempBox = `
      <!-- Reverse Conversion Quick Gateway -->
      <div style="background:linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.06)); border:2px dashed var(--primary-600); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:2rem 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="font-size:0.8rem; font-weight:800; text-transform:uppercase; color:var(--primary-600); letter-spacing:0.05em;">⇄ Reverse Conversion Shortcut</span>
          <h3 style="margin:0.25rem 0 0.35rem 0; font-size:1.15rem; color:var(--text-main); font-weight:800;">Need to convert Celsius back to Fahrenheit?</h3>
          <p style="margin:0; font-size:0.9rem; color:var(--text-muted);">Calculate 10°C in Fahrenheit (Exact 50°F) using formula: (10 × 1.8) + 32 = 50°F</p>
        </div>
        <a href="/blog/10-celsius-is-what-fahrenheit" class="tab-btn active" style="text-decoration:none; padding:0.65rem 1.25rem; font-weight:700; white-space:nowrap;">
          10°C to Fahrenheit Guide &rarr;
        </a>
      </div>
`;

if (!tempHtml.includes('Visual Temperature Spectrum')) {
  tempHtml = tempHtml.replace(
    '<!-- Google Featured Snippet Winning Target Box (100% Intact) -->',
    visualThermometer + '\n      <!-- Google Featured Snippet Winning Target Box (100% Intact) -->'
  );
}

if (!tempHtml.includes('Reverse Conversion Shortcut')) {
  tempHtml = tempHtml.replace(
    '<section class="related-guides-section"',
    reverseTempBox + '\n      <section class="related-guides-section"'
  );
}

fs.writeFileSync(tempFile, tempHtml, 'utf8');
console.log('Successfully enhanced 50-fahrenheit-to-celsius.html with Visual Thermometer & Reverse Box');


// ==========================================
// 2. UPDATE blog/32-usd-to-gbp.html
// ==========================================
let fxFile = 'blog/32-usd-to-gbp.html';
let fxHtml = fs.readFileSync(fxFile, 'utf8');

const visualPurchasingMeter = `
      <!-- Visual Purchasing Power & Fee Meter -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:1.5rem 0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">💷 Real UK Purchasing Power of $32 USD (~£24.50 - £25.00 GBP)</span>
          <span style="font-size:0.82rem; background:rgba(16,185,129,0.12); color:#059669; font-weight:700; padding:0.2rem 0.6rem; border-radius:999px;">UK Benchmark</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-top:0.75rem;">
          <div style="background:var(--bg-surface); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:1.3rem; margin-bottom:0.2rem;">🍔</div>
            <div style="font-weight:700; font-size:0.9rem; color:var(--text-main);">Dining & Pubs</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">Casual pub meal + pint of ale in London (~£22 - £25)</div>
          </div>
          <div style="background:var(--bg-surface); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:1.3rem; margin-bottom:0.2rem;">🚇</div>
            <div style="font-weight:700; font-size:0.9rem; color:var(--text-main);">London Transport</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">3 full days of zone 1-2 tube travel caps (£8.50/day)</div>
          </div>
          <div style="background:var(--bg-surface); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:1.3rem; margin-bottom:0.2rem;">📱</div>
            <div style="font-weight:700; font-size:0.9rem; color:var(--text-main);">UK Mobile SIM</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">1 month of unlimited 5G data from giffgaff or VOXI (~£20)</div>
          </div>
        </div>
      </div>
`;

const reverseFxBox = `
      <!-- Reverse Conversion Quick Gateway -->
      <div style="background:linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.06)); border:2px dashed var(--primary-600); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:2rem 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="font-size:0.8rem; font-weight:800; text-transform:uppercase; color:var(--primary-600); letter-spacing:0.05em;">⇄ Reverse Conversion Shortcut</span>
          <h3 style="margin:0.25rem 0 0.35rem 0; font-size:1.15rem; color:var(--text-main); font-weight:800;">Need to convert British Pounds back to US Dollars?</h3>
          <p style="margin:0; font-size:0.9rem; color:var(--text-muted);">See how much £25 or £32 GBP is worth in US Dollars with live interbank rates.</p>
        </div>
        <a href="/currency" class="tab-btn active" style="text-decoration:none; padding:0.65rem 1.25rem; font-weight:700; white-space:nowrap;">
          Reverse GBP to USD Converter &rarr;
        </a>
      </div>
`;

if (!fxHtml.includes('Real UK Purchasing Power')) {
  fxHtml = fxHtml.replace(
    '<!-- Quick Featured Snippet Answer Box for High CTR -->',
    visualPurchasingMeter + '\n      <!-- Quick Featured Snippet Answer Box for High CTR -->'
  );
}

if (!fxHtml.includes('Reverse Conversion Shortcut')) {
  fxHtml = fxHtml.replace(
    '<section class="related-guides-section"',
    reverseFxBox + '\n      <section class="related-guides-section"'
  );
}

fs.writeFileSync(fxFile, fxHtml, 'utf8');
console.log('Successfully enhanced 32-usd-to-gbp.html with Purchasing Meter & Reverse Box');


// ==========================================
// 3. UPDATE blog/180lbs-in-stone.html
// ==========================================
let stoneFile = 'blog/180lbs-in-stone.html';
let stoneHtml = fs.readFileSync(stoneFile, 'utf8');

const visualBmiMeter = `
      <!-- Visual BMI & Body Weight Status Gauge -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:1.5rem 0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">⚖️ Body Weight Spectrum: 180 lbs (12 st 12 lb / 81.65 kg)</span>
          <span style="font-size:0.82rem; background:rgba(16,185,129,0.12); color:#059669; font-weight:700; padding:0.2rem 0.6rem; border-radius:999px;">Healthy Weight for 6'0"+</span>
        </div>

        <div style="position:relative; height:18px; border-radius:9px; background:linear-gradient(to right, #38bdf8 0%, #10b981 35%, #10b981 60%, #f59e0b 80%, #ef4444 100%); margin:1rem 0 0.5rem 0;">
          <!-- Pin pointer at 180 lbs -->
          <div style="position:absolute; left:58%; top:-6px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center;">
            <div style="width:12px; height:12px; background:#ffffff; border:3px solid #10b981; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
            <div style="width:2px; height:18px; background:#10b981;"></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); font-weight:600; margin-top:0.4rem;">
          <span>Underweight (&lt;9 st)</span>
          <span>Normal BMI (9 - 13 st)</span>
          <span style="color:#059669; font-weight:800;">12 st 12 lb &#9650;</span>
          <span>Overweight (13 - 16 st)</span>
          <span>Obese (16+ st)</span>
        </div>

        <div style="margin-top:0.85rem; padding:0.75rem 1rem; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.88rem; color:var(--text-muted); display:flex; gap:0.6rem; align-items:center;">
          <span style="font-size:1.2rem;">📊</span>
          <span><strong>Height Context:</strong> At 180 lbs (81.65 kg), a person between 5'11" and 6'1" sits comfortably within healthy body mass index parameters according to NHS standards.</span>
        </div>
      </div>
`;

const reverseStoneBox = `
      <!-- Reverse Conversion Quick Gateway -->
      <div style="background:linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.06)); border:2px dashed var(--primary-600); border-radius:var(--radius-xl); padding:1.25rem 1.5rem; margin:2rem 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="font-size:0.8rem; font-weight:800; text-transform:uppercase; color:var(--primary-600); letter-spacing:0.05em;">⇄ Reverse Conversion Shortcut</span>
          <h3 style="margin:0.25rem 0 0.35rem 0; font-size:1.15rem; color:var(--text-main); font-weight:800;">Need to convert Stone back into Pounds or Kilograms?</h3>
          <p style="margin:0; font-size:0.9rem; color:var(--text-muted);">Explore our 14 Stone in Pounds guide or convert stones directly on the live calculator.</p>
        </div>
        <a href="/blog/14-stone-in-pounds" class="tab-btn active" style="text-decoration:none; padding:0.65rem 1.25rem; font-weight:700; white-space:nowrap;">
          14 Stone in Pounds Guide &rarr;
        </a>
      </div>
`;

if (!stoneHtml.includes('Body Weight Spectrum')) {
  stoneHtml = stoneHtml.replace(
    '<p>Converting body weight between international standard units',
    visualBmiMeter + '\n      <p>Converting body weight between international standard units'
  );
}

if (!stoneHtml.includes('Reverse Conversion Shortcut')) {
  stoneHtml = stoneHtml.replace(
    '<section class="related-guides-section"',
    reverseStoneBox + '\n      <section class="related-guides-section"'
  );
}

fs.writeFileSync(stoneFile, stoneHtml, 'utf8');
console.log('Successfully enhanced 180lbs-in-stone.html with BMI Gauge & Reverse Box');
