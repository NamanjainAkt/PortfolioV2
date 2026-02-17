import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, GroupProps } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

// Project Theme Colors
const themeColors = {
  crimson: '#C8102E',
  glow: '#FF6B6B',
  dark: '#0A0A0A',
  surface: '#111111',
  silver: '#EDEDED',
}

// Helper to determine mesh type based on name patterns
const getMeshType = (name: string): 'head' | 'legL' | 'legR' | 'body' => {
  const lower = name.toLowerCase()
  if (lower.includes('head') || lower.includes('eye') || lower.includes('visor')) return 'head'
  if (lower.includes('legl') || lower.includes('left') || lower.includes('leg_l')) return 'legL'
  if (lower.includes('legr') || lower.includes('right') || lower.includes('leg_r')) return 'legR'
  return 'body'
}

// Helper to get material based on mesh type and patterns
const getMaterial = (name: string, type: string) => {
  const lower = name.toLowerCase()
  
  // Glow/visor parts
  if (lower.includes('eye') || lower.includes('visor') || lower.includes('light') || lower.includes('glow')) {
    return <meshStandardMaterial color={themeColors.glow} emissive={themeColors.glow} emissiveIntensity={2} transparent opacity={0.9} />
  }
  
  // Head parts
  if (type === 'head') {
    return <meshStandardMaterial color={themeColors.silver} roughness={0.1} metalness={1} />
  }
  
  // Legs
  if (type === 'legL' || type === 'legR') {
    return <meshStandardMaterial color={themeColors.crimson} metalness={0.5} roughness={0.5} />
  }
  
  // Body parts - alternate colors based on hash for variety
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  if (hash % 3 === 0) {
    return <meshStandardMaterial color={themeColors.surface} roughness={0.2} metalness={0.8} />
  } else if (hash % 3 === 1) {
    return <meshStandardMaterial color={themeColors.dark} roughness={0.1} metalness={0.9} />
  } else {
    return <meshStandardMaterial color={themeColors.crimson} emissive={themeColors.crimson} emissiveIntensity={0.2} />
  }
}

