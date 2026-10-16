import fs from 'fs';

// 1. Import all unit sets
import { UNITS } from '../converter.js';
import { WEIGHT_UNITS } from '../weight-converter.js';
import { VOLUME_UNITS } from '../volume-converter.js';
import { LENGTH_UNITS } from '../length-converter.js';
import { TIME_UNITS } from '../time-converter.js';
import { AREA_UNITS } from '../area-converter.js';
import { SPEED_UNITS } from '../speed-converter.js';
import { POPULAR_CURRENCIES } from '../currency-converter.js';
import { WORLD_CITIES } from '../timezone-converter.js';

console.log('--- Generating pre-rendered option strings ---');

function makeOptionsFromUnits(unitsObj, defaultVal) {
  return Object.keys(unitsObj).map(key => {
    const item = unitsObj[key];
    const sel = key === defaultVal ? ' selected' : '';
    return `<option value="${key}"${sel}>${item.name} (${item.symbol})</option>`;
  }).join('');
}

function makeCurrencyOptions(defaultVal) {
  return POPULAR_CURRENCIES.map(c => {
    const sel = c.code === defaultVal ? ' selected' : '';
    return `<option value="${c.code}"${sel}>${c.flag} ${c.code} - ${c.name}</option>`;
  }).join('');
}

function makeTimezoneOptions(defaultVal) {
  return WORLD_CITIES.map(c => {
    const sel = c.id === defaultVal ? ' selected' : '';
    return `<option value="${c.id}"${sel}>${c.flag} ${c.city} (${c.code} ${c.defaultOffset})</option>`;
  }).join('');
}

// Map tool configurations: file -> list of selects to populate
const toolConfigs = [
  {
    file: 'temperature.html',
    selects: [
      { id: 'fromSelect', options: makeOptionsFromUnits(UNITS, 'C') },
      { id: 'toSelect', options: makeOptionsFromUnits(UNITS, 'F') }
    ]
  },
  {
    file: 'weight-mass.html',
    selects: [
      { id: 'weightFromSelect', options: makeOptionsFromUnits(WEIGHT_UNITS, 'kg') },
      { id: 'weightToSelect', options: makeOptionsFromUnits(WEIGHT_UNITS, 'lb') }
    ]
  },
  {
    file: 'volume-capacity.html',
    selects: [
      { id: 'volumeFromSelect', options: makeOptionsFromUnits(VOLUME_UNITS, 'l') },
      { id: 'volumeToSelect', options: makeOptionsFromUnits(VOLUME_UNITS, 'gal') }
    ]
  },
  {
    file: 'length.html',
    selects: [
      { id: 'lengthFromSelect', options: makeOptionsFromUnits(LENGTH_UNITS, 'm') },
      { id: 'lengthToSelect', options: makeOptionsFromUnits(LENGTH_UNITS, 'ft') }
    ]
  },
  {
    file: 'time-duration.html',
    selects: [
      { id: 'timeFromSelect', options: makeOptionsFromUnits(TIME_UNITS, 'hr') },
      { id: 'timeToSelect', options: makeOptionsFromUnits(TIME_UNITS, 'min') }
    ]
  },
  {
    file: 'area.html',
    selects: [
      { id: 'areaFromSelect', options: makeOptionsFromUnits(AREA_UNITS, 'm2') },
      { id: 'areaToSelect', options: makeOptionsFromUnits(AREA_UNITS, 'ft2') }
    ]
  },
  {
    file: 'speed.html',
    selects: [
      { id: 'speedFromSelect', options: makeOptionsFromUnits(SPEED_UNITS, 'kmh') },
      { id: 'speedToSelect', options: makeOptionsFromUnits(SPEED_UNITS, 'mph') }
    ]
  },
  {
    file: 'currency.html',
    selects: [
      { id: 'currencyFromSelect', options: makeCurrencyOptions('USD') },
      { id: 'currencyToSelect', options: makeCurrencyOptions('EUR') }
    ]
  },
  {
    file: 'time-zone.html',
    selects: [
      { id: 'fromTimezone', options: makeTimezoneOptions('Europe/London') },
      { id: 'toTimezone', options: makeTimezoneOptions('America/New_York') }
    ]
  }
];

const langs = ['es', 'de', 'pt'];

toolConfigs.forEach(tc => {
  langs.forEach(lang => {
    const filePath = `${lang}/${tc.file}`;
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    tc.selects.forEach(s => {
      // Find <select id="s.id" ...></select>
      const re = new RegExp(`(<select[^>]*id=["']${s.id}["'][^>]*>)[\\s\\S]*?(<\\/select>)`, 'i');
      if (re.test(content)) {
        content = content.replace(re, `$1${s.options}$2`);
        changed = true;
      } else {
        console.warn(`[WARN] Select #${s.id} not found in ${filePath}`);
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[UPDATED] Pre-rendered options in ${filePath}`);
    }
  });
});
