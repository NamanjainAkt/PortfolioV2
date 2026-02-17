import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float, Stars } from "@react-three/drei";
import { Satellite } from "../components/Satellite";

const Test = () => {
  return (
    <div className="h-screen w-full bg-[#050505] relative overflow-hidden">
      {/* Space Background Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,50,120,0.1),transparent_70%)]" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-full text-blue-500 font-mono animate-pulse">
          <div className="text-2xl mb-2 font-bold tracking-tighter">INITIALIZING_ORBIT...</div>
          <div className="text-xs opacity-50">SYNCING WITH DEEP_SPACE_NETWORK</div>
        </div>
      }>
        <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 2, 5], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
          
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Satellite position={[0, 0, 0]} scale={1} />
          </Float>
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.3} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
          
          <Environment preset="night" />
          
          <OrbitControls 
            makeDefault 
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
      
      {/* Satellite HUD */}
      <div className="absolute top-10 left-10 text-blue-400 font-mono space-y-4 pointer-events-none">
        <div className="border-l-2 border-blue-500 pl-4">
          <h1 className="text-2xl font-bold tracking-[0.2em] leading-none uppercase">SAT_LINK_v1</h1>
          <p className="text-[10px] text-gray-500 mt-1 tracking-widest uppercase">Orbital Status: Active</p>
        </div>
        
        <div className="text-[9px] uppercase tracking-tighter opacity-70">
          <p className="text-white">Telemetry:</p>
          <p className="text-gray-400">Lat: 42.3601° N</p>
          <p className="text-gray-400">Lon: 71.0589° W</p>
          <p className="text-blue-500 mt-2 animate-pulse">● Signal Strength: 100%</p>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-right text-gray-500 font-mono text-[9px] uppercase tracking-tighter pointer-events-none border-r border-blue-500/30 pr-4">
        <p>Component: Satellite.tsx</p>
        <p>Environment: Deep_Space_Sim</p>
        <p className="text-blue-400 mt-1 font-bold">Protocol: JSX_MODEL_RENDER</p>
      </div>

      {/* Decorative HUD corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-blue-500/20" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-blue-500/20" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-blue-500/20" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-blue-500/20" />
    </div>
  );
};

export default Test;
