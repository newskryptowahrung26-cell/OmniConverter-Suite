// Real-Life Problem Solving Specialized Interactive Calculators

// 1. Oven Baking & Culinary Temperature Converter
window.initOvenBakingConverter = function() {
  const ovenInput = document.getElementById('ovenTempInput');
  const ovenScale = document.getElementById('ovenSourceScale');
  const ovenType = document.getElementById('ovenSourceType');
  const btn = document.getElementById('calcOvenBtn');

  if (!ovenInput || !btn) return;

  function calculateOven() {
    let val = parseFloat(ovenInput.value);
    if (isNaN(val)) return;

    const scale = ovenScale.value; // 'C' or 'F'
    const type = ovenType.value;   // 'conventional' or 'fan'

    // Normalize to Conventional Celsius
    let convC = 0;
    if (scale === 'F') {
      let cEquivalent = (val - 32) * (5 / 9);
      if (type === 'fan') {
        convC = cEquivalent + 20; // Fan is 20C cooler than conventional
      } else {
        convC = cEquivalent;
      }
    } else {
      if (type === 'fan') {
        convC = val + 20;
      } else {
        convC = val;
      }
    }

    // Now calculate all settings from Conventional Celsius
    let fanC = convC - 20;
    let convF = Math.round(convC * (9 / 5) + 32);
    let fanF = Math.round(fanC * (9 / 5) + 32);

    // Approximate Gas Mark
    let gasMark = 'N/A';
    if (convC >= 130 && convC < 145) gasMark = '1/2';
    else if (convC >= 145 && convC < 160) gasMark = '1';
    else if (convC >= 160 && convC < 175) gasMark = '2';
    else if (convC >= 175 && convC < 185) gasMark = '3';
    else if (convC >= 185 && convC < 195) gasMark = '4 (Standard 350°F)';
    else if (convC >= 195 && convC < 210) gasMark = '5';
    else if (convC >= 210 && convC < 225) gasMark = '6';
    else if (convC >= 225 && convC < 235) gasMark = '7';
    else if (convC >= 235 && convC < 250) gasMark = '8';
    else if (convC >= 250) gasMark = '9+ (Very Hot)';
    else if (convC < 130 && convC >= 105) gasMark = '1/4 (Slow)';

    // Baking recommendation
    let bakedGoods = 'General Baking & Roasting';
    if (convC < 140) bakedGoods = 'Slow-cooking, Meringues & Stews';
    else if (convC >= 140 && convC < 170) bakedGoods = 'Fruit cakes, Cheesecakes & Rich sponges';
    else if (convC >= 170 && convC < 195) bakedGoods = 'Standard Sponge Cakes, Cookies, Biscuits & Roasts';
    else if (convC >= 195 && convC < 225) bakedGoods = 'Pies, Pastries, Bread rolls & High-heat Roasting';
    else if (convC >= 225) bakedGoods = 'Artisan Sourdough, Pizza & Yorkshire Puddings';

    const outConvC = document.getElementById('outConvC');
    const outFanC = document.getElementById('outFanC');
    const outConvF = document.getElementById('outConvF');
    const outFanF = document.getElementById('outFanF');
    const outGasMark = document.getElementById('outGasMark');
    const outRecommendation = document.getElementById('outOvenRecommend');

    if (outConvC) outConvC.textContent = Math.round(convC) + ' °C';
    if (outFanC) outFanC.textContent = Math.round(fanC) + ' °C';
    if (outConvF) outConvF.textContent = convF + ' °F';
    if (outFanF) outFanF.textContent = fanF + ' °F';
    if (outGasMark) outGasMark.textContent = gasMark;
    if (outRecommendation) outRecommendation.textContent = bakedGoods;
  }

  btn.addEventListener('click', calculateOven);
  ovenInput.addEventListener('input', calculateOven);
  ovenScale.addEventListener('change', calculateOven);
  ovenType.addEventListener('change', calculateOven);

  // Initial calculation
  calculateOven();
};

