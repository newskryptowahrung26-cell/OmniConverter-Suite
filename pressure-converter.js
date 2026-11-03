/**
 * Pressure Converter Engine
 * Pivot unit: Pascal (Pa)
 * Sources: NIST, BIPM, ISO 80000-4
 */

export const PRESSURE_UNITS = {
  pa:   { name: 'Pascal',             symbol: 'Pa',   inPa: 1 },
  kpa:  { name: 'Kilopascal',         symbol: 'kPa',  inPa: 1000 },
  mpa:  { name: 'Megapascal',         symbol: 'MPa',  inPa: 1_000_000 },
  bar:  { name: 'Bar',                symbol: 'bar',  inPa: 100_000 },
  mbar: { name: 'Millibar',           symbol: 'mbar', inPa: 100 },
  psi:  { name: 'Pounds per Sq Inch', symbol: 'psi',  inPa: 6894.757 },
  atm:  { name: 'Standard Atmosphere',symbol: 'atm',  inPa: 101_325 },
  mmhg: { name: 'Millimetre of Mercury (Torr)', symbol: 'mmHg', inPa: 133.3224 },
  torr: { name: 'Torr',               symbol: 'Torr', inPa: 133.3224 },
  inhg: { name: 'Inch of Mercury',    symbol: 'inHg', inPa: 3386.389 }
};

export function toPa(value, fromUnit) {
  const val = Number(value);
  if (isNaN(val)) return NaN;
  const unit = PRESSURE_UNITS[fromUnit];
  if (!unit) throw new Error(`Unsupported pressure unit: ${fromUnit}`);
  return val * unit.inPa;
}

export function fromPa(paValue, toUnit) {
  const val = Number(paValue);
  if (isNaN(val)) return NaN;
  const unit = PRESSURE_UNITS[toUnit];
  if (!unit) throw new Error(`Unsupported pressure unit: ${toUnit}`);
  return val / unit.inPa;
}

export function convertPressure(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue)) return { error: 'Invalid numeric input' };
  if (!PRESSURE_UNITS[fromUnit] || !PRESSURE_UNITS[toUnit]) return { error: 'Invalid unit specified' };

  const pa = toPa(numericValue, fromUnit);
  const rawResult = fromPa(pa, toUnit);

  const roundedResult = Math.abs(rawResult) < 1e-6 && rawResult !== 0
    ? Number(rawResult.toPrecision(6))
    : Number(Math.round(rawResult + 'e6') + 'e-6');

  const ratio = PRESSURE_UNITS[fromUnit].inPa / PRESSURE_UNITS[toUnit].inPa;
  const formula = `${PRESSURE_UNITS[toUnit].symbol} = ${PRESSURE_UNITS[fromUnit].symbol} × ${Number(ratio.toFixed(6))}`;
  const explanation = ratio >= 1
    ? `Multiply ${numericValue} ${PRESSURE_UNITS[fromUnit].symbol} by ${Number(ratio.toFixed(6))} to get ${roundedResult} ${PRESSURE_UNITS[toUnit].symbol}.`
    : `Divide ${numericValue} ${PRESSURE_UNITS[fromUnit].symbol} by ${Number((1 / ratio).toFixed(6))} to get ${roundedResult} ${PRESSURE_UNITS[toUnit].symbol}.`;

  return {
    inputValue: numericValue,
    fromUnit,
    fromSymbol: PRESSURE_UNITS[fromUnit].symbol,
    toUnit,
    toSymbol: PRESSURE_UNITS[toUnit].symbol,
    rawResult,
    result: roundedResult,
    formattedResult: `${formatNumber(roundedResult)} ${PRESSURE_UNITS[toUnit].symbol}`,
    formattedInput: `${formatNumber(numericValue)} ${PRESSURE_UNITS[fromUnit].symbol}`,
    formula,
    explanation
  };
}

function formatNumber(num) {
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);
}
