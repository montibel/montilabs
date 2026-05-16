import { useState, useEffect, useRef } from 'react'
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion'

const ACCENT = '#c8ff3e'
const TEAL   = '#4bf0c8'
const BG     = '#0b0b0b'

const CONTENT = {
  es: {
    query: 'tendencias creativas 2025',
    searchBtn: 'Buscar',
    resultsLabel: 'Resultados para:',
    replay: '↺ Repetir',
    results: [
      { title: 'El regreso del diseño expresivo en marcas globales', url: 'itsnicethat.com',      desc: 'Las identidades visuales más potentes del año abandonan la sobriedad y apuestan por el carácter.' },
      { title: 'Motion design como lenguaje de marca',              url: 'awwwards.com',          desc: 'Cómo las animaciones definen la personalidad de una marca mejor que cualquier manual de imagen.' },
      { title: 'Campañas que rompieron el ruido en 2025',          url: 'adweek.com',            desc: 'Un análisis de las piezas que lograron atención real en un ecosistema saturado de contenido.' },
      { title: 'Creatividad generativa: IA al servicio del arte',  url: 'creativereview.co.uk',  desc: 'Herramientas, casos reales y el debate sobre dónde termina la máquina y empieza el diseñador.' },
    ],
  },
  en: {
    query: 'creative trends 2025',
    searchBtn: 'Search',
    resultsLabel: 'Results for:',
    replay: '↺ Replay',
    results: [
      { title: 'The return of expressive design in global brands',  url: 'itsnicethat.com',      desc: 'The most powerful visual identities of the year abandon restraint and embrace character.' },
      { title: 'Motion design as brand language',                   url: 'awwwards.com',          desc: 'How animations define a brand\'s personality better than any style guide ever could.' },
      { title: 'Campaigns that broke through the noise in 2025',   url: 'adweek.com',            desc: 'An analysis of the pieces that achieved real attention in a content-saturated ecosystem.' },
      { title: 'Generative creativity: AI in service of art',      url: 'creativereview.co.uk',  desc: 'Tools, real cases and the debate over where the machine ends and the designer begins.' },
    ],
  },
}

const wait = ms => new Promise(r => setTimeout(r, ms))

