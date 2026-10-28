/**
 * Batch 3: Remaining Priority Articles & Multilingual Hubs
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
// 21. blog/210-kg-in-pounds: 200-220 kg table + stone breakdown
// ─────────────────────────────────────────────────────────────
patchFile('blog/210-kg-in-pounds.html', (html) => {
  if (html.includes('id="table-210-kg"')) return html;

  const table210 = `
<div id="table-210-kg" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Heavyweight Reference Table: 200 kg to 220 kg in Pounds &amp; Stone</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">210 Kilograms equals exactly <strong>462.971 pounds (462 lbs 15.5 oz)</strong> or <strong>33 stone 0.97 pounds (33.07 st)</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Kilograms (kg)</th>
          <th style="padding:0.75rem 1rem;">Pounds (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stone &amp; Pounds</th>
          <th style="padding:0.75rem 1rem;">Strength / Powerlifting Benchmark</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">200 kg</td><td style="padding:0.7rem 1rem;">440.92 lbs</td><td style="padding:0.7rem 1rem;">31 st 6.9 lb</td><td style="padding:0.7rem 1rem;">Elite 200kg deadlift milestone</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">205 kg</td><td style="padding:0.7rem 1rem;">451.95 lbs</td><td style="padding:0.7rem 1rem;">32 st 3.9 lb</td><td style="padding:0.7rem 1rem;">Heavyweight squat standard</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">210 kg ★</td><td style="padding:0.75rem 1rem;">462.97 lbs</td><td style="padding:0.75rem 1rem;">33 st 0.97 lb</td><td style="padding:0.75rem 1rem;">Exact Current Conversion Target</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">215 kg</td><td style="padding:0.7rem 1rem;">473.99 lbs</td><td style="padding:0.7rem 1rem;">33 st 11.9 lb</td><td style="padding:0.7rem 1rem;">World-class competition attempt</td></tr>
        <tr><td style="padding:0.7rem 1rem;">220 kg</td><td style="padding:0.7rem 1rem;">485.02 lbs</td><td style="padding:0.7rem 1rem;">34 st 9.0 lb</td><td style="padding:0.7rem 1rem;">International strongman event load</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${table210}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 22. es/blog/165-libras-a-kg: 150-180 lbs Spanish table
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/165-libras-a-kg.html', (html) => {
  if (html.includes('id="tabla-165-es"')) return html;

  const es165 = `
<div id="tabla-165-es" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Tabla de Pesos Cercanos: 150 a 180 Libras en Kilos</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">165 libras equivalen exactamente a <strong>74.8427 kg</strong> (11 stones 11 libras):</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Libras (lbs)</th>
          <th style="padding:0.75rem 1rem;">Kilogramos (kg)</th>
          <th style="padding:0.75rem 1rem;">Stones y Libras (UK)</th>
          <th style="padding:0.75rem 1rem;">Contexto Deportivo / Salud</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">150 lbs</td><td style="padding:0.7rem 1rem;">68.04 kg</td><td style="padding:0.7rem 1rem;">10 st 10 lb</td><td style="padding:0.7rem 1rem;">Peso pluma / Ligero</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">160 lbs</td><td style="padding:0.7rem 1rem;">72.57 kg</td><td style="padding:0.7rem 1rem;">11 st 6 lb</td><td style="padding:0.7rem 1rem;">Límite peso medio de boxeo (160 lbs)</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">165 lbs ★</td><td style="padding:0.75rem 1rem;">74.84 kg</td><td style="padding:0.75rem 1rem;">11 st 11 lb</td><td style="padding:0.75rem 1rem;">Conversión actual exacta</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">170 lbs</td><td style="padding:0.7rem 1rem;">77.11 kg</td><td style="padding:0.7rem 1rem;">12 st 2 lb</td><td style="padding:0.7rem 1rem;">Peso wélter de artes marciales mixtas</td></tr>
        <tr><td style="padding:0.7rem 1rem;">180 lbs</td><td style="padding:0.7rem 1rem;">81.65 kg</td><td style="padding:0.7rem 1rem;">12 st 12 lb</td><td style="padding:0.7rem 1rem;">Promedio masculino adulto estándar</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${es165}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 23. es/blog/65-kg-a-libras: 60-75 kg Spanish table
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/65-kg-a-libras.html', (html) => {
  if (html.includes('id="tabla-65kg-es"')) return html;

  const es65 = `
<div id="tabla-65kg-es" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Tabla de 60 kg a 75 kg en Libras y Stones</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">65 Kilogramos equivalen exactamente a <strong>143.300 libras (143 lbs 4.8 oz)</strong> o <strong>10 stone 3.3 libras</strong>:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(99,102,241,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Kilogramos (kg)</th>
          <th style="padding:0.75rem 1rem;">Libras (lbs)</th>
          <th style="padding:0.75rem 1rem;">Stones (st / lb)</th>
          <th style="padding:0.75rem 1rem;">Estatura Saludable Recomendada</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">60 kg</td><td style="padding:0.7rem 1rem;">132.28 lbs</td><td style="padding:0.7rem 1rem;">9 st 6.3 lb</td><td style="padding:0.7rem 1rem;">1.60 m - 1.68 m</td></tr>
        <tr style="background:rgba(99,102,241,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">65 kg ★</td><td style="padding:0.75rem 1rem;">143.30 lbs</td><td style="padding:0.75rem 1rem;">10 st 3.3 lb</td><td style="padding:0.75rem 1rem;">1.65 m - 1.75 m (IMC ideal 21 - 23)</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">70 kg</td><td style="padding:0.7rem 1rem;">154.32 lbs</td><td style="padding:0.7rem 1rem;">11 st 0.3 lb</td><td style="padding:0.7rem 1rem;">1.72 m - 1.80 m</td></tr>
        <tr><td style="padding:0.7rem 1rem;">75 kg</td><td style="padding:0.7rem 1rem;">165.35 lbs</td><td style="padding:0.7rem 1rem;">11 st 11.4 lb</td><td style="padding:0.7rem 1rem;">1.78 m - 1.85 m</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${es65}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 24. es/blog/12-grados-celsius-a-fahrenheit: Spanish weather table
// ─────────────────────────────────────────────────────────────
patchFile('es/blog/12-grados-celsius-a-fahrenheit.html', (html) => {
  if (html.includes('id="tabla-12c-es"')) return html;

  const es12C = `
<div id="tabla-12c-es" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Guía de Clima y Ropa: 10°C a 20°C en Grados Fahrenheit</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Fórmula: <strong>°F = (°C &times; 9/5) + 32</strong>. 12°C equivalen exactamente a <strong>53.6°F</strong> (285.15 K):</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Celsius (°C)</th>
          <th style="padding:0.75rem 1rem;">Fahrenheit (°F)</th>
          <th style="padding:0.75rem 1rem;">Sensación Térmica</th>
          <th style="padding:0.75rem 1rem;">Ropa Recomendada</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">10°C</td><td style="padding:0.7rem 1rem;">50.0°F</td><td style="padding:0.7rem 1rem;">Fresco / Otoño temprano</td><td style="padding:0.7rem 1rem;">Chaqueta ligera, jersey y pantalón largo</td></tr>
        <tr style="background:rgba(59,130,246,0.12); font-weight:800; border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem 1rem;">12°C ★</td><td style="padding:0.75rem 1rem;">53.6°F</td><td style="padding:0.7rem 1rem;">Fresco agradable de primavera</td><td style="padding:0.7rem 1rem;">Sudadera, cazadora vaquera o suéter ligero</td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;">15°C</td><td style="padding:0.7rem 1rem;">59.0°F</td><td style="padding:0.7rem 1rem;">Templado suave</td><td style="padding:0.7rem 1rem;">Manga larga fina o camisa con chaqueta fina</td></tr>
        <tr><td style="padding:0.7rem 1rem;">20°C</td><td style="padding:0.7rem 1rem;">68.0°F</td><td style="padding:0.7rem 1rem;">Temperatura ambiente agradable</td><td style="padding:0.7rem 1rem;">Camiseta de manga corta y pantalón cómodo</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/<\/article>/i, `${es12C}\n</article>`);
});

// ─────────────────────────────────────────────────────────────
// 25. length.html (Main Tool Hub): Add Quick Pair Answers in HTML
// ─────────────────────────────────────────────────────────────
patchFile('length.html', (html) => {
  if (html.includes('id="popular-length-benchmarks"')) return html;

  const quickLengthTable = `
<div id="popular-length-benchmarks" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2.5rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Popular Metric &amp; Imperial Length Conversions</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Instant reference values for standard international length queries:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Metric Query</th>
          <th style="padding:0.75rem 1rem;">Exact Imperial Feet</th>
          <th style="padding:0.75rem 1rem;">Feet &amp; Inches</th>
          <th style="padding:0.75rem 1rem;">Dedicated Detailed Guide</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;"><strong>4 Meters to Feet</strong></td><td style="padding:0.7rem 1rem;">13.1234 ft</td><td style="padding:0.7rem 1rem;">13 ft 1.5 in</td><td style="padding:0.7rem 1rem;"><a href="/blog/4-meters-to-feet" style="color:var(--primary-600); font-weight:700;">Read 4m Guide &rarr;</a></td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;"><strong>15 Meters to Feet</strong></td><td style="padding:0.7rem 1rem;">49.2126 ft</td><td style="padding:0.7rem 1rem;">49 ft 2.5 in</td><td style="padding:0.7rem 1rem;"><a href="/blog/15-meters-to-feet" style="color:var(--primary-600); font-weight:700;">Read 15m Guide &rarr;</a></td></tr>
        <tr><td style="padding:0.7rem 1rem;"><strong>300 Meters to Feet</strong></td><td style="padding:0.7rem 1rem;">984.2520 ft</td><td style="padding:0.7rem 1rem;">984 ft 3.0 in</td><td style="padding:0.7rem 1rem;"><a href="/blog/300-meters-to-feet" style="color:var(--primary-600); font-weight:700;">Read 300m Guide &rarr;</a></td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/(<\/main>)/i, `${quickLengthTable}\n$1`);
});

// ─────────────────────────────────────────────────────────────
// 26. temperature.html (Main Tool Hub): Add Quick Pair Answers in HTML
// ─────────────────────────────────────────────────────────────
patchFile('temperature.html', (html) => {
  if (html.includes('id="popular-temp-benchmarks"')) return html;

  const quickTempTable = `
<div id="popular-temp-benchmarks" style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2.5rem 0;">
  <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem; color:var(--text-main);">Key Temperature Landmarks &amp; Conversions</h2>
  <p style="color:var(--text-muted); font-size:0.92rem; margin:0 0 1.25rem 0;">Frequently converted thermal benchmarks with exact Celsius, Fahrenheit, and Kelvin equivalents:</p>
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:0.92rem; text-align:left;">
      <thead>
        <tr style="background:rgba(59,130,246,0.08); border-bottom:2px solid var(--card-border);">
          <th style="padding:0.75rem 1rem;">Benchmark Query</th>
          <th style="padding:0.75rem 1rem;">Celsius (°C)</th>
          <th style="padding:0.75rem 1rem;">Fahrenheit (°F)</th>
          <th style="padding:0.75rem 1rem;">Dedicated In-Depth Guide</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;"><strong>10°C to °F</strong></td><td style="padding:0.7rem 1rem;">10.0°C</td><td style="padding:0.7rem 1rem;">50.0°F</td><td style="padding:0.7rem 1rem;"><a href="/blog/10-celsius-is-what-fahrenheit" style="color:var(--primary-600); font-weight:700;">Read 10°C Guide &rarr;</a></td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;"><strong>12°C to °F</strong></td><td style="padding:0.7rem 1rem;">12.0°C</td><td style="padding:0.7rem 1rem;">53.6°F</td><td style="padding:0.7rem 1rem;"><a href="/blog/12-degrees-celsius-to-fahrenheit" style="color:var(--primary-600); font-weight:700;">Read 12°C Guide &rarr;</a></td></tr>
        <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.7rem 1rem;"><strong>50°F to °C</strong></td><td style="padding:0.7rem 1rem;">10.0°C</td><td style="padding:0.7rem 1rem;">50.0°F</td><td style="padding:0.7rem 1rem;"><a href="/blog/50-fahrenheit-to-celsius" style="color:var(--primary-600); font-weight:700;">Read 50°F Guide &rarr;</a></td></tr>
        <tr><td style="padding:0.7rem 1rem;"><strong>100°F to °C</strong></td><td style="padding:0.7rem 1rem;">37.78°C</td><td style="padding:0.7rem 1rem;">100.0°F</td><td style="padding:0.7rem 1rem;"><a href="/blog/100-fahrenheit-to-celsius" style="color:var(--primary-600); font-weight:700;">Read 100°F Guide &rarr;</a></td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return html.replace(/(<\/main>)/i, `${quickTempTable}\n$1`);
});

console.log('\n✅ Batch 3 optimization complete!');
