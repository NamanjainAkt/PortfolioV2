import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface SpotlightProps {
  className?: string;
  size?: number;
}

export const Spotlight = ({ className = '', size = 400 }: SpotlightProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device has fine pointer (not touch)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, size]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed pointer-events-none z-0 ${className}`}
      style={{
        x,
        y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(200, 16, 46, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  );
};
