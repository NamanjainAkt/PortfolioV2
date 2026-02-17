import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import { WalkerExp } from "../components/WalkerExp";

const Test = () => {
  return (
    <div className="h-screen w-full bg-[#0A0A0A] relative overflow-hidden">
      {/* HUD Background Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.05),transparent_70%)]" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-full text-[#C8102E] font-mono animate-pulse">
          <div className="text-2xl mb-2 font-bold tracking-tighter">BOOTING_CORE_OS...</div>
          <div className="text-xs opacity-50">ESTABLISHING PROCEDURAL NEURAL LINK</div>
        </div>
      }>
        <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 2, 8], fov: 35 }}>
          <color attach="background" args={['#0A0A0A']} />
          
          <ambientLight intensity={0.65} />
          <hemisphereLight args={['#ffffff', '#120607', 0.5]} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
            color="#FF6B6B"
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C8102E" />
          <pointLight position={[0, 4, 4]} intensity={0.8} color="#ffffff" />
          <spotLight
            position={[0, 3, -6]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            castShadow
            color="#C8102E"
          />
          
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <WalkerExp position={[0, -1, 0]} scale={1.5} />
          </Float>
          
          <ContactShadows 
            position={[0, -1, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
          
          <Environment preset="city" />
          
          <OrbitControls 
            makeDefault 
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>
      
      {/* Enhanced HUD Components */}
      <div className="absolute top-10 left-10 text-[#C8102E] font-mono space-y-4 pointer-events-none">
        <div className="border-l-2 border-[#C8102E] pl-4">
          <h1 className="text-2xl font-bold tracking-[0.2em] leading-none uppercase">Walker_v2.0</h1>
          <p className="text-[10px] text-[#A0A0A0] mt-1 tracking-widest uppercase">Procedural Animation Active</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-[9px] uppercase tracking-tighter opacity-70">
          <div>
            <p className="text-white">Movement:</p>
            <p className="text-[#A0A0A0]">[W] Forward</p>
            <p className="text-[#A0A0A0]">[S] Backward</p>
          </div>
          <div>
            <p className="text-white">Interaction:</p>
            <p className="text-[#A0A0A0]">Mouse Look</p>
            <p className="text-[#A0A0A0]">Orbit Pan</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 text-[#C8102E] font-mono text-[10px] uppercase tracking-[0.3em] pointer-events-none">
        <span className="animate-pulse mr-2">●</span> Neural_Link_Connected
      </div>

      <div className="absolute bottom-10 right-10 text-right text-[#A0A0A0] font-mono text-[9px] uppercase tracking-tighter pointer-events-none border-r border-[#C8102E]/30 pr-4">
        <p>Model: public/model.glb</p>
        <p>Location: Sector_7G // Void_System</p>
        <p className="text-[#C8102E] mt-1 font-bold">Protocol: Procedural_Motion</p>
      </div>

      {/* Decorative HUD corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#C8102E]/20" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#C8102E]/20" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#C8102E]/20" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#C8102E]/20" />
    </div>
  );
};

export default Test;
