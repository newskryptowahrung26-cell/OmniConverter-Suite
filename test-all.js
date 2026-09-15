import test from 'node:test';
import assert from 'node:assert/strict';
import { convertVolume } from './volume-converter.js';
import { convertLength } from './length-converter.js';
import { convertTime } from './time-converter.js';
import { convertTextDocument } from './file-converter.js';

test('Volume & Capacity conversions', () => {
  assert.equal(convertVolume(1, 'l', 'ml').result, 1000);
  assert.equal(convertVolume(1, 'm3', 'l').result, 1000);
  assert.equal(convertVolume(1, 'gal', 'l').result, 3.785412);
  assert.equal(convertVolume(1, 'qt', 'pt').result, 2);
});

test('Length & Distance conversions', () => {
  assert.equal(convertLength(1, 'km', 'm').result, 1000);
  assert.equal(convertLength(1, 'mi', 'km').result, 1.609344);
  assert.equal(convertLength(1, 'ft', 'in').result, 12);
  assert.equal(convertLength(1, 'yd', 'ft').result, 3);
});

test('Time & Duration conversions', () => {
  assert.equal(convertTime(1, 'hr', 'min').result, 60);
  assert.equal(convertTime(1, 'min', 's').result, 60);
  assert.equal(convertTime(1, 'd', 'hr').result, 24);
  assert.equal(convertTime(1, 'wk', 'd').result, 7);
});

test('Text document conversions (JSON ↔ CSV)', () => {
  const jsonInput = JSON.stringify([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
  const csvRes = convertTextDocument(jsonInput, 'json2csv');
  assert.ok(!csvRes.error);
  assert.equal(csvRes.filename, 'converted.csv');

  const csvInput = 'name,age\nAlice,30\nBob,25';
  const jsonRes = convertTextDocument(csvInput, 'csv2json');
  assert.ok(!jsonRes.error);
  assert.equal(jsonRes.filename, 'converted.json');
});
