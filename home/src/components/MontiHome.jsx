import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

const ACCENT = '#c8ff3e'

const PROJECTS = [
  {
    id: 'fluid-type',
    title: 'Fluid Type',
    cat: { es: 'Tipografía', en: 'Typography' },
    desc: { es: 'Texto paramétrico que responde al movimiento en tiempo real.', en: 'Parametric text that responds to movement in real time.' },
    url: '../tipografia/',
    color: '#c8ff3e',
    bg: 'radial-gradient(ellipse at 30% 60%, rgba(200,255,62,.18) 0%, transparent 70%), #111',
  },
  {
    id: 'gravity',
    title: 'Gravity',
    cat: { es: 'Tipografía', en: 'Typography' },
    desc: { es: 'Física de partículas aplicada a la tipografía interactiva.', en: 'Particle physics applied to interactive typography.' },
    url: '../tipografia2/dist/',
    color: '#ff8c42',
    bg: 'radial-gradient(ellipse at 70% 40%, rgba(255,140,66,.18) 0%, transparent 70%), #111',
  },
  {
    id: 'search',
    title: 'Search Sequence',
    cat: { es: 'UI / UX', en: 'UI / UX' },
    desc: { es: 'Secuencia animada de búsqueda e interacción con resultados.', en: 'Animated search sequence and results interaction.' },
    url: '../uxsim/dist/',
    color: '#4bf0c8',
    bg: 'radial-gradient(ellipse at 50% 70%, rgba(75,240,200,.15) 0%, transparent 70%), #111',
  },
  {
    id: 'iphone',
    title: 'iPhone Home',
    cat: { es: 'UI / UX', en: 'UI / UX' },
    desc: { es: 'Simulador interactivo de iOS con Dynamic Island y apps.', en: 'Interactive iOS simulator with Dynamic Island and apps.' },
    url: '../iphone/dist/',
    color: '#bf5af2',
    bg: 'radial-gradient(ellipse at 60% 30%, rgba(191,90,242,.18) 0%, transparent 70%), #111',
  },
]

const COPY = {
  es: {
    eyebrow: 'Interfaces · Animaciones · Código',
    h1: ['Más allá', 'de tu', 'imaginación.'],
    cta: 'Ver proyectos',
    projectsLabel: 'Proyectos',
    about: 'Somos Montilabs. Creamos interfaces dinámicas y animaciones interactivas fusionando código y las herramientas no-code. Rompemos la barrera entre el diseño y el desarrollo para dar vida a productos digitales únicos.',
    contact: 'Hablemos',
    open: 'Abrir →',
    footer: '© 2025 montilabs',
  },
  en: {
    eyebrow: 'Interfaces · Animations · Code',
    h1: ['Beyond', 'your', 'imagination.'],
    cta: 'View projects',
    projectsLabel: 'Projects',
    about: 'We are Montilabs. We create dynamic interfaces and interactive animations by fusing code with no-code tools. We break the barrier between design and development to bring unique digital products to life.',
    contact: "Let's talk",
    open: 'Open →',
    footer: '© 2025 montilabs',
  },
}

// ── Viewport width hook ───────────────────────────────────────────────
function useWide(breakpoint = 768) {
  const [wide, setWide] = useState(() => window.innerWidth >= breakpoint)
  useEffect(() => {
    const check = () => setWide(window.innerWidth >= breakpoint)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return wide
}

// ── Custom Cursor ────────────────────────────────────────────────────
function Cursor({ hovering }) {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const rx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.6 })
  const ry = useSpring(my, { stiffness: 140, damping: 18, mass: 0.6 })

  useEffect(() => {
    const move = e => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  return (
    <>
      <motion.div
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%', position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, borderRadius: '50%' }}
        animate={{ width: 6, height: 6, background: hovering ? ACCENT : '#f0f0f0' }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998, borderRadius: '50%', border: '1px solid' }}
        animate={{ width: hovering ? 44 : 28, height: hovering ? 44 : 28, borderColor: hovering ? ACCENT : 'rgba(240,240,240,0.35)' }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}

// ── Hero tiles (right side) ──────────────────────────────────────────
function HeroTiles({ lang }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: 290 }}>
      {PROJECTS.map((p, i) => (
        <motion.a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, borderColor: p.color + '55' }}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 14, borderRadius: 18, height: 130,
            background: p.bg,
            border: '1px solid rgba(255,255,255,0.07)',
            textDecoration: 'none',
            cursor: 'none',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)', display: 'block', marginBottom: 4 }}>
            {p.cat[lang]}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
            {p.title}
          </span>
          <motion.div
            style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, position: 'absolute', top: 12, right: 12 }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
          />
        </motion.a>
      ))}
    </div>
  )
}

