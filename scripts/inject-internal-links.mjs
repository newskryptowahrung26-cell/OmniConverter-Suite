import fs from 'fs';

console.log('--- Adding High-Priority Contextual Internal Links to Target Articles ---');

// 1. Link /blog/convert-pdf-form inside file-media.html
let enFileMedia = fs.readFileSync('file-media.html', 'utf8');
if (!enFileMedia.includes('/blog/convert-pdf-form')) {
  const guideBox = `
    <!-- Featured Document Conversion Guides -->
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Featured Document Workflow & Conversion Guides</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Learn how to digitize, convert, and manage interactive digital document formats:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/blog/convert-pdf-form" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">📄 Convert PDF Form Guide</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Step-by-step tutorial on turning static and scanned PDF forms into interactive fillable assets.</div>
        </a>
      </div>
    </section>
  `;
  enFileMedia = enFileMedia.replace('</article>', `</article>\n${guideBox}`);
  fs.writeFileSync('file-media.html', enFileMedia, 'utf8');
  console.log('[LINKED] Added /blog/convert-pdf-form link to file-media.html');
}

// 2. Link /es/blog/convertir-formulario-pdf inside es/file-media.html
let esFileMedia = fs.readFileSync('es/file-media.html', 'utf8');
if (!esFileMedia.includes('/es/blog/convertir-formulario-pdf')) {
  const esGuideBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Guías Destacadas de Conversión de Documentos</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Aprenda a digitalizar y convertir formatos de formularios y documentos:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/es/blog/convertir-formulario-pdf" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">📄 Guía: Convertir Formulario PDF</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Cómo transformar formularios PDF estáticos en documentos rellenables e interactivos.</div>
        </a>
      </div>
    </section>
  `;
  esFileMedia = esFileMedia.replace('</article>', `</article>\n${esGuideBox}`);
  fs.writeFileSync('es/file-media.html', esFileMedia, 'utf8');
  console.log('[LINKED] Added /es/blog/convertir-formulario-pdf link to es/file-media.html');
}

// 3. Link /pt/blog/converter-tipo-de-arquivo-para-pdf inside pt/file-media.html
let ptFileMedia = fs.readFileSync('pt/file-media.html', 'utf8');
if (!ptFileMedia.includes('/pt/blog/converter-tipo-de-arquivo-para-pdf')) {
  const ptGuideBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Guias de Conversão de Documentos e Arquivos</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Tutoriais práticos para digitalização e conversão de arquivos de dados:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/pt/blog/converter-tipo-de-arquivo-para-pdf" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">📄 Converter Tipo de Arquivo para PDF</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Instruções completas para converter documentos de dados e formulários para o formato PDF.</div>
        </a>
      </div>
    </section>
  `;
  ptFileMedia = ptFileMedia.replace('</article>', `</article>\n${ptGuideBox}`);
  fs.writeFileSync('pt/file-media.html', ptFileMedia, 'utf8');
  console.log('[LINKED] Added /pt/blog/converter-tipo-de-arquivo-para-pdf link to pt/file-media.html');
}

// 4. Link /blog/1-guntha-in-sq-ft inside area.html
let enArea = fs.readFileSync('area.html', 'utf8');
if (!enArea.includes('/blog/1-guntha-in-sq-ft')) {
  const areaGuideBox = `
    <!-- Regional Land Measurement Guides -->
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Popular Land & Regional Area Measurement Guides</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Detailed area conversion walkthroughs for residential plots and agricultural land:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        <a href="/blog/1-guntha-in-sq-ft" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">🌾 1 Guntha in Sq Ft</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Official measurement benchmark (1,089 sq ft) for plots in Maharashtra, Karnataka, and Gujarat.</div>
        </a>
        <a href="/blog/1-bigha-in-square-feet" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">📐 1 Bigha in Square Feet</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">State-wise benchmarks for UP, Bihar, Punjab, and Rajasthan.</div>
        </a>
      </div>
    </section>
  `;
  enArea = enArea.replace('</article>', `</article>\n${areaGuideBox}`);
  fs.writeFileSync('area.html', enArea, 'utf8');
  console.log('[LINKED] Added /blog/1-guntha-in-sq-ft link to area.html');
}