export function DisneyRobot(props: GroupProps) {
  const { nodes } = useGLTF('/model.glb') as unknown as GLTFResult
  
  // Create refs for animated parts
  const headRef = useRef<THREE.Group>(null)
  const legLRef = useRef<THREE.Group>(null)
  const legRRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  
  // Movement state
  const [movement, setMovement] = useState({ forward: false, backward: false })
  
  // Discover and categorize all meshes
  const allMeshes = useMemo(
    () => Object.entries(nodes).filter(([, node]) => (node as THREE.Mesh)?.geometry) as [string, THREE.Mesh][],
    [nodes]
  )
  
  // Log discovered meshes for debugging
  useEffect(() => {
    console.log('DisneyRobot - Discovered meshes:', allMeshes.map(([name]) => name))
  }, [allMeshes])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w') setMovement(m => ({ ...m, forward: true }))
      if (key === 's') setMovement(m => ({ ...m, backward: true }))
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w') setMovement(m => ({ ...m, forward: false }))
      if (key === 's') setMovement(m => ({ ...m, backward: false }))
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  // Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const mouse = state.mouse
    
    // Head tracking - smooth interpolation
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mouse.x * 0.8,
        0.1
      )
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -mouse.y * 0.5,
        0.1
      )
    }
    
    // Walking animation
    const walkSpeed = 10
    const stride = 0.5
    
    if (movement.forward || movement.backward) {
      if (legLRef.current) {
        legLRef.current.rotation.x = Math.sin(t * walkSpeed) * stride
      }
      if (legRRef.current) {
        legRRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * stride
      }
      if (bodyRef.current) {
        const direction = movement.forward ? 1 : -1
        bodyRef.current.position.z += direction * 0.02
        // Bobbing motion
        if (headRef.current) {
          headRef.current.position.y = Math.sin(t * walkSpeed * 2) * 0.03
        }
      }
    } else {
      // Return to idle
      if (legLRef.current) {
        legLRef.current.rotation.x = THREE.MathUtils.lerp(legLRef.current.rotation.x, 0, 0.1)
      }
      if (legRRef.current) {
        legRRef.current.rotation.x = THREE.MathUtils.lerp(legRRef.current.rotation.x, 0, 0.1)
      }
    }
  })
  
  // Group meshes by type with geometric fallback for generic names
  const { headMeshes, legLMeshes, legRMeshes, bodyMeshes } = useMemo(() => {
    const head: [string, THREE.Mesh][] = []
    const legL: [string, THREE.Mesh][] = []
    const legR: [string, THREE.Mesh][] = []
    const body: [string, THREE.Mesh][] = []

    // First pass: name-based classification
    allMeshes.forEach(([name, mesh]) => {
      const type = getMeshType(name)
      if (type === 'head') head.push([name, mesh])
      else if (type === 'legL') legL.push([name, mesh])
      else if (type === 'legR') legR.push([name, mesh])
      else body.push([name, mesh])
    })

    // Build centers using bounding boxes
    const centers = allMeshes.map(([name, mesh]) => {
      const box = new THREE.Box3()
      box.setFromObject(mesh)
      const center = new THREE.Vector3()
      box.getCenter(center)
      return { name, mesh, center, box }
    })
    const ys = centers.map(c => c.center.y)
    const xs = centers.map(c => c.center.x)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const rangeY = Math.max(0.0001, maxY - minY)

    // Fallback: determine head as top 25%
    if (head.length === 0) {
      const headThreshold = minY + rangeY * 0.75
      const topParts = centers.filter(c => c.center.y >= headThreshold)
      // If still empty, choose the single top-most part
      const chosen = topParts.length > 0 ? topParts : [centers.slice().sort((a, b) => b.center.y - a.center.y)[0]].filter(Boolean)
      const used = new Set(chosen.map(c => c.name))
      chosen.forEach(c => head.push([c.name, c.mesh]))
      // Remove from body if present to avoid duplicates
      for (let i = body.length - 1; i >= 0; i--) {
        if (used.has(body[i][0])) body.splice(i, 1)
      }
    }

    // Fallback: determine legs as bottom 30% and split by X left/right
    if (legL.length === 0 && legR.length === 0) {
      const legThreshold = minY + rangeY * 0.3
      const bottomParts = centers.filter(c => c.center.y <= legThreshold)
      // If empty, pick lowest 2 by Y as legs
      const chosen = bottomParts.length > 0 ? bottomParts : centers.slice().sort((a, b) => a.center.y - b.center.y).slice(0, 2)
      const medianX = xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0
      const used = new Set<string>()
      chosen.forEach(c => {
        used.add(c.name)
        if (c.center.x < medianX) legL.push([c.name, c.mesh])
        else legR.push([c.name, c.mesh])
      })
      // Remove from body where applicable
      for (let i = body.length - 1; i >= 0; i--) {
        if (used.has(body[i][0])) body.splice(i, 1)
      }
    }

    return { headMeshes: head, legLMeshes: legL, legRMeshes: legR, bodyMeshes: body }
  }, [allMeshes])
  
  // If no specific parts found, render all as body
  const hasHead = headMeshes.length > 0
  const hasLegL = legLMeshes.length > 0
  const hasLegR = legRMeshes.length > 0
  
  // Render mesh helper
  const renderMesh = (name: string, mesh: THREE.Mesh, ref?: React.Ref<THREE.Mesh>) => {
    const type = getMeshType(name)
    return (
      <mesh
        key={name}
        ref={ref}
        castShadow
        receiveShadow
        geometry={mesh.geometry}
        material={mesh.material}
        position={mesh.position}
        rotation={mesh.rotation}
        scale={mesh.scale}
      >
        {getMaterial(name, type)}
      </mesh>
    )
  }
  
  return (
    <group {...props} dispose={null}>
      <group ref={bodyRef}>
        {/* Body Group - meshes that aren't head or legs */}
        {bodyMeshes.map(([name, mesh]) => renderMesh(name, mesh))}
        
        {/* Head Group */}
        {hasHead && (
          <group ref={headRef}>
            {headMeshes.map(([name, mesh]) => renderMesh(name, mesh))}
          </group>
        )}
        
        {/* Left Leg Group */}
        {hasLegL && (
          <group ref={legLRef}>
            {legLMeshes.map(([name, mesh]) => renderMesh(name, mesh))}
          </group>
        )}
        
        {/* Right Leg Group */}
        {hasLegR && (
          <group ref={legRRef}>
            {legRMeshes.map(([name, mesh]) => renderMesh(name, mesh))}
          </group>
        )}
        
        {/* Fallback: if no parts were identified, render everything */}
        {!hasHead && !hasLegL && !hasLegR && bodyMeshes.length === 0 && (
          allMeshes.map(([name, mesh]) => renderMesh(name, mesh))
        )}
      </group>
    </group>
  )
}

// Preload the model
useGLTF.preload('/model.glb')
