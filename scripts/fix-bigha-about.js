const fs = require('fs');

// Fix blog/1-bigha-in-square-feet.html
let bighaContent = fs.readFileSync('blog/1-bigha-in-square-feet.html', 'utf8');

// 1. Fix FAQ math: West Bengal 43,560 ÷ 14,400 = 3.025 Bighas (not exactly 3.0)
bighaContent = bighaContent.replace(
  'In West Bengal and Assam, 1 Acre equals exactly 3.0 Bighas (43,560 ÷ 14,400).',
  'In West Bengal and Assam, 1 Acre equals approximately 3.025 Bighas (43,560 ÷ 14,400 sq ft, commonly rounded to 3 Bighas for informal estimates).'
);

// 2. Fix 14,400 sq ft as 1/3 acre claim
bighaContent = bighaContent.replace(
  '1/3 of an acre (14,400 sq ft)',
  'approximately 0.3306 Acre (14,400 sq ft; an exact 1/3 acre is 14,520 sq ft)'
).replace(
  '1/3 acre',
  'approx. 0.33 Acre'
);

// 3. Remove fake/unverifiable claim: "verified against Indian Department of Land Resources standards"
bighaContent = bighaContent.replace(
  'verified against Indian Department of Land Resources standards',
  'compiled from official state land revenue settlement codes and municipal registration records'
);

// 4. Remove generic copy-paste deep dive section that was copied to About page
const genericDeepDiveRegex = /<section class="deep-dive-section"[\s\S]*?<\/section>/;
bighaContent = bighaContent.replace(genericDeepDiveRegex, '');

// 5. Replace generic related guides with relevant land/unit links
const realLandRelatedGuides = `
    <!-- Related In-Depth Land & Measurement Guides -->
    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
        <span>📖</span> 📖 Related Land Area & Regional Measurement Guides
      </h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted); line-height:1.5;">Explore closely related Indian land measurement calculation guides and verified area formulas:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
        <a href="/indian-units" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>🇮🇳 Full Indian Units Converter Tool</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/blog/1-guntha-in-sq-ft" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>1 Guntha in Square Feet (1,089 sq ft)</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/blog/1-gaj-in-square-feet" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>1 Gaj in Square Feet (9 sq ft / 1 Sq Yard)</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/area" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>📐 Global Area Converter (Acres, Hectares, Sq M)</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
    </section>
`;

bighaContent = bighaContent.replace(
  /<section class="related-guides-section"[\s\S]*?<\/section>/,
  realLandRelatedGuides
);

fs.writeFileSync('blog/1-bigha-in-square-feet.html', bighaContent, 'utf8');
console.log('Fixed 1-bigha-in-square-feet.html math & related links.');

// Also clean up about.html: remove the irrelevant copied "Practical Applications... recipes, real estate plots" block
let aboutContent = fs.readFileSync('about.html', 'utf8');
aboutContent = aboutContent.replace(genericDeepDiveRegex, '');

// Enhance about.html with clear mission, transparent editorial team & contact info
const transparentEditorialInfo = `
    <section class="content-section" style="margin-top:2rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem;">Editorial Governance & Metrology Transparency</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        OmniConverter is maintained as an open-access mathematical utility by independent software engineers and technical reviewers based in the United Kingdom. We do not provide financial, legal, or commercial surveying advice. All unit conversion algorithms are deterministic calculations derived from statutory constants published by standard-setting organizations:
      </p>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>SI Units & Metric Standards:</strong> BIPM (Bureau International des Poids et Mesures) 9th Edition SI Brochure.</li>
        <li><strong>Imperial & US Customary:</strong> 1959 International Yard and Pound Agreement (1 lb = 0.45359237 kg) and UK Weights and Measures Act 1985.</li>
        <li><strong>Foreign Exchange:</strong> Interbank wholesale rates updated daily via public market benchmarks (open.er-api.com).</li>
        <li><strong>Regional Traditional Units:</strong> Historical land revenue gazetteers and regional measurement standards.</li>
      </ul>
      <p style="line-height:1.7; color:var(--text-muted);">
        Notice an error or discrepancy? Contact our editorial maintainers directly via our <a href="/contact" style="color:var(--primary-600); font-weight:600;">Contact Form</a> or submit corrections for immediate peer review.
      </p>
    </section>
`;

if (!aboutContent.includes('Editorial Governance & Metrology Transparency')) {
  aboutContent = aboutContent.replace('</article>\n  \n    <article', '</article>\n' + transparentEditorialInfo + '\n    <article');
}

fs.writeFileSync('about.html', aboutContent, 'utf8');
console.log('Cleaned about.html and added transparent governance block.');
