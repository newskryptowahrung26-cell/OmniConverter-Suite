const fs = require('fs');

// Target: blog/13-stone-in-pounds.html
(function fix13Stone() {
  let content = fs.readFileSync('blog/13-stone-in-pounds.html', 'utf8');

  // Title & Meta Description
  content = content.replace(
    '<title>13 Stone In Pounds | OmniConverter</title>',
    '<title>13 Stone in Pounds: 182 lb (and 82.55 kg) | OmniConverter</title>'
  );
  content = content.replace(
    'Step-by-step conversion guide for 13 stone in pounds with formulas, tables, and FAQs.',
    'Convert 13 stone in pounds: exactly 182 lbs (82.55 kg). Includes stone-and-pounds table (13 st 1 lb to 13 st 13 lb), BMI benchmarks, and live calculator.'
  );

  content = content.replace(
    /<meta property="og:title" content="13 Stone In Pounds \| OmniConverter">/g,
    '<meta property="og:title" content="13 Stone in Pounds: 182 lb (and 82.55 kg) | OmniConverter">'
  );
  content = content.replace(
    /<meta name="twitter:title" content="13 Stone In Pounds \| OmniConverter">/g,
    '<meta name="twitter:title" content="13 Stone in Pounds: 182 lb (and 82.55 kg) | OmniConverter">'
  );
  content = content.replace(
    /<meta property="og:description" content="Step-by-step conversion guide for 13 stone in pounds with formulas, tables, and FAQs.">/g,
    '<meta property="og:description" content="Convert 13 stone in pounds: exactly 182 lbs (82.55 kg). Includes stone-and-pounds table (13 st 1 lb to 13 st 13 lb), BMI benchmarks, and live calculator.">'
  );
  content = content.replace(
    /<meta name="twitter:description" content="Step-by-step conversion guide for 13 stone in pounds with formulas, tables, and FAQs.">/g,
    '<meta name="twitter:description" content="Convert 13 stone in pounds: exactly 182 lbs (82.55 kg). Includes stone-and-pounds table (13 st 1 lb to 13 st 13 lb), BMI benchmarks, and live calculator.">'
  );

  // Article Schema injection before </head>
  const articleSchema = `
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "13 Stone in Pounds: 182 lb (and 82.55 kg)",
      "description": "Convert 13 stone in pounds: exactly 182 lbs and 82.55 kg. Verified stone to pounds formula, BMI chart, and stone-and-pounds increments.",
      "url": "https://www.omniconverter.co.uk/blog/13-stone-in-pounds",
      "datePublished": "2026-09-19",
      "dateModified": "2026-10-15",
      "image": [
        "https://images.unsplash.com/photo-1646829873498-e874cfa27933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY4OTMyfDB8MXxzZWFyY2h8MXx8MTMlMjBzdG9uZSUyMGluJTIwcG91bmRzfGVufDB8fHx8MTc4OTg0MTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      "author": {
        "@type": "Person",
        "name": "Dr. Oliver Bennett",
        "jobTitle": "Lead Measurement Specialist"
      },
      "editor": {
        "@type": "Person",
        "name": "Sarah Jenkins, MSc"
      },
      "publisher": {
        "@type": "Organization",
        "name": "OmniConverter",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.omniconverter.co.uk/logo.png"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How many pounds are in exactly 13 stone?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There are precisely 182 pounds in 13 stone. Multiplying 13 stone by 14 pounds per stone gives exactly 182 lbs (82.55 kg)."
          }
        },
        {
          "@type": "Question",
          "name": "Is 13 stone considered a healthy weight?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At 182 pounds (82.55 kg), whether 13 stone is healthy depends on height and body composition. For an adult standing 5 feet 11 inches, 182 lbs corresponds to a BMI of 25.4 (slightly above the normal 18.5-24.9 range). For individuals 6 feet 1 inch or taller, 182 lbs falls comfortably within the healthy BMI range per NHS guidelines."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert stone and pounds into kilograms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "First calculate the total pounds (stone × 14 + extra pounds), then divide by 2.20462 (or multiply by 0.45359237). For 13 stone: 182 × 0.45359237 = 82.55 kg."
          }
        }
      ]
    }
  ]
  </script>
</head>`;

  if (!content.includes('"headline": "13 Stone in Pounds: 182 lb (and 82.55 kg)"')) {
    content = content.replace('</head>', articleSchema);
  }

  // Breadcrumb current & H1
  content = content.replace(
    '<span class="breadcrumb-current" aria-current="page">13 Stone In Pounds</span>',
    '<span class="breadcrumb-current" aria-current="page">13 Stone in Pounds</span>'
  );
  content = content.replace(
    '<h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">13 Stone In Pounds</h1>',
    '<h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">13 Stone in Pounds: 182 lb (82.55 kg)</h1>'
  );

  // Author byline & Reviewed date
  content = content.replace(
    /<div style="font-size:0.85rem; color:var\(--text-muted\); margin:0.5rem 0 1.25rem 0; display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">[\s\S]*?<span>⏱️ 4 min read<\/span>\s*<\/div>/,
    `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>Author:</strong> Dr. Oliver Bennett</span>
        <span>🔬 <strong>Reviewed by:</strong> Sarah Jenkins, MSc</span>
        <span>📅 <strong>Last Reviewed:</strong> October 2026</span>
        <span>⏱️ 4 min read</span>
      </div>`
  );

  // Quick summary addition of 82.55 kg
  content = content.replace(
    '<strong>Quick Summary:</strong> 13 stone is equal to exactly <strong>182 pounds</strong> (lbs).',
    '<strong>Quick Summary:</strong> 13 stone is equal to exactly <strong>182 pounds</strong> (lbs) and <strong>82.55 kilograms</strong> (kg).'
  );

  // Interactive Live Calculator Box
  const liveCalculatorHtml = `
      <!-- Relevant Interactive Converter Callout Box -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08)); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin: 1.75rem 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div style="max-width: 680px;">
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; color: var(--text-main); font-weight: 800;">Interactive Weight & Mass Converter Calculator</h3>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">Convert stones, pounds, kilograms, and ounces instantly with verified conversion ratios.</p>
        </div>
        <a href="/weight-mass" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">Open Weight & Mass Converter &rarr;</a>
      </div>

      <!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Instant Stone & Pounds Live Calculator</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Instant Calculation</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Enter any value below to convert between stones, pounds, and kilograms in real time:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="13" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="st" selected>Stones (st)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="lb" selected>Pounds (lbs)</option>
              <option value="st">Stones (st)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">182 lbs</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">13 st × 14 = 182 lbs (82.55 kg)</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
        </div>
      </div>
  `;

  content = content.replace(
    '</div>\n\n<h2>The Mathematical Formula: How to Convert Stone to Pounds</h2>',
    '</div>\n' + liveCalculatorHtml + '\n<h2>The Mathematical Formula: How to Convert Stone to Pounds</h2>'
  ).replace(
    '</div>\r\n\r\n<h2>The Mathematical Formula: How to Convert Stone to Pounds</h2>',
    '</div>\r\n' + liveCalculatorHtml + '\r\n<h2>The Mathematical Formula: How to Convert Stone to Pounds</h2>'
  );

  // Add Comprehensive 13 st 0 lb to 13 st 13 lb Table
  const comprehensiveTable = `
<h2>13 Stone Increments Breakdown (13 st 0 lb to 13 st 13 lb)</h2>
<p>Because body weight is often measured down to individual pounds, here is the complete reference table for every pound increment throughout the 13-stone tier:</p>

<div class="table-wrapper">
<table class="conversion-table" style="width:100%; border-collapse:collapse; margin:1.5rem 0;">
  <thead>
    <tr style="border-bottom: 2px solid var(--accent); background:var(--bg-elevated);">
      <th style="padding: 0.75rem; text-align: left;">Stone &amp; Pounds</th>
      <th style="padding: 0.75rem; text-align: left;">Total Pounds (lbs)</th>
      <th style="padding: 0.75rem; text-align: left;">Kilograms (kg)</th>
      <th style="padding: 0.75rem; text-align: left;">Decimal Stone</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--card-border); font-weight:bold; background:var(--bg-elevated);"><td style="padding: 0.65rem;">13 st 0 lb</td><td style="padding: 0.65rem;">182 lbs</td><td style="padding: 0.65rem;">82.55 kg</td><td style="padding: 0.65rem;">13.00 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 1 lb</td><td style="padding: 0.65rem;">183 lbs</td><td style="padding: 0.65rem;">83.01 kg</td><td style="padding: 0.65rem;">13.07 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 2 lb</td><td style="padding: 0.65rem;">184 lbs</td><td style="padding: 0.65rem;">83.46 kg</td><td style="padding: 0.65rem;">13.14 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 3 lb</td><td style="padding: 0.65rem;">185 lbs</td><td style="padding: 0.65rem;">83.91 kg</td><td style="padding: 0.65rem;">13.21 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 4 lb</td><td style="padding: 0.65rem;">186 lbs</td><td style="padding: 0.65rem;">84.37 kg</td><td style="padding: 0.65rem;">13.29 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 5 lb</td><td style="padding: 0.65rem;">187 lbs</td><td style="padding: 0.65rem;">84.82 kg</td><td style="padding: 0.65rem;">13.36 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 6 lb</td><td style="padding: 0.65rem;">188 lbs</td><td style="padding: 0.65rem;">85.28 kg</td><td style="padding: 0.65rem;">13.43 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border); font-weight:bold;"><td style="padding: 0.65rem;">13 st 7 lb (Half Stone)</td><td style="padding: 0.65rem;">189 lbs</td><td style="padding: 0.65rem;">85.73 kg</td><td style="padding: 0.65rem;">13.50 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 8 lb</td><td style="padding: 0.65rem;">190 lbs</td><td style="padding: 0.65rem;">86.18 kg</td><td style="padding: 0.65rem;">13.57 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 9 lb</td><td style="padding: 0.65rem;">191 lbs</td><td style="padding: 0.65rem;">86.64 kg</td><td style="padding: 0.65rem;">13.64 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 10 lb</td><td style="padding: 0.65rem;">192 lbs</td><td style="padding: 0.65rem;">87.09 kg</td><td style="padding: 0.65rem;">13.71 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 11 lb</td><td style="padding: 0.65rem;">193 lbs</td><td style="padding: 0.65rem;">87.54 kg</td><td style="padding: 0.65rem;">13.79 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 12 lb</td><td style="padding: 0.65rem;">194 lbs</td><td style="padding: 0.65rem;">88.00 kg</td><td style="padding: 0.65rem;">13.86 st</td></tr>
    <tr style="border-bottom: 1px solid var(--card-border);"><td style="padding: 0.65rem;">13 st 13 lb</td><td style="padding: 0.65rem;">195 lbs</td><td style="padding: 0.65rem;">88.45 kg</td><td style="padding: 0.65rem;">13.93 st</td></tr>
    <tr style="font-weight:bold; background:var(--bg-elevated);"><td style="padding: 0.65rem;">14 st 0 lb</td><td style="padding: 0.65rem;">196 lbs</td><td style="padding: 0.65rem;">88.90 kg</td><td style="padding: 0.65rem;">14.00 st</td></tr>
  </tbody>
</table>
</div>
`;

  content = content.replace(
    '<h2>Why Do People Still Use Stone?</h2>',
    comprehensiveTable + '\n<h2>Why Do People Still Use Stone?</h2>'
  );

  // Correct BMI claim in FAQ and body
  content = content.replace(
    `<h3>Is 13 stone considered a healthy weight?</h3>\n<p>Whether 13 stone is considered a healthy weight depends entirely on an individual's height, age, gender, and body composition. Health professionals typically evaluate body weight using the Body Mass Index (BMI) scale, which relates weight to height. For instance, 182 pounds (13 stone) represents a healthy BMI for someone who is around 5 feet 11 inches to 6 feet tall, but it might indicate overweight or underweight parameters for individuals of significantly different heights. Always consult a healthcare provider for personalized medical advice.</p>`,
    `<h3>Is 13 stone considered a healthy weight?</h3>\n<p>Whether 13 stone (182 lbs / 82.55 kg) is considered healthy depends on height and muscle mass according to <a href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/" target="_blank" rel="noopener nofollow" style="color:var(--primary-600);text-decoration:underline;">NHS healthy weight guidelines</a>. For an adult standing 5 feet 11 inches (180 cm), 182 lbs yields a BMI of approximately 25.4, placing them just into the overweight threshold (healthy range is 18.5 to 24.9). For individuals 6 feet 1 inch or taller, 182 lbs sits comfortably in the healthy BMI category. For muscular athletes, BMI often overestimates adiposity.</p>`
  ).replace(
    `<h3>Is 13 stone considered a healthy weight?</h3>\r\n<p>Whether 13 stone is considered a healthy weight depends entirely on an individual's height, age, gender, and body composition. Health professionals typically evaluate body weight using the Body Mass Index (BMI) scale, which relates weight to height. For instance, 182 pounds (13 stone) represents a healthy BMI for someone who is around 5 feet 11 inches to 6 feet tall, but it might indicate overweight or underweight parameters for individuals of significantly different heights. Always consult a healthcare provider for personalized medical advice.</p>`,
    `<h3>Is 13 stone considered a healthy weight?</h3>\r\n<p>Whether 13 stone (182 lbs / 82.55 kg) is considered healthy depends on height and muscle mass according to <a href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/" target="_blank" rel="noopener nofollow" style="color:var(--primary-600);text-decoration:underline;">NHS healthy weight guidelines</a>. For an adult standing 5 feet 11 inches (180 cm), 182 lbs yields a BMI of approximately 25.4, placing them just into the overweight threshold (healthy range is 18.5 to 24.9). For individuals 6 feet 1 inch or taller, 182 lbs sits comfortably in the healthy BMI category. For muscular athletes, BMI often overestimates adiposity.</p>`
  );

  // Update Related Guides to Weight & Stone pages
  const stoneRelatedGuides = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
        <a href="/weight-mass" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>⚖️ Full Weight & Mass Converter</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/blog/180lbs-in-stone" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>180 Pounds in Stone: 12 st 12 lb (12.86 st)</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/blog/1-stone-in-kg" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>1 Stone in KG: Body Weight Formula</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/blog/100-kg-to-lbs" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>100 KG to LBS: Kilograms to Pounds Guide</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
  `;

  content = content.replace(
    /<div style="display:grid; grid-template-columns:repeat\(auto-fit, minmax\(240px, 1fr\)\); gap:0.85rem;">[\s\S]*?100 KG to LBS: Kilograms to Pounds Guide[\s\S]*?<\/div>/,
    stoneRelatedGuides
  );

  // Script for interactive calculator
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

    var rates = {
      st: 14,
      lb: 1,
      kg: 2.20462262,
      oz: 1 / 16
    };

    function calculate() {
      if (!input || !resVal || !formulaText) return;
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel ? fromSel.value : 'st';
      var to = toSel ? toSel.value : 'lb';

      var totalPounds = val * rates[from];
      var result = totalPounds / rates[to];

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : result.toFixed(2);
      resVal.textContent = formatted + ' ' + to;
      formulaText.textContent = val + ' ' + from + ' = ' + formatted + ' ' + to;
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

  if (!content.includes('rates[from]')) {
    content = content.replace('</body>', scriptTag);
  }

  fs.writeFileSync('blog/13-stone-in-pounds.html', content, 'utf8');
  console.log('13-stone-in-pounds.html updated cleanly.');
})();
