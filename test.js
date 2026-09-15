import test from 'node:test';
import assert from 'node:assert/strict';
import { convertTemperature, toCelsius, fromCelsius } from './converter.js';

test('Celsius to Fahrenheit conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'F').result, 32);
  assert.equal(convertTemperature(100, 'C', 'F').result, 212);
  assert.equal(convertTemperature(-40, 'C', 'F').result, -40);
  assert.equal(convertTemperature(37, 'C', 'F').result, 98.6);
});

test('Fahrenheit to Celsius conversions', () => {
  assert.equal(convertTemperature(32, 'F', 'C').result, 0);
  assert.equal(convertTemperature(212, 'F', 'C').result, 100);
  assert.equal(convertTemperature(-40, 'F', 'C').result, -40);
  assert.equal(convertTemperature(98.6, 'F', 'C').result, 37);
});

test('Celsius to Kelvin conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'K').result, 273.15);
  assert.equal(convertTemperature(100, 'C', 'K').result, 373.15);
  assert.equal(convertTemperature(-273.15, 'C', 'K').result, 0);
});

test('Kelvin to Celsius conversions', () => {
  assert.equal(convertTemperature(273.15, 'K', 'C').result, 0);
  assert.equal(convertTemperature(0, 'K', 'C').result, -273.15);
  assert.equal(convertTemperature(373.15, 'K', 'C').result, 100);
});

test('Fahrenheit to Kelvin conversions', () => {
  assert.equal(convertTemperature(32, 'F', 'K').result, 273.15);
  assert.equal(convertTemperature(-459.67, 'F', 'K').result, 0);
});

test('Kelvin to Fahrenheit conversions', () => {
  assert.equal(convertTemperature(273.15, 'K', 'F').result, 32);
  assert.equal(convertTemperature(0, 'K', 'F').result, -459.67);
});

test('Rankine conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'R').result, 491.67);
  assert.equal(convertTemperature(491.67, 'R', 'C').result, 0);
  assert.equal(convertTemperature(0, 'F', 'R').result, 459.67);
  assert.equal(convertTemperature(0, 'K', 'R').result, 0);
});

test('Réaumur conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'Re').result, 0);
  assert.equal(convertTemperature(100, 'C', 'Re').result, 80);
  assert.equal(convertTemperature(80, 'Re', 'C').result, 100);
});

test('Newton conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'N').result, 0);
  assert.equal(convertTemperature(100, 'C', 'N').result, 33);
  assert.equal(convertTemperature(33, 'N', 'C').result, 100);
});

test('Rømer conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'Ro').result, 7.5);
  assert.equal(convertTemperature(100, 'C', 'Ro').result, 60);
  assert.equal(convertTemperature(60, 'Ro', 'C').result, 100);
});

test('Delisle conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'De').result, 150);
  assert.equal(convertTemperature(100, 'C', 'De').result, 0);
  assert.equal(convertTemperature(0, 'De', 'C').result, 100);
});

test('Invalid and edge inputs', () => {
  assert.equal(convertTemperature('', 'C', 'F'), null);
  assert.equal(convertTemperature('invalid', 'C', 'F').error, 'Invalid numeric input');
  assert.equal(convertTemperature(100, 'UNKNOWN', 'F').error, 'Invalid unit specified');
});
