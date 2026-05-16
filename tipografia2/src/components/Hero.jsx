import { Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center, Grid, Stars } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'

const BG      = '#0a0018'
const WORD    = 'MONTILABS'
const CHARS   = WORD.split('')
const SPACING = 1.13
const TOTAL_W = (CHARS.length - 1) * SPACING
const START_X = -TOTAL_W / 2

// Module-level ref objects — one per letter (single instance of this component)
const LETTER_REFS = CHARS.map(() => ({ current: null }))

function Letter({ char, index }) {
  const x = START_X + index * SPACING
  const y = 3.8 + (index % 3) * 0.7   // stagger start height so letters don't spawn inside each other

  return (
    <RigidBody
      ref={LETTER_REFS[index]}
      colliders={false}
      restitution={0.45}
      linearDamping={0.35}
      angularDamping={0.65}
      position={[x, y, 0]}
    >
      <CuboidCollider args={[0.42, 0.52, 0.28]} />
      <Center>
        <Text3D
          font="./fonts/helvetiker_bold.typeface.json"
          size={1.0}
          height={0.32}
          curveSegments={18}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {char}
          <meshBasicMaterial color="#7fff00" />
        </Text3D>
      </Center>
    </RigidBody>
  )
}

function Ground() {
  const { viewport } = useThree()
  const hw = viewport.width / 2 + 2
  return (
    <RigidBody type="fixed" position={[0, -3.6, 0]} colliders={false}>
      <CuboidCollider args={[hw, 0.25, 5]} />
    </RigidBody>
  )
}

function Walls() {
  const { viewport } = useThree()
  const hw = viewport.width / 2 + 0.8
  const h  = viewport.height / 2 + 5
  return (
    <>
      <RigidBody type="fixed" position={[-hw, 0, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[hw, 0, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, 5]} />
      </RigidBody>
    </>
  )
}

function MousePusher() {
  useFrame(({ pointer, viewport }) => {
    const mx = pointer.x * (viewport.width  / 2)
    const my = pointer.y * (viewport.height / 2)

    for (const ref of LETTER_REFS) {
      if (!ref.current) continue
      const pos  = ref.current.translation()
      const dx   = pos.x - mx
      const dy   = pos.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 2.4

      if (dist < radius && dist > 0.01) {
        const force = ((radius - dist) / radius) * 11
        ref.current.applyImpulse(
          { x: (dx / dist) * force, y: (dy / dist) * force, z: 0 },
          true,
        )
      }
    }
  })
  return null
}

function Scene({ resetKey }) {
  return (
    <Physics key={resetKey} gravity={[0, -3.2, 0]}>
      {CHARS.map((char, i) => (
        <Letter key={i} char={char} index={i} />
      ))}
      <Ground />
      <Walls />
      <MousePusher />
    </Physics>
  )
}

export default function Hero() {
  const [resetKey, setResetKey] = useState(0)

  return (
    <div style={{ width: '100vw', height: '100vh', background: BG, position: 'relative' }}>

      {/* Back link */}
      <a href="../../" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 100,
        fontSize: 11, fontWeight: 500, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
        transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.target.style.color = '#7fff00'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
      >← volver</a>

      {/* HTML overlay */}
      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.22)', fontSize: 11, letterSpacing: '0.22em',
          textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif',
        }}>
          mueve el cursor · move cursor
        </span>
        <button
          onClick={() => setResetKey(k => k + 1)}
          style={{
            pointerEvents: 'auto',
            padding: '5px 14px', borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
            color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
          }}
        >
          ↺ reset
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 11], fov: 52 }}>
        <color attach="background" args={[BG]} />

        <ambientLight intensity={0.12} />
        <pointLight position={[-6, 5, 3]} intensity={40} color="#ff2d78" />
        <pointLight position={[ 6, 5, 3]} intensity={40} color="#00f5ff" />
        <pointLight position={[ 0, 8, 2]} intensity={20} color="#bf5fff" />
        <pointLight position={[ 0, 2, 4]} intensity={35} color="#c8ff3e" />

        <Stars radius={90} depth={50} count={4500} factor={4} fade speed={0.4} />

        <Grid
          position={[0, -3.72, 0]}
          args={[60, 60]}
          cellSize={0.8}
          cellThickness={0.6}
          cellColor="#ff2d78"
          sectionSize={4}
          sectionThickness={1.2}
          sectionColor="#bf5fff"
          fadeDistance={32}
          fadeStrength={1}
          infiniteGrid
        />

        <Suspense fallback={null}>
          <Scene resetKey={resetKey} />
        </Suspense>
      </Canvas>
    </div>
  )
}
