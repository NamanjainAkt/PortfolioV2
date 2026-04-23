import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, Cpu } from 'lucide-react';
import Typewriter from '../components/Typewriter';
import { MagneticSocialIcon } from '../components/MagneticSocialIcon';
import SkillSection from '../components/SkillSection';
import WorkExperience from '../components/WorkExperience';
import ProjectCarouselRevamp from '../components/ProjectCarouselRevamp';
import { Project } from '../types/project';
import DroneOverlay from '../components/drone/DroneOverlay';

// Static data moved outside component to prevent recreation on render
const ROLES = [
  "Software Architect",
  "Full Stack Engineer",
  "System Designer",
  "Product Visionary"
];

const SOCIAL_LINKS = [
  { icon: Linkedin, href: "https://linkedin.com/in/naman-jain-akt/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/namanjainakt/", label: "GitHub" },
  { icon: Mail, href: "mailto:namanjainakt@gmail.com", label: "Email" },
];

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, rgba(200,16,46,0.8), transparent),
                            radial-gradient(2px 2px at 40% 70%, rgba(200,16,46,0.6), transparent),
                            radial-gradient(1px 1px at 60% 20%, rgba(200,16,46,0.7), transparent),
                            radial-gradient(2px 2px at 80% 50%, rgba(200,16,46,0.5), transparent),
                            radial-gradient(1px 1px at 10% 80%, rgba(200,16,46,0.6), transparent),
                            radial-gradient(2px 2px at 90% 10%, rgba(200,16,46,0.4), transparent),
                            radial-gradient(1px 1px at 50% 90%, rgba(200,16,46,0.5), transparent),
                            radial-gradient(2px 2px at 30% 50%, rgba(200,16,46,0.7), transparent)`,
          backgroundSize: '200px 200px',
          animation: 'twinkle 8s ease-in-out infinite alternate',
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: translateY(0); }
          100% { opacity: 0.6; transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Memoize fetch function
  const fetchProjects = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Memoize scroll handler
  const handleScrollToProjects = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  // Memoize social links rendering
  const socialIcons = useMemo(() => (
    SOCIAL_LINKS.map((social, index) => (
      <MagneticSocialIcon 
        key={social.label}
        icon={social.icon}
        href={social.href}
        index={index}
      />
    ))
  ), []);

  return (
    <div className="pt-0 bg-[#050505]">
      <DroneOverlay />
      
      <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] z-1" />

        <motion.div 
          className="container mx-auto px-4 relative z-10"
        >
          <div className="flex flex-col items-center">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-crimson/10 border border-accent-crimson/20 mb-8 backdrop-blur-md"
              style={{ willChange: 'transform' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-crimson"></span>
              </span>
              <span className="text-[10px] font-mono text-accent-crimson tracking-[0.3em] uppercase">
                Systems Online // v2.0
              </span>
            </motion.div>

            <div className="relative mb-6">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-serif font-black tracking-tighter text-white uppercase leading-[0.8]"
                style={{ willChange: 'transform' }}
              >
                NAMAN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-crimson via-accent-glow to-accent-crimson">JAIN</span>
              </motion.h1>
              
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block h-64 w-[1px] bg-gradient-to-b from-transparent via-accent-crimson to-transparent opacity-50" />
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block h-64 w-[1px] bg-gradient-to-b from-transparent via-accent-crimson to-transparent opacity-50" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 mb-10"
            >
              <div className="flex items-center gap-2 text-secondary font-mono text-sm md:text-lg">
                <Cpu size={16} className="text-accent-crimson" />
                <Typewriter words={ROLES} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="flex gap-4">
                <motion.a
                  href="/Naman_s_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-5 py-3 sm:px-8 sm:py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-none overflow-hidden"
                  style={{ willChange: 'transform' }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Resume <FileText size={14} />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-accent-crimson translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                </motion.a>

                <motion.button
                  data-cal-link="naman-jain-akt/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-3 sm:px-8 sm:py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-none hover:bg-white/5 transition-all"
                  style={{ willChange: 'transform' }}
                >
                  Book a Meeting
                </motion.button>
              </div>

              <div className="flex gap-4 ml-0 sm:ml-4">
                {socialIcons}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group"
          onClick={handleScrollToProjects}
          style={{ willChange: 'transform' }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent-crimson to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-white"
            />
          </div>
        </motion.div>
      </section>

      <div className="relative z-10 bg-[#050505]">
        <SkillSection />
        <WorkExperience />

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-accent-crimson border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-secondary font-mono tracking-[0.5em] uppercase text-[10px]">
              Fetching Assets...
            </div>
          </div>
        ) : (
          <ProjectCarouselRevamp projects={projects} />
        )}
      </div>
    </div>
  );
};

export default Home;
