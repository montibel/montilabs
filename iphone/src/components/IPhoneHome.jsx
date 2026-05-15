import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Camera, Globe, Play, Pause, SkipForward } from 'lucide-react'

const SONG = { title: 'Blinding Lights', artist: 'The Weeknd' }

const ICONS = [
  { id: 'phone',    label: 'Teléfono', Icon: Phone,          bg: 'linear-gradient(145deg,#30d158,#25a244)' },
  { id: 'messages', label: 'Mensajes', Icon: MessageCircle,  bg: 'linear-gradient(145deg,#30d158,#0ab87e)' },
  { id: 'camera',  label: 'Cámara',   Icon: Camera,          bg: 'linear-gradient(145deg,#48484a,#1c1c1e)' },
  { id: 'safari',  label: 'Safari',   Icon: Globe,           bg: 'linear-gradient(145deg,#0a84ff,#0064d1)' },
]

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// ── Dynamic Island ──────────────────────────────────────────────────
function DynamicIsland() {
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying]   = useState(true)
  const [progress, setProgress] = useState(0.3)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress(p => p >= 1 ? 0 : p + 0.0007), 50)
    return () => clearInterval(id)
  }, [playing])

  return (
    <motion.div
      layout
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{ borderRadius: 26, backgroundColor: '#000', overflow: 'hidden', cursor: 'default' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ width: 300 }}
            className="flex items-center gap-3 px-3 py-2.5"
          >
            {/* Spinning album art */}
            <motion.div
              animate={{ rotate: playing ? 360 : 0 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="shrink-0 rounded-xl"
              style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
            />

            {/* Track info + progress */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{SONG.title}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{SONG.artist}</p>
              <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: 2, background: '#333' }}>
                <motion.div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); setPlaying(p => !p) }}
                className="text-white"
              >
                {playing
                  ? <Pause  size={15} fill="white" strokeWidth={0} />
                  : <Play   size={15} fill="white" strokeWidth={0} />
                }
              </button>
              <button style={{ color: 'rgba(255,255,255,0.5)' }}>
                <SkipForward size={15} fill="currentColor" strokeWidth={0} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center justify-center gap-2 px-4"
            style={{ width: 126, height: 34 }}
          >
            <motion.div
              animate={{ opacity: playing ? [1, 0.3, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="rounded-full bg-green-400"
              style={{ width: 6, height: 6 }}
            />
            <div className="flex items-end gap-px" style={{ height: 14 }}>
              {[0.5, 1, 0.65, 1, 0.5].map((h, i) => (
                <motion.div
                  key={i}
                  animate={playing
                    ? { scaleY: [h, 1, h * 0.4, 0.9, h] }
                    : { scaleY: 0.2 }
                  }
                  transition={{ repeat: Infinity, duration: 0.7 + i * 0.08, delay: i * 0.07 }}
                  className="rounded-full bg-green-400 origin-bottom"
                  style={{ width: 2, height: 14 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── App icon ────────────────────────────────────────────────────────
function AppIcon({ label, Icon, bg }) {
  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 62, height: 62, background: bg, borderRadius: '27%' }}
      >
        <Icon size={30} color="white" strokeWidth={1.5} />
      </div>
      <span className="text-white text-[11px] font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        {label}
      </span>
    </motion.div>
  )
}

// ── Signal bars ─────────────────────────────────────────────────────
function SignalBars() {
  return (
    <div className="flex items-end gap-px" style={{ height: 12 }}>
      {[5, 8, 11, 14].map((h, i) => (
        <div key={i} className="rounded-sm bg-white" style={{ width: 3, height: h }} />
      ))}
    </div>
  )
}

// ── Battery ─────────────────────────────────────────────────────────
function Battery() {
  return (
    <div className="flex items-center gap-px">
      <div className="relative rounded-sm border border-white" style={{ width: 22, height: 11 }}>
        <div
          className="absolute rounded-sm bg-white"
          style={{ top: 2, left: 2, bottom: 2, right: 4, width: '72%' }}
        />
      </div>
      <div className="rounded-r-sm bg-white" style={{ width: 2, height: 5 }} />
    </div>
  )
}

// ── WiFi ────────────────────────────────────────────────────────────
function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 20 15" fill="white">
      <path d="M10 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      <path d="M5.5 8.3C7 6.9 8.4 6.2 10 6.2s3 .7 4.5 2.1l1.5-1.5C14 4.9 12.1 4 10 4S6 4.9 4 6.8l1.5 1.5z"/>
      <path d="M1.5 4.8C3.8 2.7 6.8 1.5 10 1.5s6.2 1.2 8.5 3.3L20 3.3C17.3 1.2 13.8 0 10 0S2.7 1.2 0 3.3l1.5 1.5z"/>
    </svg>
  )
}

// ── Main component ──────────────────────────────────────────────────
export default function IPhoneHome() {
  const now = useClock()

  const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#e5e5ea' }}>
      {/* iPhone shell */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          background: '#000',
          boxShadow: '0 0 0 10px #1c1c1e, 0 40px 100px rgba(0,0,0,0.45), 0 0 0 11px #3a3a3c',
        }}
      >
        {/* Wallpaper */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 25% 15%, rgba(167,85,247,0.35) 0%, transparent 55%),
              radial-gradient(ellipse at 75% 85%, rgba(59,130,246,0.3) 0%, transparent 55%),
              linear-gradient(160deg, #0a0015 0%, #1a0533 40%, #2d1b69 70%, #0f3460 100%)
            `,
          }}
        />

        {/* Status bar */}
        <div className="relative z-10 flex items-center justify-between px-7 pt-4">
          <span className="text-white text-sm font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {timeStr}
          </span>
          <DynamicIsland />
          <div className="flex items-center gap-1.5">
            <SignalBars />
            <Wifi />
            <Battery />
          </div>
        </div>

        {/* Clock */}
        <div className="relative z-10 flex flex-col items-center" style={{ marginTop: 56 }}>
          <span
            className="text-white font-thin tracking-tight select-none"
            style={{ fontSize: 88, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
          >
            {timeStr}
          </span>
          <span
            className="text-white capitalize mt-2 select-none"
            style={{ fontSize: 18, opacity: 0.85 }}
          >
            {dateStr}
          </span>
        </div>

        {/* Dock */}
        <div className="absolute z-10 inset-x-0" style={{ bottom: 52 }}>
          <div className="mx-5 rounded-3xl p-4" style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(24px)' }}>
            <div className="grid grid-cols-4 gap-3 justify-items-center">
              {ICONS.map(icon => <AppIcon key={icon.id} {...icon} />)}
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute z-10 inset-x-0 flex justify-center" style={{ bottom: 10 }}>
          <div className="rounded-full" style={{ width: 130, height: 4, background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </div>
    </div>
  )
}
