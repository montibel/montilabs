const puppeteer = require('puppeteer');
const path = require('path');

const FILE   = 'file://' + path.resolve(__dirname, 'index.html');
const OUT    = path.resolve(__dirname, 'screenshots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // ── 1. Hero shot: desktop with multiple windows open ──────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);

    // Open Portfolio, Contact and About windows via taskbar buttons
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.taskbar__app-btn')];
      const targets = ['Portfolio', 'Contact', 'About This Template'];
      targets.forEach(title => {
        const btn = buttons.find(b => b.textContent.trim() === title);
        if (btn) btn.click();
      });
    });
    await delay(600);

    // Offset windows so they overlap nicely
    await page.evaluate(() => {
      const wins = document.querySelectorAll('.window:not([style*="display: none"])');
      const offsets = [
        { left: 60,  top: 40  },
        { left: 220, top: 110 },
        { left: 420, top: 60  },
      ];
      [...wins].slice(0, 3).forEach((w, i) => {
        w.style.left = offsets[i].left + 'px';
        w.style.top  = offsets[i].top  + 'px';
        w.style.zIndex = 10 + i;
      });
    });
    await delay(300);
    await page.screenshot({ path: `${OUT}/01-hero-desktop.png` });
    await page.close();
    console.log('✅  01-hero-desktop.png');
  }

  // ── 2. Start Menu open ────────────────────────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);
    await page.click('.taskbar__start');
    await delay(400);
    await page.screenshot({ path: `${OUT}/02-start-menu.png` });
    await page.close();
    console.log('✅  02-start-menu.png');
  }

  // ── 3. System Error dialog (IE easter egg) ────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);
    await page.evaluate(() => {
      const ie = document.getElementById('ie-icon');
      if (ie) ie.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });
    await delay(500);
    await page.screenshot({ path: `${OUT}/03-system-error.png` });
    await page.close();
    console.log('✅  03-system-error.png');
  }

  // ── 4. Mobile responsive view ─────────────────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 }); // iPhone 14
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.taskbar__app-btn')];
      const btn = buttons.find(b => b.textContent.trim() === 'Portfolio');
      if (btn) btn.click();
    });
    await delay(500);
    await page.screenshot({ path: `${OUT}/04-mobile-responsive.png` });
    await page.close();
    console.log('✅  04-mobile-responsive.png');
  }

  // ── 5. Close-up: window bevel + controls ──────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.taskbar__app-btn')];
      const btn = buttons.find(b => b.textContent.trim() === 'About This Template');
      if (btn) btn.click();
    });
    await delay(500);
    const win = await page.$('.window:not([style*="display: none"])');
    if (win) {
      const box = await win.boundingBox();
      await page.screenshot({
        path: `${OUT}/05-window-closeup.png`,
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: Math.min(box.width + 20, 1280),
          height: Math.min(box.height + 20, 800),
        },
      });
    }
    await page.close();
    console.log('✅  05-window-closeup.png');
  }

  // ── 6. Notepad + Contact form side by side ────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await delay(400);
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.taskbar__app-btn')];
      ['Notepad', 'Contact'].forEach(title => {
        const btn = buttons.find(b => b.textContent.trim() === title);
        if (btn) btn.click();
      });
    });
    await delay(600);
    await page.evaluate(() => {
      const wins = [...document.querySelectorAll('.window:not([style*="display: none"])')];
      if (wins[0]) { wins[0].style.left = '40px';  wins[0].style.top = '60px'; }
      if (wins[1]) { wins[1].style.left = '480px'; wins[1].style.top = '60px'; }
    });
    await delay(300);
    await page.screenshot({ path: `${OUT}/06-notepad-contact.png` });
    await page.close();
    console.log('✅  06-notepad-contact.png');
  }

  await browser.close();
  console.log('\n🎉  All screenshots saved to /screenshots/');
})();
