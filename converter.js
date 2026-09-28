/**
 * Temperature Converter Engine
 * Modular, extensible, and mathematically accurate temperature conversion logic.
 */

export const UNITS = {
  C: { name: 'Celsius', symbol: '°C' },
  F: { name: 'Fahrenheit', symbol: '°F' },
  K: { name: 'Kelvin', symbol: 'K' },
  R: { name: 'Rankine', symbol: '°R' },
  Re: { name: 'Réaumur', symbol: '°Ré' },
  Ro: { name: 'Rømer', symbol: '°Rø' },
  N: { name: 'Newton', symbol: '°N' },
  De: { name: 'Delisle', symbol: '°De' }
};

// Convert any temperature to Celsius as the pivot representation
export function toCelsius(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;

  switch (fromUnit) {
    case 'C': return val;
    case 'F': return (val - 32) * 5 / 9;
    case 'K': return val - 273.15;
    case 'R': return (val - 491.67) * 5 / 9;
    case 'Re': return val * 5 / 4;
    case 'Ro': return (val - 7.5) * 40 / 21;
    case 'N': return val * 100 / 33;
    case 'De': return 100 - (val * 2 / 3);
    default: throw new Error(`Unsupported unit: ${fromUnit}`);
  }
}

// Convert Celsius pivot representation to target unit
export function fromCelsius(celsiusValue, toUnit) {
  const val = Number(celsiusValue);
  if (isNaN(val)) return NaN;

  switch (toUnit) {
    case 'C': return val;
    case 'F': return (val * 9 / 5) + 32;
    case 'K': return val + 273.15;
    case 'R': return (val + 273.15) * 9 / 5;
    case 'Re': return val * 4 / 5;
    case 'Ro': return (val * 21 / 40) + 7.5;
    case 'N': return val * 33 / 100;
    case 'De': return (100 - val) * 3 / 2;
    default: throw new Error(`Unsupported unit: ${toUnit}`);
  }
}

/**
 * Direct temperature conversion with formatted results, formula, and step breakdown.
 */
export function convertTemperature(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return { error: 'Invalid numeric input' };
  }

  if (!UNITS[fromUnit] || !UNITS[toUnit]) {
    return { error: 'Invalid unit specified' };
  }

  const celsius = toCelsius(numericValue, fromUnit);
  const rawResult = fromCelsius(celsius, toUnit);

  // Round smartly to up to 6 decimal places without trailing zeros
  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const formula = getFormulaText(fromUnit, toUnit);
  const explanation = getStepByStepExplanation(numericValue, fromUnit, toUnit, rawResult);

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: UNITS[fromUnit].symbol,
    fromName: UNITS[fromUnit].name,
    toUnit,
    toSymbol: UNITS[toUnit].symbol,
    toName: UNITS[toUnit].name,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

export function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(num);
}

export function getFormulaText(fromUnit, toUnit) {
  if (fromUnit === toUnit) return `${UNITS[toUnit].symbol} = ${UNITS[fromUnit].symbol}`;

  const key = `${fromUnit}_${toUnit}`;
  const formulas = {
    'C_F': '°F = (°C × 9/5) + 32',
    'F_C': '°C = (°F − 32) × 5/9',
    'C_K': 'K = °C + 273.15',
    'K_C': '°C = K − 273.15',
    'F_K': 'K = (°F − 32) × 5/9 + 273.15',
    'K_F': '°F = (K − 273.15) × 9/5 + 32',
    'C_R': '°R = (°C + 273.15) × 9/5',
    'R_C': '°C = (°R × 5/9) − 273.15',
    'F_R': '°R = °F + 459.67',
    'R_F': '°F = °R − 459.67',
    'K_R': '°R = K × 9/5',
    'R_K': 'K = °R × 5/9',
    'C_Re': '°Ré = °C × 4/5',
    'Re_C': '°C = °Ré × 5/4',
    'C_N': '°N = °C × 33/100',
    'N_C': '°C = °N × 100/33',
    'C_Ro': '°Rø = (°C × 21/40) + 7.5',
    'Ro_C': '°C = (°Rø − 7.5) × 40/21',
    'C_De': '°De = (100 − °C) × 3/2',
    'De_C': '°C = 100 − (°De × 2/3)'
  };

  if (formulas[key]) return formulas[key];

  return `${UNITS[toUnit].symbol} = fromCelsius(toCelsius(${UNITS[fromUnit].symbol}))`;
}

