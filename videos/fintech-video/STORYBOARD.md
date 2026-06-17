# STORYBOARD — Tutorial Banca Digital

**Message:** Un tutorial bancario animado puede ser tan claro y atractivo que los usuarios lo disfruten.
**Arc:** Demonstration — 4 pasos del flujo bancario mostrados con el iPhone como protagonista absoluto.
**Audience:** Profesionales en LinkedIn buscando referentes de diseño UX y producción de video.
**Brand voice:** Premium, dark, confident — fintech de alto nivel.
**Format:** 1920×1080 landscape
**Duration:** ~21 segundos
**Narration:** Ninguna — música electrónica ambient + SFX
**Pacing:** Moderate — 5 beats, 3–5s cada uno, CSS crossfades entre steps, cinematic-zoom al cierre.
**Music direction:** Electronic ambient fintech. Synth pad oscuro con pulso rítmico sutil. Sin voz. Sube levemente en el beat 3 (peak visual). Resuelve en el beat 5.

---

## Required Capabilities Discovery

```
No shader transitions installed locally — using cinematic-zoom (installed as registry block)
Available VFX blocks: vfx-iphone-device (3D iPhone + MacBook), cinematic-zoom, flash-through-white
```

---

## Asset Audit

**Contact sheet: capture/assets/svgs/contact-sheet.jpg (1 página)**

5 assets más distintivos:
1. `logo-a17d1932.svg`: Ícono de casa/inicio — nav del app bancaria
2. `svg-306f3c55.svg`: Línea de actividad / heartbeat — ícono de movimientos
3. `svg-40c31a6d.svg`: Tarjeta de crédito — ícono de tarjetas
4. `svg-94cf791b.svg`: Ícono de usuario/perfil — nav del app
5. `svg-87f23269.svg`: Casa estilo moderno — variant de inicio

| Asset | Tipo | Beat | Rol |
|---|---|---|---|
| `logo-a17d1932.svg` | SVG nav | SKIP | Demasiado pequeño; los íconos de nav se componen inline en el screen HTML |
| `svg-306f3c55.svg` | SVG icono | SKIP | Se compone en la pantalla del dashboard como elemento UI nativo |
| `svg-40c31a6d.svg` | SVG icono | SKIP | Se compone en el screen HTML de tarjetas |
| `svg-94cf791b.svg` | SVG icono | SKIP | Parte del nav bar compuesto |
| `svg-87f23269.svg` | SVG icono | SKIP | Usado en nav, se compone inline |

> Todos los SVGs son íconos de UI del app — el contenido del screen se compone como HTML nativo dentro del modelo 3D del iPhone. Los activos capturados son iconos funcionales del sistema de diseño, no piezas de arte independientes. El vfx-iphone-device los renderizará como parte del UI en cada beat.

---

## Global Direction

**Format:** 1920×1080
**Audio:** Música electrónica ambient (sin TTS) + SFX de sfx/
**Narration start:** N/A — sin narración
**Style:** Dark fintech premium. El iPhone 3D domina cada frame. Las captions se proyectan sobre el fondo oscuro debajo del teléfono, nunca sobre la pantalla. Teal `#06B6D4` como único acento.

---

## BEAT 1 — HOOK: PHONE ENTRADA (0:00–2.5s)

**Concept:** El teléfono no existe, y de repente existe. Sin transición suave — APARECE en total oscuridad con una explosión teal. El primer frame tiene que retener al scrolleador.

**Shot type:** Wide → Medium (el iPhone crece hasta llenar el centro)

**Camera move:** Scale PUNCH: iPhone arranca en scale 0.5, opacidad 0 → en 0.4s llega a scale 1.05 (overshoot back.out(1.7)) → se asienta en scale 1.0 a los 0.6s. Después dolly-in sutil: scale 1.0→1.03 durante 2s restantes.

