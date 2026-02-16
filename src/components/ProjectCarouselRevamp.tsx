import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, ExternalLink, ArrowUpRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';

interface ProjectCarouselRevampProps {
  projects: Project[];
}

const ProjectCarouselRevamp: React.FC<ProjectCarouselRevampProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 45 : -45,
    })
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const currentProject = projects[currentIndex];

  if (!projects.length) return null;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#050505]">
      {/* Background Atmosphere */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={currentProject.images[0]} 
            className="w-full h-full object-cover blur-[100px] saturate-150"
            alt=""
          />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <Box size={16} className="text-accent-crimson animate-pulse" />
              <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.4em]">Project Showcase</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tighter uppercase">
              Selected <span className="text-accent-crimson">Works</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-crimson hover:border-accent-crimson transition-all duration-300 group"
            >
              <ChevronLeft size={20} className="text-secondary group-hover:text-white" />
            </button>
            <div className="font-mono text-sm text-tertiary">
              <span className="text-accent-crimson">{currentIndex + 1}</span> / {projects.length}
            </div>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-crimson hover:border-accent-crimson transition-all duration-300 group"
            >
              <ChevronRight size={20} className="text-secondary group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative h-[450px] md:h-[500px] perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                rotateY: { duration: 0.6 }
              }}
              className="absolute inset-0 flex flex-col md:flex-row bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden relative group/img">
                <img 
                  src={currentProject.images[0]} 
                  alt={currentProject.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111]/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent md:hidden" />
              </div>

              {/* Info Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProject.techStack.slice(0, 3).map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-secondary uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl md:text-4xl font-serif font-black text-white mb-4 leading-tight">
                  {currentProject.title}
                </h3>
                
                <p className="text-secondary text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-light">
                  {currentProject.overview}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <Link 
                    to={`/projects/${currentProject.slug}`}
                    className=" border border-accent-crimson p-4 flex items-center gap-3 text-accent-crimson font-mono text-xs font-bold uppercase tracking-[0.3em] hover:text-white transition-colors group/link"
                  >
                    <span>Exploration</span>
                    <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </Link>

                  <div className="flex gap-4">
                    {currentProject.githubUrl && (
                      <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-tertiary hover:text-white transition-colors">
                        <Github size={20} />
                      </a>
                    )}
                    {currentProject.liveUrl && (
                      <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-tertiary hover:text-white transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Unified Discovery Footer */}
        <div className="mt-16 flex flex-col items-center">
          <Link 
            to="/projects"
            className="group flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-full hover:border-accent-crimson transition-all duration-500"
          >
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-secondary group-hover:text-white">
              View All Deployments
            </span>
            <div className="w-8 h-px bg-accent-crimson group-hover:w-12 transition-all duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarouselRevamp;