export function getStepByStepExplanation(val, fromUnit, toUnit, rawResult) {
  const fromSym = UNITS[fromUnit].symbol;
  const toSym = UNITS[toUnit].symbol;

  if (fromUnit === toUnit) {
    return `${val} ${fromSym} is identical to ${val} ${toSym} as both input and target units are the same.`;
  }

  const key = `${fromUnit}_${toUnit}`;
  const roundedRes = Number(Math.round(rawResult + 'e4') + 'e-4');

  switch (key) {
    case 'C_F':
      return `Multiply ${val} °C by 9/5 (1.8) to get ${val * 1.8}, then add 32 to get ${roundedRes} °F.`;
    case 'F_C':
      return `Subtract 32 from ${val} °F to get ${val - 32}, then multiply by 5/9 (approx 0.5556) to get ${roundedRes} °C.`;
    case 'C_K':
      return `Add 273.15 to ${val} °C to get ${roundedRes} K.`;
    case 'K_C':
      return `Subtract 273.15 from ${val} K to get ${roundedRes} °C.`;
    case 'F_K':
      return `Subtract 32 from ${val} °F (${val - 32}), multiply by 5/9 (${((val - 32) * 5 / 9).toFixed(4)} °C), and add 273.15 to get ${roundedRes} K.`;
    case 'K_F':
      return `Subtract 273.15 from ${val} K (${val - 273.15} °C), multiply by 9/5 and add 32 to get ${roundedRes} °F.`;
    default: {
      const celsiusVal = toCelsius(val, fromUnit);
      return `First convert ${val} ${fromSym} to Celsius (${Number(celsiusVal.toFixed(4))} °C), then convert to ${toSym} to yield ${roundedRes} ${toSym}.`;
    }
  }
}

/**
 * Convert temperature across ALL 8 units simultaneously for multi-scale view.
 */
export function convertAllScales(value, fromUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  const c = toCelsius(num, fromUnit);
  if (isNaN(c)) return null;

  const results = {};
  for (const [key, meta] of Object.entries(UNITS)) {
    const raw = fromCelsius(c, key);
    const rounded = Math.abs(raw) < 1e-6 && raw !== 0
      ? Number(raw.toPrecision(6))
      : Number(Math.round(raw + 'e4') + 'e-4');
    results[key] = {
      unit: key,
      name: meta.name,
      symbol: meta.symbol,
      raw,
      value: rounded,
      formatted: `${formatNumber(rounded)} ${meta.symbol}`
    };
  }
  return results;
}

/**
 * Temperature difference (ΔT) converter.
 * In temperature change, baseline zero offsets cancel out:
 * 1 Δ°C = 1 ΔK = 1.8 Δ°F = 1.8 Δ°R = 0.8 Δ°Ré = 0.525 Δ°Rø = 0.33 Δ°N = 1.5 Δ°De
 */
export function convertDeltaTemperature(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const val = Number(value);
  if (isNaN(val)) return { error: 'Invalid numeric input' };

  if (!UNITS[fromUnit] || !UNITS[toUnit]) {
    return { error: 'Invalid unit specified' };
  }

  // Convert fromUnit delta to delta Celsius
  let deltaC;
  switch (fromUnit) {
    case 'C':
    case 'K':
      deltaC = val;
      break;
    case 'F':
    case 'R':
      deltaC = val * 5 / 9;
      break;
    case 'Re':
      deltaC = val * 5 / 4;
      break;
    case 'Ro':
      deltaC = val * 40 / 21;
      break;
    case 'N':
      deltaC = val * 100 / 33;
      break;
    case 'De':
      deltaC = val * 2 / 3;
      break;
    default:
      return { error: 'Unsupported unit' };
  }

  // Convert delta Celsius to target unit delta
  let targetDelta;
  switch (toUnit) {
    case 'C':
    case 'K':
      targetDelta = deltaC;
      break;
    case 'F':
    case 'R':
      targetDelta = deltaC * 9 / 5;
      break;
    case 'Re':
      targetDelta = deltaC * 4 / 5;
      break;
    case 'Ro':
      targetDelta = deltaC * 21 / 40;
      break;
    case 'N':
      targetDelta = deltaC * 33 / 100;
      break;
    case 'De':
      targetDelta = deltaC * 3 / 2;
      break;
    default:
      return { error: 'Unsupported unit' };
  }

  const rounded = Number(Math.round(targetDelta + 'e4') + 'e-4');
  return {
    inputValue: val,
    fromUnit,
    toUnit,
    result: rounded,
    formattedResult: `${formatNumber(rounded)} Δ${UNITS[toUnit].symbol}`,
    formula: `Δ${UNITS[toUnit].symbol} ratio calculation (Offsets cancel out for ΔT)`,
    explanation: `A temperature shift of ${val} Δ${UNITS[fromUnit].symbol} equals a change of ${formatNumber(rounded)} Δ${UNITS[toUnit].symbol}. Zero-point baseline offsets (+32, +273.15) do not apply to temperature differences.`
  };
}

