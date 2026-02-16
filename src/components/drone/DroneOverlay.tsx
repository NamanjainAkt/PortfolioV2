import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DroneBody: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.05, 0.25]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#c8102e" emissive="#c8102e" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -0.05, -0.25]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#c8102e" emissive="#c8102e" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const DroneArm: React.FC<{ position: [number, number, number]; rotation: number }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
};

const Rotor: React.FC<{ position: [number, number, number]; spinDirection: number }> = ({ position, spinDirection }) => {
  const rotorRef1 = useRef<THREE.Mesh>(null);
  const rotorRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (rotorRef1.current) rotorRef1.current.rotation.y += delta * 30 * spinDirection;
    if (rotorRef2.current) rotorRef2.current.rotation.y += delta * 30 * spinDirection;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh ref={rotorRef1} position={[0, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.01, 0.04]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.3} transparent opacity={0.9} />
      </mesh>
      <mesh ref={rotorRef2} position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.5, 0.01, 0.04]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.3} transparent opacity={0.9} />
      </mesh>

      <pointLight position={[0, 0.1, 0]} color="#c8102e" intensity={0.2} distance={1} />
    </group>
  );
};

const LandingGear: React.FC = () => {
  return (
    <group>
      {[
        [0.25, -0.15, 0.2],
        [-0.25, -0.15, 0.2],
        [0.25, -0.15, -0.2],
        [-0.25, -0.15, -0.2]
      ].map((pos, i) => (
        <React.Fragment key={i}>
          <mesh position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[pos[0], -0.23, pos[2]]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

const Quadcopter: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const lerpFactor = 2.5 * delta;
    const maxTilt = 0.4;
    
    // Calculate target with a fixed offset (escort distance)
    // We add 1.2 to X and 0.8 to Y to keep it away from the cursor
    const targetX = (mousePosition.x * 4) + 1.2;
    const targetY = (mousePosition.y * 2.5) + 0.8;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpFactor);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, lerpFactor);

    const tiltX = -mousePosition.y * maxTilt;
    const tiltZ = -mousePosition.x * maxTilt;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, lerpFactor);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltZ, lerpFactor);
    
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
  });

  const armAngle = Math.PI / 4;

  return (
    <group ref={groupRef} scale={0.7}>
      <DroneBody />
      <DroneArm position={[0, 0, 0]} rotation={armAngle} />
      <DroneArm position={[0, 0, 0]} rotation={-armAngle} />
      <DroneArm position={[0, 0, 0]} rotation={Math.PI + armAngle} />
      <DroneArm position={[0, 0, 0]} rotation={Math.PI - armAngle} />

      <Rotor position={[0.55, 0.08, 0.55]} spinDirection={1} />
      <Rotor position={[-0.55, 0.08, 0.55]} spinDirection={-1} />
      <Rotor position={[0.55, 0.08, -0.55]} spinDirection={-1} />
      <Rotor position={[-0.55, 0.08, -0.55]} spinDirection={1} />

      <LandingGear />
    </group>
  );
};

const DroneOverlay: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert pixel coordinates to NDC (-1 to 1)
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] hidden md:block">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#c8102e" intensity={1} />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.3} penumbra={1} />
        
        <Float
          speed={1.5} 
          rotationIntensity={0.2} 
          floatIntensity={0.5}
        >
          <Quadcopter mousePosition={mousePosition} />
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default DroneOverlay;
