/**
 * Volume and Capacity Converter Engine
 * Pivot unit: Liters (L)
 */

export const VOLUME_UNITS = {
  l: { name: 'Liters', symbol: 'L', inLiters: 1 },
  ml: { name: 'Milliliters', symbol: 'mL', inLiters: 0.001 },
  m3: { name: 'Cubic Meters', symbol: 'm³', inLiters: 1000 },
  cm3: { name: 'Cubic Centimeters', symbol: 'cm³', inLiters: 0.001 },
  gal: { name: 'US Gallons', symbol: 'gal', inLiters: 3.785411784 },
  qt: { name: 'US Quarts', symbol: 'qt', inLiters: 0.946352946 },
  pt: { name: 'US Pints', symbol: 'pt', inLiters: 0.473176473 },
  cup: { name: 'US Cups', symbol: 'cup', inLiters: 0.24 },
  floz: { name: 'Fluid Ounces (US)', symbol: 'fl oz', inLiters: 0.0295735295625 },
  tbsp: { name: 'Tablespoons (US)', symbol: 'tbsp', inLiters: 0.01478676478125 },
  tsp: { name: 'Teaspoons (US)', symbol: 'tsp', inLiters: 0.00492892159375 },
  impgal: { name: 'Imperial Gallons', symbol: 'imp gal', inLiters: 4.54609 }
};

export function toLiters(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = VOLUME_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported volume unit: ${fromUnit}`);
  return val * unit.inLiters;
}

export function fromLiters(litersValue, toUnit) {
  const val = Number(litersValue);
  if (isNaN(val)) return NaN;
  const unit = VOLUME_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported volume unit: ${toUnit}`);
  return val / unit.inLiters;
}

export function convertVolume(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!VOLUME_UNITS[fromUnit] || !VOLUME_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const liters = toLiters(numericValue, fromUnit);
  const rawResult = fromLiters(liters, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = VOLUME_UNITS[fromUnit].inLiters / VOLUME_UNITS[toUnit].inLiters;
  const formula = `${VOLUME_UNITS[toUnit].symbol} = ${VOLUME_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1 
    ? `Multiply ${numericValue} ${VOLUME_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${VOLUME_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${VOLUME_UNITS[fromUnit].symbol} by ${Number((1/ratio).toFixed(6))} to get ${roundedResult} ${VOLUME_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: VOLUME_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: VOLUME_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${VOLUME_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${VOLUME_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
