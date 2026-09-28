/**
 * OmniConverter Currency Engine
 * Base currency pivot: USD (United States Dollar)
 * Free API fallback: open.er-api.com (CORS-enabled, zero API key required)
 */

export const CURRENCY_UNITS = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸', code: 'USD', decimals: 2 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', code: 'AUD', decimals: 2 },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', code: 'EUR', decimals: 2 },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧', code: 'GBP', decimals: 2 },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', code: 'CAD', decimals: 2 },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', code: 'JPY', decimals: 0 },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', code: 'INR', decimals: 2 },
  PKR: { name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', code: 'PKR', decimals: 2 },
  VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', code: 'VND', decimals: 0 },
  KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', code: 'KRW', decimals: 0 },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', code: 'CNY', decimals: 2 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', code: 'CHF', decimals: 2 },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', code: 'NZD', decimals: 2 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', code: 'SGD', decimals: 2 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', code: 'HKD', decimals: 2 },
  AED: { name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', code: 'AED', decimals: 2 },
  SAR: { name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', code: 'SAR', decimals: 2 },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', code: 'MXN', decimals: 2 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', code: 'BRL', decimals: 2 },
  ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦', code: 'ZAR', decimals: 2 },
  TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', code: 'TRY', decimals: 2 },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', code: 'THB', decimals: 2 },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', code: 'MYR', decimals: 2 },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', code: 'IDR', decimals: 0 },
  PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', code: 'PHP', decimals: 2 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', code: 'SEK', decimals: 2 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', code: 'NOK', decimals: 2 },
  DKK: { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', code: 'DKK', decimals: 2 },
  PLN: { name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', code: 'PLN', decimals: 2 },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', code: 'CZK', decimals: 2 },
  ILS: { name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', code: 'ILS', decimals: 2 },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', code: 'HUF', decimals: 0 },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', code: 'TWD', decimals: 2 },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼', code: 'KWD', decimals: 3 },
  BHD: { name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭', code: 'BHD', decimals: 3 },
  QAR: { name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦', code: 'QAR', decimals: 2 }
};

export const DEFAULT_RATES = {
  USD: 1,
  AUD: 1.4258,
  EUR: 0.8784,
  GBP: 0.7556,
  CAD: 1.4149,
  JPY: 157.489,
  INR: 95.9279,
  PKR: 276.91,
  VND: 25936.55,
  KRW: 1356.04,
  CNY: 6.7195,
  CHF: 0.8293,
  NZD: 1.7677,
  SGD: 1.2782,
  HKD: 7.8445,
  AED: 3.6725,
  SAR: 3.7500,
  MXN: 17.7355,
  BRL: 5.1895,
  ZAR: 16.3221,
  TRY: 48.9485,
  THB: 33.4161,
  MYR: 4.0744,
  IDR: 17921.04,
  PHP: 62.4499,
  SEK: 9.9235,
  NOK: 9.5148,
  DKK: 6.5587,
  PLN: 3.8408,
  CZK: 21.3996,
  ILS: 3.0456,
  HUF: 320.92,
  TWD: 31.7654,
  KWD: 0.3083,
  BHD: 0.3760,
  QAR: 3.6400
};

let activeRates = { ...DEFAULT_RATES };
let lastUpdateTimestamp = 'Cached Reference Rates';
let isLiveSynced = false;

const CACHE_KEY = 'omniconverter_fx_rates';
const CACHE_TIME_KEY = 'omniconverter_fx_time';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function fetchLiveRates() {
  if (typeof window === 'undefined') {
    return { rates: activeRates, lastUpdate: lastUpdateTimestamp, isLive: false };
  }

  try {
    const cachedRatesStr = localStorage.getItem(CACHE_KEY);
    const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedRatesStr && cachedTimeStr && (now - Number(cachedTimeStr) < CACHE_TTL_MS)) {
      const parsed = JSON.parse(cachedRatesStr);
      activeRates = { ...DEFAULT_RATES, ...parsed };
      isLiveSynced = true;
      lastUpdateTimestamp = new Date(Number(cachedTimeStr)).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return { rates: activeRates, lastUpdate: lastUpdateTimestamp, isLive: true };
    }

    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        activeRates = { ...DEFAULT_RATES, ...data.rates };
        isLiveSynced = true;
        lastUpdateTimestamp = data.time_last_update_utc 
          ? new Date(data.time_last_update_utc).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          : new Date().toLocaleDateString('en-GB');

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.rates));
          localStorage.setItem(CACHE_TIME_KEY, String(now));
        } catch (e) {
          // LocalStorage may fail in private mode
        }
        return { rates: activeRates, lastUpdate: lastUpdateTimestamp, isLive: true };
      }
    }
  } catch (err) {
    console.warn('Currency API sync unavailable, utilizing high-precision offline fallback rates.', err);
  }

  return { rates: activeRates, lastUpdate: lastUpdateTimestamp, isLive: isLiveSynced };
}

