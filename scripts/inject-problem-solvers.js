const fs = require('fs');

// 1. Update temperature.html
let tempHtml = fs.readFileSync('temperature.html', 'utf8');

const ovenCardHtml = `      <!-- Specialized Real-Life Tool: Oven Baking & Convection Converter -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(239, 68, 68, 0.04)); border:1px solid var(--card-border); border-top:4px solid #f59e0b; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>🧑‍🍳</span> Oven Baking &amp; Convection Fan Converter
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">
              Convert recipe temperatures between Conventional Oven, Fan-Assisted (Convection), Fahrenheit, Celsius, and UK Gas Marks.
            </p>
          </div>
          <span style="font-size:0.8rem; background:rgba(245, 158, 11, 0.15); color:#d97706; border:1px solid rgba(245, 158, 11, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">Culinary Precision</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="ovenTempInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Recipe Temperature</label>
            <input type="number" id="ovenTempInput" class="input-field" value="350" step="5" style="width:100%; box-sizing:border-box;">
          </div>
          <div>
            <label for="ovenSourceScale" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Scale</label>
            <select id="ovenSourceScale" class="select-field" style="width:100%;">
              <option value="F" selected>Fahrenheit (°F)</option>
              <option value="C">Celsius (°C)</option>
            </select>
          </div>
          <div>
            <label for="ovenSourceType" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Recipe Oven Type</label>
            <select id="ovenSourceType" class="select-field" style="width:100%;">
              <option value="conventional" selected>Conventional / Standard Electric</option>
              <option value="fan">Fan-Assisted / Convection Oven</option>
            </select>
          </div>
        </div>

        <button type="button" id="calcOvenBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #f59e0b, #d97706); border:none; box-shadow:0 4px 12px rgba(245,158,11,0.3);">Calculate Exact Oven Setting</button>

        <!-- Dynamic Output Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Conventional °C</div>
            <div id="outConvC" style="font-size:1.35rem; font-weight:800; color:var(--text-main);">177 °C</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Fan Oven (°C)</div>
            <div id="outFanC" style="font-size:1.35rem; font-weight:800; color:#059669;">157 °C</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Conventional °F</div>
            <div id="outConvF" style="font-size:1.35rem; font-weight:800; color:var(--text-main);">350 °F</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Fan Oven (°F)</div>
            <div id="outFanF" style="font-size:1.35rem; font-weight:800; color:#059669;">315 °F</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">UK Gas Mark</div>
            <div id="outGasMark" style="font-size:1.35rem; font-weight:800; color:#6366f1;">4 (Gas 4)</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>💡 <strong>Best Suited For:</strong></span>
          <span id="outOvenRecommend" style="color:var(--text-main); font-weight:600;">Standard Sponge Cakes, Cookies, Biscuits &amp; Roasts</span>
        </div>
      </section>
`;

if (!tempHtml.includes('id="ovenTempInput"')) {
  tempHtml = tempHtml.replace(/<\/section>[\r\n\s]+<\/div>[\r\n\s]+<!-- Trending In-Depth Temperature Guides/,
    `</section>\n${ovenCardHtml}\n    </div>\n\n    <!-- Trending In-Depth Temperature Guides`);
  
  if (!tempHtml.includes('problem-solvers.js')) {
    tempHtml = tempHtml.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
  }
  fs.writeFileSync('temperature.html', tempHtml, 'utf8');
  console.log('Updated temperature.html with Oven Baking Calculator');
}

// 2. Update weight-mass.html
let weightHtml = fs.readFileSync('weight-mass.html', 'utf8');

const bmiCardHtml = `      <!-- Specialized Real-Life Tool: Body Weight, Stone & BMI Range Calculator -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(59, 130, 246, 0.04)); border:1px solid var(--card-border); border-top:4px solid #10b981; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>⚖️</span> Body Weight, Stone &amp; Healthy BMI Range Calculator
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">
              Calculate your Body Mass Index (BMI), exact British stone &amp; pound breakdown, and personalized healthy target weight.
            </p>
          </div>
          <span style="font-size:0.8rem; background:rgba(16, 185, 129, 0.15); color:#059669; border:1px solid rgba(16, 185, 129, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">Health Standard</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="bmiHeightInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Height</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="number" id="bmiHeightInput" class="input-field" value="175" step="any" style="flex:1;">
              <select id="bmiHeightUnit" class="select-field" style="width:90px;">
                <option value="cm" selected>cm</option>
                <option value="m">m</option>
                <option value="in">inches</option>
                <option value="ft">feet</option>
              </select>
            </div>
          </div>
          <div>
            <label for="bmiWeightInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Weight</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="number" id="bmiWeightInput" class="input-field" value="75" step="any" style="flex:1;">
              <select id="bmiWeightUnit" class="select-field" style="width:90px;">
                <option value="kg" selected>kg</option>
                <option value="lb">lbs</option>
                <option value="st">stone</option>
              </select>
            </div>
          </div>
        </div>

        <button type="button" id="calcBmiBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #10b981, #059669); border:none; box-shadow:0 4px 12px rgba(16,185,129,0.3);">Calculate BMI &amp; Healthy Stone Range</button>

        <!-- Dynamic Output Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">BMI Score</div>
            <div id="outBmiScore" style="font-size:1.6rem; font-weight:800; color:var(--primary-600);">24.5</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Weight Category</div>
            <div id="outBmiCategory" style="font-size:1.25rem; font-weight:800; color:#10b981;">Normal weight</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">UK Stone &amp; Lbs</div>
            <div id="outStoneLbBreakdown" style="font-size:1.2rem; font-weight:800; color:var(--text-main);">11 st 11.4 lb</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Target Healthy Range</div>
            <div id="outIdealWeightRange" style="font-size:1rem; font-weight:800; color:#059669;">9 st 0 lb to 12 st 1 lb</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>🩺 <strong>Guidance:</strong></span>
          <span id="outBmiAdvice" style="color:var(--text-main); font-weight:600;">You are in the optimal healthy weight range for your height.</span>
        </div>
      </section>
`;