// 2. Body Weight, Stone & Healthy BMI Goal Calculator
window.initBodyWeightBmiCalculator = function() {
  const heightInput = document.getElementById('bmiHeightInput');
  const heightUnit = document.getElementById('bmiHeightUnit');
  const weightInput = document.getElementById('bmiWeightInput');
  const weightUnit = document.getElementById('bmiWeightUnit');
  const btn = document.getElementById('calcBmiBtn');

  if (!heightInput || !weightInput || !btn) return;

  function calculateBmi() {
    const hRaw = parseFloat(heightInput.value);
    const wRaw = parseFloat(weightInput.value);
    if (isNaN(hRaw) || isNaN(wRaw) || hRaw <= 0 || wRaw <= 0) return;

    // Convert height to meters
    let hMeters = 0;
    if (heightUnit.value === 'cm') hMeters = hRaw / 100;
    else if (heightUnit.value === 'm') hMeters = hRaw;
    else if (heightUnit.value === 'in') hMeters = hRaw * 0.0254;
    else if (heightUnit.value === 'ft') hMeters = hRaw * 0.3048;

    // Convert weight to kg
    let wKg = 0;
    if (weightUnit.value === 'kg') wKg = wRaw;
    else if (weightUnit.value === 'lb') wKg = wRaw * 0.45359237;
    else if (weightUnit.value === 'st') wKg = wRaw * 6.35029318;

    // BMI formula: kg / m^2
    const bmi = wKg / (hMeters * hMeters);
    const bmiFormatted = bmi.toFixed(1);

    // Stone + pounds breakdown
    const totalPounds = wKg * 2.20462262;
    const stones = Math.floor(totalPounds / 14);
    const remPounds = (totalPounds % 14).toFixed(1);

    // Healthy weight range (BMI 18.5 - 24.9)
    const minHealthyKg = (18.5 * (hMeters * hMeters)).toFixed(1);
    const maxHealthyKg = (24.9 * (hMeters * hMeters)).toFixed(1);
    const minHealthyLb = (minHealthyKg * 2.20462).toFixed(0);
    const maxHealthyLb = (maxHealthyKg * 2.20462).toFixed(0);
    const minHealthySt = Math.floor(minHealthyLb / 14) + ' st ' + Math.round(minHealthyLb % 14) + ' lb';
    const maxHealthySt = Math.floor(maxHealthyLb / 14) + ' st ' + Math.round(maxHealthyLb % 14) + ' lb';

    let category = 'Normal weight (Healthy)';
    let badgeColor = '#10b981';
    let advice = 'You are in the optimal healthy weight range for your height. Maintain a balanced diet and regular physical activity.';

    if (bmi < 18.5) {
      category = 'Underweight';
      badgeColor = '#3b82f6';
      advice = 'Your weight is below the standard recommended range. Consider nutrient-rich foods and strength training.';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      badgeColor = '#f59e0b';
      advice = 'Your weight is slightly above the healthy threshold. Moderate cardio and portion adjustments can assist wellness.';
    } else if (bmi >= 30) {
      category = 'Obese Class';
      badgeColor = '#ef4444';
      advice = 'Your BMI is in the clinical obesity range. Consulting with a healthcare provider can provide tailored guidance.';
    }

    const outBmi = document.getElementById('outBmiScore');
    const outCategory = document.getElementById('outBmiCategory');
    const outStoneLb = document.getElementById('outStoneLbBreakdown');
    const outIdealRange = document.getElementById('outIdealWeightRange');
    const outAdvice = document.getElementById('outBmiAdvice');

    if (outBmi) outBmi.textContent = bmiFormatted;
    if (outCategory) {
      outCategory.textContent = category;
      outCategory.style.color = badgeColor;
    }
    if (outStoneLb) outStoneLb.textContent = `${stones} st ${remPounds} lb (${wKg.toFixed(1)} kg)`;
    if (outIdealRange) outIdealRange.textContent = `${minHealthySt} to ${maxHealthySt} (${minHealthyKg} – ${maxHealthyKg} kg)`;
    if (outAdvice) outAdvice.textContent = advice;
  }

  btn.addEventListener('click', calculateBmi);
  heightInput.addEventListener('input', calculateBmi);
  weightInput.addEventListener('input', calculateBmi);
  heightUnit.addEventListener('change', calculateBmi);
  weightUnit.addEventListener('change', calculateBmi);

  // Initial run
  calculateBmi();
};

// 3. Travel Currency ATM & Foreign Card Fee Loss Estimator
window.initTravelAtmFeeCalculator = function() {
  const spendInput = document.getElementById('travelSpendInput');
  const baseCurr = document.getElementById('travelBaseCurr');
  const foreignCurr = document.getElementById('travelForeignCurr');
  const bankMarkup = document.getElementById('travelBankMarkup');
  const atmFee = document.getElementById('travelAtmFixedFee');
  const btn = document.getElementById('calcTravelFeeBtn');

  if (!spendInput || !btn) return;

  function calculateTravelLoss() {
    const spend = parseFloat(spendInput.value);
    const markupPct = parseFloat(bankMarkup.value) || 0;
    const fixedAtm = parseFloat(atmFee.value) || 0;

    if (isNaN(spend) || spend <= 0) return;

    const fxFeeCost = spend * (markupPct / 100);
    const totalLost = fxFeeCost + fixedAtm;
    const effectivePct = ((totalLost / spend) * 100).toFixed(1);
    const trueAmountReceived = spend - totalLost;

    const outLoss = document.getElementById('outTotalLostFee');
    const outTrueReceived = document.getElementById('outTrueAmountReceived');
    const outLossPercent = document.getElementById('outLossPercentBadge');
    const outTip = document.getElementById('outTravelTip');

    if (outLoss) outLoss.textContent = `${baseCurr.value} ${totalLost.toFixed(2)}`;
    if (outTrueReceived) outTrueReceived.textContent = `${baseCurr.value} ${trueAmountReceived.toFixed(2)}`;
    if (outLossPercent) outLossPercent.textContent = `${effectivePct}% Hidden Fee`;

    let tip = 'Safe range: Minimal foreign transaction markup detected.';
    if (markupPct >= 3.5 || totalLost > 25) {
      tip = '⚠️ High Fees: Never choose "Pay in your home currency" at foreign ATMs or card readers (Dynamic Currency Conversion adds 4-7% surcharge). Always choose local currency!';
    } else if (fixedAtm > 0) {
      tip = '💡 Pro-Tip: Make fewer, larger withdrawals rather than multiple small ones to minimize fixed ATM operator charges.';
    }

    if (outTip) outTip.textContent = tip;
  }

  btn.addEventListener('click', calculateTravelLoss);
  spendInput.addEventListener('input', calculateTravelLoss);
  baseCurr.addEventListener('change', calculateTravelLoss);
  foreignCurr.addEventListener('change', calculateTravelLoss);
  bankMarkup.addEventListener('change', calculateTravelLoss);
  atmFee.addEventListener('input', calculateTravelLoss);

  // Initial run
  calculateTravelLoss();
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initOvenBakingConverter === 'function') window.initOvenBakingConverter();
  if (typeof window.initBodyWeightBmiCalculator === 'function') window.initBodyWeightBmiCalculator();
  if (typeof window.initTravelAtmFeeCalculator === 'function') window.initTravelAtmFeeCalculator();
});
