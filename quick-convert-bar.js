// Quick-Bar & Interactive Real-World Fact Cards Engine
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initRealWorldFactCard();
    initMobileQuickConvertBar();
  });

  // 1. Interactive "Did You Know?" Fact Card
  function initRealWorldFactCard() {
    // Look for in-page calculator result container
    const liveResult = document.getElementById('liveToolResultVal') || document.getElementById('liveResultVal') || document.getElementById('resultValue');
    const inputVal = document.getElementById('liveToolInput') || document.getElementById('liveTempInput') || document.getElementById('tempInput') || document.getElementById('weightInput') || document.getElementById('currencyInput');
    const fromUnit = document.getElementById('liveToolFromUnit') || document.getElementById('liveFromUnit') || document.getElementById('fromSelect') || document.getElementById('weightFromSelect') || document.getElementById('currencyFromSelect');
    const toUnit = document.getElementById('liveToolToUnit') || document.getElementById('liveToUnit') || document.getElementById('toSelect') || document.getElementById('weightToSelect') || document.getElementById('currencyToSelect');

    if (!liveResult) return;

    // Determine Language
    const path = window.location.pathname;
    const lang = path.startsWith('/es/') ? 'es' : (path.startsWith('/de/') ? 'de' : (path.startsWith('/pt/') ? 'pt' : 'en'));

    // Check if card container already exists
    let factBox = document.getElementById('omniconverter-fact-card');
    if (!factBox) {
      factBox = document.createElement('div');
      factBox.id = 'omniconverter-fact-card';
      factBox.style.cssText = `
        margin-top: 1rem;
        padding: 0.85rem 1.15rem;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05));
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-left: 4px solid #6366f1;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.88rem;
        color: var(--text-main, #1e293b);
        transition: all 0.2s ease;
      `;

      // Insert right after the calculator result box
      const parentContainer = liveResult.closest('div[style*="background:var(--bg-surface)"]') || liveResult.parentElement;
      if (parentContainer && parentContainer.parentNode) {
        parentContainer.parentNode.insertBefore(factBox, parentContainer.nextSibling);
      }
    }

    function updateFact() {
      if (!factBox) return;
      const num = parseFloat(inputVal ? inputVal.value : 50) || 50;
      const from = (fromUnit ? fromUnit.value : '').toUpperCase();
      const to = (toUnit ? toUnit.value : '').toUpperCase();

      let factText = '';
      let emoji = '💡';

      // Temperature Logic
      if (from === 'F' || from === 'C' || from === 'K' || path.includes('fahrenheit') || path.includes('celsius')) {
        let tempC = (from === 'F') ? (num - 32) * (5 / 9) : (from === 'K' ? num - 273.15 : num);
        emoji = '🌡️';

        if (lang === 'es') {
          if (tempC <= 0) factText = `A ${tempC.toFixed(1)}°C el agua pura se congela. Los pingüinos emperador prosperan a estas temperaturas.`;
          else if (tempC > 0 && tempC <= 12) factText = `A ${tempC.toFixed(1)}°C el ambiente es fresco. Es la temperatura ideal de guarda de bodegas de vino (10–12°C).`;
          else if (tempC > 12 && tempC <= 23) factText = `A ${tempC.toFixed(1)}°C estás en temperatura ambiente confortable para trabajar o estudiar sin calefacción.`;
          else if (tempC > 23 && tempC <= 38) factText = `A ${tempC.toFixed(1)}°C el clima es cálido de verano; cerca de 37°C está la temperatura corporal humana normal.`;
          else factText = `A ${tempC.toFixed(1)}°C el calor es intenso o de cocción culinaria. El café de filtro suele prepararse a 90–96°C.`;
        } else if (lang === 'de') {
          if (tempC <= 0) factText = `Bei ${tempC.toFixed(1)}°C friert reines Wasser zu Eis. Ideale Winterbedingungen für Schnee.`;
          else if (tempC > 0 && tempC <= 12) factText = `Bei ${tempC.toFixed(1)}°C ist es frisch. Dies ist die klassische Weinkeller- und Herbst-Temperatur.`;
          else if (tempC > 12 && tempC <= 23) factText = `Bei ${tempC.toFixed(1)}°C herrscht angenehme Zimmertemperatur zum Wohnen und Arbeiten.`;
          else if (tempC > 23 && tempC <= 38) factText = `Bei ${tempC.toFixed(1)}°C haben Sie warmes Sommerwetter. 37°C ist die normale menschliche Körperkerntemperatur.`;
          else factText = `Bei ${tempC.toFixed(1)}°C erreichen Sie Backofen- oder Kochtemperaturen.`;
        } else if (lang === 'pt') {
          if (tempC <= 0) factText = `A ${tempC.toFixed(1)}°C a água congela. Perfeito para conservação em congeladores.`;
          else if (tempC > 0 && tempC <= 12) factText = `A ${tempC.toFixed(1)}°C o clima é fresco/frio, típico de adegas de vinho europeias (10–12°C).`;
          else if (tempC > 12 && tempC <= 23) factText = `A ${tempC.toFixed(1)}°C é a temperatura ambiente agradável e padrão para residências.`;
          else if (tempC > 23 && tempC <= 38) factText = `A ${tempC.toFixed(1)}°C o dia é quente e ensolarado; 37°C é a média do corpo humano saudável.`;
          else factText = `A ${tempC.toFixed(1)}°C temos temperaturas elevadas culinárias ou industriais.`;
        } else {
          // English Default
          if (tempC <= 0) factText = `At ${tempC.toFixed(1)}°C (32°F or below), water freezes solid into ice. Emperor penguins routinely forage in these conditions.`;
          else if (tempC > 0 && tempC <= 12) factText = `At ${tempC.toFixed(1)}°C (~50°F), the air is brisk and crisp. It matches the traditional underground wine cellar temperature!`;
          else if (tempC > 12 && tempC <= 23) factText = `At ${tempC.toFixed(1)}°C (55–73°F), you are in optimal indoor living and office thermostat comfort range.`;
          else if (tempC > 23 && tempC <= 38) factText = `At ${tempC.toFixed(1)}°C (75–100°F), it feels like a warm beach day. 37°C (98.6°F) is normal human body core temperature.`;
          else factText = `At ${tempC.toFixed(1)}°C, thermal energy is high. Specialty filter coffee brews best at 91–96°C (195–205°F).`;
        }
      }
      // Weight / Stone Logic
      else if (from === 'LB' || from === 'KG' || from === 'ST' || path.includes('stone') || path.includes('pound') || path.includes('kg')) {
        let weightKg = (from === 'LB') ? num * 0.453592 : (from === 'ST' ? num * 6.35029 : num);
        emoji = '⚖️';

        if (lang === 'es') {
          factText = `${num} ${from || 'lbs'} equivale a ~${weightKg.toFixed(1)} kg. Para ponerlo en contexto, ${Math.round(weightKg)} kg es aproximadamente el peso de ${Math.round(weightKg / 5)} balones de fútbol reglamentarios.`;
        } else if (lang === 'de') {
          factText = `${num} ${from || 'lbs'} entspricht rund ${weightKg.toFixed(1)} kg. Das entspricht etwa dem Gewicht von ${Math.round(weightKg / 16)} Bowlingkugeln.`;
        } else if (lang === 'pt') {
          factText = `${num} ${from || 'lbs'} equivale a cerca de ${weightKg.toFixed(1)} kg. Um adulto com esse peso mantém uma faixa de massa corporal amplamente utilizada em tabelas clínicas.`;
        } else {
          factText = `${num} ${from || 'lbs'} is ~${weightKg.toFixed(1)} kg. Fun benchmark: this is roughly equivalent to the weight of ${(weightKg / 5.4).toFixed(1)} standard bowling balls or an adult kangaroo!`;
        }
      }
      // Currency Logic
      else if (from === 'USD' || from === 'GBP' || from === 'EUR' || from === 'AUD' || path.includes('usd') || path.includes('gbp')) {
        emoji = '💰';
        if (lang === 'es') {
          factText = `Consejo Inteligente: Al pagar con tarjeta en el extranjero, selecciona siempre cobrar en moneda local para evitar recargos bancarios del 3% al 6%.`;
        } else if (lang === 'de') {
          factText = `Clever sparen: Wählen Sie beim Bezahlen im Ausland immer die lokale Landeswährung, um teure Umrechnungsgebühren (DCC) zu vermeiden.`;
        } else if (lang === 'pt') {
          factText = `Dica Financeira: Pague sempre na moeda local no exterior para evitar a taxa abusiva de 4% a 7% da Conversão Dinâmica (DCC).`;
        } else {
          factText = `Travel Pro-Tip: When paying abroad, always decline the ATM / terminal currency conversion and choose local billing to save 3% to 6% in markups!`;
        }
      } else {
        emoji = '⚡';
        factText = (lang === 'es') 
          ? 'OmniConverter calcula cada resultado con multiplicadores certificados de alta precisión sin redondeos destructivos.'
          : 'OmniConverter computes this result with certified high-precision floating ratios for zero rounding error.';
      }

      factBox.innerHTML = `
        <span style="font-size: 1.35rem; flex-shrink: 0;">${emoji}</span>
        <div style="line-height: 1.45;">
          <strong>${lang === 'es' ? '¿Sabías que?' : (lang === 'de' ? 'Wussten Sie schon?' : (lang === 'pt' ? 'Você sabia?' : 'Fast Benchmark Fact:'))}</strong>
          <span style="display: inline-block; margin-left: 4px; color: var(--text-muted, #475569);">${factText}</span>
        </div>
      `;
    }

    if (inputVal) inputVal.addEventListener('input', updateFact);
    if (fromUnit) fromUnit.addEventListener('change', updateFact);
    if (toUnit) toUnit.addEventListener('change', updateFact);

    // Initial render
    updateFact();
  }

  // 2. Mobile Sticky Quick-Convert Bar (appears on scroll)
  function initMobileQuickConvertBar() {
    const liveResult = document.getElementById('liveToolResultVal') || document.getElementById('liveResultVal') || document.getElementById('resultValue');
    const inputVal = document.getElementById('liveToolInput') || document.getElementById('liveTempInput') || document.getElementById('tempInput') || document.getElementById('weightInput') || document.getElementById('currencyInput');
    const fromUnit = document.getElementById('liveToolFromUnit') || document.getElementById('liveFromUnit') || document.getElementById('fromSelect') || document.getElementById('weightFromSelect') || document.getElementById('currencyFromSelect');
    const toUnit = document.getElementById('liveToolToUnit') || document.getElementById('liveToUnit') || document.getElementById('toSelect') || document.getElementById('weightToSelect') || document.getElementById('currencyToSelect');

    if (!liveResult) return;

    const path = window.location.pathname;
    const isSpanish = path.startsWith('/es/');
    const isGerman = path.startsWith('/de/');
    const isPortuguese = path.startsWith('/pt/');

    let btnText = 'Convert ⇅';
    if (isSpanish) btnText = 'Cambiar ⇅';
    else if (isGerman) btnText = 'Umrechnen ⇅';
    else if (isPortuguese) btnText = 'Converter ⇅';

    const bar = document.createElement('div');
    bar.id = 'mobile-sticky-quick-bar';
    bar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: #ffffff;
      border-top: 2px solid #4f46e5;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      z-index: 99990;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
      transform: translateY(110%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    bar.innerHTML = `
      <div style="display: flex; align-items: baseline; gap: 8px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span id="quickBarFrom" style="font-size: 0.95rem; color: #94a3b8; font-weight: 600;">50°F =</span>
        <span id="quickBarTo" style="font-size: 1.15rem; font-weight: 800; color: #38bdf8;">10.00 °C</span>
      </div>
      <button id="quickBarScrollBtn" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff; border: none; padding: 7px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 8px rgba(79,70,229,0.4);">
        ${btnText}
      </button>
    `;

    document.body.appendChild(bar);

    function syncQuickBar() {
      const qFrom = document.getElementById('quickBarFrom');
      const qTo = document.getElementById('quickBarTo');
      if (!qFrom || !qTo) return;

      const num = inputVal ? inputVal.value : '';
      const uFrom = fromUnit ? fromUnit.value : '';
      const resText = liveResult ? liveResult.textContent.trim() : '';

      qFrom.textContent = `${num} ${uFrom} =`;
      qTo.textContent = resText;
    }

    if (inputVal) inputVal.addEventListener('input', syncQuickBar);
    if (fromUnit) fromUnit.addEventListener('change', syncQuickBar);
    if (toUnit) toUnit.addEventListener('change', syncQuickBar);

    // Initial sync
    syncQuickBar();

    // Scroll trigger: show when scrolled past the calculator
    let isBarVisible = false;
    window.addEventListener('scroll', () => {
      const calcRect = liveResult.getBoundingClientRect();
      // If calculator top is above the viewport by 150px
      if (calcRect.bottom < 50 && window.scrollY > 400) {
        if (!isBarVisible) {
          syncQuickBar();
          bar.style.transform = 'translateY(0)';
          isBarVisible = true;
        }
      } else {
        if (isBarVisible) {
          bar.style.transform = 'translateY(110%)';
          isBarVisible = false;
        }
      }
    }, { passive: true });

    document.getElementById('quickBarScrollBtn').addEventListener('click', () => {
      const target = inputVal || liveResult;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (inputVal) {
          setTimeout(() => inputVal.focus(), 400);
        }
      }
    });
  }
})();
