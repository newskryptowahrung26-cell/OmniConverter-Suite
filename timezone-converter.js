/**
 * timezone-converter.js
 * Comprehensive worldwide time zone & clock conversion library.
 * Built with native vanilla JavaScript Intl.DateTimeFormat API.
 */

export const WORLD_CITIES = [
  // South Asia
  { id: 'Asia/Karachi', city: 'Karachi / Islamabad', country: 'Pakistan', flag: '🇵🇰', region: 'Asia', code: 'PKT', defaultOffset: '+05:00', keywords: 'pakistan karachi islamabad lahore rawalpindi pkt' },
  { id: 'Asia/Kolkata', city: 'New Delhi / Mumbai', country: 'India', flag: '🇮🇳', region: 'Asia', code: 'IST', defaultOffset: '+05:30', keywords: 'india delhi mumbai bangalore calcutta kolkata ist' },
  { id: 'Asia/Dhaka', city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩', region: 'Asia', code: 'BST', defaultOffset: '+06:00', keywords: 'bangladesh dhaka bst' },
  { id: 'Asia/Kathmandu', city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', region: 'Asia', code: 'NPT', defaultOffset: '+05:45', keywords: 'nepal kathmandu npt' },
  { id: 'Asia/Colombo', city: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', code: 'IST', defaultOffset: '+05:30', keywords: 'sri lanka colombo' },

  // Middle East
  { id: 'Asia/Dubai', city: 'Dubai / Abu Dhabi', country: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', code: 'GST', defaultOffset: '+04:00', keywords: 'uae dubai abu dhabi gst emirates' },
  { id: 'Asia/Riyadh', city: 'Riyadh / Jeddah', country: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', code: 'AST', defaultOffset: '+03:00', keywords: 'saudi arabia riyadh jeddah mecca medina ast ksa' },
  { id: 'Asia/Qatar', city: 'Doha', country: 'Qatar', flag: '🇶🇦', region: 'Middle East', code: 'AST', defaultOffset: '+03:00', keywords: 'qatar doha ast' },
  { id: 'Asia/Kuwait', city: 'Kuwait City', country: 'Kuwait', flag: '🇰🇼', region: 'Middle East', code: 'AST', defaultOffset: '+03:00', keywords: 'kuwait ast' },
  { id: 'Asia/Muscat', city: 'Muscat', country: 'Oman', flag: '🇴🇲', region: 'Middle East', code: 'GST', defaultOffset: '+04:00', keywords: 'oman muscat gst' },
  { id: 'Asia/Bahrain', city: 'Manama', country: 'Bahrain', flag: '🇧🇭', region: 'Middle East', code: 'AST', defaultOffset: '+03:00', keywords: 'bahrain manama' },
  { id: 'Europe/Istanbul', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', region: 'Middle East', code: 'TRT', defaultOffset: '+03:00', keywords: 'turkey istanbul ankara trt' },

  // Europe & UK
  { id: 'Europe/London', city: 'London', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', code: 'GMT/BST', defaultOffset: '+00:00', keywords: 'uk britain london england gmt bst' },
  { id: 'Europe/Paris', city: 'Paris', country: 'France', flag: '🇫🇷', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'france paris cet cest' },
  { id: 'Europe/Berlin', city: 'Berlin / Frankfurt', country: 'Germany', flag: '🇩🇪', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'germany berlin frankfurt munich cet cest' },
  { id: 'Europe/Madrid', city: 'Madrid', country: 'Spain', flag: '🇪🇸', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'spain madrid barcelona cet' },
  { id: 'Europe/Rome', city: 'Rome', country: 'Italy', flag: '🇮🇹', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'italy rome milan cet' },
  { id: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'netherlands amsterdam holland cet' },
  { id: 'Europe/Brussels', city: 'Brussels', country: 'Belgium', flag: '🇧🇪', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'belgium brussels cet' },
  { id: 'Europe/Zurich', city: 'Zurich / Geneva', country: 'Switzerland', flag: '🇨🇭', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'switzerland zurich geneva cet' },
  { id: 'Europe/Vienna', city: 'Vienna', country: 'Austria', flag: '🇦🇹', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'austria vienna cet' },
  { id: 'Europe/Dublin', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', region: 'Europe', code: 'GMT/IST', defaultOffset: '+00:00', keywords: 'ireland dublin gmt' },
  { id: 'Europe/Lisbon', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', region: 'Europe', code: 'WET/WEST', defaultOffset: '+00:00', keywords: 'portugal lisbon wet' },
  { id: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden', flag: '🇸🇪', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'sweden stockholm cet' },
  { id: 'Europe/Athens', city: 'Athens', country: 'Greece', flag: '🇬🇷', region: 'Europe', code: 'EET/EEST', defaultOffset: '+02:00', keywords: 'greece athens eet' },
  { id: 'Europe/Warsaw', city: 'Warsaw', country: 'Poland', flag: '🇵🇱', region: 'Europe', code: 'CET/CEST', defaultOffset: '+01:00', keywords: 'poland warsaw cet' },
  { id: 'Europe/Kyiv', city: 'Kyiv', country: 'Ukraine', flag: '🇺🇦', region: 'Europe', code: 'EET/EEST', defaultOffset: '+02:00', keywords: 'ukraine kyiv eet' },
  { id: 'Europe/Moscow', city: 'Moscow', country: 'Russia', flag: '🇷🇺', region: 'Europe', code: 'MSK', defaultOffset: '+03:00', keywords: 'russia moscow msk' },

  // North America
  { id: 'America/New_York', city: 'New York', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'EDT/EST', defaultOffset: '-04:00', keywords: 'usa united states new york nyc edt est eastern us' },
  { id: 'America/Chicago', city: 'Chicago', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'CDT/CST', defaultOffset: '-05:00', keywords: 'usa chicago cdt cst central us' },
  { id: 'America/Denver', city: 'Denver', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'MDT/MST', defaultOffset: '-06:00', keywords: 'usa denver mdt mst mountain us' },
  { id: 'America/Los_Angeles', city: 'Los Angeles / San Francisco', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'PDT/PST', defaultOffset: '-07:00', keywords: 'usa los angeles san francisco california pdt pst pacific us' },
  { id: 'America/Phoenix', city: 'Phoenix', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'MST', defaultOffset: '-07:00', keywords: 'usa phoenix arizona mst' },
  { id: 'America/Anchorage', city: 'Anchorage', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'AKDT/AKST', defaultOffset: '-08:00', keywords: 'usa alaska anchorage akdt akst' },
  { id: 'Pacific/Honolulu', city: 'Honolulu', country: 'United States', flag: '🇺🇸', region: 'North America', code: 'HST', defaultOffset: '-10:00', keywords: 'usa hawaii honolulu hst' },
  { id: 'America/Toronto', city: 'Toronto / Montreal', country: 'Canada', flag: '🇨🇦', region: 'North America', code: 'EDT/EST', defaultOffset: '-04:00', keywords: 'canada toronto montreal ontario edt est' },
  { id: 'America/Vancouver', city: 'Vancouver', country: 'Canada', flag: '🇨🇦', region: 'North America', code: 'PDT/PST', defaultOffset: '-07:00', keywords: 'canada vancouver british columbia pdt pst' },
  { id: 'America/Edmonton', city: 'Calgary / Edmonton', country: 'Canada', flag: '🇨🇦', region: 'North America', code: 'MDT/MST', defaultOffset: '-06:00', keywords: 'canada calgary edmonton alberta' },
  { id: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', region: 'North America', code: 'CST', defaultOffset: '-06:00', keywords: 'mexico mexico city cst' },

  // East & Southeast Asia
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'Asia', code: 'JST', defaultOffset: '+09:00', keywords: 'japan tokyo osaka jst' },
  { id: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', region: 'Asia', code: 'KST', defaultOffset: '+09:00', keywords: 'korea seoul kst' },
  { id: 'Asia/Shanghai', city: 'Beijing / Shanghai', country: 'China', flag: '🇨🇳', region: 'Asia', code: 'CST', defaultOffset: '+08:00', keywords: 'china beijing shanghai cst' },
  { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', region: 'Asia', code: 'HKT', defaultOffset: '+08:00', keywords: 'hong kong hkt' },
  { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', region: 'Asia', code: 'SGT', defaultOffset: '+08:00', keywords: 'singapore sgt' },
  { id: 'Asia/Taipei', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', region: 'Asia', code: 'CST', defaultOffset: '+08:00', keywords: 'taiwan taipei' },
  { id: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', region: 'Asia', code: 'ICT', defaultOffset: '+07:00', keywords: 'thailand bangkok ict' },
  { id: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', region: 'Asia', code: 'WIB', defaultOffset: '+07:00', keywords: 'indonesia jakarta wib' },
  { id: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', region: 'Asia', code: 'MYT', defaultOffset: '+08:00', keywords: 'malaysia kuala lumpur myt' },
  { id: 'Asia/Manila', city: 'Manila', country: 'Philippines', flag: '🇵🇭', region: 'Asia', code: 'PST', defaultOffset: '+08:00', keywords: 'philippines manila pst' },
  { id: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh City / Hanoi', country: 'Vietnam', flag: '🇻🇳', region: 'Asia', code: 'ICT', defaultOffset: '+07:00', keywords: 'vietnam hanoi ho chi minh ict' },

  // Australia & Pacific
  { id: 'Australia/Sydney', city: 'Sydney / Melbourne', country: 'Australia', flag: '🇦🇺', region: 'Oceania', code: 'AEST/AEDT', defaultOffset: '+10:00', keywords: 'australia sydney melbourne canberra aest aedt' },
  { id: 'Australia/Brisbane', city: 'Brisbane', country: 'Australia', flag: '🇦🇺', region: 'Oceania', code: 'AEST', defaultOffset: '+10:00', keywords: 'australia brisbane queensland aest' },
  { id: 'Australia/Adelaide', city: 'Adelaide', country: 'Australia', flag: '🇦🇺', region: 'Oceania', code: 'ACST/ACDT', defaultOffset: '+09:30', keywords: 'australia adelaide acst acdt' },
  { id: 'Australia/Perth', city: 'Perth', country: 'Australia', flag: '🇦🇺', region: 'Oceania', code: 'AWST', defaultOffset: '+08:00', keywords: 'australia perth awst' },
  { id: 'Pacific/Auckland', city: 'Auckland / Wellington', country: 'New Zealand', flag: '🇳🇿', region: 'Oceania', code: 'NZST/NZDT', defaultOffset: '+12:00', keywords: 'new zealand auckland wellington nzst nzdt' },
  { id: 'Pacific/Fiji', city: 'Suva', country: 'Fiji', flag: '🇫🇯', region: 'Oceania', code: 'FJT', defaultOffset: '+12:00', keywords: 'fiji suva fjt' },

  // Africa
  { id: 'Africa/Cairo', city: 'Cairo', country: 'Egypt', flag: '🇪🇬', region: 'Africa', code: 'EET/EEST', defaultOffset: '+02:00', keywords: 'egypt cairo eet' },
  { id: 'Africa/Johannesburg', city: 'Johannesburg / Cape Town', country: 'South Africa', flag: '🇿🇦', region: 'Africa', code: 'SAST', defaultOffset: '+02:00', keywords: 'south africa johannesburg cape town sast' },
  { id: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', flag: '🇳🇬', region: 'Africa', code: 'WAT', defaultOffset: '+01:00', keywords: 'nigeria lagos abuja wat' },
  { id: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya', flag: '🇰🇪', region: 'Africa', code: 'EAT', defaultOffset: '+03:00', keywords: 'kenya nairobi eat' },
  { id: 'Africa/Casablanca', city: 'Casablanca', country: 'Morocco', flag: '🇲🇦', region: 'Africa', code: 'WEST', defaultOffset: '+01:00', keywords: 'morocco casablanca' },
  { id: 'Africa/Accra', city: 'Accra', country: 'Ghana', flag: '🇬🇭', region: 'Africa', code: 'GMT', defaultOffset: '+00:00', keywords: 'ghana accra gmt' },

  // South America
  { id: 'America/Sao_Paulo', city: 'São Paulo / Rio de Janeiro', country: 'Brazil', flag: '🇧🇷', region: 'South America', code: 'BRT', defaultOffset: '-03:00', keywords: 'brazil sao paulo rio brt' },
  { id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', region: 'South America', code: 'ART', defaultOffset: '-03:00', keywords: 'argentina buenos aires art' },
  { id: 'America/Santiago', city: 'Santiago', country: 'Chile', flag: '🇨🇱', region: 'South America', code: 'CLT/CLST', defaultOffset: '-04:00', keywords: 'chile santiago clt' },
  { id: 'America/Bogota', city: 'Bogotá', country: 'Colombia', flag: '🇨🇴', region: 'South America', code: 'COT', defaultOffset: '-05:00', keywords: 'colombia bogota cot' },
  { id: 'America/Lima', city: 'Lima', country: 'Peru', flag: '🇵🇪', region: 'South America', code: 'PET', defaultOffset: '-05:00', keywords: 'peru lima pet' },

  // Universal
  { id: 'UTC', city: 'Coordinated Universal Time (UTC)', country: 'Universal', flag: '🌐', region: 'Universal', code: 'UTC', defaultOffset: '+00:00', keywords: 'utc gmt zulu universal standard time 0' }
];

/**
 * Calculates epoch Date for given local dateStr, timeStr in a specific IANA time zone
 */
export function getEpochFromLocalTime(dateStr, timeStr, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, min] = timeStr.split(':').map(Number);

  const guessUtc = new Date(Date.UTC(year, month - 1, day, hour, min, 0));

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(guessUtc);
  const map = {};
  for (const p of parts) map[p.type] = p.value;

  const tzYear = Number(map.year);
  const tzMonth = Number(map.month);
  const tzDay = Number(map.day);
  let tzHour = Number(map.hour);
  if (tzHour === 24) tzHour = 0;
  const tzMin = Number(map.minute);
  const tzSec = Number(map.second || 0);

  const tzAsUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMin, tzSec);
  const offsetMs = tzAsUtc - guessUtc.getTime();

  return new Date(guessUtc.getTime() - offsetMs);
}

/**
 * Returns time zone offset in minutes relative to UTC for a specific date
 */
export function getTimeZoneOffsetMinutes(timeZone, date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  for (const p of parts) map[p.type] = p.value;

  let h = Number(map.hour);
  if (h === 24) h = 0;

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    h,
    Number(map.minute),
    Number(map.second || 0)
  );

  return (asUtc - date.getTime()) / 60000;
}

/**
 * Formats offset minutes into "+05:00" or "-04:00" string
 */
export function formatOffsetString(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const totalMin = Math.abs(offsetMinutes);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return `UTC${sign}${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Gets abbreviation (e.g. EDT, PKT, GMT) for a time zone at a given date
 */
export function getTimeZoneAbbreviation(timeZone, date = new Date()) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
    const parts = fmt.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) {
    return '';
  }
}

/**
 * Gets day/night category and emoji based on local hour (0-23)
 */
export function getDayNightInfo(hour) {
  if (hour >= 6 && hour < 8) {
    return { category: 'dawn', label: 'Sunrise / Dawn', icon: '🌅', color: '#f59e0b' };
  } else if (hour >= 8 && hour < 17) {
    return { category: 'day', label: 'Daytime', icon: '☀️', color: '#eab308' };
  } else if (hour >= 17 && hour < 20) {
    return { category: 'dusk', label: 'Evening / Dusk', icon: '🌆', color: '#f97316' };
  } else {
    return { category: 'night', label: 'Night Time', icon: '🌙', color: '#6366f1' };
  }
}

/**
 * Evaluates business/working hour appropriateness for meetings (9:00 - 17:00 is standard)
 */
export function getBusinessHourStatus(hour) {
  if (hour >= 9 && hour < 17) {
    return {
      status: 'open',
      label: 'Standard Working Hours',
      badgeClass: 'badge-business-open',
      tagText: '🟢 Business Hours (9:00 - 17:00)',
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#059669'
    };
  } else if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 21)) {
    return {
      status: 'extended',
      label: 'Early Morning / Evening',
      badgeClass: 'badge-business-extended',
      tagText: '🟡 Extended / Commute Hours',
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#d97706'
    };
  } else {
    return {
      status: 'closed',
      label: 'Outside Business Hours / Sleep',
      badgeClass: 'badge-business-closed',
      tagText: '🔴 Outside Work Hours (Sleeping)',
      bg: 'rgba(239, 68, 68, 0.12)',
      color: '#dc2626'
    };
  }
}

/**
 * Main conversion function: converts given local date/time from source timezone to target timezone
 */
export function convertTimeZone(sourceDateStr, sourceTimeStr, fromTz, toTz) {
  // 1. Calculate UTC instant
  const epoch = getEpochFromLocalTime(sourceDateStr, sourceTimeStr, fromTz);

  // 2. Offsets & Differences
  const fromOffsetMin = getTimeZoneOffsetMinutes(fromTz, epoch);
  const toOffsetMin = getTimeZoneOffsetMinutes(toTz, epoch);
  const diffMinutes = toOffsetMin - fromOffsetMin;
  const diffHours = diffMinutes / 60;

  let diffLabel = '';
  if (diffMinutes === 0) {
    diffLabel = 'Same time as source location';
  } else {
    const absMin = Math.abs(diffMinutes);
    const hrs = Math.floor(absMin / 60);
    const mins = absMin % 60;
    const timeParts = [];
    if (hrs > 0) timeParts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
    if (mins > 0) timeParts.push(`${mins} min${mins > 1 ? 's' : ''}`);
    const timeText = timeParts.join(' ');
    diffLabel = diffMinutes > 0 ? `${timeText} ahead` : `${timeText} behind`;
  }

  // 3. Format Target Time in 12-hour and 24-hour
  const toFmt12 = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const toFmt24 = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const toFmtDateFull = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const toFmtDateShort = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const targetTime12 = toFmt12.format(epoch);
  const targetTime24 = toFmt24.format(epoch);
  const targetDateFull = toFmtDateFull.format(epoch);
  const targetDateShort = toFmtDateShort.format(epoch);

  // 4. Source Formatted Times
  const fromFmt12 = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const fromFmt24 = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const fromFmtDateFull = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const fromDateShort = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(epoch);

  const sourceTime12 = fromFmt12.format(epoch);
  const sourceTime24 = fromFmt24.format(epoch);
  const sourceDateFull = fromFmtDateFull.format(epoch);

  // Extract hour number in target timezone for day/night & business hours
  const parts = toFmt24.formatToParts(epoch);
  const hourPart = parts.find(p => p.type === 'hour');
  let targetHour = Number(hourPart ? hourPart.value : 0);
  if (targetHour === 24) targetHour = 0;

  const dayNight = getDayNightInfo(targetHour);
  const business = getBusinessHourStatus(targetHour);

  // 5. Day Offset comparison
  const fromDayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: fromTz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(epoch);
  const toDayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: toTz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(epoch);

  let dayOffsetLabel = 'Same calendar day';
  if (toDayFmt > fromDayFmt) {
    dayOffsetLabel = '+1 day ahead (Tomorrow)';
  } else if (toDayFmt < fromDayFmt) {
    dayOffsetLabel = '-1 day behind (Yesterday)';
  }

  const fromAbbr = getTimeZoneAbbreviation(fromTz, epoch);
  const toAbbr = getTimeZoneAbbreviation(toTz, epoch);

  const fromCityObj = WORLD_CITIES.find(c => c.id === fromTz) || { city: fromTz, country: '' };
  const toCityObj = WORLD_CITIES.find(c => c.id === toTz) || { city: toTz, country: '' };

  const copySummary = `${sourceTime12} ${fromAbbr} (${fromCityObj.city}) = ${targetTime12} ${toAbbr} (${toCityObj.city}) on ${targetDateShort}`;

  return {
    epoch: epoch.getTime(),
    epochIso: epoch.toISOString(),
    source: {
      timeZone: fromTz,
      city: fromCityObj.city,
      country: fromCityObj.country,
      flag: fromCityObj.flag || '📍',
      time12: sourceTime12,
      time24: sourceTime24,
      dateFull: sourceDateFull,
      dateShort: fromDateShort,
      offsetMin: fromOffsetMin,
      offsetStr: formatOffsetString(fromOffsetMin),
      abbr: fromAbbr
    },
    target: {
      timeZone: toTz,
      city: toCityObj.city,
      country: toCityObj.country,
      flag: toCityObj.flag || '📍',
      time12: targetTime12,
      time24: targetTime24,
      dateFull: targetDateFull,
      dateShort: targetDateShort,
      offsetMin: toOffsetMin,
      offsetStr: formatOffsetString(toOffsetMin),
      abbr: toAbbr,
      hour: targetHour,
      dayNight,
      business
    },
    diffMinutes,
    diffHours,
    diffLabel,
    dayOffsetLabel,
    copySummary
  };
}

/**
 * Generates a 24-hour visual meeting planner timeline
 */
export function generate24HourMeetingPlanner(dateStr, fromTz, toTz) {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    const timeStr = `${String(h).padStart(2, '0')}:00`;
    const res = convertTimeZone(dateStr, timeStr, fromTz, toTz);

    const fromHour = h;
    const toHour = res.target.hour;

    const fromBiz = getBusinessHourStatus(fromHour);
    const toBiz = getBusinessHourStatus(toHour);

    let meetingRating = 'poor'; // poor, fair, good
    if (fromBiz.status === 'open' && toBiz.status === 'open') {
      meetingRating = 'good'; // Both in business hours!
    } else if (
      (fromBiz.status === 'open' && toBiz.status === 'extended') ||
      (fromBiz.status === 'extended' && toBiz.status === 'open') ||
      (fromBiz.status === 'extended' && toBiz.status === 'extended')
    ) {
      meetingRating = 'fair';
    }

    slots.push({
      sourceHour: h,
      sourceTime12: res.source.time12,
      sourceTime24: timeStr,
      sourceBiz: fromBiz,
      targetHour: toHour,
      targetTime12: res.target.time12,
      targetTime24: res.target.time24,
      targetBiz: toBiz,
      meetingRating
    });
  }
  return slots;
}
