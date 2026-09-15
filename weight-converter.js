/**
 * Weight and Mass Converter Engine
 * Pivot unit: Grams (g)
 */

export const WEIGHT_UNITS = {
  kg: { name: 'Kilograms', symbol: 'kg', inGrams: 1000 },
  g: { name: 'Grams', symbol: 'g', inGrams: 1 },
  mg: { name: 'Milligrams', symbol: 'mg', inGrams: 0.001 },
  t: { name: 'Metric Tons', symbol: 't', inGrams: 1000000 },
  lb: { name: 'Pounds', symbol: 'lb', inGrams: 453.59237 },
  oz: { name: 'Ounces', symbol: 'oz', inGrams: 28.349523125 },
  st: { name: 'Stones', symbol: 'st', inGrams: 6350.29318 },
  usTon: { name: 'US Tons (Short)', symbol: 'ton', inGrams: 907184.74 },
  impTon: { name: 'Imperial Tons (Long)', symbol: 'long ton', inGrams: 1016046.9088 },
  ct: { name: 'Carats', symbol: 'ct', inGrams: 0.2 }
};

export function toGrams(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = WEIGHT_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported weight unit: ${fromUnit}`);
  return val * unit.inGrams;
}

export function fromGrams(gramsValue, toUnit) {
  const val = Number(gramsValue);
  if (isNaN(val)) return NaN;
  const unit = WEIGHT_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported weight unit: ${toUnit}`);
  return val / unit.inGrams;
}

export function convertWeight(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return { error: 'Invalid numeric input' };
  }

  if (!WEIGHT_UNITS[fromUnit] || !WEIGHT_UNITS[toUnit]) {
    return { error: 'Invalid unit specified' };
  }

  const grams = toGrams(numericValue, fromUnit);
  const rawResult = fromGrams(grams, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const formula = getWeightFormulaText(fromUnit, toUnit);
  const explanation = getWeightStepByStepExplanation(numericValue, fromUnit, toUnit, rawResult);

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: WEIGHT_UNITS[fromUnit].symbol,
    fromName: WEIGHT_UNITS[fromUnit].name,
    toUnit,
    toSymbol: WEIGHT_UNITS[toUnit].symbol,
    toName: WEIGHT_UNITS[toUnit].name,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${WEIGHT_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${WEIGHT_UNITS[fromUnit].symbol}`,
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

export function getWeightFormulaText(fromUnit, toUnit) {
  if (fromUnit === toUnit) return `${WEIGHT_UNITS[toUnit].symbol} = ${WEIGHT_UNITS[fromUnit].symbol}`;

  const key = `${fromUnit}_${toUnit}`;
  const formulas = {
    'kg_lb': 'lb = kg × 2.20462',
    'lb_kg': 'kg = lb ÷ 2.20462',
    'kg_g': 'g = kg × 1,000',
    'g_kg': 'kg = g ÷ 1,000',
    'lb_oz': 'oz = lb × 16',
    'oz_lb': 'lb = oz ÷ 16',
    'st_lb': 'lb = st × 14',
    'lb_st': 'st = lb ÷ 14',
    'st_kg': 'kg = st × 6.35029',
    'kg_st': 'st = kg ÷ 6.35029',
    't_kg': 'kg = t × 1,000',
    'kg_t': 't = kg ÷ 1,000',
    'g_mg': 'mg = g × 1,000',
    'mg_g': 'g = mg ÷ 1,000'
  };

  if (formulas[key]) return formulas[key];

  const ratio = WEIGHT_UNITS[fromUnit].inGrams / WEIGHT_UNITS[toUnit].inGrams;
  return `${WEIGHT_UNITS[toUnit].symbol} = ${WEIGHT_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
}

export function getWeightStepByStepExplanation(val, fromUnit, toUnit, rawResult) {
  const fromSym = WEIGHT_UNITS[fromUnit].symbol;
  const toSym = WEIGHT_UNITS[toUnit].symbol;

  if (fromUnit === toUnit) {
    return `${val} ${fromSym} is identical to ${val} ${toSym}.`;
  }

  const roundedRes = Number(Math.round(rawResult + 'e4') + 'e-4');
  const ratio = WEIGHT_UNITS[fromUnit].inGrams / WEIGHT_UNITS[toUnit].inGrams;

  if (ratio >= 1) {
    return `Multiply ${val} ${fromSym} by ${Number(ratio.toFixed(6))} to get ${roundedRes} ${toSym}.`;
  } else {
    const invRatio = 1 / ratio;
    return `Divide ${val} ${fromSym} by ${Number(invRatio.toFixed(6))} to get ${roundedRes} ${toSym}.`;
  }
}
