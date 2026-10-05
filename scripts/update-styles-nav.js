const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

// We need to replace the header, header-container, nav-tabs, tab-btn, and mobile-menu-btn definitions
// Let's inspect what header CSS looks like right now
const headerStart = css.indexOf('header{');
const mainStart = css.indexOf('main{');

if (headerStart === -1 || mainStart === -1) {
  console.error('Could not find header/main bounds in styles.css');
  process.exit(1);
}

const currentHeaderCss = css.substring(headerStart, mainStart);

const newHeaderCss = `header{background:var(--card-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--card-border);padding:.75rem 1.5rem;position:sticky;top:0;z-index:100}.header-container{max-width:1400px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.65rem 1rem}.logo{order:1;display:flex;align-items:center;gap:.6rem;font-size:1.35rem;font-weight:800;background:linear-gradient(135deg,var(--primary-600),var(--accent-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none;letter-spacing:-.02em}.logo svg,.logo img{width:32px;height:32px}.nav-tabs{order:3;width:100%;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.25rem .35rem;background:rgba(15,23,42,.04);padding:.35rem .65rem;border-radius:var(--radius-xl);border:1px solid var(--card-border)}@media (prefers-color-scheme:dark){:root{--bg-gradient:linear-gradient(135deg,#0b0f19 0%,#0f172a 50%,#1e1b4b 100%);--card-bg:rgba(30,41,59,0.75);--card-border:rgba(51,65,85,0.6);--text-main:#f8fafc;--text-muted:#cbd5e1;--text-light:#64748b;--shadow-glow:0 12px 30px -5px rgba(99,102,241,0.4),0 8px 10px -6px rgba(0,0,0,0.5)}.nav-tabs{background:rgba(255,255,255,.05)}}.tab-btn,a.tab-btn,button.tab-btn{display:inline-flex;align-items:center;justify-content:center;padding:.38rem .72rem;font-size:.84rem;font-weight:600;border:none;background:0 0;color:var(--text-muted);border-radius:var(--radius-lg);cursor:pointer;text-decoration:none!important;-webkit-text-decoration:none!important;white-space:nowrap;flex-shrink:0;transition:.25s cubic-bezier(.4,0,.2,1);line-height:1.2}.tab-btn:hover,a.tab-btn:hover,button.tab-btn:hover,.tab-btn:focus-visible,a.tab-btn:focus-visible{color:var(--text-main);background:rgba(99,102,241,.08);text-decoration:none!important;outline:0}.tab-btn.active,a.tab-btn.active,button.tab-btn.active{background:linear-gradient(135deg,var(--primary-600),var(--primary-700));color:#fff!important;box-shadow:0 4px 12px rgba(79,70,229,.3);text-decoration:none!important}.tab-btn:visited,a.tab-btn:visited{color:var(--text-muted);text-decoration:none!important}.tab-btn.active:visited,a.tab-btn.active:visited{color:#fff!important;text-decoration:none!important}`;

css = css.replace(currentHeaderCss, newHeaderCss);

// Also update the mobile media query for header-container and lang-switcher
css = css.replace(
  /\.header-container\{display:flex;justify-content:space-between;align-items:center;gap:\.5rem;position:relative\}/,
  '.header-container{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;position:relative}.logo{order:1}.lang-switcher{order:2;margin-left:auto}.mobile-menu-btn{order:3}'
);

fs.writeFileSync('styles.css', css, 'utf8');
console.log('Successfully updated styles.css header navigation layout');
