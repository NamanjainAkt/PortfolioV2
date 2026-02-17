import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';

interface ProjectCarousel3DProps {
  projects: Project[];
}

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

const ProjectCarousel3D: React.FC<ProjectCarousel3DProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || projects.length <= 1) return;

    const interval = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (projects.length === 0) {
    return <div className="text-center py-20 text-secondary">No projects found</div>;
  }

  const getProjectIndex = (offset: number) => {
    return (currentIndex + offset + projects.length) % projects.length;
  };

  const currentProject = projects[currentIndex];

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative flex items-center justify-center h-[500px] md:h-[600px]">
        <AnimatePresence mode="popLayout">
          {/* Left Card (Previous) */}
          {projects.length > 1 && (
            <motion.div
              key={`left-${getProjectIndex(-1)}`}
              className="absolute left-0 md:left-[5%] w-[45%] md:w-[35%] opacity-60 cursor-pointer"
              initial={{ x: -100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.6, scale: 0.85 }}
              exit={{ x: -100, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onClick={prevSlide}
            >
              <ProjectCard project={projects[getProjectIndex(-1)]} isSide />
            </motion.div>
          )}

          {/* Center Card (Current) */}
          <motion.div
            key={`center-${currentIndex}`}
            className="absolute z-10 w-[60%] md:w-[45%] cursor-pointer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Link to={`/projects/${currentProject.slug}`}>
              <ProjectCard project={currentProject} isCenter />
            </Link>
          </motion.div>

          {/* Right Card (Next) */}
          {projects.length > 1 && (
            <motion.div
              key={`right-${getProjectIndex(1)}`}
              className="absolute right-0 md:right-[5%] w-[45%] md:w-[35%] opacity-60 cursor-pointer"
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.6, scale: 0.85 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onClick={nextSlide}
            >
              <ProjectCard project={projects[getProjectIndex(1)]} isSide />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {projects.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/80 transition-all hover:scale-110"
          >
            <ChevronLeft size={28} className="text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/80 transition-all hover:scale-110"
          >
            <ChevronRight size={28} className="text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-accent-crimson w-8'
                  : 'bg-border hover:bg-secondary w-2'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {!isPaused && projects.length > 1 && (
        <div className="mt-6 h-1 bg-elevated rounded-full overflow-hidden max-w-md mx-auto">
          <motion.div
            className="h-full bg-accent-crimson"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  isCenter?: boolean;
  isSide?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isCenter, isSide }) => {
  const hasGithub = !!project.githubUrl;
  const hasLive = !!project.liveUrl;

  return (
    <div 
      className={`group relative bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 ${
        isCenter 
          ? 'shadow-2xl shadow-accent-crimson/20 border-accent-crimson/30 hover:border-accent-crimson/60' 
          : 'shadow-lg'
      } ${isSide ? 'grayscale-[30%]' : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {project.images[0] ? (
          <img
            src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.medium })}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-elevated flex items-center justify-center">
            <span className="text-5xl font-bold text-accent-crimson/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay with buttons (only on center) */}
        {isCenter && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            {hasGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={24} className="text-white" />
              </a>
            )}
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-accent-crimson/80 backdrop-blur-sm rounded-full hover:bg-accent-crimson transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={24} className="text-white" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${isCenter ? 'md:p-6' : 'p-3'}`}>
        <h3 className={`font-bold mb-2 ${isCenter ? 'text-xl md:text-2xl' : 'text-base'} truncate`}>
          {project.title}
        </h3>
        
        {isCenter && (
          <p className="text-secondary text-sm mb-4 line-clamp-2">
            {project.overview}
          </p>
        )}

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, isCenter ? 4 : 2).map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 text-xs bg-elevated rounded-full ${
                isCenter ? 'text-secondary' : 'text-tertiary'
              }`}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > (isCenter ? 4 : 2) && (
            <span className="px-2 py-1 text-xs bg-elevated text-tertiary rounded-full">
              +{project.techStack.length - (isCenter ? 4 : 2)}
            </span>
          )}
        </div>
      </div>

      {/* Click hint for center card */}
      {isCenter && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

export default ProjectCarousel3D;
