import React from 'react';
import { motion } from 'framer-motion';
import { TechIcon } from './TechIcon';

interface Skill {
  name: string;
  color?: string;
  iconName?: string;
}

const skillsRow1: Skill[] = [
  { name: 'React', color: '#61DAFB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Express', color: '#FFFFFF' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'Tailwind', color: '#06B6D4' },
];

const skillsRow2: Skill[] = [
  { name: 'Docker', color: '#2496ED' },
  { name: 'Git', color: '#F05032' },
  { name: 'GitHub', color: '#FFFFFF' },
  { name: 'VS Code', color: '#007ACC' },
  { name: 'Postman', color: '#FF6C37' },
  { name: 'React Native', color: '#61DAFB', iconName: 'React' },
  { name: 'Vercel', color: '#FFFFFF' },
  { name: 'HTML5', color: '#E34F26' },
];

const SkillItem = ({ skill }: { skill: Skill }) => {
  return (
    <div className="flex flex-col items-center mx-2 sm:mx-4 md:mx-6 group cursor-pointer py-4">
      <div className="relative">
        {/* Glass Card Container */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm transition-all duration-500 group-hover:bg-accent-crimson/10 group-hover:border-accent-crimson/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          {/* Internal Glow */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
            style={{ backgroundColor: skill.color || '#C8102E' }}
          />

          <TechIcon name={skill.iconName || skill.name} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-all duration-500 group-hover:scale-110" />

          {/* Corner Accents */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-accent-crimson/50 transition-colors" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-accent-crimson/50 transition-colors" />
        </div>
      </div>
      
      <span className="mt-4 text-[10px] md:text-xs text-tertiary group-hover:text-accent-crimson transition-all duration-300 font-mono uppercase tracking-[0.2em] font-bold">
        {skill.name}
      </span>
    </div>
  );
};

const SkillMarquee: React.FC = () => {
  const duplicatedRow1 = [...skillsRow1, ...skillsRow1, ...skillsRow1];
  const duplicatedRow2 = [...skillsRow2, ...skillsRow2, ...skillsRow2];

  return (
    <div className="w-full overflow-hidden space-y-4">
      {/* Row 1 - Scrolling Left */}
      <div className="relative overflow-hidden">
        {/* Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee-left whitespace-nowrap py-4">
          {duplicatedRow1.map((skill, index) => (
            <SkillItem key={`row1-${index}`} skill={skill} />
          ))}
        </div>
      </div>

      {/* Row 2 - Scrolling Right */}
      <div className="relative overflow-hidden">
        {/* Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee-right whitespace-nowrap py-4">
          {duplicatedRow2.map((skill, index) => (
            <SkillItem key={`row2-${index}`} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMarquee;
