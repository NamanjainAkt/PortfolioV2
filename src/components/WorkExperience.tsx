import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Terminal, Calendar, MapPin, Target, Zap, Circle } from 'lucide-react';
import { FadeInWhenVisible } from './FadeInWhenVisible';

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  type: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "Flick",
    location: "Raipur, Chhattisgarh, India (Remote)",
    period: "Nov 2025 - Present",
    isCurrent: true,
    type: "Internship",
    description:
      "Working as a Full Stack Developer Intern, building and maintaining scalable MERN-based applications in a remote agile environment.",
    achievements: [
      "Developed and shipped full-stack features using the MERN stack.",
      "Collaborated with cross-functional remote teams following agile practices.",
      "Implemented REST APIs and integrated frontend with backend services.",
      "Contributed to improving application performance and maintainability."
    ],
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript"]
  },
  {
    id: 2,
    role: "MERN Stack Developer",
    company: "Tellis Technologies Pvt Ltd",
    location: "West Bengal, India (Remote)",
    period: "Nov 2025",
    isCurrent: false,
    type: "Internship",
    description:
      "Worked as a MERN Stack Developer Intern, focusing on full-stack development and API-driven applications.",
    achievements: [
      "Built end-to-end MERN stack features for internal products.",
      "Designed MongoDB schemas and implemented backend logic.",
      "Integrated REST APIs with responsive React interfaces.",
      "Worked in a remote development workflow with version control."
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js"]
  }
];


const ExperienceItem = ({ exp, index }: { exp: Experience; index: number }) => {
  return (
    <div className="relative pl-8 md:pl-12 pb-12 last:pb-0">
      {/* Timeline Node */}
      <div className="absolute left-0 top-0 mt-1.5 -translate-x-1/2 z-20">
        <div className="w-4 h-4 rounded-full bg-[#050505] border-2 border-white/10 flex items-center justify-center">
          <motion.div 
            whileInView={{ scale: [0, 1.2, 1] }}
            className={`w-1.5 h-1.5 rounded-full ${exp.isCurrent ? 'bg-accent-crimson shadow-[0_0_10px_rgba(200,16,46,0.8)]' : 'bg-tertiary'}`} 
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
      >
        <div className="relative bg-elevated/30 backdrop-blur-sm border border-white/5 rounded-xl p-5 md:p-6 transition-all duration-300 group-hover:border-accent-crimson/20 group-hover:bg-elevated/50">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-white group-hover:text-accent-crimson transition-colors">
                {exp.role}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-accent-glow font-mono text-xs uppercase tracking-wider">{exp.company}</span>
                <span className="text-white/10 text-[10px]">•</span>
                <span className="text-[10px] text-tertiary font-mono uppercase">{exp.type}</span>
              </div>
            </div>
            <div className="flex flex-col md:items-end">
              <div className="flex items-center gap-2 text-accent-crimson font-mono text-xs font-bold whitespace-nowrap">
                <Calendar size={12} />
                {exp.period}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-tertiary mt-1">
                <MapPin size={10} />
                {exp.location}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-secondary text-xs md:text-sm leading-relaxed border-l-2 border-accent-crimson/20 pl-4">
              {exp.description}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {exp.achievements.map((ach, i) => (
                <li key={i} className="flex gap-2.5 text-[11px] md:text-xs text-secondary group-hover:text-primary transition-colors leading-snug">
                  <Target size={12} className="text-accent-crimson mt-0.5 shrink-0" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>

            {/* Tech Stack - Compact */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {exp.technologies.map(tech => (
                <span key={tech} className="px-2 py-0.5 text-[9px] font-mono text-tertiary bg-white/[0.02] border border-white/5 rounded transition-all group-hover:border-accent-crimson/30 group-hover:text-secondary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const WorkExperience: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-16 md:py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(200, 16, 46, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 16, 46, 0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="text-left">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-accent-crimson" />
                <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.4em]">Chronology</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-none uppercase">
                CAREER <span className="text-accent-crimson">PATH</span>
              </h2>
            </FadeInWhenVisible>
          </div>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-tertiary text-sm font-light italic max-w-xs md:text-right border-l md:border-l-0 md:border-r border-accent-crimson/20 px-4">
              "Building milestones, one commit at a time."
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Timeline Container */}
        <div className="relative ml-2 md:ml-4">
          {/* Animated Timeline Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5">
            <motion.div 
              style={{ scaleY }}
              className="absolute top-0 left-0 right-0 origin-top bg-accent-crimson shadow-[0_0_10px_rgba(200,16,46,0.5)]"
            />
          </div>

          {/* Experience List */}
          <div className="relative z-10">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>

        {/* Footer Accent */}
        <div className="mt-12 flex justify-start pl-2 md:pl-4">
          <div className="flex flex-col items-center">
            <div className="w-1 h-1 rounded-full bg-accent-crimson animate-pulse" />
            <div className="w-px h-12 bg-gradient-to-b from-accent-crimson to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
