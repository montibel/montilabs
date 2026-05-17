// app.js — Window Manager · Windows 95 Template

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
setInterval(updateClock, 1_000);


// ============================================================
// WINDOW MANAGER
// ============================================================

let zCounter = 10;

function focusWindow(win) {
  document.querySelectorAll('.window__titlebar').forEach(bar => {
    bar.classList.add('window__titlebar--inactive');
  });

  win.querySelector('.window__titlebar').classList.remove('window__titlebar--inactive');
  win.style.zIndex = ++zCounter;
  syncTaskbarButtons(win);
}


// ============================================================
// DRAG
// ============================================================

function initDrag(win) {
  const titlebar = win.querySelector('.window__titlebar');
  const desktop  = document.querySelector('.desktop');

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window__controls')) return;

    const offsetX = e.clientX - win.offsetLeft;
    const offsetY = e.clientY - win.offsetTop;

    function onMouseMove(e) {
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
// CONTROL BUTTONS
// ============================================================

function initControls(win) {
  win.querySelector('.window__btn--close').addEventListener('click', () => {
    win.remove();
    removeTaskbarButton(win);
  });

  win.querySelector('.window__btn--minimize').addEventListener('click', () => {
    win.style.display = 'none';
    const btn = getTaskbarButton(win);
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('taskbar__app-btn--active');
    }
  });
}


// ============================================================
// TASKBAR
// ============================================================

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

function initTaskbarButtons() {
  taskbarMap.forEach((btn, title) => {
    btn.addEventListener('click', () => {
      const win = [...document.querySelectorAll('.window')].find(
        w => w.querySelector('.window__title').textContent.trim() === title
      );
      if (!win) return;

      if (win.style.display === 'none') win.style.display = 'flex';
      focusWindow(win);
    });
  });
}


// ============================================================
// BOOTSTRAP
// ============================================================

document.querySelectorAll('.window').forEach(win => {
  win.addEventListener('mousedown', () => focusWindow(win));

  initDrag(win);
  initControls(win);
});

const initialActive = document.querySelector('.window__titlebar:not(.window__titlebar--inactive)');
if (initialActive) focusWindow(initialActive.closest('.window'));

initTaskbarButtons();


// ============================================================
// START MENU
// ============================================================

const startBtn  = document.querySelector('.taskbar__start');
const startMenu = document.getElementById('startMenu');

function openStartMenu() {
  startMenu.classList.add('is-open');
  startBtn.setAttribute('aria-expanded', 'true');
}

function closeStartMenu() {
  startMenu.classList.remove('is-open');
  startBtn.setAttribute('aria-expanded', 'false');
}

startBtn.addEventListener('click', () => {
  startMenu.classList.contains('is-open') ? closeStartMenu() : openStartMenu();
});

document.addEventListener('click', (e) => {
  if (!startMenu.classList.contains('is-open')) return;
  if (startMenu.contains(e.target) || startBtn.contains(e.target)) return;
  closeStartMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && startMenu.classList.contains('is-open')) {
    closeStartMenu();
    startBtn.focus();
  }
});
