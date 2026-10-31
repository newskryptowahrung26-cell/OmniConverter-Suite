const sharp = require('sharp');
const path = require('path');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>
  
  <circle cx="256" cy="220" r="130" fill="none" stroke="#38BDF8" stroke-width="4" stroke-opacity="0.25" stroke-dasharray="12 8"/>

  <g transform="translate(256, 220) scale(1.4)">
    <path d="M-45,-25 C-75,-25 -75,25 -45,25 C-20,25 0,-25 25,-25 C55,-25 55,25 25,25 C0,25 -20,-25 -45,-25 Z" 
          fill="none" stroke="url(#iconGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-45" cy="0" r="8" fill="#38BDF8"/>
    <circle cx="25" cy="0" r="8" fill="#60A5FA"/>
  </g>

  <text x="256" y="385" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">OmniConverter</text>
  <text x="256" y="425" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="700" fill="#38BDF8" letter-spacing="3">OFFICIAL APP</text>
</svg>`;

const outFile = path.join(__dirname, '..', 'assets', 'pinterest-app-icon.png');

sharp(Buffer.from(svg))
  .png()
  .toFile(outFile)
  .then(() => console.log('Successfully generated 512x512 Pinterest App Icon at ' + outFile))
  .catch(err => { console.error(err); process.exit(1); });
