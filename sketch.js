// === MONTI OS ===

const C = {
  desktop: [0, 128, 128],
  gray: [192, 192, 192],
  darkGray: [128, 128, 128],
  darker: [64, 64, 64],
  black: [0, 0, 0],
  white: [255, 255, 255],
  blue1: [0, 0, 128],
  blue2: [16, 132, 208],
  green: [0, 200, 0],
};

// --- Translations ---
const T = {
  es: {
    boot: [
      "MONTILABS OS  Version 1.0",
      "Copyright (C) 2024 montilabs.",
      "",
      "  640K RAM OK",
      "",
      "  Iniciando MONTILABS OS...",
    ],
    loading:   "Iniciando MONTILABS OS...",
    watermark: "Diseñado por montilabs",
    start:     "▶ Inicio",
    icons:     ["Mis Fotos", "Sobre mí", "Contacto", "Proyectos"],
    winTitles: {
      fotos:     "📷 Mis Fotos",
      sobremi:   "📝 Sobre mí",
      contacto:  "📧 Contacto",
      proyectos: "💼 Proyectos",
    },
    galTitle:  "montilabs",
    galSub:    "Fotografía análoga",
    galBtn:    "Ver galería  →",
    contact:   "✉  montibel@gmail.com",
    sobremi: `Hola, soy Marce. Fundadora de montilabs.

Soy Desarrolladora Creativa y Realizadora Audiovisual. Vivo actualmente en Santiago de Chile y mezclo código con diseño para armar cosas animadas, además de dedicarme a la edición de video.

Mi fuerte es la tipografía animada, los efectos visuales y el diseño de interfaces. Actualmente estoy trabajando con arte generativo y mezclando inteligencia artificial con visuales.

Cuando no estoy en el compu, lo más probable es que me encuentres en el cine, leyendo algo o preparando un café con mis gatos cerca.`,
    menuItems: [
      "📁  Programas",
      "📄  Documentos",
      "⚙  Configuración",
      "🔍  Buscar",
      "❓  Ayuda",
      "---",
      "⏻  Apagar...",
    ],
    categories: ["Tipografía", "UI / UX"],
    langBtn:    "EN",
    langHint:   "Selecciona tu idioma",
    langEs:     "Español",
    langEn:     "English",
  },
  en: {
    boot: [
      "MONTILABS OS  Version 1.0",
      "Copyright (C) 2024 montilabs.",
      "",
      "  640K RAM OK",
      "",
      "  Starting MONTILABS OS...",
    ],
    loading:   "Starting MONTILABS OS...",
    watermark: "Designed by montilabs",
    start:     "▶ Start",
    icons:     ["My Photos", "About me", "Contact", "Projects"],
    winTitles: {
      fotos:     "📷 My Photos",
      sobremi:   "📝 About me",
      contacto:  "📧 Contact",
      proyectos: "💼 Projects",
    },
    galTitle:  "montilabs",
    galSub:    "Analog photography",
    galBtn:    "View gallery  →",
    contact:   "✉  montibel@gmail.com",
    sobremi: `Hi, I'm Marce. Founder of montilabs.

I'm a Creative Developer and Audiovisual Director based in Santiago, Chile. I blend code with design to build animated experiences, and I also work in video editing.

My focus areas are animated typography, visual effects, and interface design. I'm currently exploring generative art and mixing AI with visuals.

When I'm not at the computer, you'll probably find me at the cinema, reading, or making coffee with my cats nearby.`,
    menuItems: [
      "📁  Programs",
      "📄  Documents",
      "⚙  Settings",
      "🔍  Search",
      "❓  Help",
      "---",
      "⏻  Shut down...",
    ],
    categories: ["Typography", "UI / UX"],
    langBtn:    "ES",
    langHint:   "Choose your language",
    langEs:     "Español",
    langEn:     "English",
  },
};

const ICONS = [
  { id: "fotos",     emoji: "📷" },
  { id: "sobremi",  emoji: "📝" },
  { id: "contacto", emoji: "📧" },
  { id: "proyectos",emoji: "💼" },
];

const PROYECTOS = [
  {
    categories: ["Tipografía", "Typography"],
    items: [
      { label: "Fluid Type", url: "tipografia/" },
      { label: "Gravity",    url: "tipografia2/dist/" },
    ],
  },
  {
    categories: ["UI / UX", "UI / UX"],
    items: [
      { label: "Search Sequence", url: "uxsim/dist/" },
      { label: "iPhone Home",     url: "iphone/dist/" },
    ],
  },
];