// 5. Link /es/blog/1-bar-a-psi inside es/speed.html (or core tool)
let esSpeed = fs.readFileSync('es/speed.html', 'utf8');
if (!esSpeed.includes('/es/blog/1-bar-a-psi')) {
  const esPressureBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Guías Técnicas de Ingeniería y Presión</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Equivalencias certificadas para calibración mecánica y automotriz:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/es/blog/1-bar-a-psi" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">⚙️ 1 Bar a PSI: Conversión de Presión</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Fórmulas matemáticas para inflado de neumáticos, manómetros y circuitos hidráulicos (14.5038 PSI).</div>
        </a>
      </div>
    </section>
  `;
  esSpeed = esSpeed.replace('</article>', `</article>\n${esPressureBox}`);
  fs.writeFileSync('es/speed.html', esSpeed, 'utf8');
  console.log('[LINKED] Added /es/blog/1-bar-a-psi link to es/speed.html');
}

// 6. Link /de/blog/16-unzen-in-milliliter inside de/volume-capacity.html
let deVol = fs.readFileSync('de/volume-capacity.html', 'utf8');
if (!deVol.includes('/de/blog/16-unzen-in-milliliter')) {
  const deVolBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Beliebte Volumen- & Küchenratgeber</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Genaue Umrechnungstabellen für Rezepte und Flüssigkeitsmaße:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/de/blog/16-unzen-in-milliliter" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">🥛 16 Unzen in Milliliter (fl oz in ml)</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Exakte Formel (473,18 ml = 2 US-Tassen) für internationale Back- und Kochanleitungen.</div>
        </a>
      </div>
    </section>
  `;
  deVol = deVol.replace('</article>', `</article>\n${deVolBox}`);
  fs.writeFileSync('de/volume-capacity.html', deVol, 'utf8');
  console.log('[LINKED] Added /de/blog/16-unzen-in-milliliter link to de/volume-capacity.html');
}

// 7. Link /de/blog/300-dollar-in-gbp inside de/currency.html
let deCurr = fs.readFileSync('de/currency.html', 'utf8');
if (!deCurr.includes('/de/blog/300-dollar-in-gbp')) {
  const deCurrBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Beliebte Währungsumrechnungen & Praxis-Ratgeber</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Währungstabellen, Wechselkursberechnungen und Spartipps für Auslandsüberweisungen:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/de/blog/300-dollar-in-gbp" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">💱 300 US-Dollar in Britische Pfund (GBP)</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Wechselkurs-Analyse, Bankgebühren-Vergleich und Umrechnungsformeln für USD zu GBP.</div>
        </a>
      </div>
    </section>
  `;
  deCurr = deCurr.replace('</article>', `</article>\n${deCurrBox}`);
  fs.writeFileSync('de/currency.html', deCurr, 'utf8');
  console.log('[LINKED] Added /de/blog/300-dollar-in-gbp link to de/currency.html');
}

// 8. Link /pt/blog/300-dolares-em-gbp, /pt/blog/converter-lakh-para-usd, /pt/blog/moeda-jpy-para-inr inside pt/currency.html
let ptCurr = fs.readFileSync('pt/currency.html', 'utf8');
if (!ptCurr.includes('/pt/blog/300-dolares-em-gbp')) {
  const ptCurrBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Guias de Câmbio e Moedas em Destaque</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Explore artigos detalhados com fórmulas, cotações comerciais e benchmarks financeiros:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/pt/blog/300-dolares-em-gbp" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">💱 300 Dólares em Libras (GBP)</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Conversão exata de USD para GBP com análise de margem bancária.</div>
        </a>
        <a href="/pt/blog/converter-lakh-para-usd" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">🇮🇳 Converter Lakh para USD</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Como converter 100.000 rúpias indianas para dólares norte-americanos.</div>
        </a>
        <a href="/pt/blog/moeda-jpy-para-inr" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">💴 Iene Japonês para Rúpia Indiana (JPY para INR)</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Cotações de câmbio comercial entre o iene (¥) e a rúpia indiana (₹).</div>
        </a>
      </div>
    </section>
  `;
  ptCurr = ptCurr.replace('</article>', `</article>\n${ptCurrBox}`);
  fs.writeFileSync('pt/currency.html', ptCurr, 'utf8');
  console.log('[LINKED] Added currency articles links to pt/currency.html');
}

// 9. Link /pt/blog/1-4-xicara-em-ml inside pt/volume-capacity.html
let ptVol = fs.readFileSync('pt/volume-capacity.html', 'utf8');
if (!ptVol.includes('/pt/blog/1-4-xicara-em-ml')) {
  const ptVolBox = `
    <section class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Guias Culinários de Conversão de Volume</h3>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">Tabelas práticas para receitas de cozinha e dosagens precisas:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        <a href="/pt/blog/1-4-xicara-em-ml" style="display:block; padding:1rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main);">
          <div style="font-weight:700; color:var(--primary-600); margin-bottom:0.25rem;">☕ 1/4 de Xícara em Mililitros (mL)</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Medidas precisas para confeitaria e gastronomia: 1/4 cup = 59,15 ml.</div>
        </a>
      </div>
    </section>
  `;
  ptVol = ptVol.replace('</article>', `</article>\n${ptVolBox}`);
  fs.writeFileSync('pt/volume-capacity.html', ptVol, 'utf8');
  console.log('[LINKED] Added /pt/blog/1-4-xicara-em-ml link to pt/volume-capacity.html');
}
