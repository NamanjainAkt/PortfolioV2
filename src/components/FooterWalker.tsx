import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { WalkerExp } from './WalkerExp'

type Props = {
  startRef?: React.RefObject<HTMLElement>
  endRef?: React.RefObject<HTMLElement>
  containerRef: React.RefObject<HTMLElement>
}

const FooterWalker: React.FC<Props> = ({ startRef, endRef, containerRef }) => {
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)
  const WALK_BOUNDS = useMemo(() => ({ min: -5, max: 5 }), [])
  const FOV = 35
  const cameraZ = useMemo(() => {
    const halfWidth = Math.max(Math.abs(WALK_BOUNDS.min), Math.abs(WALK_BOUNDS.max)) + 0.8
    const rad = (FOV * Math.PI) / 360
    return halfWidth / Math.tan(rad)
  }, [WALK_BOUNDS.min, WALK_BOUNDS.max])

  useEffect(() => {
    const update = () => {
      const container = containerRef.current?.getBoundingClientRect()
      if (!container) return
      setLayout({ width: container.width, height: container.height })
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current as Element)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [containerRef])

  const headTarget = useMemo(() => {
    if (!hover) return null
    if (layout.width <= 0 || layout.height <= 0) return null
    const nx = (hover.x / layout.width) * 2 - 1
    const ny = 1 - (hover.y / layout.height) * 2
    return { x: nx, y: ny }
  }, [hover, layout])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          background: 'transparent',
          zIndex: 1,
        }}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
          setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setHover(null)}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 1.2, cameraZ], fov: FOV }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 2, 2]} intensity={0.6} />
          <Environment preset="city" />
          <group position={[0, -0.6, 0]}>
            <WalkerExp
              scale={0.5}
              control={{
                axis: 'x',
                speed: 0.5,
                headTarget: headTarget,
                bounds: WALK_BOUNDS,
                lookAtCamera: true,
              }}
            />
          </group>
        </Canvas>
      </div>
    </>
  )
}

export default FooterWalker
