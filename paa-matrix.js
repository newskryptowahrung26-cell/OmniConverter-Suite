// People Also Ask (PAA) Nearby Milestone Quick-Matrix Engine
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initPaaMatrix();
  });

  function initPaaMatrix() {
    // Only target blog pages with specific numerical queries
    const path = window.location.pathname;
    if (!path.includes('/blog/') && !path.includes('-to-') && !path.includes('-in-') && !path.includes('-a-') && !path.includes('-para-')) return;

    const inputVal = document.getElementById('liveToolInput') || document.getElementById('liveTempInput');
    const fromUnit = document.getElementById('liveToolFromUnit') || document.getElementById('liveFromUnit');
    const toUnit = document.getElementById('liveToolToUnit') || document.getElementById('liveToUnit');

    const num = parseFloat(inputVal ? inputVal.value : 0);
    if (isNaN(num) || num === 0) return;

    const from = fromUnit ? fromUnit.value.toUpperCase() : '';
    const to = toUnit ? toUnit.value.toUpperCase() : '';

    const lang = path.startsWith('/es/') ? 'es' : (path.startsWith('/de/') ? 'de' : (path.startsWith('/pt/') ? 'pt' : 'en'));

    let heading = 'People Also Ask: Nearby Conversion Quick-Matrix';
    let sub = 'Instant answers for related search milestones and rounding estimates:';
    let colInput = 'Input Value';
    let colOutput = 'Exact Converted Output';
    let colNote = 'Practical Benchmark Note';

    if (lang === 'es') {
      heading = 'Preguntas Relacionadas: Matriz Rápida de Conversiones Cercanas';
      sub = 'Respuestas instantáneas para búsquedas frecuentes y valores de referencia:';
      colInput = 'Valor de Entrada';
      colOutput = 'Resultado Exacto';
      colNote = 'Contexto / Referencia Práctica';
    } else if (lang === 'de') {
      heading = 'Häufig gesucht: Schnell-Vergleichstabelle für ähnliche Werte';
      sub = 'Direkte Antworten für verwandte Suchanfragen und Richtwerte:';
      colInput = 'Eingabewert';
      colOutput = 'Exakter Ausgabewert';
      colNote = 'Praktischer Richtwert';
    } else if (lang === 'pt') {
      heading = 'Pesquisas Relacionadas: Matriz Rápida de Conversões Próximas';
      sub = 'Respostas diretas para buscas frequentes e marcos práticos:';
      colInput = 'Valor de Entrada';
      colOutput = 'Resultado Exato';
      colNote = 'Contexto Prático';
    }

    let rows = [];

    // 1. Temperature Matrix
    if (from === 'F' && to === 'C') {
      const milestones = [num - 20, num - 10, num, num + 10, num + 20];
      rows = milestones.map(fVal => {
        const cVal = ((fVal - 32) * (5 / 9)).toFixed(2);
        let note = 'Moderate';
        if (fVal <= 32) note = '❄️ Freezing Ice Point (0°C)';
        else if (fVal <= 45) note = '🧥 Cold / Refrigerator Zone';
        else if (fVal <= 55) note = '🍂 Cool Autumn / Light Jacket Weather';
        else if (fVal <= 70) note = '🏡 Room Thermostat Comfort';
        else if (fVal <= 85) note = '☀️ Warm Summer Weather';
        else note = '🔥 Hot / Baking Temperature';
        return { in: `${fVal} °F`, out: `<strong>${cVal} °C</strong>`, note: note };
      });
    }
    // 2. Pounds to Stone Matrix
    else if (from === 'LB' && to === 'ST') {
      const milestones = [num - 20, num - 10, num, num + 10, num + 20];
      rows = milestones.map(lbVal => {
        const stVal = Math.floor(lbVal / 14);
        const rem = (lbVal % 14).toFixed(1);
        const kgVal = (lbVal * 0.453592).toFixed(1);
        return {
          in: `${lbVal} lbs`,
          out: `<strong>${stVal} st ${rem} lb</strong> (${(lbVal / 14).toFixed(2)} st)`,
          note: `Equivalent to ${kgVal} kg`
        };
      });
    }
    // 3. Currency USD to GBP Matrix
    else if (from === 'USD' && to === 'GBP') {
      const milestones = [num * 0.5, num, num * 1.5, num * 2, num * 5];
      rows = milestones.map(uVal => {
        const gVal = (uVal * 0.7556).toFixed(2);
        return {
          in: `$${uVal.toFixed(0)} USD`,
          out: `<strong>£${gVal} GBP</strong>`,
          note: `Live Mid-Market Exchange Standard`
        };
      });
    }

    if (rows.length === 0) return;

    const matrixSection = document.createElement('section');
    matrixSection.id = 'paa-quick-matrix-section';
    matrixSection.className = 'content-section';
    matrixSection.style.cssText = `
      margin: 2.5rem 0;
      padding: 1.5rem;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--card-border, #e2e8f0);
      border-left: 4px solid #6366f1;
      border-radius: var(--radius-xl, 16px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    `;

    matrixSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--text-main, #0f172a); display: flex; align-items: center; gap: 6px;">
          <span>🎯</span> ${heading}
        </h3>
        <span style="font-size: 0.8rem; background: rgba(99,102,241,0.1); color: #4f46e5; padding: 2px 8px; border-radius: 999px; font-weight: 700;">Google PAA Optimized</span>
      </div>
      <p style="margin: 0 0 1rem 0; font-size: 0.92rem; color: var(--text-muted, #64748b); line-height: 1.5;">${sub}</p>
      
      <div class="table-wrapper" style="margin: 0;">
        <table class="conversion-table" style="width: 100%;">
          <thead>
            <tr>
              <th style="padding: 10px 14px;">${colInput}</th>
              <th style="padding: 10px 14px;">${colOutput}</th>
              <th style="padding: 10px 14px;">${colNote}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td style="padding: 10px 14px; font-weight: 600;">${r.in}</td>
                <td style="padding: 10px 14px; color: #4f46e5;">${r.out}</td>
                <td style="padding: 10px 14px; font-size: 0.88rem; color: var(--text-muted, #64748b);">${r.note}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Insert before the last conclusion or comments section
    const article = document.querySelector('article.content-section') || document.querySelector('main');
    if (article) {
      article.appendChild(matrixSection);
    }
  }
})();