// ── Project Card ─────────────────────────────────────────────────────
function ProjectCard({ project, lang, index, onHover }) {
  const t = COPY[lang]
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 28, borderRadius: 18, minHeight: 220,
        background: project.bg,
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none', cursor: 'none', position: 'relative', overflow: 'hidden',
      }}
    >
      <span style={{
        display: 'inline-block', fontSize: 11, fontWeight: 500, letterSpacing: '0.15em',
        textTransform: 'uppercase', padding: '4px 10px', borderRadius: 99,
        background: project.color + '18', color: project.color,
        alignSelf: 'flex-start',
      }}>
        {project.cat[lang]}
      </span>

      <div>
        <p style={{ fontSize: 20, fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>
          {project.title}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(240,240,240,0.45)' }}>
          {project.desc[lang]}
        </p>
      </div>

      <motion.span
        style={{ position: 'absolute', bottom: 28, right: 28, fontSize: 13, fontWeight: 500, color: project.color }}
        initial={{ opacity: 0, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        {t.open}
      </motion.span>
    </motion.a>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function MontiHome() {
  const [lang, setLang] = useState(() => localStorage.getItem('ml_lang') || 'es')
  const [hovering, setHovering] = useState(false)
  const projectsRef = useRef(null)
  const wide = useWide(820)
  const t = COPY[lang]

  const scrollToProjects = () => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b' }}>
      <Cursor hovering={hovering} />

      {/* ── Header ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(11,11,11,0.85)',
      }}>
        <motion.a
          href="#"
          style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: '#f0f0f0', textDecoration: 'none', cursor: 'none' }}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
        >
          montilabs
        </motion.a>

        <button
          onClick={() => setLang(l => { const n = l === 'es' ? 'en' : 'es'; localStorage.setItem('ml_lang', n); return n })}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            display: 'flex', alignItems: 'center', padding: '6px 14px', borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
            color: 'rgba(240,240,240,0.5)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'none',
            fontFamily: 'inherit',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        alignItems: 'center',
        paddingTop: 88,
        paddingLeft: 64,
        paddingRight: 64,
        gap: wide ? 64 : 48,
      }}>

        {/* Left — text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.p
            style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 28 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.eyebrow}
          </motion.p>

          <h1 style={{ fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#f0f0f0', fontSize: 'clamp(48px, 6vw, 82px)', marginBottom: '2.5rem' }}>
            {t.h1.map((line, i) => (
              <motion.span
                key={line}
                style={{ display: 'block' }}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {i === 2
                  ? <>{line.replace('.', '')}<span style={{ color: ACCENT }}>.</span></>
                  : line
                }
              </motion.span>
            ))}
          </h1>

          <motion.button
            onClick={scrollToProjects}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '14px 28px', borderRadius: 99, border: 'none',
              background: ACCENT, color: '#0b0b0b', fontSize: 14, fontWeight: 600,
              alignSelf: 'flex-start', cursor: 'none', fontFamily: 'inherit',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.cta}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </motion.button>
        </div>

        {/* Right — tiles */}
        {wide && (
          <motion.div
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <HeroTiles lang={lang} />
          </motion.div>
        )}
      </section>

      {/* ── Projects ── */}
      <section ref={projectsRef} style={{ padding: '0 64px 96px' }}>
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)' }}>
            {t.projectsLabel}
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: 20 }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} lang={lang} index={i} onHover={setHovering} />
          ))}
        </div>
      </section>

      {/* ── About + Contact ── */}
      <section style={{ padding: '0 64px 80px' }}>
        <div style={{
          borderRadius: 20, padding: wide ? '56px 64px' : 32,
          display: 'flex', flexDirection: wide ? 'row' : 'column', gap: 48, alignItems: 'flex-start',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <motion.p
            style={{ flex: 1, fontSize: 18, lineHeight: 1.7, fontWeight: 300, color: 'rgba(240,240,240,0.6)', maxWidth: 540 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.about}
          </motion.p>

          <motion.a
            href="mailto:montibel@gmail.com"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 28px', borderRadius: 99,
              border: `1px solid ${ACCENT}`, color: ACCENT,
              fontSize: 14, fontWeight: 600, textDecoration: 'none', cursor: 'none',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ background: ACCENT + '12', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.contact} →
          </motion.a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px 64px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, color: 'rgba(240,240,240,0.2)' }}>{t.footer}</span>
        <span style={{ fontSize: 12, color: 'rgba(240,240,240,0.2)' }}>montilabs.studio</span>
      </footer>
    </div>
  )
}
