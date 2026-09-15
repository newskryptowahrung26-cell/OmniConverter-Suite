/**
 * Area Converter Engine
 * Pivot unit: Square Meters (m²)
 */

export const AREA_UNITS = {
  m2: { name: 'Square Meters', symbol: 'm²', inM2: 1 },
  km2: { name: 'Square Kilometers', symbol: 'km²', inM2: 1000000 },
  cm2: { name: 'Square Centimeters', symbol: 'cm²', inM2: 0.0001 },
  mm2: { name: 'Square Millimeters', symbol: 'mm²', inM2: 0.000001 },
  ha: { name: 'Hectares', symbol: 'ha', inM2: 10000 },
  ac: { name: 'Acres', symbol: 'ac', inM2: 4046.8564224 },
  mi2: { name: 'Square Miles', symbol: 'mi²', inM2: 2589988.110336 },
  yd2: { name: 'Square Yards', symbol: 'yd²', inM2: 0.83612736 },
  ft2: { name: 'Square Feet', symbol: 'ft²', inM2: 0.09290304 },
  in2: { name: 'Square Inches', symbol: 'in²', inM2: 0.00064516 }
};

export function toM2(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = AREA_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported area unit: ${fromUnit}`);
  return val * unit.inM2;
}

export function fromM2(m2Value, toUnit) {
  const val = Number(m2Value);
  if (isNaN(val)) return NaN;
  const unit = AREA_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported area unit: ${toUnit}`);
  return val / unit.inM2;
}

export function convertArea(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!AREA_UNITS[fromUnit] || !AREA_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const m2 = toM2(numericValue, fromUnit);
  const rawResult = fromM2(m2, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = AREA_UNITS[fromUnit].inM2 / AREA_UNITS[toUnit].inM2;
  const formula = `${AREA_UNITS[toUnit].symbol} = ${AREA_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1 
    ? `Multiply ${numericValue} ${AREA_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${AREA_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${AREA_UNITS[fromUnit].symbol} by ${Number((1/ratio).toFixed(6))} to get ${roundedResult} ${AREA_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: AREA_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: AREA_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${AREA_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${AREA_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
