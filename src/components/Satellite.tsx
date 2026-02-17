import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const themeColors = {
  crimson: '#C8102E',
  glow: '#FF6B6B',
  dark: '#0A0A0A',
  surface: '#111111',
  silver: '#EDEDED',
}

export function Satellite(props: any) {
  const groupRef = useRef<THREE.Group>(null)
  const solarPanelLRef = useRef<THREE.Group>(null)
  const solarPanelRRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05
    }
    
    if (solarPanelLRef.current && solarPanelRRef.current) {
      const panelRotation = Math.sin(t * 1.5) * 0.03
      solarPanelLRef.current.rotation.x = panelRotation
      solarPanelRRef.current.rotation.x = panelRotation
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Core Body - Compact Box with Silver/Surface Theme */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial 
          color={themeColors.silver} 
          metalness={1} 
          roughness={0.1} 
          emissive={themeColors.dark}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Internal Structural Frame - Crimson accents */}
      <mesh>
        <boxGeometry args={[0.72, 0.82, 0.72]} />
        <meshStandardMaterial color={themeColors.crimson} wireframe opacity={0.3} transparent />
      </mesh>

      {/* Detailed Top Sensor Array */}
      <group position={[0, 0.4, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.2, 6]} />
          <meshStandardMaterial color={themeColors.surface} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Main High-Gain Antenna - Silver with Crimson details */}
        <group position={[0, 0.2, 0]} rotation={[-0.2, 0, 0.1]}>
          <mesh castShadow>
            <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, 0.4]} />
            <meshStandardMaterial color={themeColors.silver} metalness={1} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color={themeColors.glow} emissive={themeColors.glow} emissiveIntensity={1} />
          </mesh>
        </group>
      </group>

      {/* Solar Panel Systems - Crimson/Dark Theme */}
      <group position={[-0.35, 0, 0]} ref={solarPanelLRef}>
        <mesh position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.03]} />
          <meshStandardMaterial color={themeColors.dark} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Panel Support Struts - Crimson */}
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2]} />
          <meshStandardMaterial color={themeColors.crimson} metalness={0.5} />
        </mesh>
        {/* Panel Grid Lines - Crimson Glow */}
        <mesh position={[-0.6, 0, 0.02]}>
          <boxGeometry args={[1.15, 0.35, 0.001]} />
          <meshStandardMaterial color={themeColors.crimson} wireframe opacity={0.4} transparent />
        </mesh>
      </group>

      <group position={[0.35, 0, 0]} ref={solarPanelRRef}>
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.03]} />
          <meshStandardMaterial color={themeColors.dark} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2]} />
          <meshStandardMaterial color={themeColors.crimson} metalness={0.5} />
        </mesh>
        <mesh position={[0.6, 0, 0.02]}>
          <boxGeometry args={[1.15, 0.35, 0.001]} />
          <meshStandardMaterial color={themeColors.crimson} wireframe opacity={0.4} transparent />
        </mesh>
      </group>

      {/* Instrument Pods & RCS Thrusters */}
      {/* Front Optical Lens - Crimson Glow Eye */}
      <group position={[0, 0, 0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color={themeColors.surface} metalness={1} />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshStandardMaterial color={themeColors.glow} roughness={0} metalness={1} emissive={themeColors.glow} emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Side Equipment Boxes */}
      <mesh position={[0.3, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color={themeColors.surface} metalness={0.8} />
      </mesh>
      <mesh position={[-0.3, -0.2, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color={themeColors.surface} metalness={0.8} />
      </mesh>

      {/* Bottom Engine / Thrust Port - Crimson Glow */}
      <group position={[0, -0.4, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 0.2, 8]} />
          <meshStandardMaterial color={themeColors.surface} metalness={1} />
        </mesh>
        {/* Engine Glow */}
        <pointLight position={[0, -0.1, 0]} intensity={1} color={themeColors.crimson} distance={2} />
        <mesh position={[0, -0.05, 0]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial color={themeColors.crimson} emissive={themeColors.crimson} emissiveIntensity={5} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Status Indicators */}
      <mesh position={[0.2, 0.35, 0.36]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={themeColors.glow} emissive={themeColors.glow} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.2, 0.28, 0.36]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={themeColors.silver} emissive={themeColors.silver} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
