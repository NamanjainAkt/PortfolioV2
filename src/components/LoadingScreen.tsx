import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [isReady, setIsReady] = useState(false);

  const loadingMessages = useMemo(() => [
    'Initializing reactor core',
    'Calibrating systems',
    'Loading modules',
    'Synchronizing data',
    'Powering up',
    'Ready'
  ], []);

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      const messageIndex = Math.min(
        Math.floor((newProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setLoadingText(loadingMessages[messageIndex]);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [loadingMessages]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,16,46,0.15)_0%,_transparent_70%)]" />
        
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 16, 46, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 16, 46, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-crimson rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '110%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Arc Reactor Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Arc Reactor Rings */}
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200,16,46,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Rotating Outer Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-accent-crimson/30"
            style={{
              borderStyle: 'dashed',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Segmented Ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-transparent"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(200,16,46,0.8) 30deg, transparent 60deg, transparent 120deg, rgba(200,16,46,0.8) 150deg, transparent 180deg, transparent 240deg, rgba(200,16,46,0.8) 270deg, transparent 300deg, transparent 360deg)',
              WebkitMask: 'radial-gradient(circle, transparent 65%, black 66%, black 68%, transparent 69%)',
              mask: 'radial-gradient(circle, transparent 65%, black 66%, black 68%, transparent 69%)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner Rotating Ring with Dots */}
          <motion.div
            className="absolute inset-8 rounded-full border border-accent-crimson/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-accent-crimson rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(calc(50% + 100px)) translate(-50%, -50%)`,
                }}
              />
            ))}
          </motion.div>

          {/* Inner Glow Ring */}
          <motion.div
            className="absolute inset-16 rounded-full border-2 border-accent-glow/50"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255,107,107,0.3), inset 0 0 20px rgba(255,107,107,0.1)',
                '0 0 40px rgba(255,107,107,0.6), inset 0 0 40px rgba(255,107,107,0.2)',
                '0 0 20px rgba(255,107,107,0.3), inset 0 0 20px rgba(255,107,107,0.1)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Center Core - NJ Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 100 }}
            >
              {/* Core Glow */}
              <motion.div
                className="absolute inset-0 bg-accent-crimson rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Core Background */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-accent-crimson/20 to-accent-forge/40 backdrop-blur-sm border border-accent-crimson/50 flex items-center justify-center overflow-hidden">
                {/* Animated lines inside core */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(200,16,46,0.5) 10px, rgba(200,16,46,0.5) 12px)',
                  }}
                  animate={{ x: [0, 22] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />

                {/* NJ Text */}
                <div className="relative z-10">
                  <motion.h1
                    className="text-5xl md:text-7xl font-black font-serif tracking-tighter text-white"
                    style={{
                      textShadow: '0 0 30px rgba(200,16,46,0.8), 0 0 60px rgba(200,16,46,0.4)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    NJ
                  </motion.h1>

                  {/* Glitch Layer */}
                  <motion.span
                    className="absolute top-0 left-0 text-5xl md:text-7xl font-black font-serif tracking-tighter text-accent-crimson"
                    style={{
                      textShadow: '2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.8, 0, 0.8, 0],
                      x: [-3, 3, -2, 2, 0],
                    }}
                    transition={{ 
                      delay: 1.5,
                      duration: 0.15,
                      repeat: 4,
                      repeatDelay: 0.3,
                    }}
                    aria-hidden
                  >
                    NJ
                  </motion.span>
                </div>
              </div>

              {/* Core Ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-accent-crimson/60"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Energy Spikes */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                className="absolute w-0.5 bg-gradient-to-t from-accent-crimson to-transparent"
                style={{
                  height: '30px',
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'top center',
                  transform: `rotate(${i * 30}deg) translateY(-160px)`,
                }}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scaleY: [0.5, 1, 0.5],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </div>

        {/* Name & Title */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.h2 
            className="text-xl md:text-2xl text-white font-serif tracking-[0.3em] uppercase"
            style={{
              textShadow: '0 0 20px rgba(200,16,46,0.5)',
            }}
          >
            {'NAMAN JAIN'.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.05 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            className="text-xs md:text-sm text-tertiary mt-2 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Full Stack Developer
          </motion.p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="w-full max-w-sm mt-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-secondary font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-crimson rounded-full animate-pulse" />
              {loadingText}
              <span className="animate-pulse">...</span>
            </span>
            <span className="text-xs text-accent-crimson font-mono font-bold">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-elevated/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-crimson via-accent-glow to-accent-crimson rounded-full relative"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              style={{
                boxShadow: '0 0 20px rgba(200, 16, 46, 0.8)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-tertiary font-mono uppercase tracking-wider">
              System Status
            </span>
            <motion.span 
              className="text-[10px] font-mono uppercase tracking-wider"
              animate={{ 
                color: isReady ? '#22c55e' : '#C8102E'
              }}
            >
              {isReady ? 'Online' : 'Booting'}
            </motion.span>
          </div>
        </motion.div>

        {/* Bottom Tech Details */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-crimson/50 to-transparent" />
          <span className="text-[10px] text-tertiary font-mono tracking-widest">
            ARC REACTOR v1.0 // STARK INDUSTRIES
          </span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-crimson/50 to-transparent" />
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-accent-crimson/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-accent-crimson/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-accent-crimson/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-accent-crimson/30" />
    </motion.div>
  );
};

export default LoadingScreen;
