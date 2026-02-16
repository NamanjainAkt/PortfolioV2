import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight, Layers, Sparkles, MonitorSmartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { FadeInWhenVisible } from './FadeInWhenVisible';

interface ProjectSectionProps {
  projects: Project[];
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  // Use first 4 projects for bento grid, or less if not available
  const featuredProjects = projects.slice(0, 4);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl text-left">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-accent-crimson" />
                <span className="text-xs font-mono text-accent-glow uppercase tracking-[0.4em]">Case Studies</span>
              </div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.1}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black mb-8 leading-[0.9]">
                FEATURED <span className="text-accent-crimson">WORK</span>
              </h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <p className="text-secondary text-lg md:text-xl leading-relaxed font-sans font-light border-l-2 border-accent-crimson/20 pl-6">
                Designing and engineering scalable solutions with a focus on performance, 
                accessibility, and immersive user experiences.
              </p>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible delay={0.3}>
            <Link 
              to="/projects" 
              className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent-crimson transition-all duration-500"
            >
              <span className="text-sm font-mono uppercase tracking-widest text-secondary group-hover:text-white transition-colors">
                Archive
              </span>
              <ArrowRight size={18} className="text-accent-crimson group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeInWhenVisible>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => {
            const isLarge = index === 0;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto ${isLarge ? 'md:h-[600px]' : 'md:h-[600px]'}`}
              >
                <Link to={`/projects/${project.slug}`} className="absolute inset-0 block">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-[#111]">
                    {project.images[0] && (
                      <img 
                        src={project.images[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    {isLarge && (
                      <div className="px-3 py-1 bg-accent-crimson/90 backdrop-blur-md rounded-full flex items-center gap-2">
                        <Sparkles size={12} className="text-white" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">Featured</span>
                      </div>
                    )}
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                      <MonitorSmartphone size={12} className="text-accent-glow" />
                      <span className="text-[10px] font-mono text-secondary uppercase tracking-widest uppercase">{project.category || 'Development'}</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded text-[9px] font-mono text-primary uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className={`font-serif font-black text-white leading-tight mb-4 ${isLarge ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
                      {project.title}
                    </h3>
                    
                    <p className="text-secondary text-sm md:text-base line-clamp-2 max-w-xl mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {project.overview}
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-accent-crimson font-mono text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                        <span>View Project</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                      
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-secondary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-secondary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 border-r-2 border-b-2 border-accent-crimson/50 rounded-br-xl" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Unified Bottom CTA */}
        <FadeInWhenVisible delay={0.4}>
          <div className="mt-24 text-center">
            <Link 
              to="/projects"
              className="relative inline-flex items-center gap-6 px-12 py-6 bg-primary text-surface rounded-full overflow-hidden font-black group transition-all duration-500"
            >
              <div className="absolute inset-0 bg-accent-crimson translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Layers size={20} className="relative z-10 transition-colors group-hover:text-white" />
              <span className="relative z-10 text-sm uppercase tracking-[0.4em] transition-colors group-hover:text-white">
                Explore Full Archive
              </span>
              <div className="relative z-10 w-8 h-px bg-surface group-hover:bg-white transition-colors" />
            </Link>
            
            <div className="mt-8 flex flex-col items-center">
              <p className="font-mono text-[10px] text-tertiary uppercase tracking-[0.5em] mb-4">
                Total Deployments: {projects.length} Milestone Projects
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-accent-crimson animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default ProjectSection;
