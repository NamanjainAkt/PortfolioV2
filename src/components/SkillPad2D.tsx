import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SkillIconProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

interface SkillPad2DProps {
  icon: LucideIcon | React.ComponentType<SkillIconProps>;
  label: string;
  index: number;
  offset?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SkillPad2D: React.FC<SkillPad2DProps> = ({ 
  icon: IconComponent, 
  label, 
  index,
  offset = false,
  size = 'md'
}) => {
  // Responsive sizing
  const sizes = {
    sm: {
      container: 'w-[120px] h-[120px] md:w-[140px] md:h-[140px]',
      icon: 28,
      label: 'text-[10px]',
      corner: 'w-2 h-2',
      padding: 'p-2'
    },
    md: {
      container: 'w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px]',
      icon: 36,
      label: 'text-[11px] md:text-xs',
      corner: 'w-2.5 h-2.5 md:w-3 md:h-3',
      padding: 'p-3 md:p-4'
    },
    lg: {
      container: 'w-[160px] h-[160px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px]',
      icon: 44,
      label: 'text-xs md:text-sm',
      corner: 'w-3 h-3',
      padding: 'p-4'
    }
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center cursor-pointer group ${currentSize.container}`}
      style={{ marginTop: offset ? '20px' : '0' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Main square container */}
      <div 
        className={`relative w-full h-full ${currentSize.padding} transition-all duration-300`}
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          border: '1px solid rgba(200, 16, 46, 0.3)',
          boxShadow: '0 0 15px rgba(200, 16, 46, 0.15), inset 0 0 15px rgba(200, 16, 46, 0.03)',
        }}
      >
        {/* Hover glow overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(200, 16, 46, 0.4), inset 0 0 20px rgba(200, 16, 46, 0.1)',
            border: '1px solid rgba(200, 16, 46, 0.5)',
          }}
        />

        {/* Corner accents */}
        <div className={`absolute top-0 left-0 ${currentSize.corner} border-l-2 border-t-2 border-accent-crimson opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className={`absolute top-0 right-0 ${currentSize.corner} border-r-2 border-t-2 border-accent-crimson opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className={`absolute bottom-0 left-0 ${currentSize.corner} border-l-2 border-b-2 border-accent-crimson opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className={`absolute bottom-0 right-0 ${currentSize.corner} border-r-2 border-b-2 border-accent-crimson opacity-60 group-hover:opacity-100 transition-opacity`} />

        {/* Scanlines overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(200, 16, 46, 0.03) 2px,
              rgba(200, 16, 46, 0.03) 4px
            )`,
          }}
        />

        {/* Inner square with icon */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Icon container */}
          <motion.div 
            className="relative mb-2 md:mb-3"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
          >
            <IconComponent 
              size={currentSize.icon} 
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,107,107,0.8)]"
              color="currentColor"
            />
          </motion.div>

          {/* Label */}
          <div className="relative text-center">
            <span 
              className={`font-mono uppercase tracking-[0.15em] transition-colors duration-300 block ${currentSize.label}`}
              style={{ color: 'rgba(200, 16, 46, 0.8)' }}
            >
              <span className="group-hover:text-accent-glow transition-colors duration-300">
                {label}
              </span>
            </span>
            
            {/* Animated underline */}
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-accent-crimson group-hover:w-full transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-crimson to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-crimson to-transparent" />
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-accent-crimson to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-accent-crimson to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillPad2D;
