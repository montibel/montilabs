let pts = [];
let flows = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  sampleText();
  for (let i = 0; i < 700; i++) flows.push(mkFlow());
}

function mkFlow() {
  return {
    x: random(width),
    y: random(height),
    life: random(80, 220),
    speed: random(0.9, 2.2),
    bright: random(0.3, 1.0),
  };
}

function sampleText() {
  pts = [];
  const pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.noStroke();
  pg.textStyle(NORMAL);
  pg.textSize(min(width / 5.5, 130));
  pg.textAlign(CENTER, CENTER);
  pg.text('montilabs', width / 2, height / 2);
  pg.loadPixels();
  const step = 5;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      if (pg.pixels[(x + y * width) * 4] > 128) pts.push({ x, y });
    }
  }
  pg.remove();
}

function draw() {
  noStroke();
  fill(0, 8, 22, 22);
  rect(0, 0, width, height);

  drawFlowField();
  drawParticles();
}

function drawFlowField() {
  const t = frameCount * 0.0025;
  noStroke();

  for (const p of flows) {
    const angle = noise(p.x * 0.0025, p.y * 0.0025, t) * TWO_PI * 2.5;
    p.x += cos(angle) * p.speed;
    p.y += sin(angle) * p.speed;
    p.life--;

    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      Object.assign(p, mkFlow());
    }

    const a = map(p.life, 0, 80, 0, 1) * p.bright;
    fill(20 + p.bright * 40, 80 + p.bright * 100, 200 + p.bright * 55, a * 45);
    ellipse(p.x, p.y, 2);
  }
}

function drawParticles() {
  const t = frameCount * 0.007;
  blendMode(ADD);
  noStroke();

  for (const pt of pts) {
    const n1 = noise(pt.x * 0.004, pt.y * 0.004, t);
    const n2 = noise(pt.x * 0.004 + 500, pt.y * 0.004 + 200, t);
    const px = pt.x + (n1 - 0.5) * 10;
    const py = pt.y + (n2 - 0.5) * 10;
    const sz = map(n1, 0, 1, 1, 2.5);

    fill(40, 120, 220, 25);
    ellipse(px, py, sz * 4);
    fill(190, 230, 255, 220);
    ellipse(px, py, sz);
  }

  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sampleText();
}
