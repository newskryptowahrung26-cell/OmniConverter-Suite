import test from 'node:test';
import assert from 'node:assert/strict';
import { convertArea } from './area-converter.js';
import { convertSpeed } from './speed-converter.js';

test('Area conversions', () => {
  assert.equal(convertArea(1, 'km2', 'm2').result, 1000000);
  assert.equal(convertArea(1, 'ha', 'm2').result, 10000);
  assert.equal(convertArea(1, 'ac', 'ft2').result, 43560);
});

test('Speed conversions', () => {
  assert.equal(convertSpeed(100, 'kmh', 'ms').result, 27.777778);
  assert.equal(convertSpeed(60, 'mph', 'kmh').result, 96.56064);
  assert.equal(convertSpeed(1, 'mach', 'ms').result, 343);
});
