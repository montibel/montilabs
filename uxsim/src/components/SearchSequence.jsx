import { useState, useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { MousePointer2, Search } from 'lucide-react'

const TEXT = 'Cómo animar interfaces con código'

const RESULTS = [
  { title: 'Framer Motion – Guía completa de animaciones', url: 'framer.com/motion' },
  { title: 'CSS vs JavaScript: ¿cuándo usar cada uno?',    url: 'css-tricks.com' },
  { title: 'Principios de UX en motion design',            url: 'nngroup.com' },
  { title: 'React Spring: física en interfaces',           url: 'react-spring.dev' },
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export default function SearchSequence() {
  const [typed, setTyped]       = useState('')
  const [phase, setPhase]       = useState('idle')
  const [iteration, setIteration] = useState(0)

  const cursorCtrl  = useAnimationControls()
  const btnCtrl     = useAnimationControls()
  const searchCtrl  = useAnimationControls()
  const resultsCtrl = useAnimationControls()

  const btnRef = useRef(null)

  const replay = () => {
    setTyped('')
    setPhase('idle')
    cursorCtrl.set({ x: 0, y: 0 })
    btnCtrl.set({ scale: 1 })
    searchCtrl.set({ opacity: 1, y: 0 })
    resultsCtrl.set({ opacity: 0, y: 30 })
    setIteration((i) => i + 1)
  }

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      await wait(500)
      if (cancelled) return

      // 1 — typewriter
      setPhase('typing')
      for (let i = 1; i <= TEXT.length; i++) {
        if (cancelled) return
        await wait(52)
        setTyped(TEXT.slice(0, i))
      }

      await wait(700)
      if (cancelled) return

      // 2 — cursor moves to button
      setPhase('moving')
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        const targetX = rect.left + rect.width / 2 - (window.innerWidth - 20)
        const targetY = rect.top + rect.height / 2 - (window.innerHeight - 20)
        await cursorCtrl.start({
          x: targetX,
          y: targetY,
          transition: { type: 'spring', stiffness: 65, damping: 14, mass: 1 },
        })
      }

      if (cancelled) return
      await wait(120)

      // 3 — click simulation
      setPhase('clicking')
      await btnCtrl.start({ scale: 0.88, transition: { duration: 0.08 } })
      await btnCtrl.start({ scale: 1,    transition: { duration: 0.12 } })

      await wait(200)
      if (cancelled) return

      // 4 — search collapses
      setPhase('revealing')
      await searchCtrl.start({
        opacity: 0,
        y: -50,
        transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
      })

      // 5 — results appear
      await resultsCtrl.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
      })

      setPhase('done')
    }

    run()
    return () => { cancelled = true }
  }, [iteration])

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden flex items-center justify-center">

      {/* Search section */}
      <motion.div
        animate={searchCtrl}
        className="absolute flex flex-col items-center gap-8 w-full max-w-2xl px-6"
      >
        <p className="text-2xl font-extralight tracking-[0.3em] text-gray-400 uppercase select-none">
          montilabs
        </p>

        <div className="w-full flex items-center gap-3 border border-gray-300 rounded-full px-6 py-4 shadow-sm">
          <Search className="text-gray-400 w-5 h-5 shrink-0" />
          <span className="text-xl text-gray-800 flex-1 min-h-7 text-left">
            {typed}
            {phase === 'typing' && (
              <motion.span
                className="inline-block w-px h-5 bg-gray-700 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              />
            )}
          </span>
        </div>

        <motion.button
          ref={btnRef}
          animate={btnCtrl}
          className="px-10 py-3 bg-gray-100 text-gray-600 rounded-full text-base select-none cursor-default"
        >
          Buscar
        </motion.button>
      </motion.div>

      {/* Results */}
      <motion.div
        animate={resultsCtrl}
        initial={{ opacity: 0, y: 30 }}
        className="absolute w-full max-w-2xl px-6 flex flex-col"
      >
        <p className="text-sm text-gray-400 mb-5">
          Resultados para:{' '}
          <span className="italic text-gray-500">"{TEXT}"</span>
        </p>

        {RESULTS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.1 }}
            className="flex flex-col gap-0.5 py-3 border-b border-gray-100 last:border-0"
          >
            <span className="text-[13px] text-green-700">{r.url}</span>
            <span className="text-blue-600 text-lg leading-snug hover:underline cursor-pointer">
              {r.title}
            </span>
            <span className="text-gray-400 text-sm">
              Una guía práctica con ejemplos reales de implementación y animaciones fluidas...
            </span>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={replay}
          className="mt-6 self-start flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
        >
          ↺ Repetir
        </motion.button>
      </motion.div>

      {/* Cursor */}
      <motion.div
        animate={cursorCtrl}
        className="fixed bottom-5 right-5 z-50 pointer-events-none"
      >
        <MousePointer2
          className="w-9 h-9 drop-shadow"
          style={{ color: '#111827', fill: 'white', strokeWidth: 1.5 }}
        />
      </motion.div>
    </div>
  )
}
