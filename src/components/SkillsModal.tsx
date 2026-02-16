import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Smartphone, Bot, Wrench } from 'lucide-react';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Skill {
  name: string;
  iconClass: string;
}

const allSkills: Record<string, Skill[]> = {
  core: [
    { name: 'TypeScript', iconClass: 'devicon-typescript-plain colored' },
    { name: 'React.js', iconClass: 'devicon-react-original colored' },
    { name: 'Node.js', iconClass: 'devicon-nodejs-plain colored' },
    { name: 'Express', iconClass: 'devicon-express-original colored' },
    { name: 'MongoDB', iconClass: 'devicon-mongodb-plain colored' },
    { name: 'JavaScript', iconClass: 'devicon-javascript-plain colored' },
    { name: 'Next.js', iconClass: 'devicon-nextjs-plain colored' },
    { name: 'Tailwind', iconClass: 'devicon-tailwindcss-original colored' },
  ],
  mobile: [
    { name: 'React Native', iconClass: 'devicon-react-original colored' },
    { name: 'Expo', iconClass: 'devicon-react-original colored' },
  ],
  ai: [
    { name: 'OpenAI API', iconClass: 'devicon-openapi-plain colored' },
    { name: 'Gemini API', iconClass: 'devicon-google-plain colored' },
  ],
  tools: [
    { name: 'Docker', iconClass: 'devicon-docker-plain colored' },
    { name: 'Git', iconClass: 'devicon-git-plain colored' },
    { name: 'GitHub', iconClass: 'devicon-github-original colored' },
    { name: 'VS Code', iconClass: 'devicon-vscode-plain colored' },
    { name: 'Postman', iconClass: 'devicon-postman-plain colored' },
    { name: 'Vercel', iconClass: 'devicon-vercel-original colored' },
  ],
};

const categoryLabels: Record<string, { icon: typeof Code2; label: string; color: string }> = {
  core: { icon: Code2, label: ' Core Stack', color: '#FF6B6B' },
  mobile: { icon: Smartphone, label: ' Mobile', color: '#C8102E' },
  ai: { icon: Bot, label: ' AI Integration', color: '#FF6B6B' },
  tools: { icon: Wrench, label: ' Tools & Deployment', color: '#C8102E' },
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
                    16+ technologies across 4 categories
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
                    startIndex={8}
                  />
                  <SkillCategory 
                    category="ai" 
                    skills={allSkills.ai} 
                    startIndex={10}
                  />
                  <SkillCategory 
                    category="tools" 
                    skills={allSkills.tools} 
                    startIndex={12}
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
  skills: Skill[];
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (startIndex + index) * 0.03 }}
            className="flex flex-col items-center p-4 bg-elevated/30 border border-border rounded-xl hover:border-accent-crimson/30 hover:bg-elevated/50 transition-all group cursor-pointer"
          >
            <div className="relative mb-3">
              <i className={`${skill.iconClass} text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110`} />
              <div className="absolute inset-0 bg-accent-crimson/0 group-hover:bg-accent-crimson/20 blur-xl rounded-full transition-all duration-300" />
            </div>
            <span className="text-xs md:text-sm text-secondary group-hover:text-primary transition-colors text-center font-mono">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsModal;
