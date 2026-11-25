/**
 * OmniConverter 2.0 — Core Calculator Calculation Engines
 * Shared, deterministic, pure client-side mathematical logic.
 * Covers: Percentage, Age, Mortgage, Compound Interest, BMI, Salary UK.
 */

const OmniCalcEngines = {
  // 1. Percentage Calculator
  percentage: {
    // Scenario A: What is X% of Y?
    whatIsXPercentOfY(x, y) {
      if (isNaN(x) || isNaN(y)) return null;
      return (Number(x) * Number(y)) / 100;
    },
    // Scenario B: X is what percent of Y?
    xIsWhatPercentOfY(x, y) {
      if (isNaN(x) || isNaN(y) || Number(y) === 0) return null;
      return (Number(x) / Number(y)) * 100;
    },
    // Scenario C: Percentage change from X to Y
    percentageChange(initialVal, finalVal) {
      const v1 = Number(initialVal);
      const v2 = Number(finalVal);
      if (isNaN(v1) || isNaN(v2) || v1 === 0) return null;
      const diff = v2 - v1;
      const pct = (diff / Math.abs(v1)) * 100;
      return { diff, pct };
    },
    // Scenario D: Reverse Percentage (Value before X% discount/increase)
    reversePercentage(finalVal, pct, isDiscount = true) {
      const v = Number(finalVal);
      const p = Number(pct);
      if (isNaN(v) || isNaN(p)) return null;
      // In discount mode, discount must be 0 <= p < 100
      if (isDiscount && (p < 0 || p >= 100)) return null;
      const factor = isDiscount ? (1 - p / 100) : (1 + p / 100);
      if (factor <= 0) return null;
      return v / factor;
    }
  },

  // 2. Age & Date Difference Calculator
  age: {
    calculateAge(dobStr, targetDateStr = null) {
      const dob = new Date(dobStr);
      const target = targetDateStr ? new Date(targetDateStr) : new Date();
      if (isNaN(dob.getTime()) || isNaN(target.getTime())) return null;
      if (dob > target) return { error: 'FUTURE_DATE' };

      let years = target.getFullYear() - dob.getFullYear();
      let months = target.getMonth() - dob.getMonth();
      let days = target.getDate() - dob.getDate();

      if (days < 0) {
        months -= 1;
        // Days in previous month of target
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      // Alternate totals
      const totalMs = target.getTime() - dob.getTime();
      const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
      const totalMinutes = Math.floor(totalMs / (1000 * 60));

      // Day of week born
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeekBorn = daysOfWeek[dob.getDay()];

      // Days until next birthday
      let nextBdayYear = target.getFullYear();
      let nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
      if (nextBday < target) {
        nextBdayYear += 1;
        nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
      }
      const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

      return {
        years,
        months,
        days,
        totalDays,
        totalWeeks,
        totalHours,
        totalMinutes,
        dayOfWeekBorn,
        daysUntilNextBday
      };
    }
  },

  // 3. Mortgage Calculator UK
  mortgage: {
    calculateRepayment(price, deposit, termYears, annualRate, isInterestOnly = false, monthlyOverpayment = 0) {
      const p = Number(price);
      const d = Number(deposit);
      const term = Number(termYears);
      const rate = Number(annualRate);
      const overpayment = Number(monthlyOverpayment) || 0;

      if (isNaN(p) || isNaN(d) || isNaN(term) || isNaN(rate) || p <= 0 || term <= 0 || d >= p) {
        return null;
      }

      const loan = p - d;
      const ltv = (loan / p) * 100;
      const monthlyRate = (rate / 100) / 12;
      const totalMonths = term * 12;

      let baseMonthlyPayment = 0;
      let totalRepaid = 0;
      let totalInterest = 0;

      if (isInterestOnly) {
        baseMonthlyPayment = loan * monthlyRate;
        totalInterest = baseMonthlyPayment * totalMonths;
        totalRepaid = loan + totalInterest;
        return {
          loan,
          ltv,
          baseMonthlyPayment,
          totalMonthlyPayment: baseMonthlyPayment + overpayment,
          totalInterest,
          totalRepaid,
          monthsToPayoff: totalMonths
        };
      }

      if (monthlyRate === 0) {
        baseMonthlyPayment = loan / totalMonths;
        totalRepaid = loan;
        totalInterest = 0;
      } else {
        baseMonthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalRepaid = baseMonthlyPayment * totalMonths;
        totalInterest = totalRepaid - loan;
      }

      // Overpayment impact calculation
      let balance = loan;
      let actualMonths = 0;
      let actualTotalInterest = 0;
      const schedule = [];

      for (let m = 1; m <= totalMonths; m++) {
        if (balance <= 0) break;
        const interestM = balance * monthlyRate;
        let principalM = (baseMonthlyPayment - interestM) + overpayment;
        if (principalM > balance) principalM = balance;
        balance -= principalM;
        actualTotalInterest += interestM;
        actualMonths = m;

        if (m <= 60 || m % 12 === 0 || balance <= 0) {
          schedule.push({
            month: m,
            year: Math.ceil(m / 12),
            interestPaid: interestM,
            principalPaid: principalM,
            balanceRemaining: Math.max(0, balance)
          });
        }
      }

      const interestSaved = Math.max(0, totalInterest - actualTotalInterest);
      const yearsSaved = Number(((totalMonths - actualMonths) / 12).toFixed(1));

      return {
        loan,
        ltv,
        baseMonthlyPayment,
        totalMonthlyPayment: baseMonthlyPayment + overpayment,
        totalInterest,
        totalRepaid,
        actualTotalInterest,
        actualTotalRepaid: loan + actualTotalInterest,
        interestSaved,
        monthsSaved: totalMonths - actualMonths,
        yearsSaved,
        actualMonthsToPayoff: actualMonths,
        schedule
      };
    }
  },

  // 4. Compound Interest Calculator
  compound: {
    calculateCompound(principal, regularDeposit, annualRate, termYears, frequency = 12) {
      const p = Number(principal) || 0;
      const pmt = Number(regularDeposit) || 0;
      const r = Number(annualRate) / 100;
      const t = Number(termYears);
      const n = Number(frequency); // 12 for monthly, 1 for annual, 365 for daily

      if (isNaN(t) || t <= 0 || (p === 0 && pmt === 0)) return null;

      const schedule = [];
      let currentBalance = p;
      let totalContributions = p;

      const periodsPerYear = n;
      const ratePerPeriod = r / periodsPerYear;
      const depositPerPeriod = (pmt * 12) / periodsPerYear;

      for (let y = 1; y <= t; y++) {
        for (let period = 1; period <= periodsPerYear; period++) {
          currentBalance = (currentBalance + depositPerPeriod) * (1 + ratePerPeriod);
          totalContributions += depositPerPeriod;
        }
        schedule.push({
          year: y,
          totalBalance: currentBalance,
          principalContributed: totalContributions,
          totalInterestEarned: currentBalance - totalContributions
        });
      }

      const totalInterest = currentBalance - totalContributions;

      return {
        futureBalance: currentBalance,
        totalContributions,
        totalInterest,
        schedule
      };
    }
  },

  // 5. BMI & Healthy Weight Calculator
  bmi: {
    calculateBmi(weightKg, heightCm) {
      const w = Number(weightKg);
      const hCm = Number(heightCm);
      if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0) return null;

      const hM = hCm / 100;
      const bmiVal = w / (hM * hM);

      // Official WHO Categories
      let category = '';
      let badgeClass = '';
      if (bmiVal < 18.5) {
        category = 'Underweight';
        badgeClass = 'bg-blue-100 text-blue-800';
      } else if (bmiVal < 25.0) {
        category = 'Normal weight';
        badgeClass = 'bg-green-100 text-green-800';
      } else if (bmiVal < 30.0) {
        category = 'Overweight';
        badgeClass = 'bg-yellow-100 text-yellow-800';
      } else if (bmiVal < 35.0) {
        category = 'Obese Class I';
        badgeClass = 'bg-orange-100 text-orange-800';
      } else if (bmiVal < 40.0) {
        category = 'Obese Class II';
        badgeClass = 'bg-red-100 text-red-800';
      } else {
        category = 'Obese Class III';
        badgeClass = 'bg-red-200 text-red-900';
      }

      // Target Healthy Weight Range (BMI 18.5 to 24.9)
      const healthyMinKg = 18.5 * (hM * hM);
      const healthyMaxKg = 24.9 * (hM * hM);

      // Imperial equivalents
      const minLbsTotal = healthyMinKg * 2.20462;
      const maxLbsTotal = healthyMaxKg * 2.20462;
      const minSt = Math.floor(minLbsTotal / 14);
      const minStLbs = Math.round(minLbsTotal % 14);
      const maxSt = Math.floor(maxLbsTotal / 14);
      const maxStLbs = Math.round(maxLbsTotal % 14);

      return {
        bmi: Number(bmiVal.toFixed(1)),
        category,
        badgeClass,
        healthyMinKg: Number(healthyMinKg.toFixed(1)),
        healthyMaxKg: Number(healthyMaxKg.toFixed(1)),
        healthyRangeStone: `${minSt} st ${minStLbs} lb to ${maxSt} st ${maxStLbs} lb`
      };
    },
    convertImperialToMetric(stone, lbs, feet, inches) {
      const totalLbs = (Number(stone) || 0) * 14 + (Number(lbs) || 0);
      const totalInches = (Number(feet) || 0) * 12 + (Number(inches) || 0);
      const kg = totalLbs / 2.20462262;
      const cm = totalInches * 2.54;
      return { kg, cm };
    },
    // US Imperial mode: Weight in pounds only, height in feet and inches
    calculateUsImperial(weightLbs, feet, inches) {
      const wLbs = Number(weightLbs);
      const f = Number(feet) || 0;
      const inc = Number(inches) || 0;
      if (isNaN(wLbs) || wLbs <= 0 || (f === 0 && inc === 0) || f < 0 || inc < 0) {
        return null;
      }
      const totalInches = f * 12 + inc;
      if (totalInches <= 0) return null;

      const kg = wLbs / 2.20462262;
      const cm = totalInches * 2.54;
      const res = this.calculateBmi(kg, cm);
      if (!res) return null;

      // Add US Imperial healthy range in pounds
      const minLbs = Number((res.healthyMinKg * 2.20462262).toFixed(1));
      const maxLbs = Number((res.healthyMaxKg * 2.20462262).toFixed(1));

      return {
        ...res,
        weightLbs: wLbs,
        totalInches,
        healthyRangeLbs: `${minLbs} lbs – ${maxLbs} lbs`
      };
    }
  },

  // 6. Salary & Take-Home Pay UK (2026/27 Tax Rules) & Universal Estimator
  salaryUk: {
    // Mode 1: UK Statutory Engine (2026/27 HMRC)
    calculateTakeHome(grossAnnual, region = 'rUK', pensionPct = 5, studentLoan = 'none') {
      const gross = Number(grossAnnual);
      if (isNaN(gross) || gross <= 0) return null;

      // 1. Pension deduction (Relief at source standard)
      const pensionContrib = gross * ((Number(pensionPct) || 0) / 100);

      // 2. Personal Allowance & £100k Taper
      let personalAllowance = 12570;
      if (gross > 100000) {
        const excess = gross - 100000;
        const reduction = Math.min(12570, excess / 2);
        personalAllowance = Math.max(0, 12570 - reduction);
      }

      // 3. Taxable Income
      const taxableIncome = Math.max(0, gross - personalAllowance);

      // 4. Income Tax Calculation
      let incomeTax = 0;
      if (region === 'scotland') {
        // 2026/27 Scottish Income Tax Bands (gov.scot)
        const b1 = Math.min(taxableIncome, 16537 - 12570); // Starter 19%
        const b2 = Math.min(Math.max(0, taxableIncome - 3967), 29526 - 16537); // Basic 20%
        const b3 = Math.min(Math.max(0, taxableIncome - 16956), 43662 - 29526); // Intermediate 21%
        const b4 = Math.min(Math.max(0, taxableIncome - 31092), 75000 - 43662); // Higher 42%
        const b5 = Math.min(Math.max(0, taxableIncome - 62430), 125140 - 75000); // Advanced 45%
        const b6 = Math.max(0, taxableIncome - (125140 - personalAllowance)); // Top 48%

        incomeTax = (b1 * 0.19) + (b2 * 0.20) + (b3 * 0.21) + (b4 * 0.42) + (b5 * 0.45) + (b6 * 0.48);
      } else {
        // Rest of UK (England, Wales, NI)
        if (taxableIncome > 0) {
          const basicBand = Math.min(taxableIncome, 50270 - 12570); // £37,700 basic band
          const higherBand = Math.min(Math.max(0, taxableIncome - (50270 - personalAllowance)), 125140 - 50270);
          const additionalBand = Math.max(0, taxableIncome - (125140 - personalAllowance));

          incomeTax = (basicBand * 0.20) + (higherBand * 0.40) + (additionalBand * 0.45);
        }
      }

      // 5. National Insurance (Category A Standard Employee)
      // 0% up to £12,570, 8% between £12,570 and £50,270, 2% over £50,270
      let nationalInsurance = 0;
      if (gross > 12570) {
        const niMainBand = Math.min(gross - 12570, 50270 - 12570);
        const niUpperBand = Math.max(0, gross - 50270);
        nationalInsurance = (niMainBand * 0.08) + (niUpperBand * 0.02);
      }

      // 6. Student Loan
      let studentLoanDeduction = 0;
      const slThresholds = {
        plan1: { thresh: 24990, rate: 0.09 },
        plan2: { thresh: 27295, rate: 0.09 },
        plan4: { thresh: 31395, rate: 0.09 },
        plan5: { thresh: 25000, rate: 0.09 },
        postgrad: { thresh: 21000, rate: 0.06 }
      };

      if (studentLoan && slThresholds[studentLoan]) {
        const sl = slThresholds[studentLoan];
        if (gross > sl.thresh) {
          studentLoanDeduction = (gross - sl.thresh) * sl.rate;
        }
      }

      // 7. Net Take-Home Pay
      const totalDeductions = incomeTax + nationalInsurance + studentLoanDeduction + pensionContrib;
      const netAnnual = Math.max(0, gross - totalDeductions);

      return {
        grossAnnual: gross,
        personalAllowance,
        taxableIncome,
        incomeTax,
        nationalInsurance,
        pensionContrib,
        studentLoanDeduction,
        totalDeductions,
        netAnnual,
        netMonthly: netAnnual / 12,
        netWeekly: netAnnual / 52,
        netDaily: netAnnual / 260
      };
    },

    // Mode 2: Universal Gross-to-Net Estimator (User-Defined Percentages)
    calculateUniversalTakeHome(grossAnnual, taxPct = 20, socialPct = 5, pensionPct = 5) {
      const gross = Number(grossAnnual);
      const tPct = Number(taxPct) || 0;
      const sPct = Number(socialPct) || 0;
      const pPct = Number(pensionPct) || 0;

      if (isNaN(gross) || gross < 0 || tPct < 0 || sPct < 0 || pPct < 0) {
        return null;
      }
      if (gross === 0) {
        return {
          grossAnnual: 0,
          taxDeduction: 0,
          socialDeduction: 0,
          pensionDeduction: 0,
          totalDeductions: 0,
          netAnnual: 0,
          netMonthly: 0,
          netWeekly: 0,
          netDaily: 0,
          effectiveDeductionRate: 0
        };
      }

      const totalPct = tPct + sPct + pPct;
      const taxDeduction = (gross * tPct) / 100;
      const socialDeduction = (gross * sPct) / 100;
      const pensionDeduction = (gross * pPct) / 100;
      const totalDeductions = taxDeduction + socialDeduction + pensionDeduction;
      const netAnnual = Math.max(0, gross - totalDeductions);

      return {
        grossAnnual: gross,
        taxDeduction,
        socialDeduction,
        pensionDeduction,
        totalDeductions,
        netAnnual,
        netMonthly: netAnnual / 12,
        netWeekly: netAnnual / 52,
        netDaily: netAnnual / 260,
        effectiveDeductionRate: Number(Math.min(100, totalPct).toFixed(1))
      };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OmniCalcEngines;
}
