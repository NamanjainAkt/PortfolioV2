import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Calendar, Mail, Twitter, FileText, Cpu, Globe } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';
import Typewriter from '../components/Typewriter';
import { MagneticSocialIcon } from '../components/MagneticSocialIcon';
import SkillSection from '../components/SkillSection';
import WorkExperience from '../components/WorkExperience';
import ProjectCarouselRevamp from '../components/ProjectCarouselRevamp';
import { Project } from '../types/project';
import DroneOverlay from '../components/drone/DroneOverlay';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#050505']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C8102E" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[1, 64, 64]} scale={2}>
            <MeshDistortMaterial
              color="#C8102E"
              speed={3}
              distort={0.4}
              radius={1}
              emissive="#C8102E"
              emissiveIntensity={0.2}
              transparent
              opacity={0.15}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

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
    "Software Architect",
    "Full Stack Engineer",
    "System Designer",
    "Product Visionary"
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/naman-jain-akt/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/namanjainakt/", label: "GitHub" },
    { icon: Mail, href: "mailto:namanjainakt@gmail.com", label: "Email" },
  ];

  return (
    <div className="pt-0 bg-[#050505]">
      <DroneOverlay />
      
      <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] z-1" />

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ y: y1, opacity, scale }}
        >
          <div className="flex flex-col items-center">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-crimson/10 border border-accent-crimson/20 mb-8 backdrop-blur-md"
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
                className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-serif font-black tracking-tighter text-white uppercase leading-[0.8]"
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
              className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-10"
            >
              <div className="flex items-center gap-2 text-secondary font-mono text-sm md:text-lg">
                <Cpu size={16} className="text-accent-crimson" />
                <Typewriter words={roles} />
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
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-none overflow-hidden"
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
                  className="px-8 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-none hover:bg-white/5 transition-all"
                >
                  Book a Meeting
                </motion.button>
              </div>

              <div className="flex gap-4 ml-0 sm:ml-4">
                {socialLinks.map((social, index) => (
                  <MagneticSocialIcon 
                    key={index}
                    icon={social.icon}
                    href={social.href}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
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
