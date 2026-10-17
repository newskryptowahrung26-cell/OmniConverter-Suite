const fs = require('fs');

const tools = {
  oven: {
    es: {
      title: '🧑‍🍳 Calculadora de Temperatura de Horno (Convencional vs Ventilador)',
      desc: 'Convierte temperaturas de recetas entre Horno Tradicional, Horno de Convección (Ventilador), Fahrenheit, Celsius y Marcas de Gas (Gas Mark).',
      badge: 'Precisión Culinaria',
      lblTemp: 'Temperatura de la Receta',
      lblScale: 'Escala',
      lblType: 'Tipo de Horno en la Receta',
      optConv: 'Horno Convencional / Eléctrico Estándar',
      optFan: 'Horno de Convección / Ventilador',
      btn: 'Calcular Ajuste Exacto del Horno',
      outConvC: 'Convencional °C',
      outFanC: 'Horno Ventilador (°C)',
      outConvF: 'Convencional °F',
      outFanF: 'Horno Ventilador (°F)',
      outGas: 'Gas Mark (Reino Unido)',
      suitedFor: '💡 <strong>Ideal para:</strong>',
      recommend: 'Bizcochos clásicos, galletas, repostería y asados estándar'
    },
    de: {
      title: '🧑‍🍳 Backofen-Umrechner (Ober-/Unterhitze vs. Umluft)',
      desc: 'Rezepttemperaturen präzise zwischen Ober-/Unterhitze, Umluft (Heißluft), Fahrenheit, Celsius und Gasherd-Stufen umrechnen.',
      badge: 'Back-Präzision',
      lblTemp: 'Rezepttemperatur',
      lblScale: 'Skala',
      lblType: 'Ofenart im Rezept',
      optConv: 'Ober-/Unterhitze (Standard)',
      optFan: 'Umluft / Heißluft',
      btn: 'Genaue Ofeneinstellung berechnen',
      outConvC: 'Ober-/Unterhitze °C',
      outFanC: 'Umluft (°C)',
      outConvF: 'Ober-/Unterhitze °F',
      outFanF: 'Umluft (°F)',
      outGas: 'Gasherd Stufe',
      suitedFor: '💡 <strong>Empfohlen für:</strong>',
      recommend: 'Rührkuchen, Kekse, Plätzchen und Standardbraten'
    },
    pt: {
      title: '🧑‍🍳 Conversor de Forno e Convecção (Tradicional vs Ar Forçado)',
      desc: 'Converta temperaturas de receitas entre Forno Convencional, Forno de Convecção (Ventilador), Fahrenheit, Celsius e Níveis de Gás.',
      badge: 'Precisão Culinária',
      lblTemp: 'Temperatura da Receita',
      lblScale: 'Escala',
      lblType: 'Tipo de Forno na Receita',
      optConv: 'Forno Convencional / Elétrico Padrão',
      optFan: 'Forno de Convecção / Ventilador',
      btn: 'Calcular Ajuste Exato do Forno',
      outConvC: 'Convencional °C',
      outFanC: 'Forno Ventilador (°C)',
      outConvF: 'Convencional °F',
      outFanF: 'Forno Ventilador (°F)',
      outGas: 'Marca de Gás (UK)',
      suitedFor: '💡 <strong>Ideal para:</strong>',
      recommend: 'Bolos tradicionais, biscoitos, tortas e assados em geral'
    }
  },
  bmi: {
    es: {
      title: '⚖️ Calculadora de Peso Corporal, Stone e IMC Saludable',
      desc: 'Calcula tu Índice de Masa Corporal (IMC), desglose exacto en piedras británicas (stone) y libras, y tu rango de peso saludable ideal.',
      badge: 'Estándar de Salud',
      lblHeight: 'Estatura',
      lblWeight: 'Peso Actual',
      btn: 'Calcular IMC y Rango Saludable',
      outBmi: 'Puntaje IMC',
      outCategory: 'Categoría de Peso',
      outStone: 'Stone y Libras (UK)',
      outRange: 'Rango Saludable Recomendado',
      guidance: '🩺 <strong>Orientación:</strong>',
      advice: 'Te encuentras en el rango de peso óptimo y saludable para tu estatura.'
    },
    de: {
      title: '⚖️ Körpergewicht, Stone & Gesunder BMI-Bereich Rechner',
      desc: 'Berechnen Sie Ihren Body-Mass-Index (BMI), exakte britische Stone- und Pfund-Aufteilung und Ihr persönliches Idealgewicht.',
      badge: 'Gesundheitsstandard',
      lblHeight: 'Körpergröße',
      lblWeight: 'Aktuelles Gewicht',
      btn: 'BMI & gesunden Gewichtsbereich berechnen',
      outBmi: 'BMI-Wert',
      outCategory: 'Gewichtskategorie',
      outStone: 'Britische Stone & Pfund',
      outRange: 'Empfohlener Normalbereich',
      guidance: '🩺 <strong>Hinweis:</strong>',
      advice: 'Sie liegen im optimalen gesunden Gewichtsbereich für Ihre Körpergröße.'
    },
    pt: {
      title: '⚖️ Calculadora de Peso Corporal, Stone e IMC Saudável',
      desc: 'Calcule seu Índice de Massa Corporal (IMC), conversão em stones britânicos e libras, e a faixa ideal de peso para sua altura.',
      badge: 'Padrão de Saúde',
      lblHeight: 'Altura',
      lblWeight: 'Peso Atual',
      btn: 'Calcular IMC e Faixa de Peso Ideal',
      outBmi: 'Pontuação IMC',
      outCategory: 'Categoria de Peso',
      outStone: 'Stones e Libras (UK)',
      outRange: 'Faixa Saudável Recomendada',
      guidance: '🩺 <strong>Orientação:</strong>',
      advice: 'Você está na faixa de peso saudável e ideal para a sua altura.'
    }
  },
  travel: {
    es: {
      title: '✈️ Estimador de Comisiones Ocultas en Cajeros y Tarjetas en el Extranjero',
      desc: 'Calcula los recargos cambiarios de los bancos, comisiones fijas de cajeros automáticos en el extranjero y cuánto dinero real pierdes al cambiar divisa.',
      badge: 'Protección al Viajero',
      lblAmount: 'Monto a Retirar / Gastar',
      lblHome: 'Tu Moneda Local',
      lblMarkup: 'Tipo de Tarjeta / Comisión',
      optWise: 'Tarjeta de Viaje Wise / Revolut (0.5%)',
      optStandard: 'Tarjeta Bancaria Estándar Débito / Crédito (3.0%)',
      optAirport: 'Kiosco de Aeropuerto / Cajero DCC Dinámico (5.5%)',
      lblAtm: 'Comisión Fija del Cajero Exterior',
      btn: 'Calcular Dinero Total Perdido en Comisiones',
      outLoss: 'Total Perdido en Comisiones',
      outPower: 'Poder de Gasto Real Recibido',
      outHit: 'Recargo Oculto Efectivo',
      tipLabel: '🚨 <strong>Consejo de Viaje:</strong>',
      tip: '¡Elige siempre pagar o retirar en la moneda local del país destino para evitar el recargo abusivo del 4-7% del cambio dinámico (DCC)!'
    },
    de: {
      title: '✈️ Reisebudget & Versteckte Auslandskarten- und Geldautomat-Gebühren',
      desc: 'Berechnen Sie Bankaufschläge, feste Auslandsautomatengebühren und wie viel Geld Sie bei Auslandsreisen tatsächlich an Wechselgebühren verlieren.',
      badge: 'Reiseschutz',
      lblAmount: 'Abhebungs- / Ausgabebetrag',
      lblHome: 'Ihre Heimatwährung',
      lblMarkup: 'Kartentyp / Wechselaufschlag',
      optWise: 'Reisekarte Wise / Revolut (0,5%)',
      optStandard: 'Klassische Bankkarte EC / Kreditkarte (3,0%)',
      optAirport: 'Flughafen-Wechselstube / DCC-Geldautomat (5,5%)',
      lblAtm: 'Feste Automatengebühr',
      btn: 'Gesamtverlust durch Gebühren berechnen',
      outLoss: 'Gesamte Gebührenverluste',
      outPower: 'Tatsächliche Kaufkraft vor Ort',
      outHit: 'Effektiver Aufschlag',
      tipLabel: '🚨 <strong>Reise-Tipp:</strong>',
      tip: 'Wählen Sie am Geldautomaten im Ausland immer "Abrechnung in Landeswährung" (ohne Umrechnung), um 4-7% teure DCC-Wechselgebühren zu vermeiden!'
    },
    pt: {
      title: '✈️ Estimador de Taxas Ocultas de Cartão e Saque no Exterior',
      desc: 'Calcule a margem de lucro dos bancos, tarifas fixas de caixas eletrônicos no exterior e quanto dinheiro você realmente perde em conversões de viagem.',
      badge: 'Guia do Viajante',
      lblAmount: 'Valor do Saque / Gasto',
      lblHome: 'Sua Moeda de Origem',
      lblMarkup: 'Tipo de Cartão / Spread',
      optWise: 'Cartão de Viagem Wise / Revolut (0,5%)',
      optStandard: 'Cartão de Banco Tradicional Crédito/Débito (3,0%)',
      optAirport: 'Câmbio de Aeroporto / Caixa Eletrônico DCC (5,5%)',
      lblAtm: 'Taxa Fixa do Caixa Eletrônico',
      btn: 'Calcular Perda Total em Taxas',
      outLoss: 'Total Perdido em Tarifas',
      outPower: 'Valor Realmente Disponível',
      outHit: 'Custo Oculto Efetivo',
      tipLabel: '🚨 <strong>Dica de Viagem:</strong>',
      tip: 'Sempre escolha pagar ou sacar na moeda local do país visitado para escapar da cobrança abusiva de 4% a 7% da Conversão Dinâmica (DCC)!'
    }
  }
};

