import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Calendar, Mail, Twitter, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { MagneticSocialIcon } from '../components/MagneticSocialIcon';
import SkillSection from '../components/SkillSection';
import WorkExperience from '../components/WorkExperience';
import ProjectCarouselRevamp from '../components/ProjectCarouselRevamp';
import { Project } from '../types/project';
import DroneOverlay from '../components/drone/DroneOverlay';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/naman-jain-akt/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/namanjainakt/", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/", label: "Twitter" },
    { icon: Mail, href: "mailto:namanjainakt@gmail.com", label: "Email" },
  ];

  return (
    <div className="pt-0">
      <DroneOverlay />
      {/* Hero Section - Minimal & Professional */}
      <section 
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-crimson/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-crimson/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter text-white uppercase">
                NAMAN <span className="text-accent-crimson">JAIN</span>
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-0.5 bg-accent-crimson my-6 md:my-8"
            />

            {/* Typewriter Roles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-secondary font-mono mb-6"
            >
              <Typewriter words={roles} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-secondary text-base md:text-lg max-w-xl mb-10"
            >
              Building scalable web and mobile applications with modern technologies
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-primary text-surface font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                Resume
                <FileText size={18} className="group-hover:translate-y-[-1px] transition-transform" />
              </motion.a>
              
              <motion.button
                data-cal-link="naman-jain-akt/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 border border-white/20 text-primary font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Schedule a Call
                <Calendar size={18} />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex gap-5"
            >
              {socialLinks.map((social, index) => (
                <div key={index} className="group relative">
                  <MagneticSocialIcon 
                    icon={social.icon}
                    href={social.href}
                    index={index}
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-elevated border border-border text-[10px] font-mono text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {social.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
              >
                <motion.div className="w-1 h-2 bg-accent-crimson rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <SkillSection />

      {/* Work Experience */}
      <WorkExperience />

      {/* Featured Projects - Revamped Cinematic Carousel */}
      {loading ? (
        <div className="py-24 text-center text-secondary font-mono tracking-widest animate-pulse uppercase text-xs">
          Initialising Selected Works...
        </div>
      ) : (
        <ProjectCarouselRevamp projects={projects} />
      )}
    </div>
  );
};

export default Home;
