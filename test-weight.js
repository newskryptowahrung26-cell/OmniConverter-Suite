import test from 'node:test';
import assert from 'node:assert/strict';
import { convertWeight, toGrams, fromGrams } from './weight-converter.js';

test('Kilograms to Pounds conversions', () => {
  assert.equal(convertWeight(1, 'kg', 'lb').result, 2.204623);
  assert.equal(convertWeight(10, 'kg', 'lb').result, 22.046226);
  assert.equal(convertWeight(0, 'kg', 'lb').result, 0);
});

test('Pounds to Kilograms conversions', () => {
  assert.equal(convertWeight(1, 'lb', 'kg').result, 0.453592);
  assert.equal(convertWeight(10, 'lb', 'kg').result, 4.535924);
});

test('Pounds to Ounces conversions', () => {
  assert.equal(convertWeight(1, 'lb', 'oz').result, 16);
  assert.equal(convertWeight(0.5, 'lb', 'oz').result, 8);
});

test('Stones to Pounds and Kilograms', () => {
  assert.equal(convertWeight(1, 'st', 'lb').result, 14);
  assert.equal(convertWeight(1, 'st', 'kg').result, 6.350293);
});

test('Gram and Milligram conversions', () => {
  assert.equal(convertWeight(1, 'kg', 'g').result, 1000);
  assert.equal(convertWeight(1, 'g', 'mg').result, 1000);
  assert.equal(convertWeight(1000, 'mg', 'g').result, 1);
});

test('Metric Tons conversions', () => {
  assert.equal(convertWeight(1, 't', 'kg').result, 1000);
  assert.equal(convertWeight(1, 't', 'lb').result, 2204.622622);
});

test('Carat conversions', () => {
  assert.equal(convertWeight(5, 'ct', 'g').result, 1);
  assert.equal(convertWeight(1, 'g', 'ct').result, 5);
});

test('Invalid and boundary inputs', () => {
  assert.equal(convertWeight('', 'kg', 'lb'), null);
  assert.equal(convertWeight('xyz', 'kg', 'lb').error, 'Invalid numeric input');
  assert.equal(convertWeight(10, 'INVALID', 'lb').error, 'Invalid unit specified');
});
