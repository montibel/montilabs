import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, MessageCircle, Camera, Globe,
  Play, Pause, SkipForward, X, Lock, ChevronUp,
} from 'lucide-react'

// ── Constants ────────────────────────────────────────────────────────
const SONG = { title: 'Blinding Lights', artist: 'The Weeknd' }
const WALLPAPER = `
  radial-gradient(ellipse at 25% 15%, rgba(167,85,247,.35) 0%, transparent 55%),
  radial-gradient(ellipse at 75% 85%, rgba(59,130,246,.30) 0%, transparent 55%),
  linear-gradient(160deg, #0a0015 0%, #1a0533 40%, #2d1b69 70%, #0f3460 100%)`

const APPS = [
  { id: 'phone',    label: 'Teléfono', Icon: Phone,         bg: 'linear-gradient(145deg,#30d158,#25a244)' },
  { id: 'messages', label: 'Mensajes', Icon: MessageCircle, bg: 'linear-gradient(145deg,#30d158,#0ab87e)' },
  { id: 'camera',  label: 'Cámara',   Icon: Camera,         bg: 'linear-gradient(145deg,#48484a,#1c1c1e)' },
  { id: 'safari',  label: 'Safari',   Icon: Globe,          bg: 'linear-gradient(145deg,#0a84ff,#0064d1)' },
]

// ── Clock ────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// ── Status icons ─────────────────────────────────────────────────────
function SignalBars() {
  return (
    <div className="flex items-end gap-px" style={{ height: 12 }}>
      {[5, 8, 11, 14].map((h, i) => (
        <div key={i} className="rounded-sm bg-white" style={{ width: 3, height: h }} />
      ))}
    </div>
  )
}
function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 20 15" fill="white">
      <path d="M10 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      <path d="M5.5 8.3C7 6.9 8.4 6.2 10 6.2s3 .7 4.5 2.1l1.5-1.5C14 4.9 12.1 4 10 4S6 4.9 4 6.8l1.5 1.5z" />
      <path d="M1.5 4.8C3.8 2.7 6.8 1.5 10 1.5s6.2 1.2 8.5 3.3L20 3.3C17.3 1.2 13.8 0 10 0S2.7 1.2 0 3.3l1.5 1.5z" />
    </svg>
  )
}
function Battery() {
  return (
    <div className="flex items-center gap-px">
      <div className="relative rounded-sm border border-white" style={{ width: 22, height: 11 }}>
        <div className="absolute rounded-sm bg-white" style={{ top: 2, left: 2, bottom: 2, width: '72%' }} />
      </div>
      <div className="rounded-r-sm bg-white" style={{ width: 2, height: 5 }} />
    </div>
  )
}

