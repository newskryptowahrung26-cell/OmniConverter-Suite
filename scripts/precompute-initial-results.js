const fs = require('fs');

const glob = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => dir + '/' + f);
};

const allFiles = [...glob('blog'), ...glob('es/blog'), ...glob('de/blog'), ...glob('pt/blog')];

const ratesInBase = {
  g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125, st: 6350.29318,
  ml: 1, l: 1000, cup: 236.5882365, cup_us: 236.5882365, cup_metric: 250, gal: 3785.411784, floz: 29.5735295625, tbsp: 14.78676478125, tsp: 4.92892159375,
  m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,
  sqm: 1, sqft: 0.09290304, acre: 4046.8564224, ha: 10000, bigha_std: 2529.285264, guntha: 101.17, biswa: 126.46, kanal: 505.857, marla: 25.2929,
  sec: 1, min: 60, hr: 3600, day: 86400,
  bar: 100000, psi: 6894.757293, kpa: 1000, atm: 101325,
  kmh: 1, mph: 1.609344, ms: 3.6, knot: 1.852
};

const fx = { USD: 1, AUD: 1.4258, EUR: 0.8784, GBP: 0.7556, CAD: 1.4149, JPY: 157.49, INR: 95.93, VND: 25936.55 };

function convertTemp(val, from, to) {
  let k;
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

function compute(val, from, to) {
  let result;
  let formula;
  if (['F','C','K','R'].includes(from) && ['F','C','K','R'].includes(to)) {
    result = convertTemp(val, from, to);
    formula = `${val} ${from} = ${result.toFixed(2)} ${to}`;
  } else if (fx[from] && fx[to]) {
    const rate = fx[to] / fx[from];
    result = val * rate;
    const rateStr = rate >= 1 ? rate.toFixed(4) : rate.toPrecision(4);
    formula = `1 ${from} = ${rateStr} ${to}`;
  } else if (ratesInBase[from] && ratesInBase[to]) {
    const inBase = val * ratesInBase[from];
    result = inBase / ratesInBase[to];
    const resFormatted = Math.abs(result) > 1000 ? result.toLocaleString('en-US', {maximumFractionDigits:2}) : result.toFixed(4);
    formula = `${val} ${from} = ${resFormatted} ${to}`;
  } else {
    result = val;
    formula = `${val} ${from} = ${result} ${to}`;
  }

  const formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(2) : result.toFixed(4));
  return {
    valStr: `${formatted} ${to}`,
    formulaStr: formula
  };
}

