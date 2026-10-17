const fs = require('fs');

function insertBeforeFirstArticle(filePath, htmlToInsert) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<article class="content-section"')) {
    content = content.replace('<article class="content-section"', htmlToInsert + '\n    <article class="content-section"');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully inserted into:', filePath);
  } else {
    console.log('Target not found in:', filePath);
  }
}

// ES
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

insertBeforeFirstArticle('es/temperature.html', esTempGrid);
insertBeforeFirstArticle('es/weight-mass.html', esWeightGrid);
insertBeforeFirstArticle('es/length.html', esLenGrid);

// DE
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

insertBeforeFirstArticle('de/temperature.html', deTempGrid);
insertBeforeFirstArticle('de/weight-mass.html', deWeightGrid);
insertBeforeFirstArticle('de/length.html', deLenGrid);

// PT
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

insertBeforeFirstArticle('pt/temperature.html', ptTempGrid);
insertBeforeFirstArticle('pt/weight-mass.html', ptWeightGrid);
insertBeforeFirstArticle('pt/length.html', ptLenGrid);
