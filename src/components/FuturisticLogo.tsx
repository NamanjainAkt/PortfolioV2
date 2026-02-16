import React from 'react';

interface FuturisticLogoProps {
  scrolled?: boolean;
}

const FuturisticLogo: React.FC<FuturisticLogoProps> = ({ scrolled = false }) => {
  return (
    <div className="group flex items-center gap-3 select-none py-1">
      {/* Icon portion */}
      <div className="relative flex items-center justify-center">
        {/* Modern geometric frame */}
        <div className={`
          border-[1.5px] border-white/20 transition-all duration-700 ease-out
          group-hover:border-accent-crimson group-hover:rotate-[135deg]
          ${scrolled ? 'w-8 h-8 rounded-md' : 'w-10 h-10 rounded-sm'}
        `} />
        
        {/* Initials */}
        <div className={`
          absolute inset-0 font-serif font-black tracking-tighter flex items-center justify-center transition-all duration-500
          ${scrolled ? 'text-lg' : 'text-2xl'}
        `}>
          <span className="text-primary group-hover:text-white transition-colors duration-300">N</span>
          <span className="text-accent-crimson">J</span>
        </div>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-accent-crimson/0 group-hover:bg-accent-crimson/10 blur-xl transition-all duration-500 rounded-full pointer-events-none" />
      </div>

      {/* Text portion */}
      <div className={`
        flex flex-col justify-center transition-all duration-500 ease-in-out overflow-hidden
        ${scrolled ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-xs opacity-100 translate-x-0'}
      `}>
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-extrabold uppercase tracking-widest text-primary">
            NAMAN
          </span>
          <span className="font-serif text-xl font-light uppercase tracking-widest text-secondary group-hover:text-accent-crimson transition-colors duration-300">
            JAIN
          </span>
        </div>
        <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-accent-crimson to-transparent transition-all duration-700 ease-in-out" />
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-tertiary mt-0.5">
          Software Engineer
        </span>
      </div>
    </div>
  );
};

export default FuturisticLogo;
