import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export const TiltCard = ({ children, className = '', tiltAmount = 10 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${tiltAmount}deg`, `-${tiltAmount}deg`]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${tiltAmount}deg`, `${tiltAmount}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`${className}`}
    >
      <motion.div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
