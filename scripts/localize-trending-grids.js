const fs = require('fs');

// --- SPANISH (ES) ---
function updateSpanish() {
  // es/currency.html
  let esCurr = fs.readFileSync('es/currency.html', 'utf8');
  const esCurrGrid = `
      <!-- Guías de Conversión de Divisas en Tendencia (Internal Links) -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(16, 185, 129, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guías Populares de Cambio de Divisas
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Tasas en Vivo y Comisiones</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Aprende cómo cambiar moneda extranjera evitando comisiones ocultas y márgenes bancarios:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/es/blog/32-usd-a-gbp" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">32 USD a GBP (£24.18 - £25.00)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Tipo de cambio en vivo, comisiones de tarjetas y PayPal.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>

          <a href="/es/blog/100-usd-a-aud" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">100 USD a AUD (A$152.50)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Poder adquisitivo en dólares australianos y tarifas de cajeros.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>

          <a href="/es/blog/1-aud-a-vnd" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">1 AUD a VND (₫16,400)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Dólar australiano a Dong vietnamita para viajeros y transferencias.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (esCurr.includes('<!-- Popular Quick Conversion Presets -->')) {
    esCurr = esCurr.replace('<!-- Popular Quick Conversion Presets -->', esCurrGrid + '\n      <!-- Popular Quick Conversion Presets -->');
  } else if (esCurr.includes('<section class="content-section" style="margin-top:2rem;">')) {
    esCurr = esCurr.replace('<section class="content-section" style="margin-top:2rem;">', esCurrGrid + '\n      <section class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('es/currency.html', esCurr, 'utf8');

  // es/temperature.html
  let esTemp = fs.readFileSync('es/temperature.html', 'utf8');
  const esTempGrid = `
      <!-- Guías de Temperatura en Tendencia -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(245, 158, 11, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guías Populares de Temperatura y Presión
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Fórmulas y Tablas</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Explicaciones detalladas con trucos de cálculo mental y tablas de clima:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/es/blog/50-fahrenheit-a-celsius" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">50°F a °C (Exacto 10°C)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Fórmula paso a paso, atajo mental y qué ropa llevar con 50°F.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>

          <a href="/es/blog/1-bar-a-psi" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">1 Bar a PSI (14.5038 PSI)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Presión de neumáticos, hidráulica y factores exactos de conversión.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (esTemp.includes('<article class="content-section" style="margin-top:2rem;">')) {
    esTemp = esTemp.replace('<article class="content-section" style="margin-top:2rem;">', esTempGrid + '\n    <article class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('es/temperature.html', esTemp, 'utf8');

  // es/weight-mass.html
  let esWeight = fs.readFileSync('es/weight-mass.html', 'utf8');
  const esWeightGrid = `
      <!-- Guías de Peso Populares -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(59, 130, 246, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guías Populares de Peso Corporal y Balanzas
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Kilos / Libras / Stone</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Descubre las conversiones de masa más buscadas con tablas de peso corporal:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/es/blog/65-kg-a-libras" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">65 kg a Libras (143.3 lbs)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Fórmula certificada, tabla de cálculo rápido y categoría de peso saludable.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>

          <a href="/es/blog/180-libras-en-stone" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">180 Libras en Stone (12 st 12 lb)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Conversión al sistema británico imperial (81.65 kg) y tabla de fitness.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (esWeight.includes('<article class="content-section">')) {
    esWeight = esWeight.replace('<article class="content-section">', esWeightGrid + '\n      <article class="content-section">');
  }
  fs.writeFileSync('es/weight-mass.html', esWeight, 'utf8');

  // es/length.html
  let esLen = fs.readFileSync('es/length.html', 'utf8');
  const esLenGrid = `
      <!-- Guías de Distancia en Tendencia -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(20, 184, 166, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guías Populares de Metros y Pies
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Metros / Pies / Pulgadas</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Ejemplos prácticos para planos arquitectónicos y construcción:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/es/blog/15-metros-a-pies" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">15 Metros a Pies (49.21 pies)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Proporción exacta, medidas de parcelas y cálculo sin errores.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>

          <a href="/es/blog/4-metros-a-pies" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">4 Metros a Pies (13.12 pies)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Dimensiones de habitaciones residenciales y techos explicadas.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Leer Guía Completa &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (esLen.includes('<article class="content-section" style="margin-top:2.5rem;">')) {
    esLen = esLen.replace('<article class="content-section" style="margin-top:2.5rem;">', esLenGrid + '\n      <article class="content-section" style="margin-top:2.5rem;">');
  }
  fs.writeFileSync('es/length.html', esLen, 'utf8');
  console.log('Updated Spanish tools');
}

// --- GERMAN (DE) ---
function updateGerman() {
  // de/currency.html
  let deCurr = fs.readFileSync('de/currency.html', 'utf8');
  const deCurrGrid = `
      <!-- Beliebte Währungsumrechnungs-Ratgeber (Internal Links) -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(16, 185, 129, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Beliebte Währungsumrechnungs-Ratgeber
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Live-Kurse & Gebühren</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Detaillierte Anleitungen zur Umrechnung ohne versteckte Bankgebühren:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/de/blog/32-usd-in-gbp" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">32 USD in GBP (£24.18 - £25.00)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Live-Wechselkurs, Bankgebühren und Kreditkartenaufschläge.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>

          <a href="/de/blog/100-usd-in-aud" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">100 USD in AUD (A$152.50)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">US-Dollar in Australische Dollar mit Reise- und Geldautomatentipps.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (deCurr.includes('<!-- Popular Quick Conversion Presets -->')) {
    deCurr = deCurr.replace('<!-- Popular Quick Conversion Presets -->', deCurrGrid + '\n      <!-- Popular Quick Conversion Presets -->');
  } else if (deCurr.includes('<section class="content-section" style="margin-top:2rem;">')) {
    deCurr = deCurr.replace('<section class="content-section" style="margin-top:2rem;">', deCurrGrid + '\n      <section class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('de/currency.html', deCurr, 'utf8');

  // de/temperature.html
  let deTemp = fs.readFileSync('de/temperature.html', 'utf8');
  const deTempGrid = `
      <!-- Temperatur Ratgeber in Trend -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(245, 158, 11, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Beliebte Temperatur- und Druckratgeber
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Formeln & Tabellen</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Exakte Formeln und Kopfrechentricks für Alltag und Wissenschaft:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/de/blog/50-fahrenheit-in-celsius" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">50°F in Celsius (Exakt 10°C)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Fahrenheit in Celsius Umrechnung, Kopfrechentrick & Kleidungstipps.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>

          <a href="/de/blog/1-bar-in-psi" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">1 Bar in PSI (14.5038 PSI)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Reifendruck und Hydraulik Umrechnungstabelle.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (deTemp.includes('<article class="content-section" style="margin-top:2rem;">')) {
    deTemp = deTemp.replace('<article class="content-section" style="margin-top:2rem;">', deTempGrid + '\n    <article class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('de/temperature.html', deTemp, 'utf8');

  // de/weight-mass.html
  let deWeight = fs.readFileSync('de/weight-mass.html', 'utf8');
  const deWeightGrid = `
      <!-- Beliebte Gewichts-Ratgeber -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(59, 130, 246, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Beliebte Körpergewicht- und Stone-Ratgeber
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Kilo / Pfund / Stone</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Direkte Berechnungen für britische und amerikanische Gewichtseinheiten:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/de/blog/180-pfund-in-stone" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">180 Pfund in Stone (12 st 12 lb)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Exakte 81.65 kg Umrechnung, britisches Stone-System und BMI-Tabellen.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>

          <a href="/de/blog/65-kg-in-pfund" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">65 kg in Pfund (143.3 lbs)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Kilogramm in Pfund Umrechnungsformel und Fitnesstabellen.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (deWeight.includes('<article class="content-section">')) {
    deWeight = deWeight.replace('<article class="content-section">', deWeightGrid + '\n      <article class="content-section">');
  }
  fs.writeFileSync('de/weight-mass.html', deWeight, 'utf8');

  // de/length.html
  let deLen = fs.readFileSync('de/length.html', 'utf8');
  const deLenGrid = `
      <!-- Beliebte Längen-Ratgeber -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(20, 184, 166, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Beliebte Meter- und Fuß-Ratgeber
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Meter / Fuß / Zoll</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Praktische Rechenbeispiele für Architektur, Immobilien und Bauwesen:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/de/blog/15-meter-in-fuss" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">15 Meter in Fuß (49.21 ft)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Exaktes Umrechnungsverhältnis von Metern in Fuß für Baupläne.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>

          <a href="/de/blog/4-meter-in-fuss" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">4 Meter in Fuß (13.12 ft)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Zimmermaße und Deckenhöhen in Fuß verständlich erklärt.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ratgeber Lesen &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (deLen.includes('<article class="content-section" style="margin-top:2.5rem;">')) {
    deLen = deLen.replace('<article class="content-section" style="margin-top:2.5rem;">', deLenGrid + '\n      <article class="content-section" style="margin-top:2.5rem;">');
  }
  fs.writeFileSync('de/length.html', deLen, 'utf8');
  console.log('Updated German tools');
}

// --- PORTUGUESE (PT) ---
function updatePortuguese() {
  // pt/currency.html
  let ptCurr = fs.readFileSync('pt/currency.html', 'utf8');
  const ptCurrGrid = `
      <!-- Guias de Conversão de Moedas Populares (Internal Links) -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(16, 185, 129, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guias Populares de Câmbio de Moedas
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Taxas Comerciais e Tarifas</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Aprenda a converter valores internacionais evitando spreads e taxas abusivas de cartão:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/pt/blog/32-usd-para-gbp" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">32 USD para GBP (£24.18 - £25.00)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Cotação em tempo real, taxas de cartão e conversões PayPal.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>

          <a href="/pt/blog/100-usd-para-aud" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">100 USD para AUD (A$152.50)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Dólar americano para dólar australiano com dicas de caixas automáticos.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (ptCurr.includes('<!-- Popular Quick Conversion Presets -->')) {
    ptCurr = ptCurr.replace('<!-- Popular Quick Conversion Presets -->', ptCurrGrid + '\n      <!-- Popular Quick Conversion Presets -->');
  } else if (ptCurr.includes('<section class="content-section" style="margin-top:2rem;">')) {
    ptCurr = ptCurr.replace('<section class="content-section" style="margin-top:2rem;">', ptCurrGrid + '\n      <section class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('pt/currency.html', ptCurr, 'utf8');

  // pt/temperature.html
  let ptTemp = fs.readFileSync('pt/temperature.html', 'utf8');
  const ptTempGrid = `
      <!-- Guias de Temperatura em Destaque -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(245, 158, 11, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guias Populares de Temperatura e Pressão
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Fórmulas e Tabelas</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Cálculos passo a passo, atalhos de cálculo mental e referências de clima:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/pt/blog/50-fahrenheit-para-celsius" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">50°F para Celsius (Exato 10°C)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Fórmula exata de conversão, cálculo mental rápido e o que vestir.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>

          <a href="/pt/blog/1-bar-para-psi" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">1 Bar para PSI (14.5038 PSI)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Pressão de pneus, calibração industrial e tabela de valores.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (ptTemp.includes('<article class="content-section" style="margin-top:2rem;">')) {
    ptTemp = ptTemp.replace('<article class="content-section" style="margin-top:2rem;">', ptTempGrid + '\n    <article class="content-section" style="margin-top:2rem;">');
  }
  fs.writeFileSync('pt/temperature.html', ptTemp, 'utf8');

  // pt/weight-mass.html
  let ptWeight = fs.readFileSync('pt/weight-mass.html', 'utf8');
  const ptWeightGrid = `
      <!-- Guias de Peso em Destaque -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(59, 130, 246, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guias Populares de Peso Corporal e Balança
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Quilos / Libras / Stone</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Tabelas diretas de equivalência de massa corporal para saúde e treino:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/pt/blog/180-libras-em-stone" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">180 Libras em Stone (12 st 12 lb)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Conversão exata para 81.65 kg, sistema britânico stone e tabelas IMC.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>

          <a href="/pt/blog/65-kg-em-libras" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">65 kg em Libras (143.3 lbs)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Fórmula de conversão de quilos para libras e faixas de peso corporal.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (ptWeight.includes('<article class="content-section">')) {
    ptWeight = ptWeight.replace('<article class="content-section">', ptWeightGrid + '\n      <article class="content-section">');
  }
  fs.writeFileSync('pt/weight-mass.html', ptWeight, 'utf8');

  // pt/length.html
  let ptLen = fs.readFileSync('pt/length.html', 'utf8');
  const ptLenGrid = `
      <!-- Guias de Comprimento em Destaque -->
      <section class="content-section" style="margin-top:2rem; background:linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(20, 184, 166, 0.04)); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          <h2 style="font-size:1.3rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <span>🔥</span> Guias Populares de Metros e Pés
          </h2>
          <span style="font-size:0.8rem; background:var(--bg-elevated); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid var(--card-border); font-weight:600; color:var(--primary-600);">Metros / Pés / Polegadas</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Exemplos práticos para arquitetura, construção e medidas de terrenos:</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:0.85rem;">
          <a href="/pt/blog/15-metros-para-pes" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">15 Metros para Pés (49.21 pés)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Proporção exata de metros para pés e cálculo rápido.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>

          <a href="/pt/blog/4-metros-para-pes" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); text-decoration:none; color:var(--text-main); transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.borderColor='var(--primary-600)'" onmouseout="this.style.borderColor='var(--card-border)'">
            <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:0.25rem;">4 Metros para Pés (13.12 pés)</div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Dimensões de quartos e pé-direito residencial explicadas.</div>
            <span style="display:inline-block; margin-top:0.5rem; font-size:0.8rem; font-weight:700; color:var(--primary-600);">Ler Guia Completo &rarr;</span>
          </a>
        </div>
      </section>
`;
  if (ptLen.includes('<article class="content-section" style="margin-top:2.5rem;">')) {
    ptLen = ptLen.replace('<article class="content-section" style="margin-top:2.5rem;">', ptLenGrid + '\n      <article class="content-section" style="margin-top:2.5rem;">');
  }
  fs.writeFileSync('pt/length.html', ptLen, 'utf8');
  console.log('Updated Portuguese tools');
}

updateSpanish();
updateGerman();
updatePortuguese();