// --- 3D helpers ---
function raised(x, y, w, h) {
  strokeWeight(1);
  stroke(...C.white);
  line(x, y, x + w, y);
  line(x, y, x, y + h);
  stroke(...C.gray);
  line(x + 1, y + 1, x + w - 1, y + 1);
  line(x + 1, y + 1, x + 1, y + h - 1);
  stroke(...C.darker);
  line(x + w, y, x + w, y + h);
  line(x, y + h, x + w, y + h);
  stroke(...C.darkGray);
  line(x + w - 1, y + 1, x + w - 1, y + h - 1);
  line(x + 1, y + h - 1, x + w - 1, y + h - 1);
}

function sunken(x, y, w, h) {
  strokeWeight(1);
  stroke(...C.darker);
  line(x, y, x + w, y);
  line(x, y, x, y + h);
  stroke(...C.darkGray);
  line(x + 1, y + 1, x + w - 1, y + 1);
  line(x + 1, y + 1, x + 1, y + h - 1);
  stroke(...C.white);
  line(x + w, y, x + w, y + h);
  line(x, y + h, x + w, y + h);
}

function gradientBar(x, y, w, h, c1, c2) {
  for (let i = 0; i <= w; i++) {
    stroke(lerpColor(c1, c2, i / w));
    line(x + i, y, x + i, y + h);
  }
}

// --- Base Window ---
class Win95Window {
  constructor(x, y, w, h, title) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.minimized = false;
    this._btns = {};
    this._taskX = 0;
    this._appId = null;
  }

  get TB() { return 18; }
  get B()  { return 3; }

  isActive() {
    return wins.length > 0 && wins[wins.length - 1] === this;
  }

  draw() {
    if (this.minimized) return;
    push();

    raised(this.x, this.y, this.w, this.h);
    fill(...C.gray);
    noStroke();
    rect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);

    const tx = this.x + this.B,
      ty = this.y + this.B,
      tw = this.w - this.B * 2;

    if (this.isActive()) {
      gradientBar(tx, ty, tw, this.TB, color(...C.blue1), color(...C.blue2));
    } else {
      fill(...C.darkGray);
      noStroke();
      rect(tx, ty, tw, this.TB);
    }

    fill(...C.white);
    noStroke();
    textFont("monospace");
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    // Window title is dynamic per language
    text(T[lang].winTitles[this._appId] || this.title, tx + 4, ty + this.TB / 2 + 1);
    textStyle(NORMAL);

    this._drawBtns(tx, ty, tw);

    const cx = this.x + this.B;
    const cy = ty + this.TB + 2;
    const cw = this.w - this.B * 2;
    const ch = this.h - (cy - this.y) - this.B;

    sunken(cx, cy, cw, ch);
    fill(...C.white);
    noStroke();
    rect(cx + 2, cy + 2, cw - 4, ch - 4);

    this.drawContent(cx + 6, cy + 6, cw - 12, ch - 12);
    pop();
  }

  _drawBtns(tx, ty, tw) {
    const S = 14, by = ty + 2;
    const closeX = tx + tw - S - 2;
    const maxX   = closeX - S - 2;
    const minX   = maxX - S - 2;

    this._drawBtn(closeX, by, S);
    fill(...C.black);
    textSize(9);
    textAlign(CENTER, CENTER);
    text("✕", closeX + S / 2, by + S / 2);

    this._drawBtn(maxX, by, S);
    noFill();
    stroke(...C.black);
    strokeWeight(1);
    rect(maxX + 3, by + 4, S - 6, S - 7);

    this._drawBtn(minX, by, S);
    stroke(...C.black);
    strokeWeight(2);
    line(minX + 3, by + S - 4, minX + S - 3, by + S - 4);
    strokeWeight(1);

    this._btns = { closeX, maxX, minX, by, S };
  }

  _drawBtn(x, y, s) {
    fill(...C.gray);
    noStroke();
    rect(x, y, s, s);
    stroke(...C.white);
    line(x, y, x + s, y);
    line(x, y, x, y + s);
    stroke(...C.darker);
    line(x + s, y, x + s, y + s);
    line(x, y + s, x + s, y + s);
    stroke(...C.darkGray);
    line(x + s - 1, y + 1, x + s - 1, y + s - 1);
    line(x + 1, y + s - 1, x + s - 1, y + s - 1);
  }

  drawContent(x, y, w, h) {}

  onTitleBar(mx, my) {
    const tx = this.x + this.B, ty = this.y + this.B;
    return mx > tx && mx < tx + this.w - this.B * 2 && my > ty && my < ty + this.TB;
  }

  onClose(mx, my) { return this._hitBtn(mx, my, this._btns.closeX); }
  onMin(mx, my)   { return this._hitBtn(mx, my, this._btns.minX); }

  _hitBtn(mx, my, bx) {
    const { by, S } = this._btns;
    return bx !== undefined && mx > bx && mx < bx + S && my > by && my < by + S;
  }

  hit(mx, my) {
    return mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
  }
}

