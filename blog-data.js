/**
 * Blog Articles & Content Repository
 */

export const posts = [
  {
    id: 'understanding-temperature-conversions',
    title: 'Understanding Temperature Conversions: From Celsius to Absolute Zero',
    slug: 'understanding-temperature-conversions',
    date: '2026-09-15',
    readTime: '5 min read',
    category: 'Temperature',
    summary: 'Explore the science behind Celsius, Fahrenheit, Kelvin, and minor temperature scales like Rankine and Réaumur, complete with exact mathematical derivations.',
    content: `
      <p>Temperature measurement is fundamental to everyday life, scientific research, culinary arts, and industrial engineering. While most of the world uses the metric Celsius scale, the United States primarily uses Fahrenheit, and physics laboratories worldwide rely on Kelvin.</p>
      
      <h3>The History of Temperature Scales</h3>
      <p>In 1724, Daniel Gabriel Fahrenheit proposed a scale based on three reference points: an equal mixture of ice, salt, and water (0 °F), the freezing point of pure water (32 °F), and human body temperature (originally 96 °F, later revised to 98.6 °F).</p>
      <p>In 1742, Anders Celsius created a scale with 0 as water's boiling point and 100 as its freezing point. After his death, Jean-Pierre Christin inverted the scale to its modern form where 0 °C is freezing and 100 °C is boiling.</p>

      <h3>Why Kelvin Matters in Physics</h3>
      <p>The Kelvin scale is an absolute temperature scale starting at absolute zero (-273.15 °C), the temperature at which all molecular motion virtually ceases. Because it has no negative values, Kelvin is essential for gas law equations and thermodynamic principles.</p>

      <h3>Quick Conversion Reference</h3>
      <ul>
        <li><strong>Celsius to Fahrenheit:</strong> °F = (°C × 9/5) + 32</li>
        <li><strong>Fahrenheit to Celsius:</strong> °C = (°F − 32) × 5/9</li>
        <li><strong>Celsius to Kelvin:</strong> K = °C + 273.15</li>
      </ul>
    `
  },
  {
    id: 'metric-vs-imperial-unit-guide',
    title: 'Metric vs. Imperial System: The Ultimate Unit Conversion Guide',
    slug: 'metric-vs-imperial-unit-guide',
    date: '2026-09-14',
    readTime: '6 min read',
    category: 'Unit Guides',
    summary: 'A deep dive into why different measurement systems exist, how to quickly estimate metric to imperial weight, volume, and length conversions in your head.',
    content: `
      <p>Why does the UK measure human weight in stones, the US measure driving distances in miles, and mainland Europe measure everything in meters and kilograms? Measurement history is a fascinating story of trade, trade standards, and scientific revolutions.</p>

      <h3>The French Revolution & The Metric System</h3>
      <p>In 1795, France officially introduced the metric system (Systeme International) based on powers of 10. The meter was originally defined as one ten-millionth of the distance from the equator to the North Pole along the Paris meridian.</p>

      <h3>Mental Math Shortcuts</h3>
      <p>When you do not have a digital calculator handy, use these mental estimation shortcuts:</p>
      <ul>
        <li><strong>Kilograms to Pounds:</strong> Double the kg value and add 10% (e.g., 70 kg → 140 + 14 = 154 lbs; exact is 154.3 lbs).</li>
        <li><strong>Meters to Feet:</strong> Multiply by 3.3 (e.g., 10 m → ~33 feet).</li>
        <li><strong>Liters to US Gallons:</strong> Multiply by 0.26 or divide by 4.</li>
      </ul>
    `
  },
  {
    id: 'image-formats-webp-png-jpeg-explained',
    title: 'Client-Side Image Format Guide: WebP vs. PNG vs. JPEG',
    slug: 'image-formats-webp-png-jpeg-explained',
    date: '2026-09-12',
    readTime: '4 min read',
    category: 'File Utilities',
    summary: 'Learn which image format to choose for web speed, transparent graphics, photos, and privacy-first client-side browser conversions.',
    content: `
      <p>Image optimization is crucial for website speed, Core Web Vitals, and bandwidth savings. Choosing the right image format can reduce file sizes by up to 80% without noticeable quality degradation.</p>

      <h3>When to Use Each Format</h3>
      <ul>
        <li><strong>WebP:</strong> Modern standard for web graphics and photos. Supports both lossy and lossless compression as well as transparency, with file sizes ~25-35% smaller than JPEG.</li>
        <li><strong>PNG:</strong> Best for transparent logos, UI icons, screenshots, and graphics requiring sharp lines without compression artifacts.</li>
        <li><strong>JPEG:</strong> Best for rich photographic images where slight lossy compression is imperceptible.</li>
      </ul>

      <h3>Privacy in Client-Side Conversions</h3>
      <p>Using our OmniConverter Image Tool, your images never leave your device. The conversion executes entirely inside your web browser's HTML5 Canvas engine, keeping your personal photos 100% private and confidential.</p>
    `
  }
];
