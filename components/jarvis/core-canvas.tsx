"use client"

import { Canvas } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { NodalCore } from "./nodal-core"

type CoreCanvasProps = {
  intensity: number
  /** horizontal offset target in world units; negative pushes core to the left */
  offset: number
}

const CORE_COLOR = "#5fe3ff"

function Stage({ intensity, offset }: CoreCanvasProps) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!group.current) return
    group.current.position.x += (offset - group.current.position.x) * 0.06
  })
  return (
    <group ref={group}>
      <NodalCore intensity={intensity} color={CORE_COLOR} />
    </group>
  )
}

export function CoreCanvas({ intensity, offset }: CoreCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Stage intensity={intensity} offset={offset} />
    </Canvas>
  )
}