// --- Fotos Window ---
class FotosWindow extends Win95Window {
  constructor(x, y) {
    super(x, y, 300, 200, "");
    this._galBtn = null;
  }
  drawContent(x, y, w, h) {
    const t = T[lang];
    textFont("monospace");
    textAlign(CENTER, TOP);
    noStroke();
    fill(...C.black);
    textSize(13);
    textStyle(BOLD);
    text(t.galTitle, x + w / 2, y + 10);
    textStyle(NORMAL);
    fill(...C.darkGray);
    textSize(11);
    text(t.galSub, x + w / 2, y + 30);

    const bw = 150, bh = 28;
    const bx = x + w / 2 - bw / 2, by = y + h - bh - 10;
    raised(bx, by, bw, bh);
    fill(...C.gray);
    noStroke();
    rect(bx + 2, by + 2, bw - 4, bh - 4);
    fill(...C.black);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(t.galBtn, bx + bw / 2, by + bh / 2);

    this._galBtn = { x: bx, y: by, w: bw, h: bh };
  }
  onGalBtn(mx, my) {
    if (!this._galBtn) return false;
    const b = this._galBtn;
    return mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h;
  }
}

// --- Text Window (Notepad-style) ---
class TextWindow extends Win95Window {
  constructor(x, y, w, h, contentKey) {
    super(x, y, w, h, "");
    this.contentKey = contentKey;
  }
  drawContent(x, y, w, h) {
    fill(...C.black);
    noStroke();
    textFont("monospace");
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    text(T[lang][this.contentKey], x, y, w, h);
  }
}

// --- Contacto Window ---
class ContactoWindow extends Win95Window {
  constructor(x, y) {
    super(x, y, 280, 120, "");
    this._mailBtn = null;
  }
  drawContent(x, y, w, h) {
    fill(...C.black);
    noStroke();
    textFont("monospace");
    textSize(12);
    textAlign(LEFT, CENTER);
    text(T[lang].contact, x + 4, y + h / 2);
    this._mailBtn = { x, y: y + h / 2 - 10, w, h: 22 };
  }
  onMailBtn(mx, my) {
    if (!this._mailBtn) return false;
    const b = this._mailBtn;
    return mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h;
  }
}

// --- Proyectos Window ---
class ProyectosWindow extends Win95Window {
  constructor(x, y) {
    super(x, y, 320, 300, "");
    this._btnsP = [];
  }
  drawContent(x, y, w, h) {
    this._btnsP = [];
    textFont("monospace");
    noStroke();

    const bh = 28, gap = 6;
    let cy = y;
    const langIdx = lang === "es" ? 0 : 1;

    for (const group of PROYECTOS) {
      fill(...C.darkGray);
      textSize(10);
      textAlign(LEFT, TOP);
      text(group.categories[langIdx].toUpperCase(), x + 2, cy);
      stroke(...C.darkGray);
      strokeWeight(1);
      line(x, cy + 14, x + w, cy + 14);
      cy += 20;

      for (const item of group.items) {
        raised(x, cy, w, bh);
        fill(...C.gray);
        noStroke();
        rect(x + 2, cy + 2, w - 4, bh - 4);
        fill(...C.black);
        textSize(12);
        textAlign(LEFT, CENTER);
        text(item.label, x + 10, cy + bh / 2);
        this._btnsP.push({ x, y: cy, w, h: bh, url: item.url });
        cy += bh + gap;
      }
      cy += 8;
    }
  }
  hitProyecto(mx, my) {
    for (const b of this._btnsP) {
      if (mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h) return b.url;
    }
    return null;
  }
}

