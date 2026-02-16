import React from 'react';
import { FadeInWhenVisible } from './FadeInWhenVisible';
import SkillMarquee from './SkillMarquee';
import { motion } from 'framer-motion';

const SkillSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#050505] border-y border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.05),transparent_70%)] pointer-events-none" />
      
      {/* Cyber Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(200, 16, 46, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 16, 46, 0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FadeInWhenVisible>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent-crimson/50" />
              <span className="text-xs font-mono text-accent-glow uppercase tracking-[0.5em]">Expertise</span>
              <div className="h-px w-8 bg-accent-crimson/50" />
            </div>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 tracking-tight">
              TECH <span className="text-accent-crimson">ECOSYSTEM</span>
            </h2>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.2}>
            <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              A fluid showcase of the modern technologies I use to build 
              high-performance digital solutions.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Enhanced Marquee */}
        <div className="relative group">
          {/* Decorative frame around marquee */}
          <div className="absolute -inset-4 border border-white/5 rounded-[2rem] pointer-events-none group-hover:border-accent-crimson/10 transition-colors duration-700" />
          
          <FadeInWhenVisible delay={0.3}>
            <SkillMarquee />
          </FadeInWhenVisible>
        </div>

        {/* Bottom Tagline */}
        <FadeInWhenVisible delay={0.5}>
          <div className="mt-16 flex flex-col items-center">
            <div className="flex gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent-crimson/20" />
              ))}
            </div>
            <p className="font-mono text-[10px] text-tertiary uppercase tracking-[0.4em]">
              Continuously evolving with the latest industry standards
            </p>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default SkillSection;
