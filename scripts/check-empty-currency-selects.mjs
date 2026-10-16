import { CURRENCY_UNITS } from '../currency-converter.js';
import fs from 'fs';
import path from 'path';

const files = ['es/currency.html', 'de/currency.html', 'pt/currency.html'];

files.forEach(f => {
  const p = path.resolve(f);
  const c = fs.readFileSync(p, 'utf8');
  console.log(f, 'fromSelect empty:', c.includes('<select id="currencyFromSelect" class="select-field" aria-label="From Currency"></select>'));
});
