// Botón de modo claro / oscuro. Sin elección guardada, la página sigue la preferencia del sistema.
// La elección guardada se aplica antes de pintar la página con un script corto en el <head> de cada página.
(function () {
  var KEY = 'montilabs-theme';
  var root = document.documentElement;
  var EN = /^en\b/i.test(root.lang || '');
  var LABEL = EN
    ? { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' }
    : { toDark: 'Cambiar a modo oscuro', toLight: 'Cambiar a modo claro' };
  var BAR = { light: '#FFFFFF', dark: '#0F1A2C' };
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var buttons = [];

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }

  function sync() {
    var dark = current() === 'dark';
    buttons.forEach(function (b) {
      var label = dark ? LABEL.toLight : LABEL.toDark;
      b.setAttribute('aria-label', label);
      b.setAttribute('title', label);
    });
    // Color de la barra del navegador en el teléfono.
    var chosen = root.getAttribute('data-theme');
    Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m) {
      var media = m.getAttribute('media') || '';
      m.setAttribute('content', chosen ? BAR[chosen] : (media.indexOf('dark') !== -1 ? BAR.dark : BAR.light));
    });
  }

  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { window.localStorage.setItem(KEY, next); } catch (e) { /* sin almacenamiento: vale solo para esta visita */ }
    sync();
  }

  function start() {
    buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));
    buttons.forEach(function (b) { b.addEventListener('click', toggle); });
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', sync);
      else if (mq.addListener) mq.addListener(sync);
    }
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
