/**
 * Speed Converter Engine
 * Pivot unit: Meters per Second (m/s)
 */

export const SPEED_UNITS = {
  ms: { name: 'Meters per Second', symbol: 'm/s', inMS: 1 },
  kmh: { name: 'Kilometers per Hour', symbol: 'km/h', inMS: 0.2777777777777778 },
  mph: { name: 'Miles per Hour', symbol: 'mph', inMS: 0.44704 },
  kn: { name: 'Knots', symbol: 'kn', inMS: 0.5144444444444445 },
  fts: { name: 'Feet per Second', symbol: 'ft/s', inMS: 0.3048 },
  mach: { name: 'Mach (at sea level)', symbol: 'Mach', inMS: 343 }
};

export function toMS(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = SPEED_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported speed unit: ${fromUnit}`);
  return val * unit.inMS;
}

export function fromMS(msValue, toUnit) {
  const val = Number(msValue);
  if (isNaN(val)) return NaN;
  const unit = SPEED_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported speed unit: ${toUnit}`);
  return val / unit.inMS;
}

export function convertSpeed(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!SPEED_UNITS[fromUnit] || !SPEED_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const ms = toMS(numericValue, fromUnit);
  const rawResult = fromMS(ms, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = SPEED_UNITS[fromUnit].inMS / SPEED_UNITS[toUnit].inMS;
  const formula = `${SPEED_UNITS[toUnit].symbol} = ${SPEED_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1 
    ? `Multiply ${numericValue} ${SPEED_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${SPEED_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${SPEED_UNITS[fromUnit].symbol} by ${Number((1/ratio).toFixed(6))} to get ${roundedResult} ${SPEED_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: SPEED_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: SPEED_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${SPEED_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${SPEED_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
