import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface LoadingScreenProps {
  onComplete: () => void;
}

// 1. VOLUMETRIC ACCRETION DISK: 5000+ particles creating a "fiery" mist
const AccretionPoints = ({ progress }: { progress: number }) => {
  const count = 5000;
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = (Math.random() - 0.5) * 0.2 * (1 / r); // Thinner near edges

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient: White hot center to Crimson edge
      const color = new THREE.Color();
      const lerpVal = (r - 2.5) / 5;
      color.lerpColors(new THREE.Color("#fff"), new THREE.Color("#C8102E"), lerpVal);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate disk and pulsate
      pointsRef.current.rotation.y += 0.02 + (progress / 100) * 0.08;
      // Slight tilt wobble
      pointsRef.current.rotation.x = Math.PI / 2.2 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 2. LIGHT SHREDDER: Individual light beams being sucked in and stretched
const LightBeam = ({ index }: { index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [data] = useState(() => ({
    speed: 0.1 + Math.random() * 0.2,
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40
    ),
    color: index % 3 === 0 ? "#ffffff" : "#C8102E"
  }));

  useFrame(() => {
    if (meshRef.current) {
      const dist = meshRef.current.position.length();
      
      // Intense Gravitational Pull
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), data.speed * (10 / (dist + 1)));

      // SPAGHETTIFICATION: Shredding into thin lines
      if (dist < 8) {
        const stretch = 1 + (8 - dist) * 2;
        meshRef.current.scale.set(0.05, stretch, 0.05);
        meshRef.current.lookAt(0, 0, 0);
        meshRef.current.rotateX(Math.PI / 2);
      }

      // Respawn
      if (dist < 0.2) {
        meshRef.current.position.copy(data.pos);
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={data.pos}>
      <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
      <meshBasicMaterial color={data.color} transparent opacity={0.6} />
    </mesh>
  );
};

const SingularityMasterpiece = ({ progress, isExploding }: { progress: number; isExploding: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      if (isExploding) {
        groupRef.current.scale.lerp(new THREE.Vector3(60, 60, 60), 0.15);
      } else {
        const s = 1 + (progress / 100) * 0.4;
        groupRef.current.scale.set(s, s, s);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* The Central Void (Event Horizon) */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#000" />
      </Sphere>

      {/* The Glow Halo */}
      <Sphere args={[2.05, 64, 64]}>
        <MeshDistortMaterial 
          color="#C8102E" 
          speed={10} 
          distort={0.4} 
          emissive="#C8102E"
          emissiveIntensity={5}
          toneMapped={false}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Atmospheric Scattering Rings */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2.1, 0.1 * i, 0]}>
          <ringGeometry args={[2.1 + i * 0.1, 8 - i, 128]} />
          <meshBasicMaterial 
            color="#C8102E" 
            transparent 
            opacity={0.1 / (i + 1)} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 second blast
    const interval = 16;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      // Exponential power curve for aggressive finish
      const rawProgress = Math.pow(t, 5);
      const newProgress = Math.min(Math.round(rawProgress * 100), 100);
      
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsExploding(true);
        setTimeout(() => setShowFlash(true), 200);
        setTimeout(onComplete, 800);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 4, 18], fov: 40 }} dpr={[1, 2]}>
          <color attach="background" args={['#000']} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={30} color="#C8102E" />

          <Stars radius={100} depth={50} count={4000} factor={6} saturation={0} fade speed={3} />
          
          <SingularityMasterpiece progress={progress} isExploding={isExploding} />
          <AccretionPoints progress={progress} />

          {/* LIGHT SHREDDING BEAMS */}
          {[...Array(80)].map((_, i) => (
            <LightBeam key={i} index={i} />
          ))}

          {isExploding && (
            <pointLight position={[0, 0, 0]} intensity={300} color="#fff" />
          )}
        </Canvas>
      </div>

      {/* Minimalist HUD */}
      {!showFlash && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-24 pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-accent-crimson font-mono text-[8px] tracking-[1.5em] uppercase opacity-70">
              Dimensional Convergence
            </span>
          </div>

          <div className="relative">
            <motion.span 
              className="text-white font-serif text-[12rem] font-black tracking-tighter leading-none"
              animate={{ 
                textShadow: progress > 85 ? '0 0 80px #C8102E' : '0 0 20px rgba(255,255,255,0.1)',
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              {progress}
            </motion.span>
            <span className="text-accent-crimson text-4xl font-black absolute top-4 -right-16">%</span>
          </div>

          <div className="w-64 flex flex-col items-center gap-4">
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-accent-crimson shadow-[0_0_15px_#C8102E]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/30 font-mono text-[7px] tracking-[0.8em] uppercase">
              Event Horizon Status: CRITICAL
            </span>
          </div>
        </div>
      )}

      {/* Professional Sharp White Flash */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute inset-0 z-[200] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {/* Letterbox Bars */}
      <div className="absolute top-0 left-0 w-full h-[12vh] bg-black z-30" />
      <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-black z-30" />
      
      {/* Decorative Lines */}
      <div className="absolute top-1/2 left-10 w-[1px] h-32 -translate-y-1/2 bg-accent-crimson/20 z-30" />
      <div className="absolute top-1/2 right-10 w-[1px] h-32 -translate-y-1/2 bg-accent-crimson/20 z-30" />
    </motion.div>
  );
};

export default LoadingScreen;
