import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const interval = 16;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      const rawProgress = Math.pow(t, 3);
      const newProgress = Math.min(Math.round(rawProgress * 100), 100);

      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsComplete(true);
        setTimeout(onComplete, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated gradient orbs - GPU accelerated */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
          animate={{
            x: ['-50%', '0%', '-50%'],
            y: ['-50%', '0%', '-50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200,16,46,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            willChange: 'transform',
          }}
          animate={{
            x: ['0%', '-30%', '0%'],
            y: ['0%', '-30%', '0%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Progress number */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            className="text-white font-serif text-[8rem] sm:text-[10rem] font-black tracking-tighter leading-none"
            style={{ willChange: 'transform' }}
          >
            {progress}
          </span>
          <span className="text-accent-crimson text-2xl sm:text-3xl font-black absolute -top-2 -right-8">
            %
          </span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 sm:w-80 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent-crimson rounded-full"
            style={{ 
              width: `${progress}%`,
              willChange: 'width',
            }}
            transition={{ duration: 0.1 }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '400%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Status text */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-accent-crimson font-mono text-[10px] tracking-[0.3em] uppercase">
            Initializing Experience
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 bg-white/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Flash effect on complete */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-white z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-8 sm:left-16 w-[1px] h-24 bg-gradient-to-b from-transparent via-accent-crimson/30 to-transparent" />
      <div className="absolute top-1/2 right-8 sm:right-16 w-[1px] h-24 bg-gradient-to-b from-transparent via-accent-crimson/30 to-transparent" />
    </motion.div>
  );
};

export default LoadingScreen;
