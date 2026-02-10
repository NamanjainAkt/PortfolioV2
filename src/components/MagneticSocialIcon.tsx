import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MagneticSocialIconProps {
  icon: LucideIcon;
  href: string;
  index: number;
  size?: number;
}

export const MagneticSocialIcon = ({ icon: Icon, href, index, size = 24 }: MagneticSocialIconProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center w-12 h-12 rounded-full text-secondary hover:text-accent-crimson transition-colors"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      custom={index}
    >
      <Icon size={size} />
      <motion.div
        className="absolute inset-0 rounded-full border border-accent-crimson/0"
        whileHover={{ 
          borderColor: 'rgba(200, 16, 46, 0.5)',
          scale: 1.1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};
