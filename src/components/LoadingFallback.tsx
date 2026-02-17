import React from 'react';
import { motion } from 'framer-motion';

const LoadingFallback = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Loader */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-accent-crimson/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-t-2 border-accent-crimson" />
          </motion.div>
          
          {/* Inner Ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-white/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-b-2 border-accent-glow" />
          </motion.div>
          
          {/* Center Dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-3 h-3 bg-accent-crimson rounded-full shadow-[0_0_20px_rgba(200,16,46,0.8)]" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <motion.p
            className="text-white font-mono text-xs tracking-[0.3em] uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Initializing Systems
          </motion.p>
          <div className="flex items-center justify-center gap-2">
            <motion.span
              className="w-1 h-1 bg-accent-crimson rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-1 h-1 bg-accent-crimson rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1 h-1 bg-accent-crimson rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 16, 46, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 16, 46, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default LoadingFallback;
