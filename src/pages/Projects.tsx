import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, FolderGit2, MonitorSmartphone, Code2, Sparkles, Command, ShieldCheck } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  techStack: string[];
  images: string[];
  category?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?orderBy=displayOrder');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category || 'Development')))];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => (p.category || 'Development') === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-crimson/20 border-t-accent-crimson rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-primary pb-32 overflow-x-hidden">
      {/* Cinematic Header */}
      <section className="relative pt-32 pb-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,16,46,0.05),transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
              <FadeInWhenVisible>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Command size={14} className="text-accent-crimson" />
                  <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.5em]">Operational Deployment</span>
                </div>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.1}>
                <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase leading-[0.85]">
                  PROJECT <span className="text-accent-crimson">BASE .</span>
                </h1>
              </FadeInWhenVisible>
            </div>

            {/* Compact Category Filter */}
            <FadeInWhenVisible delay={0.2} className="w-full md:w-auto">
              <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={clsx(
                      'px-6 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all duration-500',
                      filter === cat 
                        ? 'bg-accent-crimson text-white shadow-lg shadow-accent-crimson/20' 
                        : 'text-tertiary hover:bg-white/5 hover:text-primary'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/projects/${project.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent-crimson/30 transition-all duration-500 hover:-translate-y-3">
                    
                    {/* Visual Asset */}
                    <div className="aspect-[16/10] overflow-hidden relative">
                      {project.images[0] ? (
                        <img
                          src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.large })}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-50 group-hover:saturate-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#151515] flex items-center justify-center">
                          <FolderGit2 size={60} className="text-white/5" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-6 left-6 flex gap-2">
                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                          <Sparkles size={10} className="text-accent-glow" />
                          <span className="text-[8px] font-mono text-secondary uppercase tracking-widest uppercase">{project.category || 'Development'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-10 flex flex-col flex-1 relative">
                      <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 rounded-2xl bg-accent-crimson flex items-center justify-center shadow-xl shadow-accent-crimson/20 transform group-hover:rotate-12 transition-transform duration-500">
                        <ArrowUpRight size={20} className="text-white" />
                      </div>

                      <h2 className="text-3xl font-serif font-black text-white mb-4 group-hover:text-accent-crimson transition-colors uppercase tracking-tighter leading-none">
                        {project.title}
                      </h2>
                      
                      <p className="text-secondary text-sm font-light line-clamp-3 mb-8 leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">
                        {project.overview}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] font-mono text-tertiary uppercase tracking-widest group-hover:border-accent-crimson/30 group-hover:text-secondary transition-colors">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-[8px] font-mono text-accent-crimson uppercase pt-1">+{project.techStack.length - 3} More</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[4rem]">
            <MonitorSmartphone size={48} className="text-white/5 mx-auto mb-6" />
            <p className="font-mono text-[10px] text-tertiary uppercase tracking-[0.5em]">System was unable to synchronize requested project data.</p>
          </div>
        )}
      </div>

      {/* Global Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 z-50 hidden md:block">
        <div className="container mx-auto px-8 max-w-7xl flex justify-between items-center text-[8px] font-mono text-tertiary uppercase tracking-[0.4em]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent-crimson animate-pulse" />
              <span>Project Core v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={10} />
              <span>Encryption Active</span>
            </div>
          </div>
          <div className="flex gap-8">
            <span>Total Entities: {projects.length}</span>
            <span>Filter: {filter}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { clsx } from 'clsx'; // Missing import check
export default Projects;
