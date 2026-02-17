import React, { useRef, useEffect, useState } from 'react'
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

export function WalkerExp(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/model.glb') as GLTFResult

  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const legRightRef = useRef<THREE.Group>(null)
  const legLeftRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)

  const [movement, setMovement] = useState({ forward: false, backward: false })
  const gaitRef = useRef(0)
  const speedRef = useRef(0)
  const headBaseY = 1.545
  const legRightBaseY = -1.621
  const legLeftBaseY = -1.613
  const prevRootZ = useRef(0)
  const phaseRef = useRef(0)
  const yawRef = useRef(0)
  const leftSwingT = useRef(0)
  const rightSwingT = useRef(0)
  const leftIsSwing = useRef(false)
  const rightIsSwing = useRef(true)
  const leftPlant = useRef(new THREE.Vector3(-1.293, -1.613, -0.077))
  const rightPlant = useRef(new THREE.Vector3(1.157, -1.621, 0.221))
  const leftSwingStart = useRef(leftPlant.current.clone())
  const rightSwingStart = useRef(rightPlant.current.clone())
  const leftSwingEnd = useRef(leftPlant.current.clone())
  const rightSwingEnd = useRef(rightPlant.current.clone())
  const theme = {
    crimson: '#C8102E',
    glow: '#FF6B6B',
    dark: '#0A0A0A',
    surface: '#111111',
    silver: '#EDEDED',
  }

  useEffect(() => {
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
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const mouse = state.mouse
    const targetGait = movement.forward || movement.backward ? 1 : 0
    gaitRef.current = THREE.MathUtils.lerp(gaitRef.current, targetGait, 0.12)
    const maxSpeed = 1
    const targetSpeed = movement.forward || movement.backward ? maxSpeed : 0
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 0.15)
    phaseRef.current += delta * 6 * Math.max(0.2, speedRef.current)
    const phase = phaseRef.current
    const stride = 0.6 * gaitRef.current
    const lift = 0.14 * gaitRef.current
    const stepLen = 0.45 * gaitRef.current
    const direction = movement.forward ? 1 : movement.backward ? -1 : 0

    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.x * 0.7, 0.12)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.y * 0.4, 0.12)
    }

    if (groupRef.current && legLeftRef.current && legRightRef.current && bodyRef.current) {
      const dz = groupRef.current.position.z - prevRootZ.current
      prevRootZ.current = groupRef.current.position.z
      groupRef.current.position.z += direction * speedRef.current * delta * 2
      const targetYaw = direction >= 0 ? 0 : Math.PI
      yawRef.current = THREE.MathUtils.lerp(yawRef.current, targetYaw, 0.15 * gaitRef.current + 0.05)
      groupRef.current.rotation.y = yawRef.current
      const leftPhase = phase
      const rightPhase = phase + Math.PI
      const leftSwingNow = Math.sin(leftPhase) > 0
      const rightSwingNow = Math.sin(rightPhase) > 0
      if (leftSwingNow && !leftIsSwing.current) {
        leftIsSwing.current = true
        leftSwingT.current = 0
        leftSwingStart.current.copy(leftPlant.current)
        leftSwingEnd.current.copy(leftPlant.current).add(new THREE.Vector3(0, 0, direction * stepLen))
      } else if (!leftSwingNow && leftIsSwing.current) {
        leftIsSwing.current = false
        leftPlant.current.copy(legLeftRef.current.position)
      }
      if (rightSwingNow && !rightIsSwing.current) {
        rightIsSwing.current = true
        rightSwingT.current = 0
        rightSwingStart.current.copy(rightPlant.current)
        rightSwingEnd.current.copy(rightPlant.current).add(new THREE.Vector3(0, 0, direction * stepLen))
      } else if (!rightSwingNow && rightIsSwing.current) {
        rightIsSwing.current = false
        rightPlant.current.copy(legRightRef.current.position)
      }
      if (leftIsSwing.current) {
        leftSwingT.current = Math.min(1, leftSwingT.current + delta * 2)
        const a = leftSwingStart.current.clone().lerp(leftSwingEnd.current, leftSwingT.current)
        const yArc = Math.sin(Math.PI * leftSwingT.current) * lift
        legLeftRef.current.position.set(a.x, legLeftBaseY + yArc, a.z)
      } else {
        legLeftRef.current.position.z -= dz
        legLeftRef.current.position.y = legLeftBaseY
      }
      if (rightIsSwing.current) {
        rightSwingT.current = Math.min(1, rightSwingT.current + delta * 2)
        const a = rightSwingStart.current.clone().lerp(rightSwingEnd.current, rightSwingT.current)
        const yArc = Math.sin(Math.PI * rightSwingT.current) * lift
        legRightRef.current.position.set(a.x, legRightBaseY + yArc, a.z)
      } else {
        legRightRef.current.position.z -= dz
        legRightRef.current.position.y = legRightBaseY
      }
      legLeftRef.current.rotation.x = Math.sin(leftPhase) * stride
      legRightRef.current.rotation.x = Math.sin(rightPhase) * stride
      legLeftRef.current.rotation.z = Math.sin(leftPhase) * 0.05 * gaitRef.current
      legRightRef.current.rotation.z = Math.sin(rightPhase) * -0.05 * gaitRef.current
      bodyRef.current.position.y = Math.sin(phase * 2) * 0.06 * gaitRef.current
      bodyRef.current.rotation.y = Math.sin(phase) * 0.05 * gaitRef.current
      bodyRef.current.rotation.z = Math.sin(phase + Math.PI / 2) * 0.03 * gaitRef.current
      if (headRef.current) headRef.current.position.y = headBaseY + Math.sin(phase * 2) * 0.05 * gaitRef.current
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group ref={headRef} position={[-0.003, 1.545, 0.99]} rotation={[0.174, 0.02, -0.004]}>
        <pointLight position={[0, 0.05, 0.25]} intensity={1.6} distance={3.5} decay={2} color={theme.glow} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_1.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_2.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={1} roughness={0.15} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_3.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={1} roughness={0.15} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_4.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_5.geometry}>
          <meshStandardMaterial color={theme.glow} emissive={theme.glow} emissiveIntensity={2} transparent opacity={0.9} metalness={0.2} roughness={0.1} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_6.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_7.geometry}>
          <meshStandardMaterial color={theme.crimson} emissive={theme.crimson} emissiveIntensity={0.35} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_8.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_9.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0004_10.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.7} roughness={0.5} />
        </mesh>
      </group>

      <group ref={legRightRef} position={[1.157, -1.621, 0.221]} rotation={[0.026, -0.1, 0.107]}>
        <pointLight position={[0.1, 0.2, 0.1]} intensity={0.6} distance={2.5} decay={2} color={theme.crimson} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_1.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_2.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_3.geometry}>
          <meshStandardMaterial color={theme.crimson} emissive={theme.crimson} emissiveIntensity={0.25} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_4.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_5.geometry}>
          <meshStandardMaterial color={theme.crimson} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0003_6.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.7} roughness={0.5} />
        </mesh>
      </group>

      <group ref={legLeftRef} position={[-1.293, -1.613, -0.077]} rotation={[-0.023, 0.084, 0.035]}>
        <pointLight position={[-0.1, 0.2, 0.1]} intensity={0.6} distance={2.5} decay={2} color={theme.crimson} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_1.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_2.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_3.geometry}>
          <meshStandardMaterial color={theme.crimson} emissive={theme.crimson} emissiveIntensity={0.25} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_4.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_5.geometry}>
          <meshStandardMaterial color={theme.crimson} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0002_6.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.7} roughness={0.5} />
        </mesh>
      </group>

      <group ref={bodyRef}>
        <pointLight position={[0.5, 0.5, 0.7]} intensity={0.7} distance={3} decay={2} color={theme.crimson} />
        <pointLight position={[-0.5, 0.5, 0.7]} intensity={0.7} distance={3} decay={2} color={theme.crimson} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_1.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_2.geometry}>
          <meshStandardMaterial color={theme.crimson} emissive={theme.crimson} emissiveIntensity={0.3} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_3.geometry}>
          <meshStandardMaterial color={theme.surface} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_4.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_5.geometry}>
          <meshStandardMaterial color={theme.crimson} metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_6.geometry}>
          <meshStandardMaterial color={theme.silver} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0001_7.geometry}>
          <meshStandardMaterial color={theme.dark} metalness={0.7} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/model.glb')
