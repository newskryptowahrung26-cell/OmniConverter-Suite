const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('blog').filter(f => f.endsWith('.html'));

const categoryGuides = {
  currency: [
    { url: '/currency', title: '💱 Multi-Currency Exchange Converter Tool' },
    { url: '/blog/100-usd-to-aud', title: '100 USD to AUD: US Dollar to Australian Dollar' },
    { url: '/blog/32-usd-to-gbp', title: '32 USD to GBP: Exchange Calculation & Travel Rates' },
    { url: '/blog/2000-dollars-in-pounds', title: '2000 Dollars in Pounds: Live USD to GBP' }
  ],
  weight: [
    { url: '/weight-mass', title: '⚖️ Full Weight & Mass Converter' },
    { url: '/blog/180lbs-in-stone', title: '180 Pounds in Stone: 12 st 12 lb (12.86 st)' },
    { url: '/blog/13-stone-in-pounds', title: '13 Stone in Pounds: 182 lb (82.55 kg)' },
    { url: '/blog/100-kg-to-lbs', title: '100 KG to LBS: Kilograms to Pounds Guide' }
  ],
  volume: [
    { url: '/volume-capacity', title: '🧪 Kitchen Volume & Capacity Converter' },
    { url: '/blog/500-ml-to-cups', title: '500 mL to Cups: Liquid Volume Conversion' },
    { url: '/blog/1-tsp-is-ml', title: 'How Many mL in a Teaspoon? (1 tsp is mL)' },
    { url: '/blog/1-3-cup-to-grams', title: '1/3 Cup to Grams: Baking Conversion Guide' }
  ],
  temperature: [
    { url: '/temperature', title: '🌡️ Temperature Scale Converter' },
    { url: '/blog/100-fahrenheit-to-celsius', title: '100 Fahrenheit to Celsius Guide' },
    { url: '/blog/50-fahrenheit-to-celsius', title: '50 Fahrenheit to Celsius Guide' },
    { url: '/blog/10-celsius-is-what-fahrenheit', title: '10 Celsius to Fahrenheit Guide' }
  ],
  area: [
    { url: '/area', title: '📐 Global Area & Land Converter' },
    { url: '/indian-units', title: '🇮🇳 Indian Traditional Land & Gold Units' },
    { url: '/blog/1-bigha-in-square-feet', title: '1 Bigha in Square Feet Guide' },
    { url: '/blog/1-guntha-in-sq-ft', title: '1 Guntha in Square Feet Guide' }
  ],
  length: [
    { url: '/length', title: '📏 Length & Distance Converter' },
    { url: '/blog/4-meters-to-feet', title: '4 Meters to Feet Guide' },
    { url: '/blog/15-meters-to-feet', title: '15 Meters to Feet Guide' },
    { url: '/speed', title: '🚗 Speed & Velocity Converter' }
  ],
  general: [
    { url: '/weight-mass', title: '⚖️ Weight & Mass Converter' },
    { url: '/volume-capacity', title: '🧪 Volume & Capacity Converter' },
    { url: '/currency', title: '💱 Live Currency Converter' },
    { url: '/temperature', title: '🌡️ Temperature Converter' }
  ]
};

function detectCategory(f, content) {
  const name = f.toLowerCase();
  const text = (name + ' ' + content.slice(0, 3000)).toLowerCase();
  if (name.includes('usd') || name.includes('dollar') || name.includes('gbp') || name.includes('aud') || name.includes('vnd') || name.includes('eur') || text.includes('exchange rate') || text.includes('currency')) return 'currency';
  if (name.includes('bigha') || name.includes('acre') || name.includes('square-feet') || name.includes('gaj') || name.includes('guntha') || text.includes('square feet') || text.includes('area conversion')) return 'area';
  if (name.includes('fahrenheit') || name.includes('celsius') || text.includes('temperature conversion')) return 'temperature';
  if (name.includes('meter') || name.includes('feet') || name.includes('inch') || name.includes('cm') || name.includes('km') || name.includes('yard')) return 'length';
  if (name.includes('stone') || name.includes('kg') || name.includes('lbs') || name.includes('pound') || name.includes('gram') || name.includes('tola') || name.includes('weight')) return 'weight';
  if (name.includes('ml') || name.includes('cup') || name.includes('tsp') || name.includes('tbsp') || name.includes('liter') || name.includes('gallon') || name.includes('volume')) return 'volume';
  return 'general';
}

let fixedCount = 0;

files.forEach(f => {
  const p = path.join('blog', f);
  let content = fs.readFileSync(p, 'utf8');
  const cat = detectCategory(f, content);
  const guides = categoryGuides[cat] || categoryGuides.general;

  // Filter out self-link
  const currentUrl = '/blog/' + f.replace('.html', '');
  const filtered = guides.filter(g => g.url !== currentUrl).slice(0, 4);

  const relatedHtml = `
    <!-- Related In-Depth Conversion Guides -->
    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
        <span>📖</span> 📖 Related In-Depth Guides & Conversion Tools
      </h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted); line-height:1.5;">Explore closely related calculation guides, verified formulas, and interactive unit converters:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
        ${filtered.map(g => `
        <a href="${g.url}" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>${g.title}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>`).join('\n')}
      </div>
    </section>
  `;

  const relatedRegex = /<!-- Related In-Depth Conversion Guides -->[\s\S]*?<\/section>/;
  if (relatedRegex.test(content)) {
    content = content.replace(relatedRegex, relatedHtml.trim());
    fs.writeFileSync(p, content, 'utf8');
    fixedCount++;
  }
});

console.log(`Updated relevant internal links across ${fixedCount} English blog articles.`);
