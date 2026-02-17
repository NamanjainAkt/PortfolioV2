import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../types/project';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'tiles' | 'carousel' | 'masonry' | 'bento' | 'timeline';
  isFeatured?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  viewMode = 'tiles',
  isFeatured = false,
  className = ''
}) => {
  const hasGithub = !!project.githubUrl;
  const hasLive = !!project.liveUrl;

  // Size variants based on view mode
  const sizeClasses = {
    tiles: 'h-full',
    carousel: 'h-full',
    masonry: 'h-full',
    bento: isFeatured ? 'h-full md:h-[500px]' : 'h-full',
    timeline: 'h-full'
  };

  return (
    <motion.div
      className={`group relative bg-surface border border-border rounded-xl overflow-hidden hover:border-accent-crimson/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-crimson/10 ${sizeClasses[viewMode]} ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${viewMode === 'carousel' ? 'aspect-video' : 'aspect-video'}`}>
        {project.images[0] ? (
          <img
            src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.medium })}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-elevated flex items-center justify-center">
            <span className="text-4xl font-bold text-accent-crimson/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {/* GitHub Button */}
          {hasGithub ? (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={24} className="text-white" />
            </motion.a>
          ) : (
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 cursor-not-allowed">
              <Github size={24} className="text-white/30" />
            </div>
          )}

          {/* Live Button */}
          {hasLive ? (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent-crimson/80 backdrop-blur-sm rounded-full border border-accent-crimson hover:bg-accent-crimson transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={24} className="text-white" />
            </motion.a>
          ) : (
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 cursor-not-allowed">
              <ExternalLink size={24} className="text-white/30" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={`font-bold mb-2 group-hover:text-accent-crimson transition-colors ${
          isFeatured ? 'text-2xl' : 'text-lg'
        }`}>
          {project.title}
        </h3>
        
        <p className={`text-secondary mb-4 line-clamp-2 ${
          isFeatured ? 'text-base line-clamp-3' : 'text-sm'
        }`}>
          {project.overview}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, isFeatured ? 5 : 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-elevated text-secondary rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > (isFeatured ? 5 : 3) && (
            <span className="px-2 py-1 text-xs bg-elevated text-secondary rounded-full">
              +{project.techStack.length - (isFeatured ? 5 : 3)}
            </span>
          )}
        </div>

        {/* Bottom action buttons (always visible on mobile) */}
        <div className="flex gap-3 mt-4 md:hidden">
          {hasGithub ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-elevated rounded-lg text-sm hover:bg-accent-crimson/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          ) : (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-elevated/50 rounded-lg text-sm text-secondary/50 cursor-not-allowed">
              <Github size={16} />
              <span>Code</span>
            </button>
          )}
          
          {hasLive ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent-crimson/20 rounded-lg text-sm text-accent-crimson hover:bg-accent-crimson/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
              <span>Live</span>
            </a>
          ) : (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-elevated/50 rounded-lg text-sm text-secondary/50 cursor-not-allowed">
              <ExternalLink size={16} />
              <span>Live</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