**Depth strategy:**
- Background: `#08090F` con radial glow teal (400px, rgba(6,182,212,0.18)) que irradia desde el centro en el momento del impacto, luego se asienta a 0.10 opacity
- Midground: iPhone 3D modelo (`vfx-iphone-device`) — pantalla muestra el splash del app: logo "FinDemo" + "Banca Digital" centrado en deep navy
- Foreground: ninguno — el iPhone llena el centro

**Composed:**
Usa `vfx-iphone-device` sub-composition como bloque. El phone-html muestra:
- Fondo: `#0f172a`
- Logo gradient circle (azul-cyan) centrado, 60px
- "FinDemo" Inter 700 18px white
- "Banca Digital" Inter 400 12px `#94a3b8`
- Shimmer sutil de luz descendente

GSAP: `gsap.from('#iphone-group', {scale:0.5, opacity:0, duration:0.45, ease:'back.out(1.7)'})`
Glow teal: `gsap.fromTo('#bg-glow', {opacity:0,scale:0.3}, {opacity:0.18, scale:1, duration:0.5, ease:'power2.out'})`
Dolly: `gsap.to('#scene', {scale:1.03, duration:2.0, ease:'power1.inOut', delay:0.6})`

**Text Animations:**
- Ninguno en este beat — el iPhone es el sujeto total

**SFX:**
- `impact-bass-1.mp3` at `0.0s`, volume `0.5` — en el momento que el iPhone aparece (J-cut decay normal)

**Beat Timing:** Transition in at: 0s · GSAP duration: 2.5s

---

## BEAT 2 — PASO 1: LOGIN (2.5s–7.0s)

**Concept:** El flujo empieza. El teléfono ya está presente; ahora muestra qué hace. La pantalla revela el login con PIN. El caption SUBE desde abajo como si emergiera del piso.

**Shot type:** Medium — iPhone ocupa 48% del frame height, centrado

**Camera move:** Dolly-out suave: el iPhone en scale 1.03 → 0.98 durante 4.5s (el zoom out "respira" con el paso del tiempo). Parallax: fondo glow se mueve ligeramente en dirección opuesta (x: +5px drift).

**Depth strategy:**
- Background: `#08090F`, glow teal centrado (opacity 0.10)
- Midground: iPhone — pantalla muestra PIN login: "Ingresa tu PIN", 4 dots, fingerprint
- Foreground: Caption overlay abajo del iPhone (y: 60px debajo del borde inferior)

**Composed:**
Phone HTML (phone-html dentro de vfx-iphone-device):
- Header: "9:41" status bar
- App logo + "Banca Digital"
- "Ingresa tu PIN" Inter 700 16px white
- 4 PIN dots (3 filled, 1 pulsando — CSS animation: scale 1→1.3→1 0.6s loop)
- Fingerprint icon en `#06B6D4` abajo, opacity pulsando

Caption overlay (sobre el canvas, fuera del iframe):
- Chip: "PASO 1 DE 4" → Inter 700 11px `#06B6D4` uppercase, bg `rgba(6,182,212,0.12)`, border teal, border-radius 20px, padding 6px 14px
- Título: "Inicio de sesión seguro" → Inter 800 42px `#FFFFFF`, letter-spacing -0.025em
- Body: "PIN de 4 dígitos o huella dactilar" → Inter 400 17px `#94A3B8`
- Progress dots: 4 dots — dot 1 activo en `#06B6D4`

GSAP caption entrance: `gsap.from('.caption-block', {y:50, opacity:0, duration:0.6, ease:'power3.out', delay:0.3})`

**Text Animations:**
- Caption chip: fade up desde y:20, opacity 0→1, 0.4s power2.out
- Título: rise desde y:30, opacity 0→1, 0.5s power3.out, delay 0.1s
- Body: fade desde y:15, opacity 0→1, 0.4s power2.out, delay 0.2s

**SFX:**
- `click-soft.mp3` at `2.5s`, volume `0.3` — transición a esta pantalla
- `click.mp3` at `4.5s`, volume `0.2` — simula el tap del PIN

