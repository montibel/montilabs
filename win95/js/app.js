// app.js — Window Manager · Windows 95 Template

// ============================================================
// RESPONSIVE HELPER
// ============================================================

// matchMedia keeps the result live — no need to re-query on resize.
const mobileQuery = window.matchMedia('(max-width: 768px)');

function isMobile() {
  return mobileQuery.matches;
}

// ============================================================
// SOUND ENGINE  (Web Audio API — zero external files)
// ============================================================
// AudioContext is created lazily on the first user interaction
// to comply with browser autoplay policies.

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Core primitive: one oscillator with an exponential fade-out.
  // startTime is an absolute AudioContext time so sequences stay
  // sample-accurate without relying on setTimeout drift.
  function tone(freq, startTime, duration, type = 'square', vol = 0.07) {
    const ac   = getCtx();
    const osc  = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  return {
    // Ascending two-note chime — window opens / restores
    open() {
      const t = getCtx().currentTime;
      tone(523.25, t,        0.12, 'square', 0.07); // C5
      tone(659.25, t + 0.08, 0.18, 'square', 0.07); // E5
    },

    // Descending two-note tone — window closes / minimises
    close() {
      const t = getCtx().currentTime;
      tone(440, t,        0.10, 'square', 0.06); // A4
      tone(330, t + 0.06, 0.14, 'square', 0.06); // E4
    },

    // Dissonant sine chord — System Error dialog gains focus
    error() {
      const t = getCtx().currentTime;
      tone(493.88, t,        0.35, 'sine', 0.09); // B4
      tone(369.99, t + 0.04, 0.35, 'sine', 0.06); // F#4 (tritone — intentionally unsettling)
    },

    // Quick ascending tick — Start Menu opens
    menu() {
      const t = getCtx().currentTime;
      tone(880,  t,        0.05, 'square', 0.04);
      tone(1100, t + 0.04, 0.07, 'square', 0.04);
    },
  };
})();


// Finds the System Error window, updates its message, and brings it
// to the front. If the window was removed by the user, fails silently.
function showError(message) {
  const win = [...document.querySelectorAll('.window')].find(
    w => w.querySelector('.window__title')?.textContent.trim() === 'System Error'
  );
  if (!win) return;
  win.querySelector('.error-body__msg').innerHTML = message;
  if (win.style.display === 'none') {
    win.style.display = 'flex';
    runAnimation(win, 'window--opening');
  }
  focusWindow(win); // also triggers SFX.error() via focusWindow's inactive check
}


// ============================================================
// CLOCK
// ============================================================

