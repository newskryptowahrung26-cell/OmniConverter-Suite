import test from 'node:test';
import assert from 'node:assert/strict';
import { convertVolume } from './volume-converter.js';
import { convertLength } from './length-converter.js';
import { convertTime } from './time-converter.js';
import { convertTextDocument } from './file-converter.js';
import { convertCurrency, DEFAULT_RATES } from './currency-converter.js';
import { convertTemperature, convertAllScales, convertDeltaTemperature } from './converter.js';
import { convertTimeZone, generate24HourMeetingPlanner, WORLD_CITIES } from './timezone-converter.js';

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

test('Currency conversions (USD, AUD, EUR, GBP)', () => {
  const conv5UsdAud = convertCurrency(5, 'USD', 'AUD', DEFAULT_RATES);
  assert.ok(!conv5UsdAud.error);
  assert.equal(conv5UsdAud.inputValue, 5);
  assert.equal(conv5UsdAud.fromCur, 'USD');
  assert.equal(conv5UsdAud.toCur, 'AUD');
  assert.equal(conv5UsdAud.formattedResult, 'A$7.13 AUD');

  const conv100AudUsd = convertCurrency(100, 'AUD', 'USD', DEFAULT_RATES);
  assert.ok(!conv100AudUsd.error);
  assert.equal(conv100AudUsd.formattedResult, '$70.14 USD');

  // Test cross-currency without USD as source or target (e.g., EUR to GBP)
  const convEurGbp = convertCurrency(100, 'EUR', 'GBP', DEFAULT_RATES);
  assert.ok(!convEurGbp.error);
  assert.ok(convEurGbp.rate > 0.8 && convEurGbp.rate < 0.9);
});

test('Temperature conversions, All Scales, and Delta T', () => {
  assert.equal(convertTemperature(0, 'C', 'F').result, 32);
  assert.equal(convertTemperature(100, 'C', 'F').result, 212);
  assert.equal(convertTemperature(-40, 'C', 'F').result, -40);
  assert.equal(convertTemperature(0, 'K', 'C').result, -273.15);
  assert.equal(convertTemperature(37, 'C', 'K').result, 310.15);
  assert.equal(convertTemperature(0, 'C', 'R').result, 491.67);

  const delta10C = convertDeltaTemperature(10, 'C', 'F');
  assert.equal(delta10C.result, 18);

  const delta18F = convertDeltaTemperature(18, 'F', 'C');
  assert.equal(delta18F.result, 10);

  const allScales0C = convertAllScales(0, 'C');
  assert.equal(allScales0C.F.value, 32);
  assert.equal(allScales0C.K.value, 273.15);
  assert.equal(allScales0C.R.value, 491.67);
  assert.equal(allScales0C.Re.value, 0);
});

test('Worldwide Time Zone & Clock conversions', () => {
  assert.ok(WORLD_CITIES.length >= 50);

  // New York (EDT, UTC-4) to Karachi (PKT, UTC+5)
  const nyToKarachi = convertTimeZone('2026-10-01', '10:00', 'America/New_York', 'Asia/Karachi');
  assert.equal(nyToKarachi.target.time12, '7:00 PM');
  assert.equal(nyToKarachi.target.time24, '19:00');
  assert.equal(nyToKarachi.diffHours, 9);
  assert.equal(nyToKarachi.diffMinutes, 540);
  assert.equal(nyToKarachi.dayOffsetLabel, 'Same calendar day');

  // London (BST, UTC+1) to Tokyo (JST, UTC+9)
  const londonToTokyo = convertTimeZone('2026-10-01', '14:00', 'Europe/London', 'Asia/Tokyo');
  assert.equal(londonToTokyo.target.time12, '10:00 PM');
  assert.equal(londonToTokyo.diffHours, 8);

  // New York to Sydney across International Date Line (+1 day)
  const nyToSydney = convertTimeZone('2026-10-01', '20:00', 'America/New_York', 'Australia/Sydney');
  assert.ok(nyToSydney.dayOffsetLabel.includes('+1 day ahead'));

  // Half-hour offset: London to New Delhi (IST, UTC+5:30)
  const londonToDelhi = convertTimeZone('2026-10-01', '12:00', 'Europe/London', 'Asia/Kolkata');
  assert.equal(londonToDelhi.diffMinutes, 270); // 4.5 hours ahead in Oct (BST UTC+1 vs IST UTC+5.5)

  // 24-hour visual meeting planner
  const meetingSlots = generate24HourMeetingPlanner('2026-10-01', 'Europe/London', 'Asia/Karachi');
  assert.equal(meetingSlots.length, 24);
  const goodSlots = meetingSlots.filter(s => s.meetingRating === 'good');
  assert.ok(goodSlots.length >= 3);
});