function buildOvenHtml(t) {
  return `      <!-- Specialized Real-Life Tool: Oven Baking Converter -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(239, 68, 68, 0.04)); border:1px solid var(--card-border); border-top:4px solid #f59e0b; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>🧑‍🍳</span> ${t.title}
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">${t.desc}</p>
          </div>
          <span style="font-size:0.8rem; background:rgba(245, 158, 11, 0.15); color:#d97706; border:1px solid rgba(245, 158, 11, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">${t.badge}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="ovenTempInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblTemp}</label>
            <input type="number" id="ovenTempInput" class="input-field" value="350" step="5" style="width:100%; box-sizing:border-box;">
          </div>
          <div>
            <label for="ovenSourceScale" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblScale}</label>
            <select id="ovenSourceScale" class="select-field" style="width:100%;">
              <option value="F" selected>Fahrenheit (°F)</option>
              <option value="C">Celsius (°C)</option>
            </select>
          </div>
          <div>
            <label for="ovenSourceType" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblType}</label>
            <select id="ovenSourceType" class="select-field" style="width:100%;">
              <option value="conventional" selected>${t.optConv}</option>
              <option value="fan">${t.optFan}</option>
            </select>
          </div>
        </div>

        <button type="button" id="calcOvenBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #f59e0b, #d97706); border:none; box-shadow:0 4px 12px rgba(245,158,11,0.3);">${t.btn}</button>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outConvC}</div>
            <div id="outConvC" style="font-size:1.35rem; font-weight:800; color:var(--text-main);">177 °C</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outFanC}</div>
            <div id="outFanC" style="font-size:1.35rem; font-weight:800; color:#059669;">157 °C</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outConvF}</div>
            <div id="outConvF" style="font-size:1.35rem; font-weight:800; color:var(--text-main);">350 °F</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outFanF}</div>
            <div id="outFanF" style="font-size:1.35rem; font-weight:800; color:#059669;">315 °F</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outGas}</div>
            <div id="outGasMark" style="font-size:1.35rem; font-weight:800; color:#6366f1;">4 (Gas 4)</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>${t.suitedFor}</span>
          <span id="outOvenRecommend" style="color:var(--text-main); font-weight:600;">${t.recommend}</span>
        </div>
      </section>`;
}

