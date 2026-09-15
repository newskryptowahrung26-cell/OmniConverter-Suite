/**
 * Length and Distance Converter Engine
 * Pivot unit: Meters (m)
 */

export const LENGTH_UNITS = {
  m: { name: 'Meters', symbol: 'm', inMeters: 1 },
  km: { name: 'Kilometers', symbol: 'km', inMeters: 1000 },
  cm: { name: 'Centimeters', symbol: 'cm', inMeters: 0.01 },
  mm: { name: 'Millimeters', symbol: 'mm', inMeters: 0.001 },
  um: { name: 'Micrometers', symbol: 'μm', inMeters: 0.000001 },
  nm: { name: 'Nanometers', symbol: 'nm', inMeters: 1e-9 },
  mi: { name: 'Miles', symbol: 'mi', inMeters: 1609.344 },
  yd: { name: 'Yards', symbol: 'yd', inMeters: 0.9144 },
  ft: { name: 'Feet', symbol: 'ft', inMeters: 0.3048 },
  in: { name: 'Inches', symbol: 'in', inMeters: 0.0254 },
  nmi: { name: 'Nautical Miles', symbol: 'nmi', inMeters: 1852 }
};

export function toMeters(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = LENGTH_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported length unit: ${fromUnit}`);
  return val * unit.inMeters;
}

export function fromMeters(metersValue, toUnit) {
  const val = Number(metersValue);
  if (isNaN(val)) return NaN;
  const unit = LENGTH_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported length unit: ${toUnit}`);
  return val / unit.inMeters;
}

export function convertLength(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!LENGTH_UNITS[fromUnit] || !LENGTH_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const meters = toMeters(numericValue, fromUnit);
  const rawResult = fromMeters(meters, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = LENGTH_UNITS[fromUnit].inMeters / LENGTH_UNITS[toUnit].inMeters;
  const formula = `${LENGTH_UNITS[toUnit].symbol} = ${LENGTH_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1 
    ? `Multiply ${numericValue} ${LENGTH_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${LENGTH_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${LENGTH_UNITS[fromUnit].symbol} by ${Number((1/ratio).toFixed(6))} to get ${roundedResult} ${LENGTH_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: LENGTH_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: LENGTH_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${LENGTH_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${LENGTH_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