let fixedPages = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('id="liveToolInput"') || content.includes("id='liveToolInput'")) {
    // extract input value
    const inputMatch = content.match(/id="liveToolInput"[^>]*value="([^"]+)"/);
    const inputVal = inputMatch ? parseFloat(inputMatch[1]) : 100;

    // extract from selected
    const fromMatch = content.match(/<select id="liveToolFromUnit"[\s\S]*?<\/select>/);
    const toMatch = content.match(/<select id="liveToolToUnit"[\s\S]*?<\/select>/);

    if (fromMatch && toMatch) {
      let fromSelected = fromMatch[0].match(/<option\s+value="([^"]+)"[^>]*selected[^>]*>/i);
      let toSelected = toMatch[0].match(/<option\s+value="([^"]+)"[^>]*selected[^>]*>/i);

      let fromUnit = fromSelected ? fromSelected[1] : null;
      let toUnit = toSelected ? toSelected[1] : null;

      // Check if from and to are mismatched with page slug/intent
      const slug = file.split('/').pop().replace('.html', '');

      // Specific fix for 100-usd-in-australian
      if (slug === '100-usd-in-australian') {
        // From should be USD, to should be AUD
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="USD">US Dollar ($)</option>
              <option value="AUD" selected>Australian Dollar (A$)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="VND">Vietnamese Dong (₫)</option>
            </select>`
        );
        toUnit = 'AUD';
        changed = true;
      }

      // Specific fix for 20-gbp-aud
      if (slug === '20-gbp-aud') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="GBP" selected>British Pound (£)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="AUD">Australian Dollar (A$)</option>
              <option value="EUR">Euro (€)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="VND">Vietnamese Dong (₫)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="AUD" selected>Australian Dollar (A$)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="VND">Vietnamese Dong (₫)</option>
            </select>`
        );
        fromUnit = 'GBP';
        toUnit = 'AUD';
        changed = true;
      }

      // Specific fix for 67-usd-to-gbp
      if (slug === '67-usd-to-gbp') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="USD" selected>US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="AUD">Australian Dollar (A$)</option>
              <option value="EUR">Euro (€)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="VND">Vietnamese Dong (₫)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="GBP" selected>British Pound (£)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="AUD">Australian Dollar (A$)</option>
              <option value="EUR">Euro (€)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="VND">Vietnamese Dong (₫)</option>
            </select>`
        );
        fromUnit = 'USD';
        toUnit = 'GBP';
        changed = true;
      }

      // Specific fix for 104-kg-pounds
      if (slug === '104-kg-pounds') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="kg" selected>Kilograms (kg)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
              <option value="st">Stones (st)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="kg">Kilograms (kg)</option>
              <option value="lb" selected>Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
              <option value="st">Stones (st)</option>
            </select>`
        );
        fromUnit = 'kg';
        toUnit = 'lb';
        changed = true;
      }

      // Specific fix for 14-stone-in-pounds
      if (slug === '14-stone-in-pounds') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="st" selected>Stones (st)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="lb" selected>Pounds (lbs)</option>
              <option value="st">Stones (st)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
            </select>`
        );
        fromUnit = 'st';
        toUnit = 'lb';
        changed = true;
      }

      // Specific fix for 15-meters-to-feet
      if (slug === '15-meters-to-feet') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="m" selected>Meters (m)</option>
              <option value="ft">Feet (ft)</option>
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="km">Kilometers (km)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="ft" selected>Feet (ft)</option>
              <option value="m">Meters (m)</option>
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="km">Kilometers (km)</option>
            </select>`
        );
        fromUnit = 'm';
        toUnit = 'ft';
        changed = true;
      }

      // Specific fix for 4-meters-to-feet
      if (slug === '4-meters-to-feet') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="m" selected>Meters (m)</option>
              <option value="ft">Feet (ft)</option>
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="km">Kilometers (km)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="ft" selected>Feet (ft)</option>
              <option value="m">Meters (m)</option>
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="km">Kilometers (km)</option>
            </select>`
        );
        fromUnit = 'm';
        toUnit = 'ft';
        changed = true;
      }

      // Specific fix for 16-ounces-to-milliliters
      if (slug === '16-ounces-to-milliliters') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="floz" selected>Fluid Ounces (fl oz)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="cup">Cups</option>
              <option value="l">Liters (l)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="ml" selected>Milliliters (ml)</option>
              <option value="floz">Fluid Ounces (fl oz)</option>
              <option value="cup">Cups</option>
              <option value="l">Liters (l)</option>
            </select>`
        );
        fromUnit = 'floz';
        toUnit = 'ml';
        changed = true;
      }

      // Specific fix for 165-lbs-to-kg
      if (slug === '165-lbs-to-kg') {
        fromUnit = 'lb';
        toUnit = 'kg';
      }

      // Specific fix for 5-lbs-in-kg
      if (slug === '5-lbs-in-kg') {
        fromUnit = 'lb';
        toUnit = 'kg';
      }

      // Specific fix for 65-kg-pounds
      if (slug === '65-kg-pounds') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="kg" selected>Kilograms (kg)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
              <option value="st">Stones (st)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="lb" selected>Pounds (lbs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
              <option value="st">Stones (st)</option>
            </select>`
        );
        fromUnit = 'kg';
        toUnit = 'lb';
        changed = true;
      }

      // Specific fix for 70kg-in-stone
      if (slug === '70kg-in-stone') {
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="st" selected>Stones (st)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
            </select>`
        );
        fromUnit = 'kg';
        toUnit = 'st';
        changed = true;
      }

      // Specific fix for 700-pounds-to-aud
      if (slug === '700-pounds-to-aud') {
        content = content.replace(
          /<select id="liveToolFromUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="GBP" selected>British Pound (£ GBP)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="AUD">Australian Dollar ($ AUD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="CAD">Canadian Dollar ($ CAD)</option>
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="VND">Vietnamese Dong (₫ VND)</option>
            </select>`
        );
        content = content.replace(
          /<select id="liveToolToUnit"[\s\S]*?<\/select>/,
          `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="AUD" selected>Australian Dollar ($ AUD)</option>
              <option value="GBP">British Pound (£ GBP)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="CAD">Canadian Dollar ($ CAD)</option>
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="VND">Vietnamese Dong (₫ VND)</option>
            </select>`
        );
        fromUnit = 'GBP';
        toUnit = 'AUD';
        changed = true;
      }

      // Now compute initial non-dash result
      if (fromUnit && toUnit) {
        const computed = compute(inputVal, fromUnit, toUnit);

        // Replace `--` in HTML
        if (content.includes('>--<')) {
          content = content.replace(
            /<div id="liveToolResultVal"[^>]*>--<\/div>/,
            `<div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">${computed.valStr}</div>`
          );
          content = content.replace(
            /<div id="liveToolFormulaText"[^>]*>Live formula calculation<\/div>/,
            `<div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${computed.formulaStr}</div>`
          );
          changed = true;
          fixedPages++;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Fixed pages with pre-computed initial values:', fixedPages);