const S = {
  root: {
    width: '100vw', height: '100vh', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: BG,
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  searchWrap: {
    position: 'absolute',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
    width: '100%', maxWidth: 580, padding: '0 28px',
  },
  brand: {
    fontSize: 11, fontWeight: 500, letterSpacing: '0.28em',
    textTransform: 'uppercase', color: ACCENT,
  },
  bar: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 99, padding: '15px 22px',
  },
  barText: {
    fontSize: 18, color: '#f0f0f0', flex: 1, minHeight: 28,
    letterSpacing: '-0.01em',
  },
  searchBtn: {
    padding: '12px 32px', borderRadius: 99,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: 'rgba(240,240,240,0.55)', fontSize: 14, fontWeight: 500,
    cursor: 'default', fontFamily: 'inherit',
  },
  resultsWrap: {
    position: 'absolute',
    width: '100%', maxWidth: 580, padding: '0 28px',
    display: 'flex', flexDirection: 'column',
  },
  resultsLabel: { fontSize: 12, color: 'rgba(240,240,240,0.28)', marginBottom: 28 },
  resultItem:   { display: 'flex', flexDirection: 'column', gap: 5, padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  resultUrl:    { fontSize: 11, color: TEAL, letterSpacing: '0.04em' },
  resultTitle:  { fontSize: 17, color: '#f0f0f0', lineHeight: 1.4, fontWeight: 500 },
  resultDesc:   { fontSize: 13, color: 'rgba(240,240,240,0.38)', lineHeight: 1.6 },
  replayBtn: {
    marginTop: 28, alignSelf: 'flex-start',
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 99, color: 'rgba(240,240,240,0.5)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  },
  langBtn: {
    position: 'fixed', top: 20, right: 20, zIndex: 100,
    display: 'flex', alignItems: 'center',
    padding: '6px 14px', borderRadius: 99,
    border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
    color: 'rgba(240,240,240,0.5)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    cursor: 'pointer', fontFamily: 'inherit',
  },
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,240,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CursorIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="#111" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M4 2l16 9.5-7.5 1.5L9 21z" />
    </svg>
  )
}

export default function SearchSequence() {
  const [lang, setLang]           = useState(() => localStorage.getItem('ml_lang') || 'es')
  const [typed, setTyped]         = useState('')
  const [phase, setPhase]         = useState('idle')
  const [iteration, setIteration] = useState(0)

  const cursorCtrl  = useAnimationControls()
  const btnCtrl     = useAnimationControls()
  const searchCtrl  = useAnimationControls()
  const resultsCtrl = useAnimationControls()
  const btnRef      = useRef(null)

  const t = CONTENT[lang]

  const replay = () => {
    setTyped('')
    setPhase('idle')
    cursorCtrl.set({ x: 0, y: 0 })
    btnCtrl.set({ scale: 1 })
    searchCtrl.set({ opacity: 1, y: 0, pointerEvents: 'auto' })
    resultsCtrl.set({ opacity: 0, y: 30 })
    setIteration(i => i + 1)
  }

  const switchLang = () => {
    setLang(l => { const n = l === 'es' ? 'en' : 'es'; localStorage.setItem('ml_lang', n); return n })
    setTyped('')
    setPhase('idle')
    cursorCtrl.set({ x: 0, y: 0 })
    btnCtrl.set({ scale: 1 })
    searchCtrl.set({ opacity: 1, y: 0, pointerEvents: 'auto' })
    resultsCtrl.set({ opacity: 0, y: 30 })
    setIteration(i => i + 1)
  }

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      await wait(800)
      if (cancelled) return

      setPhase('typing')
      for (let i = 1; i <= t.query.length; i++) {
        if (cancelled) return
        await wait(52)
        setTyped(t.query.slice(0, i))
      }

      await wait(750)
      if (cancelled) return

      setPhase('moving')
      if (btnRef.current) {
        const rect    = btnRef.current.getBoundingClientRect()
        const targetX = rect.left + rect.width / 2 - (window.innerWidth  - 20)
        const targetY = rect.top  + rect.height / 2 - (window.innerHeight - 20)
        await cursorCtrl.start({
          x: targetX, y: targetY,
          transition: { type: 'spring', stiffness: 65, damping: 14, mass: 1 },
        })
      }

      if (cancelled) return
      await wait(120)

      setPhase('clicking')
      await btnCtrl.start({ scale: 0.88, transition: { duration: 0.08 } })
      await btnCtrl.start({ scale: 1,    transition: { duration: 0.12 } })

      await wait(250)
      if (cancelled) return

      setPhase('revealing')
      await searchCtrl.start({ opacity: 0, y: -50, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } })
      await resultsCtrl.start({ opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } })

      setPhase('done')
      await wait(3500)
      if (!cancelled) replay()
    }

    run()
    return () => { cancelled = true }
  }, [iteration, lang])

  return (
    <div style={S.root}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(200,255,62,.04) 0%, transparent 65%)' }} />

      {/* Lang toggle */}
      <button onClick={switchLang} style={S.langBtn}>
        <AnimatePresence mode="wait">
          <motion.span
            key={lang}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* ── Search phase ── */}
      <motion.div animate={searchCtrl} style={S.searchWrap}>
        <p style={S.brand}>montilabs</p>

        <div style={S.bar}>
          <SearchIcon />
          <span style={S.barText}>
            {typed}
            {phase === 'typing' && (
              <motion.span
                style={{ display: 'inline-block', width: 2, height: 20, background: ACCENT, marginLeft: 2, verticalAlign: 'middle', borderRadius: 1 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.85 }}
              />
            )}
          </span>
        </div>

        <motion.button ref={btnRef} animate={btnCtrl} style={S.searchBtn}>
          {t.searchBtn}
        </motion.button>
      </motion.div>

      {/* ── Results phase ── */}
      <motion.div animate={resultsCtrl} initial={{ opacity: 0, y: 30 }} style={S.resultsWrap}>
        <p style={S.resultsLabel}>
          {t.resultsLabel}{' '}
          <span style={{ color: 'rgba(240,240,240,0.5)', fontStyle: 'italic' }}>"{t.query}"</span>
        </p>

        {t.results.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={S.resultItem}
          >
            <span style={S.resultUrl}>{r.url}</span>
            <span style={S.resultTitle}>{r.title}</span>
            <span style={S.resultDesc}>{r.desc}</span>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          onClick={replay} style={S.replayBtn}
        >
          {t.replay}
        </motion.button>
      </motion.div>

      {/* ── Cursor ── */}
      <motion.div
        animate={cursorCtrl}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50, pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
      >
        <CursorIcon />
      </motion.div>
    </div>
  )
}
