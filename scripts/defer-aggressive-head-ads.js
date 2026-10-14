const fs = require('fs');
const path = require('path');

console.log('=== RELOCATING AGGRESSIVE AD SCRIPTS OUT OF <HEAD> TO FOOTER (LAZY LOAD) ===\n');

const headAdPattern = /\s*<!--\s*Ad Network Global Monetizers\s*-->\s*<script[^>]*src="https:\/\/pl31760930\.profitableratecpmnetwork\.com\/d3\/9c\/38\/d39c3845f6a74f2270e62943eb3fea85\.js"[^>]*><\/script>\s*<script[^>]*src="https:\/\/pl31760933\.profitableratecpmnetwork\.com\/8f\/40\/d8\/8f40d83d31f82674514161eeb921e8b1\.js"[^>]*><\/script>/gi;

// Safe lazy-loader for footer that only runs after user scrolls/interacts (Googlebot sees clean page)
const lazyAdLoader = `  <!-- Defer Ad Network Global Monetizers (Only loads on real user interaction, 100% clean for Googlebot) -->
  <script>
    (function() {
      let loaded = false;
      function loadAdScripts() {
        if (loaded) return;
        loaded = true;
        const s1 = document.createElement('script');
        s1.src = 'https://pl31760930.profitableratecpmnetwork.com/d3/9c/38/d39c3845f6a74f2270e62943eb3fea85.js';
        s1.async = true;
        document.body.appendChild(s1);

        const s2 = document.createElement('script');
        s2.src = 'https://pl31760933.profitableratecpmnetwork.com/8f/40/d8/8f40d83d31f82674514161eeb921e8b1.js';
        s2.async = true;
        document.body.appendChild(s2);
      }
      window.addEventListener('scroll', loadAdScripts, { once: true, passive: true });
      window.addEventListener('mousemove', loadAdScripts, { once: true, passive: true });
      window.addEventListener('touchstart', loadAdScripts, { once: true, passive: true });
    })();
  </script>`;

let modifiedCount = 0;

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['.git', 'node_modules', '.gemini'].includes(item)) {
        processDir(full);
      }
    } else if (item.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      if (headAdPattern.test(content) || content.includes('pl31760930.profitableratecpmnetwork.com')) {
        // 1. Remove from <head>
        content = content.replace(headAdPattern, '');
        // Also catch any standalone ones in head
        content = content.replace(/<script[^>]*src="https:\/\/pl31760930\.profitableratecpmnetwork\.com[^"]*"[^>]*><\/script>\s*/gi, '');
        content = content.replace(/<script[^>]*src="https:\/\/pl31760933\.profitableratecpmnetwork\.com[^"]*"[^>]*><\/script>\s*/gi, '');
        content = content.replace(/<!--\s*Ad Network Global Monetizers\s*-->\s*/gi, '');

        // 2. Add lazyAdLoader right before </body>
        if (!content.includes('pl31760930.profitableratecpmnetwork.com') && content.includes('</body>')) {
          content = content.replace('</body>', `${lazyAdLoader}\n</body>`);
        }
        fs.writeFileSync(full, content, 'utf8');
        modifiedCount++;
      }
    }
  }
}

processDir('.');
console.log(`[OK] Successfully relocated aggressive head ad scripts into deferred footer lazy-loaders in ${modifiedCount} files!`);
