// Aviso de cookies y etiqueta de Google. La etiqueta solo se carga si la persona acepta.
(function () {
  var KEY = 'montilabs-cookies';
  var TAG_ID = 'GTM-52ZBDLNP';
  var loaded = false;
  var banner = null;
  var EN = /^en\b/i.test(document.documentElement.lang || '');
  var TEXT = EN ? {
    label: 'Cookie preferences',
    body: 'We use Google cookies to measure visits and our ads. They are only activated if you accept them. <a href="/en/privacy.html#cookies">Privacy policy</a>',
    deny: 'Reject',
    accept: 'Accept'
  } : {
    label: 'Preferencias de cookies',
    body: 'Usamos cookies de Google para medir las visitas y nuestros anuncios. Solo se activan si las aceptas. <a href="/privacy.html#cookies">Política de privacidad</a>',
    deny: 'Rechazar',
    accept: 'Aceptar'
  };

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* sin almacenamiento: vuelve a preguntar */ }
  }

  function loadTag() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    window.gtag('js', new Date());
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + TAG_ID;
    document.head.appendChild(s);
  }

  function clearGoogleCookies() {
    var host = window.location.hostname;
    var root = host.split('.').slice(-2).join('.');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl|_gac|FPAU|FPID)/.test(name)) return;
      [host, '.' + host, '.' + root].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + domain;
      });
      document.cookie = name + '=; Max-Age=0; path=/';
    });
  }

  function choose(value) {
    var before = read();
    write(value);
    hideBanner();
    if (value === 'granted') {
      loadTag();
    } else if (before === 'granted' || loaded) {
      // Retira el consentimiento: borra las cookies y recarga para descargar la etiqueta.
      clearGoogleCookies();
      window.location.reload();
    }
  }

  function hideBanner() {
    if (banner) banner.remove();
    banner = null;
  }

  function showBanner() {
    if (banner) return;
    if (!document.getElementById('cookie-style')) {
      var style = document.createElement('style');
      style.id = 'cookie-style';
      style.textContent =
        '#cookie-banner{position:fixed;right:16px;bottom:16px;z-index:2147483000;box-sizing:border-box;width:min(460px,calc(100vw - 32px));padding:20px;border:1px solid #D5DCE6;border-radius:12px;background:#fff;color:#0B1B33;font:400 15px/1.45 "IBM Plex Sans",system-ui,sans-serif;box-shadow:0 12px 32px -12px rgba(11,27,51,.4)}' +
        '#cookie-banner p{margin:0 0 14px}' +
        '#cookie-banner a{color:#1E4FD8;text-decoration:underline}' +
        '#cookie-banner .cookie-actions{display:flex;gap:10px}' +
        '#cookie-banner button{flex:1;min-height:44px;padding:10px 14px;border:1px solid #0B1B33;border-radius:8px;background:#fff;color:#0B1B33;font:inherit;font-weight:600;cursor:pointer}' +
        '#cookie-banner button:focus-visible{outline:3px solid #1E4FD8;outline-offset:2px}';
      document.head.appendChild(style);
    }
    banner = document.createElement('section');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', TEXT.label);
    banner.innerHTML =
      '<p>' + TEXT.body + '</p>' +
      '<div class="cookie-actions"><button type="button" data-choice="denied">' + TEXT.deny + '</button><button type="button" data-choice="granted">' + TEXT.accept + '</button></div>';
    banner.addEventListener('click', function (e) {
      var value = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (value) choose(value);
    });
    document.body.appendChild(banner);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a, button') : null;
    if (!el) return;
    if (el.hasAttribute('data-cookie-settings')) {
      e.preventDefault();
      showBanner();
      return;
    }
    // Clic en un enlace de contacto. Cloudflare reescribe los mailto como email-protection.
    var href = el.getAttribute('href') || '';
    if (loaded && (href.indexOf('mailto:') === 0 || href.indexOf('email-protection') !== -1)) {
      window.dataLayer.push({ event: 'contacto_click', contacto_pagina: window.location.pathname, contacto_tipo: 'correo' });
    }
  });

  function start() {
    var choice = read();
    if (choice === 'granted') loadTag();
    else if (choice !== 'denied') showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
