import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import TypeScript from '@/icons/skills/TypeScript';
import ReactJs from '@/icons/skills/ReactJs';
import NodeJs from '@/icons/skills/NodeJs';
import Express from '@/icons/skills/Express';
import MongoDb from '@/icons/skills/MongoDb';
import JavaScript from '@/icons/skills/JavaScript';
import Jwt from '@/icons/skills/Jwt';
import ReactNative from '@/icons/skills/ReactNative';
import Expo from '@/icons/skills/Expo';
import OpenAi from '@/icons/skills/OpenAi';
import Claude from '@/icons/skills/Claude';
import Docker from '@/icons/skills/Docker';
import Git from '@/icons/skills/Git';
import Vercel from '@/icons/skills/Vercel';
import VsCode from '@/icons/skills/VsCode';
import AntigravityIde from '@/icons/skills/AntigravityIde';
import Postman from '@/icons/skills/Postman';
import SkillPad2D from './SkillPad2D';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allSkills = {
  core: [
    { icon: TypeScript, label: 'TypeScript' },
    { icon: ReactJs, label: 'React.js' },
    { icon: NodeJs, label: 'Node.js' },
    { icon: Express, label: 'Express' },
    { icon: MongoDb, label: 'MongoDB' },
    { icon: JavaScript, label: 'JavaScript' },
    { icon: Jwt, label: 'JWT' },
  ],
  mobile: [
    { icon: ReactNative, label: 'React Native' },
    { icon: Expo, label: 'Expo' },
  ],
  ai: [
    { icon: OpenAi, label: 'OpenAI API' },
    { icon: Claude, label: 'Claude API' },
  ],
  tools: [
    { icon: Docker, label: 'Docker' },
    { icon: Git, label: 'Git' },
    { icon: Vercel, label: 'Vercel' },
    { icon: VsCode, label: 'VS Code' },
    { icon: AntigravityIde, label: 'Antigravity IDE' },
    { icon: Postman, label: 'Postman' },
  ],
};

const categoryLabels: Record<string, { icon: typeof ReactJs; label: string; color: string }> = {
  core: { icon: ReactJs, label: ' Core Stack', color: '#FF6B6B' },
  mobile: { icon: ReactNative, label: ' Mobile', color: '#C8102E' },
  ai: { icon: OpenAi, label: ' AI Integration', color: '#FF6B6B' },
  tools: { icon: VsCode, label: ' Tools & Deployment', color: '#C8102E' },
};

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[90vw] h-[90vh] bg-background border border-border rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                boxShadow: '0 0 60px rgba(200, 16, 46, 0.2), inset 0 0 30px rgba(200, 16, 46, 0.05)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex justify-between items-center">
                <div>
                  <motion.h2 
                    className="font-serif text-2xl md:text-3xl font-bold text-primary"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Complete Skill Arsenal
                  </motion.h2>
                  <p className="text-secondary text-sm mt-1">
                    17 technologies across 4 categories
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-elevated rounded-lg transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                </motion.button>
              </div>

              <div className="overflow-y-auto h-[calc(90vh-80px)] p-6 md:p-8 custom-scrollbar">
                <div className="space-y-12">
                  <SkillCategory 
                    category="core" 
                    skills={allSkills.core} 
                    startIndex={0}
                  />
                  <SkillCategory 
                    category="mobile" 
                    skills={allSkills.mobile} 
                    startIndex={7}
                  />
                  <SkillCategory 
                    category="ai" 
                    skills={allSkills.ai} 
                    startIndex={9}
                  />
                  <SkillCategory 
                    category="tools" 
                    skills={allSkills.tools} 
                    startIndex={11}
                  />
                </div>
                <div className="h-8" />
              </div>

              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent-crimson/30 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-accent-crimson/30 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-accent-crimson/30 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent-crimson/30 rounded-br-2xl pointer-events-none" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SkillCategory: React.FC<{
  category: string;
  skills: Array<{ icon: typeof ReactJs; label: string }>;
  startIndex: number;
}> = ({ category, skills, startIndex }) => {
  const categoryInfo = categoryLabels[category];
  const CategoryIcon = categoryInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: startIndex * 0.02 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${categoryInfo.color}15` }}
        >
          <CategoryIcon className="w-5 h-5" style={{ color: categoryInfo.color }} />
        </div>
        <h3 className="text-xl font-bold text-primary">{categoryInfo.label}</h3>
        <div 
          className="flex-1 h-px ml-4"
          style={{ backgroundColor: `${categoryInfo.color}30` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {skills.map((skill, index) => (
          <SkillPad2D
            key={skill.label}
            icon={skill.icon}
            label={skill.label}
            index={startIndex + index}
            size="sm"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsModal;
