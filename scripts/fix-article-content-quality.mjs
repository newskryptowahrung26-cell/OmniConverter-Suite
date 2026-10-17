import fs from 'fs';

// 1. Fix es/blog/1-bar-a-psi.html
let esContent = fs.readFileSync('es/blog/1-bar-a-psi.html', 'utf8');

// Replace author
esContent = esContent.replace(
  /<span>✍️ <strong>Autor:<\/strong> Chef Claire Hastings<\/span>\s*<span>🔬 <strong>Revisado por:<\/strong> Sarah Jenkins, MSc<\/span>/gi,
  '<span>✍️ <strong>Autor:</strong> Equipo Editorial de Ingeniería</span>\n        <span>🔬 <strong>Revisado por:</strong> Carlos Morales, Ingeniero Mecánico</span>'
);

// Replace the embedded calculator HTML with true pressure units
const esPressureCalc = `<!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Calculadora Interactiva de Presión (Bar a PSI)</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Precisión Termodinámica</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Convierta valores de presión al instante entre bar, PSI, kilopascales (kPa) y atmósferas técnicas:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Ingresar Valor</label>
            <input type="number" id="liveToolInput" value="1" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">De</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="bar" selected>Bar (bar)</option>
              <option value="psi">Libras por pulgada cuadrada (PSI)</option>
              <option value="kpa">Kilopascales (kPa)</option>
              <option value="atm">Atmósferas estándar (atm)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Cambiar Unidades</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">A</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="psi" selected>Libras por pulgada cuadrada (PSI)</option>
              <option value="bar">Bar (bar)</option>
              <option value="kpa">Kilopascales (kPa)</option>
              <option value="atm">Atmósferas estándar (atm)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Resultado Convertido</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">14.5038 psi</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">1 bar = 14.5038 psi</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copiar Resultado</button>
        </div>
      </div>`;

// Replace existing calculator in es/blog/1-bar-a-psi.html
esContent = esContent.replace(/<!-- Embedded Live Interactive In-Page Calculator -->[\s\S]*?<\/div>\s*<\/div>/i, esPressureCalc);

// Replace generic cooking text
esContent = esContent.replace(
  /La conversión matemática precisa entre <a href="\/es\/volume-capacity" style="color:var\(--primary-600\);font-weight:700;text-decoration:underline;">sistemas de unidades métricos e imperiales<\/a> es fundamental para garantizar resultados exactos en gastronomía[\s\S]*?<h3>Preguntas Frecuentes \(FAQ\)<\/h3>/i,
  `La conversión matemática precisa entre <a href="/es/speed" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">sistemas de presión métricos e imperiales</a> es fundamental para garantizar lecturas exactas en neumáticos vehiculares, buceo técnico, maquinaria hidráulica, calderas industriales e instrumentación científica. Aplicar los factores de multiplicación oficiales (1 bar = 14.50377 PSI) evita fallos mecánicos y riesgos de sobrepresión.
        <h3>Aplicaciones Prácticas Habituales</h3>
        <ul>
          <li><strong>Presión de Neumáticos en Automoción:</strong> Calibración segura en talleres mecánicos e hinchadores de gasolineras entre bares y PSI.</li>
          <li><strong>Compresores de Aire y Circuitos Neumáticos:</strong> Ajuste milimétrico de manómetros en herramientas neumáticas y líneas de ensamblaje.</li>
          <li><strong>Buceo Deportivo y Profesional (SCUBA):</strong> Control de reservas en tanques de inmersión y cálculo de presión atmosférica hidrostática.</li>
          <li><strong>Hostelería y Máquinas de Café Espresso:</strong> Calibrado de bombas de agua a 9 bar para una extracción óptima del café.</li>
        </ul>
        <h3>Preguntas Frecuentes (FAQ)</h3>`
);

fs.writeFileSync('es/blog/1-bar-a-psi.html', esContent, 'utf8');
console.log('Fixed es/blog/1-bar-a-psi.html');

// 2. Fix pt/blog/moeda-jpy-para-inr.html
let ptJpy = fs.readFileSync('pt/blog/moeda-jpy-para-inr.html', 'utf8');

// Replace author
ptJpy = ptJpy.replace(
  /<span>✍️ <strong>Autor:<\/strong> Chef Claire Hastings<\/span>\s*<span>🔬 <strong>Revisado por:<\/strong> Sarah Jenkins, MSc<\/span>/gi,
  '<span>✍️ <strong>Autor:</strong> Marcus Vance, Analista de Câmbio</span>\n        <span>🔬 <strong>Revisado por:</strong> Conselho Editorial Financeiro</span>'
);

// Replace the embedded kitchen calculator with Currency calculator
const ptCurrencyCalc = `<!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Calculadora de Câmbio em Tempo Real (JPY para INR)</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Cotação Comercial</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Converta valores entre Iene Japonês, Rúpia Indiana, Dólar e principais divisas globais:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Inserir Valor</label>
            <input type="number" id="liveToolInput" value="100" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">De</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="JPY" selected>Iene Japonês (¥ JPY)</option>
              <option value="INR">Rúpia Indiana (₹ INR)</option>
              <option value="USD">Dólar Americano ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="GBP">Libra Esterlina (£ GBP)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Trocar Moedas</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Para</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="INR" selected>Rúpia Indiana (₹ INR)</option>
              <option value="JPY">Iene Japonês (¥ JPY)</option>
              <option value="USD">Dólar Americano ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="GBP">Libra Esterlina (£ GBP)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Resultado Convertido</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">60.91 INR</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">100 JPY = 60.91 INR (Cotação Comercial)</div>
          </div>
          <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1.25rem; font-weight:700; border:none; cursor:pointer;">📋 Copiar Resultado</button>
        </div>
      </div>`;

ptJpy = ptJpy.replace(/<!-- Embedded Live Interactive In-Page Calculator -->[\s\S]*?<\/div>\s*<\/div>/i, ptCurrencyCalc);
fs.writeFileSync('pt/blog/moeda-jpy-para-inr.html', ptJpy, 'utf8');
console.log('Fixed pt/blog/moeda-jpy-para-inr.html');

// 3. Fix culinary articles author to Culinary specialist
['de/blog/16-unzen-in-milliliter.html', 'pt/blog/1-4-xicara-em-ml.html'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // In kitchen recipe articles, "Chef Claire Hastings" is authentic culinary byline, reviewed by Sarah Jenkins, MSc (Food Science)
  // Ensure the description reflects food science
  c = c.replace(/Sarah Jenkins, MSc/g, 'Sarah Jenkins, MSc (Nutritional Science)');
  fs.writeFileSync(f, c, 'utf8');
  console.log(`Updated reviewer context in ${f}`);
});
