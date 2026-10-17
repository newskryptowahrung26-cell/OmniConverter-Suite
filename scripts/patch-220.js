const fs = require('fs');

let c = fs.readFileSync('blog/220-pounds-in-stone.html', 'utf8');

// Normalize line endings to avoid CRLF / LF replace mismatches
c = c.replace(/<select id="liveToolFromUnit"[\s\S]*?<\/select>/, `<select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="kg">Kilograms (kg)</option>
              <option value="lb" selected>Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
              <option value="st">Stones (st)</option>
            </select>`);

c = c.replace(/<select id="liveToolToUnit"[\s\S]*?<\/select>/, `<select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="st" selected>Stones (st)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="lb">Pounds (lbs)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
            </select>`);

fs.writeFileSync('blog/220-pounds-in-stone.html', c, 'utf8');
console.log('Successfully patched blog/220-pounds-in-stone.html');