function updateClock() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}`;
}
updateClock();
// Every second so the display flips at exactly the right moment.
setInterval(updateClock, 1_000);


// ============================================================
// WINDOW MANAGER
// ============================================================

let zCounter = 10; // increments each time a window is focused

// Adds a CSS animation class, then removes it and fires the optional
// callback once the animation ends. Skips straight to the callback
// when the user has "prefers-reduced-motion: reduce" enabled.
function runAnimation(el, className, callback) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.remove(className);
    callback?.();
    return;
  }
  el.classList.add(className);
  el.addEventListener('animationend', () => {
    el.classList.remove(className);
    callback?.();
  }, { once: true });
}

// Marks a window as active: raises its z-index, updates titlebar
// state on all windows, and syncs the taskbar buttons.
function focusWindow(win) {
  const titlebar   = win.querySelector('.window__titlebar');
  const wasInactive = titlebar.classList.contains('window__titlebar--inactive');

  document.querySelectorAll('.window__titlebar').forEach(bar => {
    bar.classList.add('window__titlebar--inactive');
  });

  titlebar.classList.remove('window__titlebar--inactive');
  win.style.zIndex = ++zCounter;
  syncTaskbarButtons(win);

  // Play the error ding whenever the System Error dialog comes into focus
  // from an inactive state (avoids repeating on every mousedown).
  if (wasInactive && win.querySelector('.window__title').textContent.trim() === 'System Error') {
    SFX.error();
  }
}


// ============================================================
// DRAG
// ============================================================

function initDrag(win) {
  const titlebar = win.querySelector('.window__titlebar');
  const desktop  = document.querySelector('.desktop');

  titlebar.addEventListener('mousedown', (e) => {
    // Let control button clicks reach their own handlers without starting a drag.
    if (e.target.closest('.window__controls')) return;

    // On mobile, windows are full-screen panels — dragging makes no sense.
    if (isMobile()) return;

    // Distance from the mouse to the window origin — stays constant during drag.
    const offsetX = e.clientX - win.offsetLeft;
    const offsetY = e.clientY - win.offsetTop;

    // Attach to document so the drag survives if the cursor outruns the element.
    function onMouseMove(e) {
      // Keep the window fully within the desktop surface.
      const maxLeft = desktop.clientWidth  - win.offsetWidth;
      const maxTop  = desktop.clientHeight - win.offsetHeight;

      win.style.left = `${Math.max(0, Math.min(e.clientX - offsetX, maxLeft))}px`;
      win.style.top  = `${Math.max(0, Math.min(e.clientY - offsetY, maxTop))}px`;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
  });
}


// ============================================================
// MAXIMIZE
// ============================================================

function initMaximize(win) {
  const btn = win.querySelector('.window__btn--maximize');

  function toggle() {
    if (isMobile()) return; // full-screen panels already handle layout on mobile
    if (win.classList.contains('window--maximized')) {
      // Restore saved position and size
      win.classList.remove('window--maximized');
      win.style.top    = win.dataset.restoreTop    || '';
      win.style.left   = win.dataset.restoreLeft   || '';
      win.style.width  = win.dataset.restoreWidth  || '';
      win.style.height = win.dataset.restoreHeight || '';
      btn.textContent  = '□';
      btn.setAttribute('aria-label', 'Maximize');
    } else {
      // Save current position before going full-screen
      win.dataset.restoreTop    = win.style.top;
      win.dataset.restoreLeft   = win.style.left;
      win.dataset.restoreWidth  = win.style.width;
      win.dataset.restoreHeight = win.style.height;
      win.classList.add('window--maximized');
      btn.textContent = '❐';
      btn.setAttribute('aria-label', 'Restore Down');
    }
    focusWindow(win);
  }

  btn.addEventListener('click', toggle);

  // Double-click on the title bar also toggles maximize (classic Win95 behaviour).
  win.querySelector('.window__titlebar').addEventListener('dblclick', (e) => {
    if (e.target.closest('.window__controls')) return;
    toggle();
  });
}


// ============================================================
// RESIZE
// ============================================================

function initResize(win) {
  // The handle is created in JS to avoid touching every window in the HTML.
  const handle = document.createElement('div');
  handle.className = 'window__resize';
  handle.setAttribute('aria-hidden', 'true');
  win.appendChild(handle);

  handle.addEventListener('mousedown', (e) => {
    if (isMobile() || win.classList.contains('window--maximized')) return;
    e.stopPropagation(); // prevent mousedown from bubbling to focusWindow or drag

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.offsetWidth;
    const startH = win.offsetHeight;

    function onMouseMove(e) {
      win.style.width  = `${Math.max(200, startW + e.clientX - startX)}px`;
      win.style.height = `${Math.max(150, startH + e.clientY - startY)}px`;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
  });
}


// ============================================================
// CONTROL BUTTONS
// ============================================================

function initControls(win) {
  win.querySelector('.window__btn--close').addEventListener('click', () => {
    SFX.close();
    // System dialogs (data-system) hide instead of being removed,
    // so showError() can reuse them without recreating the DOM node.
    if (win.dataset.system) {
      runAnimation(win, 'window--closing', () => {
        win.style.display = 'none';
        const btn = getTaskbarButton(win);
        if (btn) {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('taskbar__app-btn--active');
        }
      });
      return;
    }
    runAnimation(win, 'window--closing', () => {
      win.remove();
      removeTaskbarButton(win);
    });
  });

  win.querySelector('.window__btn--minimize').addEventListener('click', () => {
    SFX.close();
    runAnimation(win, 'window--closing', () => {
      win.style.display = 'none';
      const btn = getTaskbarButton(win);
      if (btn) {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('taskbar__app-btn--active');
      }
    });
  });
}


// ============================================================
// TASKBAR
// ============================================================

// Map window title text → its taskbar button, built once at startup.
const taskbarMap = new Map(
  [...document.querySelectorAll('.taskbar__app-btn')].map(btn => [btn.textContent.trim(), btn])
);

function getTaskbarButton(win) {
  const title = win.querySelector('.window__title').textContent.trim();
  return taskbarMap.get(title) ?? null;
}

function removeTaskbarButton(win) {
  const btn = getTaskbarButton(win);
  if (btn) btn.remove();
}

function syncTaskbarButtons(activeWin) {
  taskbarMap.forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('taskbar__app-btn--active');
  });

  const btn = getTaskbarButton(activeWin);
  if (btn) {
    btn.setAttribute('aria-pressed', 'true');
    btn.classList.add('taskbar__app-btn--active');
  }
}

// Clicking a taskbar button restores a minimized window or re-focuses it.
function initTaskbarButtons() {
  taskbarMap.forEach((btn, title) => {
    btn.addEventListener('click', () => {
      const win = [...document.querySelectorAll('.window')].find(
        w => w.querySelector('.window__title').textContent.trim() === title
      );
      if (!win) return;

      if (win.style.display === 'none') {
        win.style.display = 'flex';
        SFX.open();
        runAnimation(win, 'window--opening');
      }
      focusWindow(win);
    });
  });
}


// ============================================================
// BOOTSTRAP
// ============================================================

document.querySelectorAll('.window').forEach(win => {
  // Any click on the window raises it — mousedown so it fires before the
  // click event that the control buttons use.
  win.addEventListener('mousedown', () => focusWindow(win));

  initDrag(win);
  initControls(win);
  initMaximize(win);
  initResize(win);
});

// Set initial focus to whichever window is marked active in the HTML.
const initialActive = document.querySelector('.window__titlebar:not(.window__titlebar--inactive)');
if (initialActive) focusWindow(initialActive.closest('.window'));

initTaskbarButtons();

// Staggered entrance: each window fades in 80 ms after the previous one.
document.querySelectorAll('.window').forEach((win, i) => {
  win.style.animationDelay = `${i * 80}ms`;
  runAnimation(win, 'window--opening', () => {
    win.style.animationDelay = '';
  });
});


// ============================================================
// DESKTOP ICONS
// ============================================================

// Double-clicking a desktop icon opens or focuses the matching window.
document.querySelectorAll('.icon-item--desktop[data-window]').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    const title = icon.dataset.window;
    const win   = [...document.querySelectorAll('.window')].find(
      w => w.querySelector('.window__title').textContent.trim() === title
    );
    if (!win) return;
    if (win.style.display === 'none') {
      win.style.display = 'flex';
      SFX.open();
      runAnimation(win, 'window--opening');
    }
    focusWindow(win);
  });
});


// ============================================================
// CONTACT FORM VALIDATION
// ============================================================

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg   = document.getElementById('contact-msg').value.trim();

    if (!name || !email || !msg) {
      showError('All fields are required.<br>Please fill in Name, E-mail and Message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('The e-mail address entered is not valid.<br>Please check and try again.');
      return;
    }

    // Success — update the status bar and reset the form.
    const statusCell = contactForm.closest('.window').querySelector('.statusbar__cell');
    statusCell.textContent = 'Message sent!';
    contactForm.reset();
    setTimeout(() => { statusCell.textContent = 'Ready'; }, 3000);
  });
}


// ============================================================
// INTERNET EXPLORER EASTER EGG
// ============================================================

// Double-clicking Internet Explorer shows a crash error — as it should.
document.getElementById('ie-icon')?.addEventListener('dblclick', () => {
  showError('IEXPLORE.EXE has performed an illegal operation<br>and will be shut down.');
});

// Double-clicking Recycle Bin also ends in disappointment.
document.getElementById('recycle-icon')?.addEventListener('dblclick', () => {
  showError('Cannot empty Recycle Bin.<br>Access is denied.');
});


// ============================================================
// ERROR DIALOG BUTTONS
// ============================================================

// OK and Cancel both dismiss the System Error dialog the same way
// the close button does — hide with animation, keep the node in DOM.
const errorWin = [...document.querySelectorAll('.window')].find(
  w => w.querySelector('.window__title')?.textContent.trim() === 'System Error'
);

if (errorWin) {
  errorWin.querySelectorAll('.error-body .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      SFX.close();
      runAnimation(errorWin, 'window--closing', () => {
        errorWin.style.display = 'none';
        const taskBtn = getTaskbarButton(errorWin);
        if (taskBtn) {
          taskBtn.setAttribute('aria-pressed', 'false');
          taskBtn.classList.remove('taskbar__app-btn--active');
        }
      });
    });
  });
}


// ============================================================
// START MENU ITEMS
// ============================================================

// Maps each Start Menu label to an action.
// Items with a window title open/focus that window;
// items without a real counterpart show a classic error.
const startMenuActions = {
  'Programs':   () => openOrFocus('Portfolio'),
  'Documents':  () => openOrFocus('Notepad'),
  'Settings':   () => openOrFocus('About This Template'),
  'Find':       () => showError('Find: feature not available<br>in this version.'),
  'Help':       () => openOrFocus('About This Template'),
  'Run…':  () => showError('The name specified is not recognized<br>as a program or command.'),
  'Shut Down…': () => showError('Access is denied.<br>You cannot shut down this computer.'),
};

function openOrFocus(title) {
  const win = [...document.querySelectorAll('.window')].find(
    w => w.querySelector('.window__title').textContent.trim() === title
  );
  if (!win) return;
  if (win.style.display === 'none') {
    win.style.display = 'flex';
    SFX.open();
    runAnimation(win, 'window--opening');
  }
  focusWindow(win);
  closeStartMenu();
}

document.querySelectorAll('.start-menu__item').forEach(item => {
  const label  = item.querySelector('.start-menu__label')?.textContent.trim();
  const action = startMenuActions[label];
  if (action) item.addEventListener('click', action);
});


// ============================================================
// START MENU
// ============================================================

const startBtn  = document.querySelector('.taskbar__start');
const startMenu = document.getElementById('startMenu');

function openStartMenu() {
  SFX.menu();
  startMenu.classList.add('is-open');
  startBtn.setAttribute('aria-expanded', 'true');
}

function closeStartMenu() {
  startMenu.classList.remove('is-open');
  startBtn.setAttribute('aria-expanded', 'false');
}

// Toggle on Start button click. No stopPropagation needed because the
// document listener below explicitly ignores clicks that land on the button.
startBtn.addEventListener('click', () => {
  startMenu.classList.contains('is-open') ? closeStartMenu() : openStartMenu();
});

// Close when the user clicks anywhere that is neither the menu nor the button.
document.addEventListener('click', (e) => {
  if (!startMenu.classList.contains('is-open')) return;
  if (startMenu.contains(e.target) || startBtn.contains(e.target)) return;
  closeStartMenu();
});

// Close on Escape and return focus to the Start button.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && startMenu.classList.contains('is-open')) {
    closeStartMenu();
    startBtn.focus();
  }
});
