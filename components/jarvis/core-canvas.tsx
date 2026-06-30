"use client"

import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { NodalCore } from "./nodal-core"

type CoreCanvasProps = {
  intensity: number
  /** target vertical offset in world units; positive moves the core up */
  offsetY: number
  /** target uniform scale of the core */
  scale: number
}

const CORE_COLOR = "#5fe3ff"

function Stage({ intensity, offsetY, scale }: CoreCanvasProps) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!group.current) return
    // smoothly lerp toward the target position + scale
    group.current.position.y += (offsetY - group.current.position.y) * 0.06
    const s = group.current.scale.x + (scale - group.current.scale.x) * 0.06
    group.current.scale.setScalar(s)
  })
  return (
    <group ref={group}>
      <NodalCore intensity={intensity} color={CORE_COLOR} />
    </group>
  )
}

export function CoreCanvas({ intensity, offsetY, scale }: CoreCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Stage intensity={intensity} offsetY={offsetY} scale={scale} />
      {/* let the user grab and spin the core with the mouse */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 2 - 0.9}
        maxPolarAngle={Math.PI / 2 + 0.9}
      />
    </Canvas>
  )
}