export function getActiveRates() {
  return activeRates;
}

export function formatRate(rate) {
  if (isNaN(rate)) return '0';
  if (rate >= 1000) return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(rate);
  if (rate >= 1) return rate.toFixed(4);
  return rate.toPrecision(4);
}

export function formatCurrencyValue(val, code) {
  if (isNaN(val)) return '0.00';
  const unit = CURRENCY_UNITS[code];
  const decimals = unit && typeof unit.decimals === 'number' ? unit.decimals : 2;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(val);
}

export function convertCurrency(value, fromCur, toCur, customRates = null) {
  if (value === '' || value === null || value === undefined) return null;
  const numericValue = Number(value);
  if (isNaN(numericValue) || numericValue < 0) return { error: 'Please enter a valid positive amount' };

  fromCur = fromCur.toUpperCase();
  toCur = toCur.toUpperCase();

  const rates = customRates || activeRates;

  const fromRate = rates[fromCur];
  const toRate = rates[toCur];

  if (!fromRate || !toRate) {
    return { error: `Unsupported currency pair: ${fromCur} to ${toCur}` };
  }

  // Cross-rate calculation relative to USD base
  // USD -> fromCur rate = fromRate; USD -> toCur rate = toRate
  // 1 fromCur = (toRate / fromRate) toCur
  const exchangeRate = toRate / fromRate;
  const rawResult = numericValue * exchangeRate;
  const inverseRate = fromRate / toRate;

  const fromUnit = CURRENCY_UNITS[fromCur] || { name: fromCur, symbol: fromCur, flag: '🌐', decimals: 2 };
  const toUnit = CURRENCY_UNITS[toCur] || { name: toCur, symbol: toCur, flag: '🌐', decimals: 2 };

  const formattedInput = `${fromUnit.symbol}${formatCurrencyValue(numericValue, fromCur)} ${fromCur}`;
  const formattedResult = `${toUnit.symbol}${formatCurrencyValue(rawResult, toCur)} ${toCur}`;

  const formula = `1 ${fromCur} = ${formatRate(exchangeRate)} ${toCur}`;
  const inverseFormula = `1 ${toCur} = ${formatRate(inverseRate)} ${fromCur}`;

  const explanation = `${numericValue} ${fromCur} × ${formatRate(exchangeRate)} = ${toUnit.symbol}${formatCurrencyValue(rawResult, toCur)} ${toCur}`;

  return {
    inputValue: numericValue,
    fromCur,
    fromName: fromUnit.name,
    fromSymbol: fromUnit.symbol,
    fromFlag: fromUnit.flag,
    toCur,
    toName: toUnit.name,
    toSymbol: toUnit.symbol,
    toFlag: toUnit.flag,
    rate: exchangeRate,
    inverseRate: inverseRate,
    rawResult,
    formattedInput,
    formattedResult,
    formula,
    inverseFormula,
    explanation
  };
}

export function generateMatrix(fromCur, toCur, customRates = null) {
  const steps = [1, 5, 10, 20, 50, 100, 250, 500, 1000, 5000];
  return steps.map(amt => {
    const conv = convertCurrency(amt, fromCur, toCur, customRates);
    const inv = convertCurrency(amt, toCur, fromCur, customRates);
    return {
      amount: amt,
      forwardFormatted: conv ? conv.formattedResult : '',
      reverseFormatted: inv ? inv.formattedResult : ''
    };
  });
}
