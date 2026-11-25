/**
 * OmniConverter 2.0 — Interactive Client-Side Controller
 * Connects UI events to OmniCalcEngines with zero external dependencies.
 * Fully supports multi-currency selection, locale-aware formatting,
 * tri-mode BMI, universal salary estimation, and multi-scenario percentages.
 */

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('calculator-app');
  if (!app || typeof OmniCalcEngines === 'undefined') return;

  const tool = app.dataset.tool;
  const loc = app.dataset.loc || 'en';

  // Locale mapping for number formatting
  const localeMap = {
    'en': 'en-GB',
    'es': 'es-ES',
    'de': 'de-DE',
    'pt': 'pt-PT'
  };
  const activeLocale = localeMap[loc] || 'en-GB';

  // Helper: Locale-aware number format
  function formatNumber(val, decimals = 2) {
    if (isNaN(val) || val === null) return '—';
    return Number(val).toLocaleString(activeLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // Helper: Currency formatting (code + symbol, no FX conversion)
  function formatCurrency(val, currencyCode = 'USD', decimals = 2) {
    if (isNaN(val) || val === null) return '—';
    const symbols = {
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'C$',
      'AUD': 'A$',
      'INR': '₹',
      'BRL': 'R$',
      'ZAR': 'R',
      'AED': 'AED ',
      'SAR': 'SAR '
    };
    const sym = symbols[currencyCode] || `${currencyCode} `;
    const formattedNum = formatNumber(val, decimals);
    
    // In Spanish/German, symbols typically appear after with space (e.g. 1.234,56 €)
    if (loc === 'de' || loc === 'es') {
      return `${formattedNum} ${sym.trim()}`;
    }
    return `${sym}${formattedNum}`;
  }

  // 1. Percentage Calculator Controller (All 4 Scenarios)
  if (tool === 'percentage') {
    // Scenario A: What is X% of Y?
    const p1CalcBtn = document.getElementById('p1-calc-btn');
    const p1X = document.getElementById('p1-x');
    const p1Y = document.getElementById('p1-y');
    const p1Res = document.getElementById('p1-result');
    const p1Steps = document.getElementById('p1-steps');

    if (p1CalcBtn && p1X && p1Y && p1Res) {
      p1CalcBtn.addEventListener('click', () => {
        const x = parseFloat(p1X.value);
        const y = parseFloat(p1Y.value);
        const ans = OmniCalcEngines.percentage.whatIsXPercentOfY(x, y);
        if (ans !== null) {
          p1Res.textContent = formatNumber(ans, 2);
          if (p1Steps) p1Steps.textContent = `(${formatNumber(x, 1)} × ${formatNumber(y, 1)}) ÷ 100 = ${formatNumber(ans, 2)}`;
        }
      });
    }

    // Scenario B: X is what percent of Y?
    const p2CalcBtn = document.getElementById('p2-calc-btn');
    const p2X = document.getElementById('p2-x');
    const p2Y = document.getElementById('p2-y');
    const p2Res = document.getElementById('p2-result');
    const p2Steps = document.getElementById('p2-steps');

    if (p2CalcBtn && p2X && p2Y && p2Res) {
      p2CalcBtn.addEventListener('click', () => {
        const x = parseFloat(p2X.value);
        const y = parseFloat(p2Y.value);
        const ans = OmniCalcEngines.percentage.xIsWhatPercentOfY(x, y);
        if (ans !== null) {
          p2Res.textContent = `${formatNumber(ans, 2)}%`;
          if (p2Steps) p2Steps.textContent = `(${formatNumber(x, 1)} ÷ ${formatNumber(y, 1)}) × 100 = ${formatNumber(ans, 2)}%`;
        }
      });
    }

    // Scenario C: Percentage change from X to Y
    const p3CalcBtn = document.getElementById('p3-calc-btn');
    const p3X = document.getElementById('p3-x');
    const p3Y = document.getElementById('p3-y');
    const p3Res = document.getElementById('p3-result');
    const p3Steps = document.getElementById('p3-steps');

    if (p3CalcBtn && p3X && p3Y && p3Res) {
      p3CalcBtn.addEventListener('click', () => {
        const x = parseFloat(p3X.value);
        const y = parseFloat(p3Y.value);
        const ans = OmniCalcEngines.percentage.percentageChange(x, y);
        if (ans !== null) {
          const sign = ans.pct > 0 ? '+' : '';
          p3Res.textContent = `${sign}${formatNumber(ans.pct, 2)}%`;
          if (p3Steps) p3Steps.textContent = `((${formatNumber(y, 1)} − ${formatNumber(x, 1)}) ÷ |${formatNumber(x, 1)}|) × 100 = ${sign}${formatNumber(ans.pct, 2)}%`;
        }
      });
    }

    // Scenario D: Reverse Percentage (Value before discount)
    const p4CalcBtn = document.getElementById('p4-calc-btn');
    const p4Val = document.getElementById('p4-val');
    const p4Pct = document.getElementById('p4-pct');
    const p4Res = document.getElementById('p4-result');
    const p4Steps = document.getElementById('p4-steps');

    if (p4CalcBtn && p4Val && p4Pct && p4Res) {
      p4CalcBtn.addEventListener('click', () => {
        const v = parseFloat(p4Val.value);
        const p = parseFloat(p4Pct.value);

        // Validation for discount range: 0 <= p < 100
        if (isNaN(p) || p < 0 || p >= 100) {
          const errMsg = {
            'es': 'Introduce un descuento igual o superior a 0% e inferior a 100%.',
            'de': 'Gib einen Rabatt von mindestens 0% und weniger als 100% ein.',
            'pt': 'Insira um desconto maior ou igual a 0% e inferior a 100%.',
            'en': 'Please enter a discount of at least 0% and less than 100%.'
          }[loc] || 'Please enter a discount of at least 0% and less than 100%.';

          p4Res.textContent = '—';
          if (p4Steps) p4Steps.textContent = errMsg;
          return;
        }

        const ans = OmniCalcEngines.percentage.reversePercentage(v, p, true);
        if (ans !== null) {
          p4Res.textContent = formatNumber(ans, 2);
          if (p4Steps) p4Steps.textContent = `${formatNumber(v, 2)} ÷ (1 − ${p}/100) = ${formatNumber(ans, 2)}`;
        }
      });
    }
  }

  // 2. Age Calculator Controller (With fallback text parser)
  if (tool === 'age') {
    const calcBtn = document.getElementById('age-calc-btn');
    const dobInput = document.getElementById('age-dob');
    const targetInput = document.getElementById('age-target');
    const primaryRes = document.getElementById('age-result-primary');

    // Date fallback normalizer
    function parseFlexibleDate(dateStr) {
      if (!dateStr) return null;
      // If YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
      }
      // If DD/MM/YYYY or DD.MM.YYYY
      const parts = dateStr.split(/[\/\.\-]/);
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
          // Default to DD/MM/YYYY unless loc === 'en' and user is US format
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          return new Date(y, m, d);
        }
      }
      return new Date(dateStr);
    }

    if (calcBtn && dobInput && primaryRes) {
      calcBtn.addEventListener('click', () => {
        const dob = parseFlexibleDate(dobInput.value);
        const target = targetInput && targetInput.value ? parseFlexibleDate(targetInput.value) : new Date();

        if (!dob || isNaN(dob.getTime())) {
          primaryRes.textContent = 'Invalid date';
          return;
        }

        const res = OmniCalcEngines.age.calculateAge(dob.toISOString().split('T')[0], target ? target.toISOString().split('T')[0] : null);
        if (res && !res.error) {
          primaryRes.textContent = `${res.years} years, ${res.months} months, ${res.days} days`;
          const wd = document.getElementById('age-weekday');
          const d = document.getElementById('age-days');
          const h = document.getElementById('age-hours');
          const nb = document.getElementById('age-next-bday');
          if (wd) wd.textContent = res.dayOfWeekBorn;
          if (d) d.textContent = `${formatNumber(res.totalDays, 0)} days`;
          if (h) h.textContent = `${formatNumber(res.totalHours, 0)} hours`;
          if (nb) nb.textContent = `${res.daysUntilNextBday} days`;
        } else if (res && res.error === 'FUTURE_DATE') {
          primaryRes.textContent = 'Birthdate cannot be in the future';
        }
      });
    }
  }

  // 3. Global Mortgage Calculator Controller
  if (tool === 'mortgage') {
    const calcBtn = document.getElementById('mort-calc-btn');
    const pInput = document.getElementById('mort-price');
    const dInput = document.getElementById('mort-deposit');
    const tInput = document.getElementById('mort-term');
    const rInput = document.getElementById('mort-rate');
    const currSelect = document.getElementById('mort-currency') || { value: 'USD' };
    const mRes = document.getElementById('mort-monthly');

    function runMortgageCalc() {
      if (!pInput || !dInput || !tInput || !rInput || !mRes) return;
      const price = parseFloat(pInput.value);
      const deposit = parseFloat(dInput.value);
      const term = parseFloat(tInput.value);
      const rate = parseFloat(rInput.value);
      const curr = currSelect.value || 'USD';

      const res = OmniCalcEngines.mortgage.calculateRepayment(price, deposit, term, rate);
      if (res) {
        mRes.textContent = formatCurrency(res.baseMonthlyPayment, curr, 2);
        const l = document.getElementById('mort-loan');
        const ltv = document.getElementById('mort-ltv');
        const mi = document.getElementById('mort-interest');
        const mt = document.getElementById('mort-total');
        if (l) l.textContent = formatCurrency(res.loan, curr, 0);
        if (ltv) ltv.textContent = `${formatNumber(res.ltv, 1)}%`;
        if (mi) mi.textContent = formatCurrency(res.totalInterest, curr, 0);
        if (mt) mt.textContent = formatCurrency(res.totalRepaid, curr, 0);
      }
    }

    if (calcBtn) calcBtn.addEventListener('click', runMortgageCalc);
    if (currSelect.addEventListener) {
      currSelect.addEventListener('change', runMortgageCalc);
    }
  }

  // 4. Global Compound Interest Controller
  if (tool === 'compound') {
    const calcBtn = document.getElementById('comp-calc-btn');
    const pInput = document.getElementById('comp-principal');
    const cInput = document.getElementById('comp-contrib');
    const rInput = document.getElementById('comp-rate');
    const tInput = document.getElementById('comp-term');
    const currSelect = document.getElementById('comp-currency') || { value: 'USD' };
    const fRes = document.getElementById('comp-future');

    function runCompoundCalc() {
      if (!pInput || !cInput || !rInput || !tInput || !fRes) return;
      const p = parseFloat(pInput.value);
      const c = parseFloat(cInput.value);
      const r = parseFloat(rInput.value);
      const t = parseFloat(tInput.value);
      const curr = currSelect.value || 'USD';

      const res = OmniCalcEngines.compound.calculateCompound(p, c, r, t);
      if (res) {
        fRes.textContent = formatCurrency(res.futureBalance, curr, 2);
        const inv = document.getElementById('comp-invested');
        const ear = document.getElementById('comp-earned');
        if (inv) inv.textContent = formatCurrency(res.totalContributions, curr, 2);
        if (ear) ear.textContent = formatCurrency(res.totalInterest, curr, 2);
      }
    }

    if (calcBtn) calcBtn.addEventListener('click', runCompoundCalc);
    if (currSelect.addEventListener) {
      currSelect.addEventListener('change', runCompoundCalc);
    }
  }

  // 5. Universal BMI Controller (Tri-Mode: Metric, US Imperial, UK Imperial)
  if (tool === 'bmi') {
    const tabs = app.querySelectorAll('.oc-calc-tab-btn');
    let activeUnit = 'metric';

    const metricInputs = document.getElementById('bmi-inputs-metric');
    const usInputs = document.getElementById('bmi-inputs-us');
    const ukInputs = document.getElementById('bmi-inputs-uk');

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        activeUnit = btn.dataset.unit || 'metric';

        if (metricInputs) metricInputs.classList.toggle('hidden', activeUnit !== 'metric');
        if (usInputs) usInputs.classList.toggle('hidden', activeUnit !== 'us');
        if (ukInputs) ukInputs.classList.toggle('hidden', activeUnit !== 'uk');
      });
    });

    const calcBtn = document.getElementById('bmi-calc-btn');
    const bVal = document.getElementById('bmi-val');
    const bBadge = document.getElementById('bmi-badge');
    const hr = document.getElementById('bmi-healthy');

    if (calcBtn && bVal) {
      calcBtn.addEventListener('click', () => {
        let res = null;
        if (activeUnit === 'metric') {
          const w = parseFloat(document.getElementById('bmi-weight')?.value);
          const h = parseFloat(document.getElementById('bmi-height')?.value);
          res = OmniCalcEngines.bmi.calculateBmi(w, h);
          if (res && hr) {
            hr.textContent = `${formatNumber(res.healthyMinKg, 1)} kg – ${formatNumber(res.healthyMaxKg, 1)} kg`;
          }
        } else if (activeUnit === 'us') {
          const wLbs = parseFloat(document.getElementById('bmi-weight-lbs')?.value);
          const f = parseFloat(document.getElementById('bmi-height-ft')?.value);
          const inc = parseFloat(document.getElementById('bmi-height-in')?.value);
          res = OmniCalcEngines.bmi.calculateUsImperial(wLbs, f, inc);
          if (res && hr) {
            hr.textContent = res.healthyRangeLbs;
          }
        } else if (activeUnit === 'uk') {
          const st = parseFloat(document.getElementById('bmi-weight-st')?.value);
          const lb = parseFloat(document.getElementById('bmi-weight-uklbs')?.value);
          const f = parseFloat(document.getElementById('bmi-height-ukft')?.value);
          const inc = parseFloat(document.getElementById('bmi-height-ukin')?.value);
          const conv = OmniCalcEngines.bmi.convertImperialToMetric(st, lb, f, inc);
          res = OmniCalcEngines.bmi.calculateBmi(conv.kg, conv.cm);
          if (res && hr) {
            hr.textContent = res.healthyRangeStone;
          }
        }

        if (res) {
          bVal.textContent = formatNumber(res.bmi, 1);
          if (bBadge) {
            bBadge.textContent = res.category;
            bBadge.className = `px-2.5 py-1 text-xs font-semibold rounded ${res.badgeClass}`;
          }
        }
      });
    }
  }

  // 6. Salary & Take-Home Pay Controller (Dual Mode: UK Statutory & Universal Estimator)
  if (tool === 'salary') {
    const modeTabs = app.querySelectorAll('.oc-salary-mode-btn');
    let activeMode = 'uk'; // 'uk' or 'universal'

    const ukSection = document.getElementById('sal-mode-uk');
    const uniSection = document.getElementById('sal-mode-uni');
    const calcBtn = document.getElementById('sal-calc-btn');

    modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        activeMode = btn.dataset.mode || 'uk';

        if (ukSection) ukSection.classList.toggle('hidden', activeMode !== 'uk');
        if (uniSection) uniSection.classList.toggle('hidden', activeMode !== 'uni');
      });
    });

    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        const tRes = document.getElementById('sal-takehome');
        const m = document.getElementById('sal-monthly');
        const w = document.getElementById('sal-weekly');
        const tx = document.getElementById('sal-tax');
        const ni = document.getElementById('sal-ni');

        if (activeMode === 'uk') {
          const g = parseFloat(document.getElementById('sal-gross')?.value);
          const reg = document.getElementById('sal-region')?.value || 'rUK';
          const p = parseFloat(document.getElementById('sal-pension')?.value) || 5;
          const sl = document.getElementById('sal-student')?.value || 'none';

          const res = OmniCalcEngines.salaryUk.calculateTakeHome(g, reg, p, sl);
          if (res) {
            if (tRes) tRes.textContent = formatCurrency(res.netAnnual, 'GBP', 2);
            if (m) m.textContent = formatCurrency(res.netMonthly, 'GBP', 2);
            if (w) w.textContent = formatCurrency(res.netWeekly, 'GBP', 2);
            if (tx) tx.textContent = formatCurrency(res.incomeTax, 'GBP', 2);
            if (ni) ni.textContent = formatCurrency(res.nationalInsurance, 'GBP', 2);
          }
        } else {
          // Universal Mode
          const g = parseFloat(document.getElementById('sal-uni-gross')?.value);
          const tPct = parseFloat(document.getElementById('sal-uni-tax')?.value) || 20;
          const sPct = parseFloat(document.getElementById('sal-uni-social')?.value) || 5;
          const pPct = parseFloat(document.getElementById('sal-uni-pension')?.value) || 5;
          const curr = document.getElementById('sal-uni-currency')?.value || 'USD';

          const res = OmniCalcEngines.salaryUk.calculateUniversalTakeHome(g, tPct, sPct, pPct);
          if (res) {
            if (tRes) tRes.textContent = formatCurrency(res.netAnnual, curr, 2);
            if (m) m.textContent = formatCurrency(res.netMonthly, curr, 2);
            if (w) w.textContent = formatCurrency(res.netWeekly, curr, 2);
            if (tx) tx.textContent = formatCurrency(res.taxDeduction, curr, 2);
            if (ni) ni.textContent = formatCurrency(res.socialDeduction + res.pensionDeduction, curr, 2);
          }
        }
      });
    }
  }
});
