const fs = require('fs');

let len = fs.readFileSync('length.html', 'utf8');

const trendingLengthGrid = `
      <!-- Trending In-Depth Length & Area Guides (High-Impact Internal Links) -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(20, 184, 166, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Popular Distance & Measurement Guides
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Meters / Feet / Inches</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Detailed worked examples for real estate, architectural rooms, construction, and height conversions:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/blog/15-meters-to-feet" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">15 Meters to Feet (49.21 ft)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Exact meter-to-feet ratio, room layout sizes & construction conversion.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Read Full Guide &rarr;</span>
          </a>

          <a href="/blog/4-meters-to-feet" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">4 Meters to Feet (13.12 ft)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Standard residential ceiling & bedroom dimensions explained.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Read Full Guide &rarr;</span>
          </a>

          <a href="/blog/1-guntha-in-sq-ft" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">1 Guntha in Sq Ft (1,089 sq ft)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Indian land measurement standard with state-wise square yards and meters.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Read Full Guide &rarr;</span>
          </a>
        </div>
      </section>
`;

len = len.replace('<!-- Quick Conversion Shortcuts Grid -->', trendingLengthGrid + '\n      <!-- Quick Conversion Shortcuts Grid -->');
fs.writeFileSync('length.html', len, 'utf8');
console.log('Successfully inserted trending grid into length.html');