if (!weightHtml.includes('id="bmiHeightInput"')) {
  weightHtml = weightHtml.replace(/<\/section>[\r\n\s]+<!-- Trending In-Depth Weight & Stone Guides/,
    `</section>\n${bmiCardHtml}\n      <!-- Trending In-Depth Weight & Stone Guides`);
  
  if (!weightHtml.includes('problem-solvers.js')) {
    weightHtml = weightHtml.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
  }
  fs.writeFileSync('weight-mass.html', weightHtml, 'utf8');
  console.log('Updated weight-mass.html with BMI & Stone Range Calculator');
}

// 3. Update currency.html
let currHtml = fs.readFileSync('currency.html', 'utf8');

const travelAtmCardHtml = `      <!-- Specialized Real-Life Tool: Travel ATM & Card Fee Loss Calculator -->
      <section class="converter-card" style="margin-top:2rem; background:linear-gradient(135deg, rgba(79, 70, 229, 0.04), rgba(16, 185, 129, 0.04)); border:1px solid var(--card-border); border-top:4px solid #4f46e5; border-radius:var(--radius-xl); padding:1.75rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);">
              <span>✈️</span> Travel Budget &amp; Hidden Foreign ATM Fee Estimator
            </h2>
            <p style="margin:0.35rem 0 0 0; font-size:0.92rem; color:var(--text-muted);">
              Calculate hidden bank markups, overseas ATM withdrawal surcharges, and how much money you actually lose when exchanging cash abroad.
            </p>
          </div>
          <span style="font-size:0.8rem; background:rgba(79, 70, 229, 0.15); color:#4f46e5; border:1px solid rgba(79, 70, 229, 0.3); padding:0.3rem 0.75rem; border-radius:999px; font-weight:700;">Anti-Ripoff Guide</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label for="travelSpendInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Withdrawal / Spend Amount</label>
            <input type="number" id="travelSpendInput" class="input-field" value="500" step="10" style="width:100%; box-sizing:border-box;">
          </div>
          <div>
            <label for="travelBaseCurr" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Your Home Currency</label>
            <select id="travelBaseCurr" class="select-field" style="width:100%;">
              <option value="USD" selected>USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div>
            <label for="travelBankMarkup" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">Card Type / Spread</label>
            <select id="travelBankMarkup" class="select-field" style="width:100%;">
              <option value="0.5">Wise / Revolut Travel Card (0.5%)</option>
              <option value="3.0" selected>Standard Bank Credit / Debit Card (3.0%)</option>
              <option value="5.5">Airport Kiosk / DCC ATM Dynamic Conversion (5.5%)</option>
            </select>
          </div>
          <div>
            <label for="travelAtmFixedFee" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">ATM Operator Fixed Fee</label>
            <input type="number" id="travelAtmFixedFee" class="input-field" value="5" step="1" style="width:100%; box-sizing:border-box;">
          </div>
        </div>

        <button type="button" id="calcTravelFeeBtn" class="btn-convert" style="width:100%; margin-bottom:1.5rem; background:linear-gradient(135deg, #4f46e5, #6366f1); border:none; box-shadow:0 4px 12px rgba(79,70,229,0.3);">Calculate Total Money Lost to Fees</button>

        <!-- Dynamic Output Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Total Fees &amp; Markup Lost</div>
            <div id="outTotalLostFee" style="font-size:1.6rem; font-weight:800; color:#ef4444;">USD 20.00</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Actual Spending Power Received</div>
            <div id="outTrueAmountReceived" style="font-size:1.4rem; font-weight:800; color:#10b981;">USD 480.00</div>
          </div>
          <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Effective Fee Hit</div>
            <div id="outLossPercentBadge" style="font-size:1.3rem; font-weight:800; color:#f59e0b;">4.0% Hidden Fee</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem;">
          <span>🚨 <strong>Travel Tip:</strong></span>
          <span id="outTravelTip" style="color:var(--text-main); font-weight:600;">Always choose local currency when paying or withdrawing abroad to avoid heavy 4-7% DCC markups!</span>
        </div>
      </section>
`;

if (!currHtml.includes('id="travelSpendInput"')) {
  currHtml = currHtml.replace(/<\/section>[\r\n\s]+<!-- Trending In-Depth Currency Guides/,
    `</section>\n${travelAtmCardHtml}\n      <!-- Trending In-Depth Currency Guides`);

  if (!currHtml.includes('problem-solvers.js')) {
    currHtml = currHtml.replace('</body>', '  <script src="/problem-solvers.js" defer></script>\n</body>');
  }
  fs.writeFileSync('currency.html', currHtml, 'utf8');
  console.log('Updated currency.html with Travel ATM Fee Estimator');
}