// ── Dynamic Island ───────────────────────────────────────────────────
function DynamicIsland({ mode, onNotifDone }) {
  const [hovering, setHovering] = useState(false)
  const [playing, setPlaying]   = useState(true)
  const [progress, setProgress] = useState(0.3)

  useEffect(() => {
    if (mode !== 'notification') return
    const t = setTimeout(onNotifDone, 4000)
    return () => clearTimeout(t)
  }, [mode, onNotifDone])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress(p => (p >= 1 ? 0 : p + 0.0007)), 50)
    return () => clearInterval(id)
  }, [playing])

  const view = mode === 'notification' ? 'notif' : hovering ? 'music' : 'pill'

  return (
    <motion.div
      layout
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{ borderRadius: 26, backgroundColor: '#000', overflow: 'hidden', cursor: 'default' }}
    >
      <AnimatePresence mode="wait" initial={false}>

        {view === 'notif' && (
          <motion.div key="notif"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3 px-3 py-2.5" style={{ width: 300 }}
          >
            <div className="shrink-0 rounded-xl flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#30d158,#0ab87e)' }}>
              <MessageCircle size={20} color="white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-white text-[11px] font-semibold">Mensajes</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>ahora</p>
              </div>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
                El cliente aprobó los conceptos ✓
              </p>
            </div>
          </motion.div>
        )}

        {view === 'music' && (
          <motion.div key="music"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3 px-3 py-2.5" style={{ width: 300 }}
          >
            <motion.div
              animate={{ rotate: playing ? 360 : 0 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="shrink-0 rounded-xl"
              style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{SONG.title}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{SONG.artist}</p>
              <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: 2, background: '#333' }}>
                <motion.div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={e => { e.stopPropagation(); setPlaying(p => !p) }} className="text-white">
                {playing ? <Pause size={15} fill="white" strokeWidth={0} /> : <Play size={15} fill="white" strokeWidth={0} />}
              </button>
              <button style={{ color: 'rgba(255,255,255,0.5)' }}>
                <SkipForward size={15} fill="currentColor" strokeWidth={0} />
              </button>
            </div>
          </motion.div>
        )}

        {view === 'pill' && (
          <motion.div key="pill"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2 px-4"
            style={{ width: 126, height: 34 }}
          >
            <motion.div
              animate={{ opacity: playing ? [1, 0.3, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="rounded-full bg-green-400" style={{ width: 6, height: 6 }}
            />
            <div className="flex items-end gap-px" style={{ height: 14 }}>
              {[0.5, 1, 0.65, 1, 0.5].map((h, i) => (
                <motion.div key={i}
                  animate={playing ? { scaleY: [h, 1, h * 0.4, 0.9, h] } : { scaleY: 0.2 }}
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

// ── App: Phone ───────────────────────────────────────────────────────
function PhoneApp({ onClose }) {
  const [connected, setConnected] = useState(false)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: WALLPAPER }}>
      <div className="flex flex-col items-center flex-1 justify-center gap-5">
        <p className="text-white/60 text-sm">
          {connected ? 'En llamada · 0:07' : 'iPhone · Llamando...'}
        </p>
        <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
          {!connected && [1, 2, 3].map(i => (
            <motion.div key={i}
              className="absolute rounded-full border border-white/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1 + i * 0.35, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.45 }}
              style={{ width: 90, height: 90 }}
            />
          ))}
          <div className="rounded-full flex items-center justify-center text-white text-2xl font-light"
            style={{ width: 90, height: 90, background: 'linear-gradient(135deg,#5e5ce6,#bf5af2)', zIndex: 1 }}>
            MM
          </div>
        </div>
        <p className="text-white text-3xl font-light">montilabs</p>
      </div>

      <div className="flex justify-center gap-20 pb-20">
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose} className="flex flex-col items-center gap-2">
          <div className="rounded-full flex items-center justify-center" style={{ width: 68, height: 68, background: '#ff3b30' }}>
            <Phone size={28} color="white" style={{ transform: 'rotate(135deg)' }} />
          </div>
          <span className="text-white/60 text-xs">Rechazar</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setConnected(true)} className="flex flex-col items-center gap-2">
          <div className="rounded-full flex items-center justify-center" style={{ width: 68, height: 68, background: '#30d158' }}>
            <Phone size={28} color="white" />
          </div>
          <span className="text-white/60 text-xs">Aceptar</span>
        </motion.button>
      </div>
    </div>
  )
}

// ── App: Messages ────────────────────────────────────────────────────
const CHAT = [
  { id: 1, from: 'them', text: 'Hola! ¿cómo va el proyecto?' },
  { id: 2, from: 'me',   text: 'Todo listo para el viernes 🚀' },
  { id: 3, from: 'them', text: 'El cliente aprobó los conceptos ✓' },
  { id: 4, from: 'me',   text: 'Buenas noticias! Enviamos el reel esta tarde.' },
]

function MessagesApp({ onClose }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#1c1c1e' }}>
      <div className="flex items-center px-4 pt-14 pb-3" style={{ borderBottom: '1px solid #2c2c2e' }}>
        <button onClick={onClose} className="text-blue-400 text-sm font-medium">‹ Mensajes</button>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-white text-sm font-semibold">montilabs Studio</p>
          <p className="text-white/40 text-xs">En línea</p>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          className="rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)' }}>
          <X size={14} color="white" />
        </motion.button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {CHAT.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[75%] rounded-2xl px-3 py-2 text-sm"
              style={{
                background: m.from === 'me' ? '#0a84ff' : '#2c2c2e',
                color: 'white',
                borderBottomRightRadius: m.from === 'me' ? 4 : undefined,
                borderBottomLeftRadius:  m.from === 'them' ? 4 : undefined,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #2c2c2e' }}>
        <div className="flex-1 rounded-full px-4 py-2 text-sm text-white/30"
          style={{ border: '1px solid #3a3a3c' }}>
          Mensaje...
        </div>
      </div>
    </div>
  )
}

// ── App: Camera ───────────────────────────────────────────────────────
function CameraApp({ onClose }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Close button */}
      <div className="absolute top-14 right-5 z-20">
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          className="rounded-full flex items-center justify-center"
          style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.15)' }}>
          <X size={16} color="white" />
        </motion.button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.25 }}>
          <line x1="33%" y1="0" x2="33%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="33%" x2="100%" y2="33%" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="white" strokeWidth="0.5" />
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100,
            border: '1.5px solid rgba(255,210,0,0.85)' }}
        >
          {[['top-0 left-0','borderTop borderLeft'],['top-0 right-0','borderTop borderRight'],
            ['bottom-0 left-0','borderBottom borderLeft'],['bottom-0 right-0','borderBottom borderRight']
          ].map(([pos, _], i) => {
            const isTop = i < 2, isLeft = i % 2 === 0
            return (
              <div key={i} className={`absolute`}
                style={{ width: 12, height: 12,
                  top: isTop ? -1 : undefined, bottom: !isTop ? -1 : undefined,
                  left: isLeft ? -1 : undefined, right: !isLeft ? -1 : undefined,
                  borderTop:    isTop  ? '2.5px solid #ffd200' : undefined,
                  borderBottom: !isTop ? '2.5px solid #ffd200' : undefined,
                  borderLeft:   isLeft  ? '2.5px solid #ffd200' : undefined,
                  borderRight:  !isLeft ? '2.5px solid #ffd200' : undefined,
                }}
              />
            )
          })}
        </motion.div>
      </div>
      <div className="flex items-center justify-between px-8 py-5">
        <div className="rounded-xl overflow-hidden" style={{ width: 48, height: 48, background: '#222' }} />
        <motion.button whileTap={{ scale: 0.9 }}>
          <div className="rounded-full border-4 border-white flex items-center justify-center"
            style={{ width: 72, height: 72 }}>
            <div className="rounded-full bg-white" style={{ width: 58, height: 58 }} />
          </div>
        </motion.button>
        <div style={{ width: 48 }} />
      </div>
    </div>
  )
}

