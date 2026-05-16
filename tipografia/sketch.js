let pts = []
const GRID = 28

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)
  sampleText()
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
  background(11, 11, 11)

  drawGrid()
  drawParticles()
}

function drawGrid() {
  const t = frameCount * 0.003
  noStroke()

  for (let x = GRID; x < width; x += GRID) {
    for (let y = GRID; y < height; y += GRID) {
      // Mouse influence: dots near cursor get brighter
      const dx = x - mouseX
      const dy = y - mouseY
      const d  = sqrt(dx * dx + dy * dy)
      const mouseBright = d < 160 ? (1 - d / 160) * 0.6 : 0

      const n = noise(x * 0.004, y * 0.004, t)
      const a = map(n, 0, 1, 20, 160) + mouseBright * 180
      const r = map(n, 0, 1, 1.5, 4)

      fill(200, 255, 62, a)
      ellipse(x, y, r)
    }
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

    fill(200, 255, 62, 16)
    ellipse(px, py, sz * 6)
    fill(200, 255, 62, 55)
    ellipse(px, py, sz * 2)
    fill(230, 255, 180, 210)
    ellipse(px, py, sz)
  }

  blendMode(BLEND)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  sampleText()
}
