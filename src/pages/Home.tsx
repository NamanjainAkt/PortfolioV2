import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Server, Layers, Github, Linkedin, Mail, Twitter, FileText, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { TiltCard } from '../components/TiltCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { MagneticSocialIcon } from '../components/MagneticSocialIcon';
import SkillPadsGrid2D from '../components/SkillPadsGrid2D';
import SkillsModal from '../components/SkillsModal';
import WorkExperience from '../components/WorkExperience';
import ProjectCarousel3D from '../components/ProjectCarousel3D';
import { Project } from '../types/project';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?limit=5&orderBy=displayOrder');
        const data = await res.json();
        if (Array.isArray(data)) {
            setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Native Developer"
  ];

  const skills = [
    { name: "React", icon: Code },
    { name: "Node.js", icon: Server },
    { name: "Database", icon: Database },
    { name: "System Design", icon: Layers },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/naman-jain-akt/" },
    { icon: Github, href: "https://github.com/namanjainakt/" },
    { icon: Mail, href: "mailto:namanjainakt@gmail.com" },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center container mx-auto px-4 relative">
        <ParticleBackground />
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-4xl text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(200,16,46,0.3)]"
          >
            Na<span className="text-accent-crimson drop-shadow-[0_0_25px_rgba(200,16,46,0.6)]">man</span> Jain
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-3xl font-mono text-white mb-6 h-8"
          >
            I'm a <Typewriter words={roles} typingSpeed={80} deletingSpeed={50} pauseTime={2000} className="text-accent-crimson" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            I build <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded text-sm font-medium">Scalable</span>, high-performance AI applications and modern web solutions with a focus on exceptional <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded text-sm font-medium">User Experience</span> and robust <span className="text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded text-sm font-medium">System Design</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <skill.icon size={20} />
                <span className="font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FileText size={18} /> Resume / CV
            </motion.button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-3 border border-border text-primary font-bold rounded hover:bg-elevated transition-colors flex items-center gap-2"
              >
                <Mail size={18} /> Get in touch
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-amber-700/20 text-amber-500 border border-amber-700/50 font-bold rounded hover:bg-amber-700/30 transition-colors flex items-center gap-2"
            >
              <Calendar size={18} /> Schedule Call
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex justify-center gap-4 text-secondary"
          >
            {socialLinks.map((social, index) => (
              <MagneticSocialIcon 
                key={index}
                icon={social.icon}
                href={social.href}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack - Holographic Skill Pads */}
      <section className="py-20 md:py-32 bg-surface/30 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <FadeInWhenVisible>
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono text-accent-glow uppercase tracking-[0.3em] border border-accent-crimson/30 rounded-full bg-accent-crimson/5">
                Tech Stack
              </span>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                Skills
              </h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <p className="text-secondary text-base md:text-lg max-w-xl mx-auto mb-2">
                My core technologies for full-stack + mobile development
              </p>
            </FadeInWhenVisible>
          </div>

          {/* Skill Pads Grid */}
          <FadeInWhenVisible delay={0.3}>
            <SkillPadsGrid2D />
          </FadeInWhenVisible>
          
          {/* View All Skills Button */}
          <FadeInWhenVisible delay={0.6}>
            <div className="flex justify-center mt-12 md:mt-16">
              <motion.button
                onClick={() => setIsSkillsModalOpen(true)}
                className="group flex items-center gap-3 px-8 py-4 bg-elevated border border-accent-crimson/30 rounded-lg hover:border-accent-crimson hover:bg-accent-crimson/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-mono text-sm text-secondary group-hover:text-primary transition-colors">
                  &lt;&gt;
                </span>
                <span className="text-secondary group-hover:text-primary transition-colors font-medium">
                  View all 20+ skills
                </span>
                <ChevronRight 
                  size={18} 
                  className="text-accent-crimson group-hover:translate-x-1 transition-transform" 
                />
              </motion.button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Work Experience */}
      <WorkExperience />

      {/* Skills Modal */}
      <SkillsModal 
        isOpen={isSkillsModalOpen} 
        onClose={() => setIsSkillsModalOpen(false)} 
      />

      {/* Featured Projects */}
      <section className="py-20 md:py-32 bg-surface/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono text-accent-glow uppercase tracking-[0.3em] border border-accent-crimson/30 rounded-full bg-accent-crimson/5">
                Portfolio
              </span>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                Featured Work
              </h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
                A selection of projects that demonstrate my ability to solve complex problems
              </p>
            </FadeInWhenVisible>
          </div>

          {loading ? (
             <div className="text-center py-20 text-secondary">Loading projects...</div>
          ) : (
            <ProjectCarousel3D projects={projects} />
          )}

          <FadeInWhenVisible delay={0.4}>
            <div className="mt-16 text-center">
              <Link 
                to="/projects" 
                className="inline-flex items-center px-8 py-4 border border-border rounded-lg hover:border-accent-crimson hover:text-accent-crimson transition-colors font-medium group"
              >
                View all projects 
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};

export default Home;
