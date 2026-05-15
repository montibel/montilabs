import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center, Environment, Grid, Stars } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'

function GlassText({ text, position, colliderArgs, rigidRef }) {
  return (
    <RigidBody
      ref={rigidRef}
      colliders={false}
      restitution={0.8}
      linearDamping={0.4}
      angularDamping={0.4}
      position={position}
    >
      <CuboidCollider args={colliderArgs} />
      <Center>
        <Text3D
          font="./fonts/helvetiker_bold.typeface.json"
          size={1.4}
          height={0.4}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.02}
          bevelSegments={8}
        >
          {text}
          <meshPhysicalMaterial
            metalness={1}
            roughness={0.05}
            transmission={0}
            color="#ffffff"
            envMapIntensity={3}
          />
        </Text3D>
      </Center>
    </RigidBody>
  )
}

function Ground() {
  const { viewport } = useThree()
  const hw = viewport.width / 2 + 2

  return (
    <RigidBody type="fixed" position={[0, -2.8, 0]} colliders={false}>
      <CuboidCollider args={[hw, 0.25, 5]} />
    </RigidBody>
  )
}

function Walls() {
  const { viewport } = useThree()
  const hw = viewport.width / 2 + 0.5
  const hh = viewport.height / 2 + 0.5
  const h  = viewport.height / 2 + 2
  const w  = viewport.width  / 2 + 2

  return (
    <>
      <RigidBody type="fixed" position={[-hw, 0, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[hw, 0, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, hh, 0]} colliders={false}>
        <CuboidCollider args={[w, 0.5, 5]} />
      </RigidBody>
    </>
  )
}

function MousePusher({ letterRefs }) {
  useFrame(({ pointer, viewport }) => {
    const mx = pointer.x * (viewport.width / 2)
    const my = pointer.y * (viewport.height / 2)

    for (const ref of letterRefs) {
      if (!ref.current) continue
      const pos = ref.current.translation()
      const dx = pos.x - mx
      const dy = pos.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 2.5

      if (dist < radius && dist > 0.01) {
        const force = ((radius - dist) / radius) * 8
        ref.current.applyImpulse(
          { x: (dx / dist) * force, y: (dy / dist) * force, z: 0 },
          true
        )
      }
    }
  })

  return null
}

export default function Hero() {
  const montilabsRef = useRef()
  const codeRef = useRef()

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0d0021' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#0d0021']} />

        <ambientLight intensity={0.2} />
        <pointLight position={[-5, 3, 3]} intensity={30} color="#ff2d78" />
        <pointLight position={[ 5, 3, 3]} intensity={30} color="#00f5ff" />
        <pointLight position={[ 0, 6, 2]} intensity={15} color="#bf5fff" />

        <Stars radius={80} depth={50} count={4000} factor={4} fade speed={0.5} />

        <Grid
          position={[0, -2.95, 0]}
          args={[40, 40]}
          cellSize={0.8}
          cellThickness={0.6}
          cellColor="#ff2d78"
          sectionSize={4}
          sectionThickness={1.2}
          sectionColor="#bf5fff"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />

        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <Physics gravity={[0, -2, 0]}>
            <GlassText text="MONTILABS" position={[0, 3,   0]} colliderArgs={[4.8, 0.8, 0.3]} rigidRef={montilabsRef} />
            <GlassText text="CODE"      position={[0, 5.5, 0]} colliderArgs={[2.8, 0.8, 0.3]} rigidRef={codeRef} />
            <Ground />
            <Walls />
            <MousePusher letterRefs={[montilabsRef, codeRef]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}