// ── App: Safari ───────────────────────────────────────────────────────
function SafariApp({ onClose }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#f2f2f7' }}>
      <div style={{ background: '#f2f2f7' }} className="pt-14 pb-2 px-4">
        <div className="rounded-xl bg-white px-4 py-2 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <p className="text-gray-500 text-sm flex-1 text-center">montilabs.com</p>
          <button onClick={onClose}><X size={14} className="text-gray-400" /></button>
        </div>
      </div>
      <div className="flex-1 bg-white overflow-y-auto px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-col gap-5">
          <p className="text-2xl font-light text-gray-900 tracking-tight">montilabs</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Estudio creativo especializado en diseño de interfaces, animación y arte generativo.
          </p>
          <div className="h-36 rounded-2xl" style={{ background: WALLPAPER }} />
          <div className="flex flex-col gap-2">
            {[100, 75, 90, 60].map((w, i) => (
              <div key={i} className="h-2 bg-gray-200 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="h-28 rounded-2xl bg-gray-100" />
        </motion.div>
      </div>
      <div className="bg-white border-t border-gray-200 flex justify-around px-8 py-3">
        {['←', '→', '⤴', '⧉', '⋯'].map(icon => (
          <button key={icon} className="text-blue-500 text-lg">{icon}</button>
        ))}
      </div>
    </div>
  )
}

// ── App Icon ──────────────────────────────────────────────────────────
function AppIcon({ id, label, Icon, bg, onOpen }) {
  return (
    <motion.div whileTap={{ scale: 0.82 }} onClick={() => onOpen(id)}
      className="flex flex-col items-center gap-1.5 cursor-pointer select-none">
      <div className="flex items-center justify-center"
        style={{ width: 62, height: 62, background: bg, borderRadius: '27%' }}>
        <Icon size={30} color="white" strokeWidth={1.5} />
      </div>
      <span className="text-white text-[11px] font-medium"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        {label}
      </span>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────
const APP_MAP = { phone: PhoneApp, messages: MessagesApp, camera: CameraApp, safari: SafariApp }

export default function IPhoneHome() {
  const now = useClock()
  const [screen,  setScreen]  = useState('locked')
  const [diMode,  setDiMode]  = useState('music')
  const [openApp, setOpenApp] = useState(null)

  const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    if (screen !== 'home') return
    const t = setTimeout(() => setDiMode('notification'), 2500)
    return () => clearTimeout(t)
  }, [screen])

  const onNotifDone = useCallback(() => setDiMode('music'), [])
  const OpenApp = openApp ? APP_MAP[openApp] : null

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#000' }}>
      <div className="relative overflow-hidden"
        style={{ width: 393, height: 852, borderRadius: 55, background: '#000',
          boxShadow: '0 0 0 10px #1c1c1e, 0 40px 100px rgba(0,0,0,.45), 0 0 0 11px #3a3a3c' }}>

        {/* Base wallpaper */}
        <div className="absolute inset-0" style={{ background: WALLPAPER }} />

        {/* ── Lock Screen ── */}
        <AnimatePresence>
          {screen === 'locked' && (
            <motion.div key="lock"
              exit={{ opacity: 0, y: -28, scale: 1.04, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setScreen('home')}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="absolute inset-0" style={{ background: WALLPAPER }} />

              <motion.div className="relative z-10 mb-5"
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.2 }}>
                <Lock size={22} color="rgba(255,255,255,0.75)" />
              </motion.div>

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-white font-thin tracking-tight select-none"
                  style={{ fontSize: 88, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {timeStr}
                </span>
                <span className="text-white/80 text-lg mt-2 capitalize select-none">{dateStr}</span>
              </div>

              <motion.div className="absolute bottom-14 z-10 flex flex-col items-center gap-1"
                animate={{ opacity: [0.4, 0.85, 0.4], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}>
                <ChevronUp size={20} color="rgba(255,255,255,0.7)" />
                <span className="text-white/65 text-xs">Toca para desbloquear</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Home Screen ── */}
        <AnimatePresence>
          {screen === 'home' && (
            <motion.div key="home"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              className="absolute inset-0 z-10"
            >
              {/* Status bar */}
              <div className="flex items-center justify-between px-7 pt-4 relative z-10">
                <span className="text-white text-sm font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {timeStr}
                </span>
                <DynamicIsland mode={diMode} onNotifDone={onNotifDone} />
                <div className="flex items-center gap-1.5">
                  <SignalBars /><Wifi /><Battery />
                </div>
              </div>

              {/* Clock */}
              <div className="flex flex-col items-center relative z-10" style={{ marginTop: 56 }}>
                <span className="text-white font-thin select-none"
                  style={{ fontSize: 88, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {timeStr}
                </span>
                <span className="text-white/82 text-lg mt-2 capitalize select-none">{dateStr}</span>
              </div>

              {/* Dock */}
              <div className="absolute inset-x-0 z-10" style={{ bottom: 52 }}>
                <div className="mx-5 rounded-3xl p-4"
                  style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(24px)' }}>
                  <div className="grid grid-cols-4 gap-3 justify-items-center">
                    {APPS.map(app => <AppIcon key={app.id} {...app} onOpen={setOpenApp} />)}
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute inset-x-0 flex justify-center z-10" style={{ bottom: 10 }}>
                <div className="rounded-full" style={{ width: 130, height: 4, background: 'rgba(255,255,255,0.5)' }} />
              </div>

              {/* Reset */}
              <button
                onClick={() => { setScreen('locked'); setDiMode('music') }}
                className="absolute top-16 right-5 z-10 text-white/30 text-xs select-none"
              >
                ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── App Overlay ── */}
        <AnimatePresence>
          {openApp && OpenApp && (
            <motion.div key={openApp}
              initial={{ y: '100%', borderRadius: 55 }}
              animate={{ y: 0, borderRadius: 0 }}
              exit={{ y: '100%', borderRadius: 55 }}
              transition={{ type: 'spring', stiffness: 280, damping: 34 }}
              className="absolute inset-0 z-30 overflow-hidden"
            >
              <OpenApp onClose={() => setOpenApp(null)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
