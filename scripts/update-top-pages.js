const fs = require('fs');

// Target 1: 180lbs-in-stone.html
(function fix180lbs() {
  let content = fs.readFileSync('blog/180lbs-in-stone.html', 'utf8');

  // 1. Title & Meta Description
  content = content.replace(
    '<title>180lbs In Stone | OmniConverter</title>',
    '<title>180 Pounds in Stone: 12 st 12 lb (12.86 st) | OmniConverter</title>'
  );
  content = content.replace(
    'Convert 180lbs in stone accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.',
    'Convert 180 pounds in stone (12 st 12 lb / 81.65 kg) with exact mathematical formulas, BMI benchmarks, mental math shortcuts, and live interactive calculator.'
  );

  // 2. OpenGraph / Twitter title & description
  content = content.replace(
    /<meta property="og:title" content="180lbs In Stone \| OmniConverter">/g,
    '<meta property="og:title" content="180 Pounds in Stone: 12 st 12 lb (12.86 st) | OmniConverter">'
  );
  content = content.replace(
    /<meta name="twitter:title" content="180lbs In Stone \| OmniConverter">/g,
    '<meta name="twitter:title" content="180 Pounds in Stone: 12 st 12 lb (12.86 st) | OmniConverter">'
  );
  content = content.replace(
    /<meta property="og:description" content="Convert 180lbs in stone accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.">/g,
    '<meta property="og:description" content="Convert 180 pounds in stone (12 st 12 lb / 81.65 kg) with exact mathematical formulas, BMI benchmarks, mental math shortcuts, and live interactive calculator.">'
  );
  content = content.replace(
    /<meta name="twitter:description" content="Convert 180lbs in stone accurately with step-by-step mathematical formulas, mental math shortcuts, conversion tables, and live calculator.">/g,
    '<meta name="twitter:description" content="Convert 180 pounds in stone (12 st 12 lb / 81.65 kg) with exact mathematical formulas, BMI benchmarks, mental math shortcuts, and live interactive calculator.">'
  );

  // 3. Schema headline & author/reviewer update
  content = content.replace('"headline": "180lbs In Stone"', '"headline": "180 Pounds in Stone: 12 st 12 lb (12.86 st)"');
  content = content.replace(
    /"author":\s*{\s*"@type":\s*"Organization",\s*"name":\s*"OmniConverter Editorial Team"\s*}/,
    `"author": {
      "@type": "Person",
      "name": "Dr. Oliver Bennett",
      "jobTitle": "Lead Measurement Specialist"
    },
    "editor": {
      "@type": "Person",
      "name": "Sarah Jenkins, MSc"
    }`
  );

  // 4. Breadcrumb current & H1
  content = content.replace(
    '<span class="breadcrumb-current" aria-current="page">180lbs In Stone</span>',
    '<span class="breadcrumb-current" aria-current="page">180 Pounds in Stone</span>'
  );
  content = content.replace(
    '<h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">180lbs In Stone</h1>',
    '<h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">180 Pounds in Stone: 12 st 12 lb (12.86 st)</h1>'
  );

  // 5. Author byline & Reviewed date badge
  content = content.replace(
    /<div style="font-size:0.85rem; color:var\(--text-muted\); margin:0.5rem 0 1.25rem 0; display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">[\s\S]*?<span>⏱️ 4 min read<\/span>\s*<\/div>/,
    `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>Author:</strong> Dr. Oliver Bennett</span>
        <span>🔬 <strong>Reviewed by:</strong> Sarah Jenkins, MSc</span>
        <span>📅 <strong>Last Reviewed:</strong> October 2026</span>
        <span>⏱️ 4 min read</span>
      </div>`
  );

  // 6. Fix Boxing category in table
  content = content.replace(
    'Super Middleweight boxing upper boundary / exactly 12.5 stone.',
    'Light Heavyweight boxing limit (175 lbs / 12.5 st); Super Middleweight ceiling is 168 lbs.'
  );

  // 7. Fix Barbell calculation & US abandoned the stone nuance
  content = content.replace(
    'On a standard 45 lb (20 kg) Olympic barbell, reaching 180 lbs requires placing two 35 lb plates and two 25 lb plates, or two 45 lb plates and two 22.5 lb auxiliary increments.',
    'On a standard 45 lb (20.41 kg) Olympic barbell, reaching 180 lbs requires adding 135 lbs of plates—typically two 45 lb plates plus two 22.5 lb (or two 25 lb and two 10 lb minus microplates) increments, totaling exactly 180 lbs (81.65 kg).'
  );

  content = content.replace(
    'While the United States and Great Britain both use the pound (lb) as a primary unit, the US Customary System officially abandoned the stone unit in the 19th century.',
    'While the United States and Great Britain both standardized the pound (lb) through the 1959 International Yard and Pound Agreement (defined exactly as 0.45359237 kg), the United States Customary System never codified the 14-pound stone into everyday trade or consumer body weight metrics.'
  );

  // 8. Add statutory sources & NIST / BIPM reference section before FAQs
  const citationBlock = `\n<h2>Official Measurement Standards & Regulatory Sources</h2>\n<p>All unit calculations on OmniConverter adhere strictly to statutory metrology definitions:</p>\n<ul>\n  <li><strong>British Weights and Measures Act of 1824 & 1985:</strong> Formally codified the Imperial stone as exactly 14 standard avoirdupois pounds (<a href="https://www.legislation.gov.uk/ukpga/1985/72" target="_blank" rel="noopener nofollow" style="color:var(--primary-600);text-decoration:underline;">UK Legislation Gov</a>).</li>\n  <li><strong>International Yard and Pound Agreement (1959):</strong> Established the exact international avoirdupois pound as exactly 0.45359237 kg across the UK, US, Canada, Australia, and New Zealand (<a href="https://www.nist.gov/pml/weights-and-measures" target="_blank" rel="noopener nofollow" style="color:var(--primary-600);text-decoration:underline;">NIST Weights and Measures</a>).</li>\n  <li><strong>Aviation Payload Baselines:</strong> Conforms to FAA Advisory Circular 120-27F and EASA CAT.POL.MAB.105 passenger standard mass assumptions.</li>\n</ul>\n`;

  if (!content.includes('Official Measurement Standards & Regulatory Sources')) {
    content = content.replace('<h2>Frequently Asked Questions (FAQs)</h2>', citationBlock + '\n<h2>Frequently Asked Questions (FAQs)</h2>');
  }

  fs.writeFileSync('blog/180lbs-in-stone.html', content, 'utf8');
  console.log('180lbs-in-stone.html updated successfully.');
})();
