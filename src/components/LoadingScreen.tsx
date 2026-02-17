import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useDynamicLoadingConfig } from '../hooks/useDynamicLoadingConfig';

interface LoadingScreenProps {
  onComplete: () => void;
}

// 1. VOLUMETRIC ACCRETION DISK: Dynamic particle count based on device performance
interface AccretionPointsProps {
  progress: number;
  count: number;
  rotationSpeed: number;
  particleSize: number;
}

const AccretionPoints = ({ progress, count, rotationSpeed, particleSize }: AccretionPointsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = (Math.random() - 0.5) * 0.2 * (1 / r);

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
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate disk and pulsate with dynamic speed
      pointsRef.current.rotation.y += rotationSpeed + (progress / 100) * (rotationSpeed * 4);
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
        size={particleSize}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 2. LIGHT SHREDDER: Dynamic beam count
interface LightBeamProps {
  index: number;
}

const LightBeam = ({ index }: LightBeamProps) => {
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

interface SingularityMasterpieceProps {
  progress: number;
  isExploding: boolean;
  enableGlow: boolean;
  enableRings: boolean;
}

const SingularityMasterpiece = ({ progress, isExploding, enableGlow, enableRings }: SingularityMasterpieceProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
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

      {/* The Glow Halo - conditionally rendered */}
      {enableGlow && (
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
      )}

      {/* Atmospheric Scattering Rings - conditionally rendered */}
      {enableRings && [...Array(3)].map((_, i) => (
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

      {/* Fallback simple glow when glow is disabled */}
      {!enableGlow && (
        <Sphere args={[2.05, 32, 32]}>
          <meshBasicMaterial
            color="#C8102E"
            transparent
            opacity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
};

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const { config, quality, startMonitoring } = useDynamicLoadingConfig();
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    console.log(`[LoadingScreen] Initial quality level: ${quality}`);
    console.log(`[LoadingScreen] Config:`, {
      particles: config.particleCount,
      beams: config.lightBeamCount,
      stars: config.starCount,
      quality: quality
    });
  }, [config, quality]);

  useEffect(() => {
    // Start performance monitoring
    startMonitoring();

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
  }, [onComplete, startMonitoring]);

  // Debug: Press 'D' to toggle debug info
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Debug Info Overlay */}
      {showDebug && (
        <div className="absolute top-4 left-4 z-[300] bg-black/80 border border-accent-crimson/30 rounded-lg p-4 font-mono text-xs text-accent-crimson">
          <div>Quality: {quality.toUpperCase()}</div>
          <div>Particles: {config.particleCount}</div>
          <div>Beams: {config.lightBeamCount}</div>
          <div>Stars: {config.starCount}</div>
          <div>Glow: {config.enableGlow ? 'ON' : 'OFF'}</div>
          <div>Rings: {config.enableRings ? 'ON' : 'OFF'}</div>
          <div className="text-white/50 mt-2">Press 'D' to hide</div>
        </div>
      )}

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 4, 18], fov: 40 }} dpr={config.dpr} frameloop="demand">
          <color attach="background" args={['#000']} />

          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={30} color="#C8102E" />

          <Stars radius={100} depth={50} count={config.starCount} factor={6} saturation={0} fade speed={3} />

          <SingularityMasterpiece
            progress={progress}
            isExploding={isExploding}
            enableGlow={config.enableGlow}
            enableRings={config.enableRings}
          />
          <AccretionPoints
            progress={progress}
            count={config.particleCount}
            rotationSpeed={config.rotationSpeed}
            particleSize={config.particleSize}
          />

          {/* LIGHT SHREDDING BEAMS - Dynamic count */}
          {[...Array(config.lightBeamCount)].map((_, i) => (
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
