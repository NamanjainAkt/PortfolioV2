import React from 'react';
import { motion } from 'framer-motion';
import TypeScript from '@/icons/skills/TypeScript';
import ReactJs from '@/icons/skills/ReactJs';
import NodeJs from '@/icons/skills/NodeJs';
import Express from '@/icons/skills/Express';
import MongoDb from '@/icons/skills/MongoDb';
import ReactNative from '@/icons/skills/ReactNative';
import Expo from '@/icons/skills/Expo';
import Docker from '@/icons/skills/Docker';
import Git from '@/icons/skills/Git';
import Vercel from '@/icons/skills/Vercel';
import JavaScript from '@/icons/skills/JavaScript';
import Jwt from '@/icons/skills/Jwt';
import SkillPad2D from './SkillPad2D';

// Top 12 skills for main page - grouped by category
const topSkills = [
  // Core Stack (6)
  { icon: JavaScript, label: 'JavaScript', category: 'Core' },
  { icon: TypeScript, label: 'TypeScript', category: 'Core' },
  { icon: ReactJs, label: 'React.js', category: 'Core' },
  { icon: NodeJs, label: 'Node.js', category: 'Core' },
  { icon: Express, label: 'Express', category: 'Core' },
  { icon: MongoDb, label: 'MongoDB', category: 'Core' },
  // Mobile & Auth (3)
  { icon: ReactNative, label: 'React Native', category: 'Mobile' },
  { icon: Expo, label: 'Expo', category: 'Mobile' },
  { icon: Jwt, label: 'JWT Auth', category: 'Security' },
  // DevOps & Tools (3)
  { icon: Docker, label: 'Docker', category: 'DevOps' },
  { icon: Git, label: 'Git', category: 'DevOps' },
  { icon: Vercel, label: 'Vercel', category: 'DevOps' },
];

const SkillPadsGrid2D: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:hidden">
        {topSkills.map((skill, index) => (
          <motion.div
            key={skill.label}
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <SkillPad2D
              icon={skill.icon}
              label={skill.label}
              index={index}
              size="md"
            />
          </motion.div>
        ))}
      </div>

      <div className="hidden lg:block columns-4 xl:columns-6" style={{ columnGap: '2rem' }}>
        {topSkills.map((skill, index) => (
          <motion.div
            key={skill.label}
            className="mb-12 break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex justify-center">
              <SkillPad2D
                icon={skill.icon}
                label={skill.label}
                index={index}
                size="md"
              />
            </div>
          </motion.div>
        ))}
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
