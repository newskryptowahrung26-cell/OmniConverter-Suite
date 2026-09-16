const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log(`[${new Date().toISOString()}] Automated 6-Hour Publisher Triggered`);
console.log('====================================================');

// Keywords pool for continuous auto-publishing (4 articles per 24 hours)
const keywordsPool = [
  {
    slug: '70-fahrenheit-to-celsius',
    title: '70 Fahrenheit to Celsius: Room Temperature Guide',
    category: 'Temperature Guide',
    img: 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { q: 'What is 70°F in Celsius?', a: '70 degrees Fahrenheit equals 21.11 degrees Celsius (21.11°C).' },
      { q: 'Is 70°F considered comfortable room temperature?', a: 'Yes! 70°F (21.1°C) is widely regarded as optimal indoor thermostat room temperature.' },
      { q: 'What is the formula to convert 70°F to °C?', a: 'Subtract 32 from 70 (70 - 32 = 38) and divide by 1.8 to get 21.11°C.' }
    ]
  },
  {
    slug: '1-liter-to-gallons',
    title: '1 Liter to Gallons: Exact Fluid Volume Conversion',
    category: 'Volume & Capacity Guide',
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { q: 'How many US gallons is 1 liter?', a: '1 liter equals 0.264172 US liquid gallons (approx 0.264 gal).' },
      { q: 'How many Imperial UK gallons is 1 liter?', a: '1 liter equals 0.219969 Imperial UK gallons.' },
      { q: 'How many liters are in 1 gallon?', a: 'There are 3.785 liters in 1 US liquid gallon and 4.546 liters in 1 Imperial UK gallon.' }
    ]
  },
  {
    slug: '150-lbs-to-kg',
    title: '150 LBS to KG: Weight Conversion Guide',
    category: 'Weight & Mass Guide',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { q: 'How many kg is 150 lbs?', a: '150 pounds equals 68.0389 kilograms (commonly rounded to 68.04 kg).' },
      { q: 'How many stones is 150 lbs?', a: '150 pounds equals 10 stones and 10 pounds (10 st 10 lb).' }
    ]
  },
  {
    slug: '100-kmh-to-mph',
    title: '100 KM/H to MPH: Speed Limit Conversion Guide',
    category: 'Speed Conversion Guide',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { q: 'How fast is 100 km/h in mph?', a: '100 kilometers per hour equals 62.1371 miles per hour (62.14 mph).' },
      { q: 'What is the formula to convert km/h to mph?', a: 'Multiply km/h by 0.621371: 100 x 0.621371 = 62.14 mph.' }
    ]
  }
];

try {
  const publishedFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
  console.log(`Current Published Articles Count: ${publishedFiles.length}`);

  const nextTarget = keywordsPool.find(item => !publishedFiles.includes(item.slug));

  if (nextTarget) {
    console.log(`Publishing Next Scheduled Article: ${nextTarget.slug}...`);

    const faqItemsHtml = nextTarget.faqs.map(f => `
        <h4 style="margin:1.25rem 0 0.35rem 0; font-size:1.1rem; color:var(--text-primary); font-weight:700;">${f.q}</h4>
        <p style="margin:0 0 1rem 0; color:var(--text-muted); line-height:1.7;">${f.a}</p>
