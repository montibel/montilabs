let pts = []
let flows = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)
  sampleText()
  for (let i = 0; i < 700; i++) flows.push(mkFlow())
}

function mkFlow() {
  return {
    x: random(width),
    y: random(height),
    life: random(80, 220),
    speed: random(0.9, 2.2),
    bright: random(0.3, 1.0),
  }
}

function sampleText() {
  pts = []
  const pg = createGraphics(width, height)
  pg.pixelDensity(1)
  pg.background(0)
  pg.fill(255)
  pg.noStroke()
  pg.textStyle(NORMAL)
  pg.textSize(min(width / 5.5, 130))
  pg.textAlign(CENTER, CENTER)
  pg.text('montilabs', width / 2, height / 2)
  pg.loadPixels()
  const step = 5
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      if (pg.pixels[(x + y * width) * 4] > 128) pts.push({ x, y })
    }
  }
  pg.remove()
}

function draw() {
  noStroke()
  fill(11, 11, 11, 30)
  rect(0, 0, width, height)

  drawFlowField()
  drawParticles()
}

function drawFlowField() {
  const t = frameCount * 0.0025
  noStroke()

  for (const p of flows) {
    let angle = noise(p.x * 0.0025, p.y * 0.0025, t) * TWO_PI * 2.5

    // Mouse distorts the flow field
    const dx = p.x - mouseX
    const dy = p.y - mouseY
    const d  = sqrt(dx * dx + dy * dy)
    if (d < 200 && d > 1) {
      angle += (1 - d / 200) * TWO_PI * 1.2
    }

    p.x += cos(angle) * p.speed
    p.y += sin(angle) * p.speed
    p.life--

    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      Object.assign(p, mkFlow())
    }

    const a = map(p.life, 0, 80, 0, 1) * p.bright
    fill(80, 50, 160, a * 30)
    ellipse(p.x, p.y, 2)
  }
}

function drawParticles() {
  const t = frameCount * 0.007
  blendMode(ADD)
  noStroke()

  for (const pt of pts) {
    const n1 = noise(pt.x * 0.004, pt.y * 0.004, t)
    const n2 = noise(pt.x * 0.004 + 500, pt.y * 0.004 + 200, t)
    let px = pt.x + (n1 - 0.5) * 10
    let py = pt.y + (n2 - 0.5) * 10

    // Mouse pushes text particles away
    const dx = pt.x - mouseX
    const dy = pt.y - mouseY
    const d  = sqrt(dx * dx + dy * dy)
    if (d < 130 && d > 1) {
      const push = (1 - d / 130) * 35
      px += (dx / d) * push
      py += (dy / d) * push
    }

    const sz = map(n1, 0, 1, 1, 2.5)

    // Glow layer — #c8ff3e (200, 255, 62)
    fill(200, 255, 62, 16)
    ellipse(px, py, sz * 6)
    fill(200, 255, 62, 55)
    ellipse(px, py, sz * 2)
    // Bright core
    fill(230, 255, 180, 210)
    ellipse(px, py, sz)
  }

  blendMode(BLEND)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  sampleText()
}
