const fs = require('fs');

const glob = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => dir + '/' + f);
};

const allFiles = [...glob('blog'), ...glob('es/blog'), ...glob('de/blog'), ...glob('pt/blog')];

const standardScript = `
  <script>
  (function() {
    var input = document.getElementById('liveToolInput');
    var fromSel = document.getElementById('liveToolFromUnit');
    var toSel = document.getElementById('liveToolToUnit');
    var swapBtn = document.getElementById('liveToolSwapBtn');
    var resVal = document.getElementById('liveToolResultVal');
    var formulaText = document.getElementById('liveToolFormulaText');
    var copyBtn = document.getElementById('liveToolCopyBtn');

    if (!input || !resVal || !fromSel || !toSel) return;

    var ratesInBase = {
      g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125, st: 6350.29318,
      ml: 1, l: 1000, cup: 236.5882365, cup_us: 236.5882365, cup_metric: 250, gal: 3785.411784, floz: 29.5735295625, tbsp: 14.78676478125, tsp: 4.92892159375,
      m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,
      sqm: 1, sqft: 0.09290304, acre: 4046.8564224, ha: 10000, bigha_std: 2529.285264, guntha: 101.17, biswa: 126.46, kanal: 505.857, marla: 25.2929,
      sec: 1, min: 60, hr: 3600, day: 86400,
      bar: 100000, psi: 6894.757293, kpa: 1000, atm: 101325,
      kmh: 1, mph: 1.609344, ms: 3.6, knot: 1.852
    };

    var fx = { USD: 1, AUD: 1.525, EUR: 0.92, GBP: 0.79, CAD: 1.38, JPY: 154.5, INR: 84.0, VND: 25400 };

    function convertTemp(val, from, to) {
      var k;
      if (from === 'C') k = val + 273.15;
      else if (from === 'F') k = (val - 32) * 5/9 + 273.15;
      else if (from === 'K') k = val;
      else if (from === 'R') k = val * 5/9;

      if (to === 'C') return k - 273.15;
      if (to === 'F') return (k - 273.15) * 9/5 + 32;
      if (to === 'K') return k;
      if (to === 'R') return k * 9/5;
      return k;
    }

    function calculate() {
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel.value;
      var to = toSel.value;

      var result;
      if (['F','C','K','R'].indexOf(from) !== -1 && ['F','C','K','R'].indexOf(to) !== -1) {
        result = convertTemp(val, from, to);
        formulaText.textContent = val + ' ' + from + ' = ' + result.toFixed(2) + ' ' + to;
      } else if (fx[from] && fx[to]) {
        var rate = fx[to] / fx[from];
        result = val * rate;
        formulaText.textContent = '1 ' + from + ' = ' + (rate >= 1 ? rate.toFixed(4) : rate.toPrecision(4)) + ' ' + to;
      } else if (ratesInBase[from] && ratesInBase[to]) {
        var inBase = val * ratesInBase[from];
        result = inBase / ratesInBase[to];
        formulaText.textContent = val + ' ' + from + ' = ' + (Math.abs(result) > 1000 ? result.toLocaleString('en-US', {maximumFractionDigits:2}) : result.toFixed(4)) + ' ' + to;
      } else {
        result = val;
        formulaText.textContent = val + ' ' + from + ' = ' + result + ' ' + to;
      }

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(2) : result.toFixed(4));
      resVal.textContent = formatted + ' ' + to;
    }

    input.addEventListener('input', calculate);
    fromSel.addEventListener('change', calculate);
    toSel.addEventListener('change', calculate);

    if (swapBtn) {
      swapBtn.addEventListener('click', function() {
        var temp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = temp;
        calculate();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(resVal.textContent);
          var orig = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          setTimeout(function() { copyBtn.textContent = orig; }, 2000);
        } catch(e) {}
      });
    }

    calculate();
  })();
  </script>
`;

let injected = 0;
let updatedDash = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('id="liveToolInput"') || content.includes("id='liveToolInput'")) {
    // If script is completely missing, inject it right before </body>
    if (!content.includes('function calculate()')) {
      content = content.replace('</body>', standardScript + '\n</body>');
      changed = true;
      injected++;
      console.log('Injected missing script in:', file);
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Finished injecting missing scripts:', injected);