function buildBmiHtml(t) {
  return `      <!-- Specialized Real-Life Tool: Body Weight & BMI Calculator -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(59, 130, 246, 0.04)); border:1px solid var(--card-border); border-top:4px solid #10b981; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>⚖️</span> ${t.title}
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">${t.desc}</p>
          </div>
          <span style="font-size:0.8rem; background:rgba(16, 185, 129, 0.15); color:#059669; border:1px solid rgba(16, 185, 129, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">${t.badge}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="bmiHeightInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblHeight}</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="number" id="bmiHeightInput" class="input-field" value="175" step="any" style="flex:1;">
              <select id="bmiHeightUnit" class="select-field" style="width:90px;">
                <option value="cm" selected>cm</option>
                <option value="m">m</option>
                <option value="in">inches</option>
                <option value="ft">feet</option>
              </select>
            </div>
          </div>
          <div>
            <label for="bmiWeightInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblWeight}</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="number" id="bmiWeightInput" class="input-field" value="75" step="any" style="flex:1;">
              <select id="bmiWeightUnit" class="select-field" style="width:90px;">
                <option value="kg" selected>kg</option>
                <option value="lb">lbs</option>
                <option value="st">stone</option>
              </select>
            </div>
          </div>
        </div>

        <button type="button" id="calcBmiBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #10b981, #059669); border:none; box-shadow:0 4px 12px rgba(16,185,129,0.3);">${t.btn}</button>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outBmi}</div>
            <div id="outBmiScore" style="font-size:1.6rem; font-weight:800; color:var(--primary-600);">24.5</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outCategory}</div>
            <div id="outBmiCategory" style="font-size:1.25rem; font-weight:800; color:#10b981;">Normal</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outStone}</div>
            <div id="outStoneLbBreakdown" style="font-size:1.2rem; font-weight:800; color:var(--text-main);">11 st 11.4 lb</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outRange}</div>
            <div id="outIdealWeightRange" style="font-size:1rem; font-weight:800; color:#059669;">9 st 0 lb to 12 st 1 lb</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>${t.guidance}</span>
          <span id="outBmiAdvice" style="color:var(--text-main); font-weight:600;">${t.advice}</span>
        </div>
      </section>`;
}

