import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code, Database, Server, Layers, Github, Linkedin, Mail, Twitter, FileText, Calendar, ChevronRight, Cpu, Zap, Globe } from 'lucide-react';
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
import heroImg from '../assets/hero-mod.png';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
    { icon: Linkedin, href: "https://linkedin.com/in/naman-jain-akt/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/namanjainakt/", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/", label: "Twitter" },
    { icon: Mail, href: "mailto:namanjainakt@gmail.com", label: "Email" },
  ];

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section 
        id="home"
        ref={containerRef}
        className="relative min-h-screen flex flex-col items-center justify-start pt-32 md:pt-40 overflow-hidden bg-[#050505]"
      >
        {/* Deep Red Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-crimson/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-t from-accent-crimson/10 to-transparent pointer-events-none" />
        
        <ParticleBackground />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          
          {/* Top Character Area */}
          <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-auto mb-4 md:mb-8 flex flex-col items-center justify-center pt-20 md:pt-0">
            
            {/* Left Floating Card 1 - AI Engineer */}
            <motion.div 
              style={{ y: y1 }}
              initial={{ opacity: 0, x: -150, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="absolute -left-[17%] top-[40%] hidden lg:block z-30"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-crimson/40 to-accent-glow/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-[240px] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent-crimson/20 rounded-lg">
                      <Cpu size={18} className="text-accent-crimson" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white tracking-tight">AI Engineer</h3>
                  </div>
                  <div className="font-mono text-[9px] leading-relaxed text-accent-glow/70 bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-blue-400">const</span> build = (idea) ={">"} <span className="text-accent-crimson">scale</span>;
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Left Floating Card 2 - Full Stack */}
            <motion.div 
              style={{ y: y3 }}
              initial={{ opacity: 0, x: -120, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              className="absolute -left-[4%] -bottom-[7%] hidden lg:block z-30"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-accent-crimson/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-[240px] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Layers size={18} className="text-blue-400" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white tracking-tight">Full Stack</h3>
                  </div>
                  <div className="font-mono text-[9px] leading-relaxed text-blue-300/70 bg-black/40 p-3 rounded-xl border border-white/5">
                    docker-compose up <span className="text-accent-crimson">-d</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Character Image - Responsive Scaling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 155 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
            >
              <div className="absolute inset-0 bg-accent-crimson/15 blur-[80px] md:blur-[120px] rounded-full scale-90" />
              <img 
                src={heroImg} 
                alt="Naman Jain" 
                className="w-full h-auto relative z-10 drop-shadow-[0_0_50px_rgba(200,16,46,0.3)] md:drop-shadow-[0_0_100px_rgba(200,16,46,0.4)] filter contrast-[1.05] brightness-[1.05]"
              />
            </motion.div>

            {/* Name Text - Responsive Sizes */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: -130, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="absolute z-5 pointer-events-none text-center w-full"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter text-white/90 drop-shadow-[0_0_20px_rgba(200,16,46,0.3)] md:drop-shadow-[0_0_30px_rgba(200,16,46,0.5)]">
                NA<span className='text-accent-crimson'>MAN</span>JAIN
              </h1>
            </motion.div>

            {/* Right Floating Card 1 - Product Builder */}
            <motion.div 
              style={{ y: y2 }}
              initial={{ opacity: 0, x: 150, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              className="absolute right-[-20%] top-[40%] hidden lg:block z-30"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-glow/40 to-accent-crimson/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-[240px] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent-crimson/20 rounded-lg">
                      <Zap size={18} className="text-accent-crimson" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white tracking-tight">Product Builder</h3>
                  </div>
                  <div className="font-mono text-[9px] leading-relaxed text-accent-glow/70 bg-black/40 p-3 rounded-xl border border-white/5">
                    vision: <span className="text-accent-crimson">"unlimited"</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Floating Card 2 - Problem Solver */}
            <motion.div 
              style={{ y: y4 }}
              initial={{ opacity: 0, x: 120, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
              className="absolute right-[-5%] bottom-[-4%] hidden lg:block z-30"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-accent-glow/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-[240px] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Globe size={18} className="text-green-400" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white tracking-tight">System Architect</h3>
                  </div>
                  <div className="font-mono text-[9px] leading-relaxed text-green-300/70 bg-black/40 p-3 rounded-xl border border-white/5">
                    scaling: <span className="text-accent-crimson">infinite</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Centered Content Section */}
          <motion.div
            style={{ opacity }}
            className="text-center relative z-20 mt-20 md:mt-24"
          >
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 60 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mb-16 px-6 sm:px-0"
            >
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(200,16,46,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-12 py-4 bg-primary text-surface font-bold rounded-xl transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(200,16,46,0.3)]"
              >
                Resume/CV <FileText size={20} className="group-hover:translate-y-[-2px] transition-transform" />
              </motion.a>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <a
                  href="mailto:namanjainakt@gmail.com"
                  className="w-full sm:w-auto px-12 py-4 border border-white/10 bg-white/5 backdrop-blur-xl text-primary font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  Mail <Mail size={20} />
                </a>
              </motion.div>
            </motion.div>

            {/* Social Links with Tooltips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 80 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex justify-center gap-6 md:gap-8 mt-4 md:mt-0"
            >
              {socialLinks.map((social, index) => (
                <div key={index} className="group relative">
                  <MagneticSocialIcon 
                    icon={social.icon}
                    href={social.href}
                    index={index}
                  />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-elevated border border-border text-[10px] font-mono text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {social.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
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
