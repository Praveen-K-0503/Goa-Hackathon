import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

// Generate random points in a sphere without maath (avoids NaN issue)
function generateSpherePoints(count, radius) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

function StarField() {
  const ref = useRef()
  const sphere = useMemo(() => generateSpherePoints(4000, 1.5), [])

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 12
      ref.current.rotation.y -= delta / 18
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f5ff"
          size={0.003}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        <StarField />
      </Canvas>
    </div>
  )
}
