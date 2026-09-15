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
