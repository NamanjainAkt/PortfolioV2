import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DroneBody = () => {
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

const DroneArm = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
};

const Rotor = ({ position, spinDirection }: { position: [number, number, number]; spinDirection: number }) => {
  const rotorRef1 = useRef<THREE.Mesh>(null);
  const rotorRef2 = useRef<THREE.Mesh>(null);
  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    rotationRef.current += delta * 30 * spinDirection;
    if (rotorRef1.current) rotorRef1.current.rotation.y = rotationRef.current;
    if (rotorRef2.current) rotorRef2.current.rotation.y = rotationRef.current;
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

const LandingGear = () => {
  const positions: [number, number, number][] = [
    [0.25, -0.15, 0.2],
    [-0.25, -0.15, 0.2],
    [0.25, -0.15, -0.2],
    [-0.25, -0.15, -0.2]
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i}>
          <mesh position={pos}>
            <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[pos[0], -0.23, pos[2]]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

interface QuadcopterProps {
  mousePosition: { x: number; y: number };
}

const Quadcopter = ({ mousePosition }: QuadcopterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, z: 0 });
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const lerpFactor = 2.5 * delta;
    const maxTilt = 0.4;
    
    // Calculate target with a fixed offset (escort distance)
    const targetX = (mousePosition.x * 4) + 1.2;
    const targetY = (mousePosition.y * 2.5) + 0.8;

    // Smooth position update using refs
    positionRef.current.x = THREE.MathUtils.lerp(positionRef.current.x, targetX, lerpFactor);
    positionRef.current.y = THREE.MathUtils.lerp(positionRef.current.y, targetY, lerpFactor);

    const tiltX = -mousePosition.y * maxTilt;
    const tiltZ = -mousePosition.x * maxTilt;
    
    // Smooth rotation update
    rotationRef.current.x = THREE.MathUtils.lerp(rotationRef.current.x, tiltX, lerpFactor);
    rotationRef.current.z = THREE.MathUtils.lerp(rotationRef.current.z, tiltZ, lerpFactor);
    
    // Apply updates
    groupRef.current.position.x = positionRef.current.x;
    groupRef.current.position.y = positionRef.current.y + Math.sin(state.clock.elapsedTime * 2) * 0.002;
    groupRef.current.rotation.x = rotationRef.current.x;
    groupRef.current.rotation.z = rotationRef.current.z;
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

const DroneOverlay = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  // Throttled mouse handler using RAF
  const updateMousePosition = useCallback(() => {
    setMousePosition(mouseRef.current);
    rafRef.current = undefined;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Convert pixel coordinates to NDC (-1 to 1)
    mouseRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
    
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateMousePosition);
    }
  }, [updateMousePosition]);

  // Visibility check - pause rendering when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const container = document.getElementById('drone-container');
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div 
      id="drone-container"
      className="fixed inset-0 pointer-events-none z-[100] hidden md:block"
    >
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={isVisible ? 'always' : 'never'}
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
