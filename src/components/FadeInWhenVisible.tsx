import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInWhenVisibleProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export const FadeInWhenVisible = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = '',
}: FadeInWhenVisibleProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : directions[direction].y,
        x: isInView ? 0 : directions[direction].x,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
