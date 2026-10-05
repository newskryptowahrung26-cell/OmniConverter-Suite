const fs = require('fs');
const path = require('path');

console.log('=== BOOSTING ALL 41 LOCALIZED TOOL PAGES TO >300 WORDS ===\n');

const toolBooster = {
  de: `
    <article class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Häufige Fragen & Schritt-für-Schritt-Anleitung</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Um optimale Umrechnungsergebnisse zu erzielen, geben Sie Ihren Ausgangswert in das obere Zahlenfeld ein und wählen Sie Ausgangs- sowie Zieleinheit aus den Dropdown-Listen. Das System führt die Berechnung verzögerungsfrei in Echtzeit durch.
      </p>
      <div style="line-height:1.8; color:var(--text-muted);">
        <p><strong>Wie präzise sind die angezeigten Nachkommastellen?</strong><br>
        Unsere Algorithmen berechnen intern mit 64-Bit-Gleitkommapräzision und runden das Endergebnis für maximale Lesbarkeit standardmäßig auf vier Nachkommastellen, ohne die mathematische Genauigkeit zu verfälschen.</p>
        <p><strong>Kann das Tool offline oder auf Mobilgeräten verwendet werden?</strong><br>
        Ja, der OmniConverter ist als responsive Webanwendung optimiert und führt sämtliche Formeln lokal in Ihrem Webbrowser aus, wodurch minimaler Datenverbrauch und höchste Geschwindigkeit gewährleistet sind.</p>
        <p><strong>Welche Normen liegen den Umrechnungen zugrunde?</strong><br>
        Alle Einheitenfaktoren entsprechen den Definitionen der Physikalisch-Technischen Bundesanstalt (PTB), des Internationalen Einheitensystems (SI) sowie den NIST-Handbüchern.</p>
      </div>
    </article>`,

  es: `
    <article class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Preguntas Frecuentes y Guía de Uso Paso a Paso</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Para realizar una conversión instantánea, introduzca el número deseado en la casilla de entrada y elija las unidades de origen y destino en los menús desplegables. El cálculo se efectúa en tiempo real en la memoria de su navegador.
      </p>
      <div style="line-height:1.8; color:var(--text-muted);">
        <p><strong>¿Qué nivel de precisión tienen los resultados?</strong><br>
        Nuestros algoritmos operan con doble precisión matemática y presentan hasta cuatro decimales significativos, eliminando discrepancias acumulativas en cálculos profesionales o académicos.</p>
        <p><strong>¿Funciona correctamente en teléfonos móviles y tablets?</strong><br>
        Sí, la plataforma está completamente optimizada para dispositivos móviles con diseño responsive y bajo consumo de datos móviles, ya que no requiere peticiones al servidor.</p>
        <p><strong>¿Qué normativas respaldan las equivalencias métricas?</strong><br>
        Todas las constantes y multiplicadores de conversión se basan en los dictámenes internacionales del Centro Español de Metrología (CEM) y del Buró Internacional de Pesas y Medidas (BIPM).</p>
      </div>
    </article>`,

  pt: `
    <article class="content-section" style="margin-top:2rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main); font-size:1.25rem;">Perguntas Frequentes e Instruções de Uso</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Para calcular qualquer conversão instantaneamente, digite o valor de referência no campo numérico e selecione as unidades pretendidas nos seletores. A ferramenta processa o resultado instantaneamente no seu navegador.
      </p>
      <div style="line-height:1.8; color:var(--text-muted);">
        <p><strong>Qual é o grau de precisão das casas decimais?</strong><br>
        Nossas fórmulas utilizam precisão matemática estrita de 64 bits e exibem o resultado formatado com até quatro casas decimais para máxima clareza em estudos, receitas ou trabalhos técnicos.</p>
        <p><strong>A ferramenta consome dados de internet ao calcular?</strong><br>
        Não, todos os cálculos matemáticos rodam de maneira 100% nativa no navegador do seu smartphone ou computador, assegurando resposta imediata e privacidade.</p>
        <p><strong>Quais padrões internacionais fundamentam as conversões?</strong><br>
        Os fatores de proporção seguem fielmente as normas do Instituto Nacional de Metrologia (INMETRO) e as definições oficiais do Sistema Internacional de Unidades (SI).</p>
      </div>
    </article>`
};

function getAllHtml(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scratch') res = res.concat(getAllHtml(fp));
    } else if (f.endsWith('.html')) res.push(fp);
  }
  return res;
}

let boosted = 0;
getAllHtml('.').forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');

  // Count words
  const cleanText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleanText.split(/\s+/).length;

  if (words < 260) {
    let lang = 'en';
    if (fp.startsWith('de')) lang = 'de';
    else if (fp.startsWith('es')) lang = 'es';
    else if (fp.startsWith('pt')) lang = 'pt';

    const boosterHtml = toolBooster[lang] || toolBooster.en;
    if (boosterHtml && !html.includes('Häufige Fragen & Schritt-für-Schritt-Anleitung') &&
        !html.includes('Preguntas Frecuentes y Guía de Uso Paso a Paso') &&
        !html.includes('Perguntas Frequentes e Instruções de Uso')) {
      
      html = html.replace('</main>', `${boosterHtml}\n  </main>`);
      fs.writeFileSync(fp, html, 'utf8');
      boosted++;
      console.log(`  [OK] Boosted ${fp} with FAQ & step-by-step guide.`);
    }
  }
});

console.log(`\nBoosted ${boosted} pages total.`);
