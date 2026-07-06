import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.MeshStandardMaterial
  }
}

type Control = {
  axis?: 'x' | 'z'
  direction?: -1 | 0 | 1
  speed?: number
  headTarget?: { x: number; y: number } | null
  bounds?: { min: number; max: number }
  lookAtCamera?: boolean
}

export function WalkerExp(props: ThreeElements['group'] & { control?: Control }) {
  const { nodes } = useGLTF('/model.glb') as GLTFResult

  const groupRef = useRef<THREE.Group>(null)

  const [movement, setMovement] = useState({ forward: false, backward: false })
  const speedRef = useRef(0)
  const phaseRef = useRef(0)
  const yawRef = useRef(0)
  const autoDirRef = useRef<1 | -1>(1)

  const allMeshes = useMemo(
    () => Object.values(nodes).filter((node): node is THREE.Mesh =>
      (node as THREE.Mesh)?.geometry !== undefined
    ),
    [nodes]
  )

  const theme = {
    crimson: '#C8102E',
    glow: '#FF6B6B',
    dark: '#0A0A0A',
    surface: '#111111',
    silver: '#EDEDED',
  }

  useEffect(() => {
    if (props.control) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') setMovement(m => ({ ...m, forward: true }))
      if (e.key === 's' || e.key === 'S') setMovement(m => ({ ...m, backward: true }))
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') setMovement(m => ({ ...m, forward: false }))
      if (e.key === 's' || e.key === 'S') setMovement(m => ({ ...m, backward: false }))
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [props.control])

  useFrame((state, delta) => {
    const axis = props.control?.axis ?? 'z'
    const externalMoving = props.control ? ((props.control.direction ?? autoDirRef.current) !== 0) : false
    const targetGait = props.control ? (externalMoving ? 1 : 0) : (movement.forward || movement.backward ? 1 : 0)
    const gait = THREE.MathUtils.lerp(Math.min(1, Math.abs(speedRef.current)), targetGait, 0.12)
    const maxSpeed = props.control?.speed ?? 1
    const targetSpeed = props.control ? (externalMoving ? maxSpeed : 0) : ((movement.forward || movement.backward) ? maxSpeed : 0)
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 0.15)
    phaseRef.current += delta * 6 * Math.max(0.2, speedRef.current)
    const phase = phaseRef.current

    const direction = props.control ? (props.control.direction ?? autoDirRef.current) : (movement.forward ? 1 : movement.backward ? -1 : 0)

    if (groupRef.current) {
      if (axis === 'z') {
        groupRef.current.position.z += direction * speedRef.current * delta * 2
      } else {
        groupRef.current.position.x += direction * speedRef.current * delta * 2
      }

      groupRef.current.position.y = Math.sin(phase * 2) * 0.06 * gait
      groupRef.current.rotation.z = Math.sin(phase + Math.PI / 2) * 0.03 * gait

      const targetYaw = axis === 'z' ? (direction >= 0 ? 0 : Math.PI) : (direction >= 0 ? -Math.PI / 2 : Math.PI / 2)
      yawRef.current = THREE.MathUtils.lerp(yawRef.current, targetYaw, 0.15 * gait + 0.05)
      groupRef.current.rotation.y = yawRef.current

      if (props.control?.bounds && props.control.direction === undefined) {
        const pos = axis === 'z' ? groupRef.current.position.z : groupRef.current.position.x
        if (pos >= props.control.bounds.max) autoDirRef.current = -1
        if (pos <= props.control.bounds.min) autoDirRef.current = 1
      }
    }
  })

  if (allMeshes.length === 0) return null

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <pointLight position={[0, 0.7, 1]} intensity={1.6} distance={3.5} decay={2} color={theme.glow} />
      <pointLight position={[0.5, 0.3, 0.5]} intensity={0.7} distance={3} decay={2} color={theme.crimson} />
      <pointLight position={[-0.5, 0.3, 0.5]} intensity={0.7} distance={3} decay={2} color={theme.crimson} />
      {allMeshes.map((mesh, i) => (
        <mesh key={i} castShadow receiveShadow geometry={mesh.geometry} material={mesh.material}>
          <meshStandardMaterial
            color={theme.surface}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}

useGLTF.preload('/model.glb')
