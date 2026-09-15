/**
 * Time and Duration Converter Engine
 * Pivot unit: Seconds (s)
 */

export const TIME_UNITS = {
  s: { name: 'Seconds', symbol: 's', inSeconds: 1 },
  ms: { name: 'Milliseconds', symbol: 'ms', inSeconds: 0.001 },
  us: { name: 'Microseconds', symbol: 'μs', inSeconds: 0.000001 },
  ns: { name: 'Nanoseconds', symbol: 'ns', inSeconds: 1e-9 },
  min: { name: 'Minutes', symbol: 'min', inSeconds: 60 },
  hr: { name: 'Hours', symbol: 'hr', inSeconds: 3600 },
  d: { name: 'Days', symbol: 'd', inSeconds: 86400 },
  wk: { name: 'Weeks', symbol: 'wk', inSeconds: 604800 },
  mo: { name: 'Months (30.44 days)', symbol: 'mo', inSeconds: 2629746 },
  yr: { name: 'Years (365.25 days)', symbol: 'yr', inSeconds: 31557600 }
};

export function toSeconds(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = TIME_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported time unit: ${fromUnit}`);
  return val * unit.inSeconds;
}

export function fromSeconds(secondsValue, toUnit) {
  const val = Number(secondsValue);
  if (isNaN(val)) return NaN;
  const unit = TIME_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported time unit: ${toUnit}`);
  return val / unit.inSeconds;
}

export function convertTime(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!TIME_UNITS[fromUnit] || !TIME_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const seconds = toSeconds(numericValue, fromUnit);
  const rawResult = fromSeconds(seconds, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0 
    ? Number(rawResult.toPrecision(6)) 
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = TIME_UNITS[fromUnit].inSeconds / TIME_UNITS[toUnit].inSeconds;
  const formula = `${TIME_UNITS[toUnit].symbol} = ${TIME_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1 
    ? `Multiply ${numericValue} ${TIME_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${TIME_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${TIME_UNITS[fromUnit].symbol} by ${Number((1/ratio).toFixed(6))} to get ${roundedResult} ${TIME_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: TIME_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: TIME_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${TIME_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${TIME_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
