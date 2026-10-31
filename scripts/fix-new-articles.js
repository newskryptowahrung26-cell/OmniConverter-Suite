/**
 * fix-new-articles.js
 * Adds calculator widget + hreflang to 2 new articles
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const fixes = [
  {
    file: 'blog/22-kg-in-stone.html',
    calcWidget: `
    <!-- Calculator Widget -->
    <section style="background:#f0f4ff;border-radius:12px;padding:1.5rem;margin:1.5rem 0;">
      <h2 style="margin-top:0;">kg to Stone Calculator</h2>
      <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
        <input id="kgInput" type="number" value="22" min="0" step="0.1"
          style="padding:0.6rem;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;width:120px;">
        <span style="font-weight:600;">kg =</span>
        <span id="stoneResult" style="font-size:1.1rem;font-weight:700;color:#4f46e5;">3 st 6.5 lb</span>
      </div>
      <script>
        document.getElementById('kgInput').addEventListener('input', function() {
          const kg = parseFloat(this.value) || 0;
          const lbs = kg * 2.20462;
          const stone = Math.floor(lbs / 14);
          const remLb = (lbs - stone * 14).toFixed(1);
          document.getElementById('stoneResult').textContent = stone + ' st ' + remLb + ' lb (' + lbs.toFixed(2) + ' lbs)';
        });
      </script>
    </section>`,
    hreflang: `
  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/22-kg-in-stone">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/22-kg-in-stone">`,
  },
  {
    file: 'blog/700-gbp-to-aud.html',
    calcWidget: `
    <!-- Calculator Widget -->
    <section style="background:#f0f4ff;border-radius:12px;padding:1.5rem;margin:1.5rem 0;">
      <h2 style="margin-top:0;">GBP to AUD Calculator</h2>
      <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
        <span style="font-weight:600;">£</span>
        <input id="gbpInput" type="number" value="700" min="0" step="1"
          style="padding:0.6rem;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;width:120px;">
        <span style="font-weight:600;">GBP =</span>
        <span id="audResult" style="font-size:1.1rem;font-weight:700;color:#4f46e5;">A$1,341.06</span>
      </div>
      <p style="font-size:0.8rem;color:#888;margin:0.5rem 0 0;">Rate: 1 GBP = 1.9158 AUD (indicative mid-market rate)</p>
      <script>
        document.getElementById('gbpInput').addEventListener('input', function() {
          const gbp = parseFloat(this.value) || 0;
          const aud = (gbp * 1.9158).toFixed(2);
          document.getElementById('audResult').textContent = 'A$' + parseFloat(aud).toLocaleString('en-AU', {minimumFractionDigits:2});
        });
      </script>
    </section>`,
    hreflang: `
  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/700-gbp-to-aud">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/700-gbp-to-aud">`,
  }
];

for (const fix of fixes) {
  let html = fs.readFileSync(path.join(ROOT, fix.file), 'utf8');

  // Add hreflang in <head>
  html = html.replace('</head>', fix.hreflang + '\n</head>');

  // Add calculator before the table section
  html = html.replace('<h2>Conversion Table</h2>', fix.calcWidget + '\n      <h2>Conversion Table</h2>');

  fs.writeFileSync(path.join(ROOT, fix.file), html, 'utf8');
  console.log(`✅ Fixed: ${fix.file}`);
}
console.log('Done!');