// --- App definitions ---
let windowCount = 0;
const APP_DEFS = {
  fotos:     () => new FotosWindow(80, 60),
  sobremi:   () => new TextWindow(120, 80, 400, 260, "sobremi"),
  contacto:  () => new ContactoWindow(160, 110),
  proyectos: () => new ProyectosWindow(200, 130),
};

// --- Globals ---
let wins = [];
let dragging = null, dragOX, dragOY;
let startOpen = false;
let appState = "lang";
let stateFrame = 0;
let lang = "es";

// Store lang btn rects for click detection
let _langBtnEs = null, _langBtnEn = null, _langToggleBtn = null;

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont("monospace");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- Draw ---
function draw() {
  const f = frameCount - stateFrame;
  if (appState === "lang")    { drawLangSelect(); return; }
  if (appState === "boot")    { drawBoot(f); return; }
  if (appState === "loading") { drawLoading(f); return; }
  drawOS();
}

function goTo(state) {
  appState = state;
  stateFrame = frameCount;
}

// --- Language Selection ---
function drawLangSelect() {
  background(0);
  const t = T[lang];

  fill(...C.green);
  noStroke();
  textFont("monospace");
  textSize(13);
  textAlign(CENTER, CENTER);
  text("MONTILABS OS", width / 2, height / 2 - 90);

  fill(...C.white);
  textSize(11);
  text(t.langHint, width / 2, height / 2 - 60);

  // Buttons
  const bw = 120, bh = 36, gap = 20;
  const totalW = bw * 2 + gap;
  const bx1 = width / 2 - totalW / 2;
  const bx2 = bx1 + bw + gap;
  const by  = height / 2 - 20;

  _langBtnEs = { x: bx1, y: by, w: bw, h: bh };
  _langBtnEn = { x: bx2, y: by, w: bw, h: bh };

  // ES button
  const esHover = mouseX > bx1 && mouseX < bx1 + bw && mouseY > by && mouseY < by + bh;
  if (esHover) fill(...C.white); else fill(...C.gray);
  noStroke();
  rect(bx1, by, bw, bh);
  raised(bx1, by, bw, bh);
  if (esHover) fill(...C.blue1); else fill(...C.black);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Español", bx1 + bw / 2, by + bh / 2);
  textStyle(NORMAL);

  // EN button
  const enHover = mouseX > bx2 && mouseX < bx2 + bw && mouseY > by && mouseY < by + bh;
  if (enHover) fill(...C.white); else fill(...C.gray);
  noStroke();
  rect(bx2, by, bw, bh);
  raised(bx2, by, bw, bh);
  if (enHover) fill(...C.blue1); else fill(...C.black);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("English", bx2 + bw / 2, by + bh / 2);
  textStyle(NORMAL);
}

// --- Boot screen ---
function drawBoot(f) {
  background(0);
  fill(...C.green);
  noStroke();
  textFont("monospace");
  textSize(14);
  textAlign(LEFT, TOP);

  const lines = T[lang].boot;
  const linesVisible = min(floor(f / 8), lines.length);
  const ox = width / 2 - 180, oy = height / 2 - 80;

  for (let i = 0; i < linesVisible; i++) {
    text(lines[i], ox, oy + i * 22);
  }
  if (f % 15 < 8 && linesVisible >= lines.length) {
    text("_", ox, oy + linesVisible * 22);
  }
  if (f > lines.length * 8 + 25) goTo("loading");
}

// --- Loading screen ---
function drawLoading(f) {
  background(0);
  const p = constrain(f / 40, 0, 1);
  const bw = 240, bh = 20;
  const bx = width / 2 - bw / 2, by = height / 2;

  fill(...C.green);
  noStroke();
  textFont("monospace");
  textSize(13);
  textAlign(CENTER, BOTTOM);
  text(T[lang].loading, width / 2, by - 12);

  noFill();
  stroke(...C.green);
  strokeWeight(1);
  rect(bx, by, bw, bh);
  fill(...C.green);
  noStroke();
  rect(bx + 2, by + 2, (bw - 4) * p, bh - 4);

  if (f > 45) goTo("desktop");
}

// --- OS ---
function drawOS() {
  background(...C.desktop);
  drawIcons();
  for (const w of wins) w.draw();
  if (startOpen) drawStartMenu();
  drawTaskbar();
  drawLangToggle();

  fill(0, 0, 0, 60);
  noStroke();
  textFont("monospace");
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  text(T[lang].watermark, width - 8, height - 42);
}