**Beat Timing:** Transition in at: 2.5s · GSAP duration: 4.5s

---

## BEAT 3 — PASO 2: DASHBOARD (7.0s–12.0s)

**Concept:** El saldo aparece. Este es el beat PEAK — la pantalla más visualmente rica del flujo. El iPhone se mantiene estable y la información del dashboard cobra vida con un counter.

**Shot type:** Medium close-up — iPhone llena el 52% del frame height

**Camera move:** Dolly in: scale 0.98→1.04 durante 5s (el teléfono "se acerca" sutilmente mientras el usuario "se engancha" con el saldo). Breathe: oscilación de y: 0→-4px→0 en 3s sine.inOut.

**Depth strategy:**
- Background: `#08090F`, glow teal ligeramente más brillante (opacity 0.13), una segunda capa de glow azul-deep (opacity 0.06) para profundidad
- Midground: iPhone — dashboard screen con balance
- Foreground: Caption abajo + chip teal

**Composed:**
Phone HTML:
- "Bienvenida 👋 María González" Inter 600 13px
- Card de saldo: bg `#1e293b`, border-radius 12px — "SALDO DISPONIBLE" label + "$1.234.567" Inter 800 28px white (counter animation: cuenta de 0 a 1.234.567 en 1.2s, ease power1.out)
- Quick actions: Transferir, Pagar, Recargar, Más (4 ícono-buttons en fila)
- 2 últimas transacciones deslizándose desde abajo: Supermercado -$32.500 (rojo), Transferencia +$150.000 (verde)
- Nav bar en la base

Caption overlay:
- Chip: "PASO 2 DE 4"
- Título: "Revisa tu saldo" Inter 800 42px white
- Body: "Movimientos y saldo disponible desde el inicio" Inter 400 17px `#94A3B8`
- Progress dot 2 activo

**Text Animations:**
- Counter de saldo: `CountUp` via `tl.set()` con 60 frames, ease power1.out
- Transacciones: stagger slide-up desde y:20, delay 1.5s, intervalo 0.15s
- Caption: rise entrance idéntico al beat 2

**SFX:**
- `chime.mp3` at `7.0s`, volume `0.4` — transición / nueva pantalla revelada
- `sparkle.mp3` at `8.5s`, volume `0.25` — cuando el counter llega al número final

**Beat Timing:** Transition in at: 7.0s · GSAP duration: 5.0s

---

## BEAT 4 — PASOS 3–4: TRANSFERENCIA + ÉXITO (12.0s–17.0s)

**Concept:** El payoff del tutorial — el flujo termina con éxito. El teléfono muestra "¡Transferencia exitosa!" con el check verde. El caption cambia al resultado.

**Shot type:** Medium — iPhone en 48% frame height

**Camera move:** Dolly-out de impacto: en el momento del éxito (t=3.5s dentro del beat), scale hace un MICRO-PUNCH: 1.0→1.06 en 0.15s (power3.out) y vuelve a 1.0 en 0.4s (power2.inOut). Efecto: el teléfono "reacciona" al éxito.

**Depth strategy:**
- Background: `#08090F`, en el momento del éxito un flash muy sutil de `rgba(16,185,129,0.06)` sobre el fondo (0.3s, fade out)
- Midground: iPhone — pantalla de éxito
- Foreground: Caption con texto de éxito

**Composed:**
Phone HTML (evoluciona en 2 sub-fases):
- Fase 1 (0-2.5s): Pantalla de nueva transferencia con "Juan Rodríguez" ya ingresado, monto "$50.000", botón "Transferir" teal
- Fase 2 (2.5s-5s): `#0f172a` fondo → aparece check circle verde grande → "¡Transferencia exitosa!" Inter 800 20px white → "Enviado a Juan Rodríguez" → "$50.000" en verde
- Check circle: scale 0→1.2→1.0, back.out(2.0), 0.4s

Caption overlay:
- Chip: "PASO 4 DE 4"
- Título: "Transferencia en segundos" Inter 800 42px white
- En el momento del éxito (t=3.5s): título cambia a "¡Listo!" con color teal `#06B6D4`
- Progress dots: 4 activos (llenos)

