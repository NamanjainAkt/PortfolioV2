import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, FileCode, Server, Database, Smartphone, 
  Cloud, GitBranch, Container, Zap, Globe
} from 'lucide-react';
import SkillPad2D from './SkillPad2D';

// Top 10 skills for main page - grouped by category
const topSkills = [
  // Core Stack (5)
  { icon: FileCode, label: 'TypeScript', category: 'Core' },
  { icon: Code, label: 'React.js', category: 'Core' },
  { icon: Server, label: 'Node.js', category: 'Core' },
  { icon: Zap, label: 'Express', category: 'Core' },
  { icon: Database, label: 'MongoDB', category: 'Core' },
  // Mobile (2)
  { icon: Smartphone, label: 'React Native', category: 'Mobile' },
  { icon: Globe, label: 'Expo', category: 'Mobile' },
  // DevOps & Tools (3)
  { icon: Container, label: 'Docker', category: 'DevOps' },
  { icon: GitBranch, label: 'Git', category: 'DevOps' },
  { icon: Cloud, label: 'Vercel', category: 'DevOps' },
];

const SkillPadsGrid2D: React.FC = () => {
  // Split into two rows of 5
  const row1 = topSkills.slice(0, 5);
  const row2 = topSkills.slice(5, 10);

  return (
    <div className="w-full">
      {/* Grid Container - Responsive */}
      <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
        {/* Row 1 - Core Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {row1.map((skill, index) => (
            <SkillPad2D
              key={skill.label}
              icon={skill.icon}
              label={skill.label}
              index={index}
              offset={index % 2 === 1}
              size="md"
            />
          ))}
        </div>

        {/* Row 2 - Mobile & DevOps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {row2.map((skill, index) => (
            <SkillPad2D
              key={skill.label}
              icon={skill.icon}
              label={skill.label}
              index={index + 5}
              offset={index % 2 === 0}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="flex justify-center mt-8 md:mt-12 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-accent-crimson to-transparent" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent-crimson"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-accent-crimson to-transparent" />
      </motion.div>
    </div>
  );
};

export default SkillPadsGrid2D;