// --- Lang toggle button on desktop ---
function drawLangToggle() {
  const lbl = T[lang].langBtn;
  const bw = 28, bh = 16;
  const bx = width - 8 - bw, by = height - 42 - bh - 4;
  _langToggleBtn = { x: bx, y: by, w: bw, h: bh };

  fill(0, 0, 0, 50);
  noStroke();
  rect(bx, by, bw, bh, 3);
  fill(255, 255, 255, 180);
  textFont("monospace");
  textSize(9);
  textAlign(CENTER, CENTER);
  text(lbl, bx + bw / 2, by + bh / 2);
}

// --- Desktop icons ---
function drawIcons() {
  const labels = T[lang].icons;
  for (let i = 0; i < ICONS.length; i++) {
    const { emoji } = ICONS[i];
    const ix = 16, iy = 16 + i * 100;
    textAlign(CENTER, TOP);
    noStroke();
    textSize(42);
    fill(...C.white);
    text(emoji, ix + 28, iy);
    textSize(13);
    text(labels[i], ix + 28, iy + 48);
  }
}

// --- Taskbar ---
function drawTaskbar() {
  const H = 38, Y = height - H;
  fill(...C.gray);
  noStroke();
  rect(0, Y, width, H);
  stroke(...C.white);
  strokeWeight(1);
  line(0, Y, width, Y);

  raisedBlock(2, Y + 2, 76, H - 4);
  fill(...C.black);
  textSize(14);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(T[lang].start, 40, Y + H / 2);
  textStyle(NORMAL);

  const t = new Date();
  const ts = nf(t.getHours(), 2) + ":" + nf(t.getMinutes(), 2);
  const cW = 56, cX = width - cW - 4;
  sunkenBlock(cX, Y + 3, cW, H - 6);
  fill(...C.black);
  textSize(13);
  textAlign(CENTER, CENTER);
  text(ts, cX + cW / 2, Y + H / 2);

  let bx = 82;
  for (const w of wins) {
    const isTop = wins[wins.length - 1] === w;
    if (w.minimized || !isTop) raisedBlock(bx, Y + 3, 130, H - 6);
    else sunkenBlock(bx, Y + 3, 130, H - 6);
    fill(...C.black);
    textSize(12);
    textAlign(LEFT, CENTER);
    const title = T[lang].winTitles[w._appId] || w.title;
    text(title.substring(0, 14), bx + 4, Y + H / 2);
    w._taskX = bx;
    bx += 134;
  }
}

function raisedBlock(x, y, w, h) {
  fill(...C.gray);
  noStroke();
  rect(x, y, w, h);
  stroke(...C.white);
  line(x, y, x + w, y);
  line(x, y, x, y + h);
  stroke(...C.darker);
  line(x + w, y, x + w, y + h);
  line(x, y + h, x + w, y + h);
  stroke(...C.darkGray);
  line(x + w - 1, y + 1, x + w - 1, y + h - 1);
  line(x + 1, y + h - 1, x + w - 1, y + h - 1);
}

function sunkenBlock(x, y, w, h) {
  fill(...C.gray);
  noStroke();
  rect(x, y, w, h);
  stroke(...C.darker);
  line(x, y, x + w, y);
  line(x, y, x, y + h);
  stroke(...C.white);
  line(x + w, y, x + w, y + h);
  line(x, y + h, x + w, y + h);
}

// --- Start Menu ---
function drawStartMenu() {
  const mW = 180, mH = 220;
  const mX = 2, mY = height - 38 - mH;
  raisedBlock(mX, mY, mW, mH);

  fill(...C.blue1);
  noStroke();
  rect(mX + 2, mY + 2, 22, mH - 4);

  push();
  fill(...C.white);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  translate(mX + 13, mY + mH / 2 + 20);
  rotate(-HALF_PI);
  text("MONTILABS OS", 0, 0);
  textStyle(NORMAL);
  pop();

  const items = T[lang].menuItems;
  for (let i = 0; i < items.length; i++) {
    if (items[i] === "---") {
      stroke(...C.darkGray);
      strokeWeight(1);
      line(mX + 26, mY + 10 + i * 28, mX + mW - 4, mY + 10 + i * 28);
      continue;
    }
    const iy = mY + 4 + i * 28;
    if (mouseX > mX + 24 && mouseX < mX + mW && mouseY > iy && mouseY < iy + 28) {
      fill(...C.blue1);
      noStroke();
      rect(mX + 24, iy, mW - 26, 28);
      fill(...C.white);
    } else {
      fill(...C.black);
    }
    textSize(12);
    textAlign(LEFT, CENTER);
    text(items[i], mX + 30, iy + 14);
  }
}