**Text Animations:**
- Caption título: cuando cambia a "¡Listo!", hace: opacity 0.7→1, scale 0.95→1, 0.3s power2.out
- Check circle en pantalla: back.out(2.0) bounce

**SFX:**
- `whoosh-short.mp3` at `12.0s`, volume `0.3` — transición a este beat
- `notification.mp3` at `15.3s`, volume `0.5` — en el éxito de transferencia (peak del video)

**Beat Timing:** Transition in at: 12.0s · GSAP duration: 5.0s

---

## BEAT 5 — CIERRE (17.0s–21.0s)

**Concept:** El teléfono se aleja. El campo visual se amplía. Aparece la firma del estudio. El último frame debe quedar como imagen mental — iPhone flotando en oscuridad, marca debajo.

**Shot type:** Wide — iPhone reducido al 38% frame height, más espacio alrededor

**Camera move:** Dolly out dramático: el iPhone escala 1.0→0.82 en 1.2s (power2.inOut), descende ligeramente y: 0→+20px. Luego respiración suave: y oscillation ±6px, 2s, sine.inOut.

**Shader transition:** `cinematic-zoom` INTO beat 5 (del beat 4 a este)

**Depth strategy:**
- Background: `#08090F`, glow teal centrado pero más grande y tenue (opacity 0.08)
- Midground: iPhone en pantalla de éxito (estático, frozen en el último frame del éxito)
- Foreground: Branding Montilabs centrado debajo del iPhone

**Composed:**
- iPhone: muestra la pantalla de éxito (frozen) — no anima más
- Branding block (centrado bajo el iPhone, aparece fade-up desde y:30):
  - "Tutorial animado · App bancaria" Inter 400 16px `#94A3B8`, letter-spacing 0.08em uppercase
  - Separador: línea `#06B6D4` de 40px, 1px height, centrada, fade in delay 0.4s
  - "montilabs" Inter 700 28px `#FFFFFF`

**Text Animations:**
- Label: fade up desde y:20, opacity 0→1, 0.5s power2.out
- Línea: scaleX 0→1 desde center, 0.4s power3.out, delay 0.3s
- "montilabs": scale 0.9→1.0, opacity 0→1, 0.5s back.out(1.3), delay 0.5s

**SFX:**
- `ping.mp3` at `17.8s`, volume `0.35` — cuando aparece la firma Montilabs

**Beat Timing:** Transition in at: 17.0s (cinematic-zoom, 0.8s) · GSAP duration: 4.0s

---

## Rhythm Global

`PUNCH → moderate → PEAK → payoff → WIDE RESOLVE`
`impact-bass → crossfade → crossfade → crossfade → cinematic-zoom`

---

## Production Architecture

```
videos/fintech-video/
├── index.html                  root — beat orchestration + música
├── DESIGN.md
├── STORYBOARD.md               (este archivo)
├── capture/
│   ├── assets/fonts/           Inter 400,600,700,800
│   └── assets/svgs/            íconos UI (usados inline en phone HTML)
├── compositions/
│   ├── beat-1-hook.html        iPhone entrada + glow explosion
│   ├── beat-2-login.html       PIN screen + caption
│   ├── beat-3-dashboard.html   Dashboard screen + counter + caption
│   ├── beat-4-transfer.html    Transfer → success + caption
│   ├── beat-5-close.html       Wide iPhone + Montilabs branding
│   ├── vfx-iphone-device.html  (registry block base)
│   └── cinematic-zoom.html     (shader transition)
├── models/
│   ├── iphone.glb
│   └── macbook.glb
└── sfx/
    ├── impact-bass-1.mp3
    ├── click-soft.mp3
    ├── click.mp3
    ├── chime.mp3
    ├── sparkle.mp3
    ├── notification.mp3
    ├── whoosh-short.mp3
    └── ping.mp3
```
