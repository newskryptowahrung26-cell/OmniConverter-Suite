// PWA Installer & Service Worker Registration Script
(function() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.debug('SW registration error:', err);
      });
    });
  }

  // 2. Add PWA Install Modal / Banner
  let deferredPrompt = null;
  const STORAGE_KEY = 'omniconverter_pwa_dismissed';

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar
    e.preventDefault();
    deferredPrompt = e;

    // Check if dismissed recently (within 7 days)
    const dismissedTime = localStorage.getItem(STORAGE_KEY);
    if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10)) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Show custom install prompt banner after a short delay (3s after user engagement)
    setTimeout(() => {
      if (!document.getElementById('pwa-install-banner')) {
        showPwaBanner();
      }
    }, 3000);
  });

  function showPwaBanner() {
    const isSpanish = window.location.pathname.startsWith('/es/');
    const isGerman = window.location.pathname.startsWith('/de/');
    const isPortuguese = window.location.pathname.startsWith('/pt/');

    let title = 'Install OmniConverter App';
    let desc = 'Instant unit & currency conversion directly from your home screen. Fast & offline ready.';
    let btnInstall = '⚡ Install Free';
    let btnLater = 'Later';

    if (isSpanish) {
      title = 'Instalar OmniConverter';
      desc = 'Conversión instantánea de unidades desde tu pantalla de inicio. Rápida y sin conexión.';
      btnInstall = '⚡ Instalar Gratis';
      btnLater = 'Más tarde';
    } else if (isGerman) {
      title = 'OmniConverter App installieren';
      desc = 'Schnelle Einheitenumrechnung direkt vom Startbildschirm. Funktioniert offline.';
      btnInstall = '⚡ Kostenlos installieren';
      btnLater = 'Später';
    } else if (isPortuguese) {
      title = 'Instalar App OmniConverter';
      desc = 'Conversão instantânea direto da tela inicial. Rápido e funciona offline.';
      btnInstall = '⚡ Instalar Grátis';
      btnLater = 'Mais tarde';
    }

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 440px;
      width: calc(100% - 32px);
      background: #0f172a;
      color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 35px -5px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideUpPwa 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;

    banner.innerHTML = `
      <style>
        @keyframes slideUpPwa {
          from { opacity: 0; transform: translate(-50%, 25px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        #pwa-install-banner button {
          font-family: inherit;
        }
      </style>
      <img src="/logo.png" alt="App Icon" style="width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 700; font-size: 0.95rem; line-height: 1.25; margin-bottom: 2px;">${title}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.35;">${desc}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; flex-shrink: 0;">
        <button id="pwa-install-confirm-btn" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff; border: none; padding: 7px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(79,70,229,0.4);">
          ${btnInstall}
        </button>
        <button id="pwa-install-dismiss-btn" style="background: transparent; color: #94a3b8; border: none; padding: 3px 6px; font-size: 0.75rem; cursor: pointer; text-align: center;">
          ${btnLater}
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('pwa-install-confirm-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      banner.style.display = 'none';
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
      deferredPrompt = null;
    });

    document.getElementById('pwa-install-dismiss-btn').addEventListener('click', () => {
      banner.remove();
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    });
  }

  window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.remove();
    deferredPrompt = null;
  });
})();