function buildTravelHtml(t) {
  return `      <!-- Specialized Real-Life Tool: Travel Fee Loss Calculator -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(79, 70, 229, 0.04), rgba(16, 185, 129, 0.04)); border:1px solid var(--card-border); border-top:4px solid #4f46e5; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>✈️</span> ${t.title}
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">${t.desc}</p>
          </div>
          <span style="font-size:0.8rem; background:rgba(79, 70, 229, 0.15); color:#4f46e5; border:1px solid rgba(79, 70, 229, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">${t.badge}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="travelSpendInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblAmount}</label>
            <input type="number" id="travelSpendInput" class="input-field" value="500" step="10" style="width:100%; box-sizing:border-box;">
          </div>
          <div>
            <label for="travelBaseCurr" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblHome}</label>
            <select id="travelBaseCurr" class="select-field" style="width:100%;">
              <option value="USD" selected>USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div>
            <label for="travelBankMarkup" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblMarkup}</label>
            <select id="travelBankMarkup" class="select-field" style="width:100%;">
              <option value="0.5">${t.optWise}</option>
              <option value="3.0" selected>${t.optStandard}</option>
              <option value="5.5">${t.optAirport}</option>
            </select>
          </div>
          <div>
            <label for="travelAtmFixedFee" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">${t.lblAtm}</label>
            <input type="number" id="travelAtmFixedFee" class="input-field" value="5" step="1" style="width:100%; box-sizing:border-box;">
          </div>
        </div>

        <button type="button" id="calcTravelFeeBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #4f46e5, #6366f1); border:none; box-shadow:0 4px 12px rgba(79,70,229,0.3);">${t.btn}</button>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outLoss}</div>
            <div id="outTotalLostFee" style="font-size:1.6rem; font-weight:800; color:#ef4444;">USD 20.00</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outPower}</div>
            <div id="outTrueAmountReceived" style="font-size:1.4rem; font-weight:800; color:#10b981;">USD 480.00</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">${t.outHit}</div>
            <div id="outLossPercentBadge" style="font-size:1.3rem; font-weight:800; color:#f59e0b;">4.0%</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>${t.tipLabel}</span>
          <span id="outTravelTip" style="color:var(--text-main); font-weight:600;">${t.tip}</span>
        </div>
      </section>`;
}

const langs = ['es', 'de', 'pt'];

langs.forEach(lang => {
  // 1. temperature.html
  const tempPath = `${lang}/temperature.html`;
  if (fs.existsSync(tempPath)) {
    let content = fs.readFileSync(tempPath, 'utf8');
    if (!content.includes('id="ovenTempInput"')) {
      const htmlToInsert = buildOvenHtml(tools.oven[lang]);
      // Insert right after tool-tab-content's </section> or before trending section
      content = content.replace(/(<\/section>\s*<\/div>)/, `</section>\n${htmlToInsert}\n    </div>`);
      if (!content.includes('problem-solvers.js')) {
        content = content.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
      }
      fs.writeFileSync(tempPath, content, 'utf8');
      console.log(`Updated ${tempPath}`);
    }
  }

  // 2. weight-mass.html
  const weightPath = `${lang}/weight-mass.html`;
  if (fs.existsSync(weightPath)) {
    let content = fs.readFileSync(weightPath, 'utf8');
    if (!content.includes('id="bmiHeightInput"')) {
      const htmlToInsert = buildBmiHtml(tools.bmi[lang]);
      content = content.replace(/(<\/section>\s*<\/div>)/, `</section>\n${htmlToInsert}\n    </div>`);
      if (!content.includes('problem-solvers.js')) {
        content = content.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
      }
      fs.writeFileSync(weightPath, content, 'utf8');
      console.log(`Updated ${weightPath}`);
    }
  }

  // 3. currency.html
  const currPath = `${lang}/currency.html`;
  if (fs.existsSync(currPath)) {
    let content = fs.readFileSync(currPath, 'utf8');
    if (!content.includes('id="travelSpendInput"')) {
      const htmlToInsert = buildTravelHtml(tools.travel[lang]);
      content = content.replace(/(<\/section>\s*<\/div>)/, `</section>\n${htmlToInsert}\n    </div>`);
      if (!content.includes('problem-solvers.js')) {
        content = content.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
      }
      fs.writeFileSync(currPath, content, 'utf8');
      console.log(`Updated ${currPath}`);
    }
  }
});