// --- Mouse ---
function mousePressed() {
  // Language selection screen
  if (appState === "lang") {
    if (_langBtnEs && mouseX > _langBtnEs.x && mouseX < _langBtnEs.x + _langBtnEs.w &&
        mouseY > _langBtnEs.y && mouseY < _langBtnEs.y + _langBtnEs.h) {
      lang = "es"; goTo("boot"); return;
    }
    if (_langBtnEn && mouseX > _langBtnEn.x && mouseX < _langBtnEn.x + _langBtnEn.w &&
        mouseY > _langBtnEn.y && mouseY < _langBtnEn.y + _langBtnEn.h) {
      lang = "en"; goTo("boot"); return;
    }
    return;
  }

  if (appState !== "desktop") {
    goTo("desktop");
    return;
  }

  // Lang toggle button on desktop
  if (_langToggleBtn && mouseX > _langToggleBtn.x && mouseX < _langToggleBtn.x + _langToggleBtn.w &&
      mouseY > _langToggleBtn.y && mouseY < _langToggleBtn.y + _langToggleBtn.h) {
    lang = lang === "es" ? "en" : "es";
    wins = [];
    startOpen = false;
    return;
  }

  const tbY = height - 38;

  if (mouseX >= 2 && mouseX <= 78 && mouseY >= tbY) {
    startOpen = !startOpen;
    return;
  }
  if (startOpen) {
    startOpen = false;
    return;
  }

  if (mouseY >= tbY) {
    for (const w of wins) {
      if (mouseX >= w._taskX && mouseX <= w._taskX + 130) {
        const isTop = wins[wins.length - 1] === w;
        if (w.minimized) {
          w.minimized = false;
          bringToFront(w);
        } else if (isTop) {
          w.minimized = true;
        } else {
          bringToFront(w);
        }
        return;
      }
    }
    return;
  }

  // Windows top → bottom
  for (let i = wins.length - 1; i >= 0; i--) {
    const w = wins[i];
    if (w.minimized || !w.hit(mouseX, mouseY)) continue;
    bringToFront(w);

    if (w.onClose(mouseX, mouseY)) {
      wins.splice(wins.indexOf(w), 1);
      return;
    }
    if (w.onMin(mouseX, mouseY)) {
      w.minimized = true;
      return;
    }

    if (w instanceof FotosWindow && w.onGalBtn(mouseX, mouseY)) {
      window.open("fotos/", "_blank");
      return;
    }
    if (w instanceof ContactoWindow && w.onMailBtn(mouseX, mouseY)) {
      window.open("mailto:montibel@gmail.com");
      return;
    }
    if (w instanceof ProyectosWindow) {
      const url = w.hitProyecto(mouseX, mouseY);
      if (url) { window.open(url, "_blank"); return; }
    }

    if (w.onTitleBar(mouseX, mouseY)) {
      dragging = w;
      dragOX = mouseX - w.x;
      dragOY = mouseY - w.y;
    }
    return;
  }

  // Desktop icon click
  for (let i = 0; i < ICONS.length; i++) {
    const ix = 16, iy = 16 + i * 100;
    if (mouseX > ix && mouseX < ix + 56 && mouseY > iy && mouseY < iy + 68) {
      openApp(ICONS[i].id);
      return;
    }
  }
}

function mouseDragged() {
  if (!dragging) return;
  dragging.x = constrain(mouseX - dragOX, 0, width - dragging.w);
  dragging.y = constrain(mouseY - dragOY, 0, height - 38 - dragging.h);
}

function mouseReleased() {
  dragging = null;
}

function keyPressed() {
  if (appState !== "desktop") goTo("desktop");
}

// --- App management ---
function openApp(id) {
  const existing = wins.find((w) => w._appId === id);
  if (existing) {
    existing.minimized = false;
    bringToFront(existing);
    return;
  }
  const w = APP_DEFS[id]();
  w._appId = id;
  w.x += (windowCount % 5) * 20;
  w.y += (windowCount % 5) * 20;
  windowCount++;
  wins.push(w);
}

function bringToFront(w) {
  wins.splice(wins.indexOf(w), 1);
  wins.push(w);
}
