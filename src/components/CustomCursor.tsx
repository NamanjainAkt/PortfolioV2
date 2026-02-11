import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorXSpring = useSpring(0, { damping: 20, stiffness: 800, mass: 0.1 });
  const cursorYSpring = useSpring(0, { damping: 20, stiffness: 800, mass: 0.1 });

  const ringXSpring = useSpring(0, { damping: 30, stiffness: 200, mass: 0.5 });
  const ringYSpring = useSpring(0, { damping: 30, stiffness: 200, mass: 0.5 });

  const rafIdRef = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const updateCursor = () => {
      cursorXSpring.set(mousePosRef.current.x);
      cursorYSpring.set(mousePosRef.current.y);
      ringXSpring.set(mousePosRef.current.x);
      ringYSpring.set(mousePosRef.current.y);
      rafIdRef.current = requestAnimationFrame(updateCursor);
    };

    const moveCursor = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      setIsHovering(!!isInteractive);
    };

    rafIdRef.current = requestAnimationFrame(updateCursor);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorXSpring, cursorYSpring, ringXSpring, ringYSpring]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-accent-crimson rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent-crimson/50 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 0.3,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />

      <style>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};
