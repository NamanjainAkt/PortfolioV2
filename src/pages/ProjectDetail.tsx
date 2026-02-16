import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowRight, FolderGit2, Boxes, Terminal, ShieldAlert, Sparkles, Globe } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { Lightbox } from '../components/Lightbox';

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  images: string[];
  githubUrl: string;
  liveUrl: string;
  category?: string;
}

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Failed to fetch project', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setAllProjects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };

    fetchProject();
    fetchAllProjects();
    window.scrollTo(0, 0);
  }, [slug]);

  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-accent-crimson/20 border-t-accent-crimson rounded-full animate-spin" />
        <p className="font-mono text-xs text-accent-glow uppercase tracking-[0.4em]">Compiling Assets...</p>
      </div>
    </div>
  );

  if (!project) return <div className="pt-32 text-center text-secondary">Project not found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent-crimson/30 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-crimson z-[60] origin-left" style={{ scaleX }} />

      {/* Lightbox */}
      <Lightbox
        images={project.images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((p) => (p + 1) % project.images.length)}
        onPrev={() => setCurrentImageIndex((p) => (p - 1 + project.images.length) % project.images.length)}
      />

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-crimson/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-crimson/3 rounded-full blur-[100px]" />
      </div>

      {/* Cinematic Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]" />
          {project.images[0] && (
            <motion.img 
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 2, ease: "easeOut" }}
              src={project.images[0]} 
              className="w-full h-full object-cover blur-3xl saturate-200"
              alt=""
            />
          )}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <FadeInWhenVisible>
              <Link to="/projects" className="inline-flex items-center gap-3 text-[10px] font-mono font-bold text-tertiary hover:text-accent-crimson transition-all mb-16 group uppercase tracking-[0.4em]">
                <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                Return to Master Archives
              </Link>
            </FadeInWhenVisible>

            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-10 lg:offset-1">
                <FadeInWhenVisible delay={0.1}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="px-4 py-1.5 bg-accent-crimson/10 border border-accent-crimson/20 rounded-full text-[9px] font-mono text-accent-glow uppercase font-black tracking-[0.3em]">
                      {project.category || 'System Architecture'}
                    </span>
                    <div className="h-px w-16 bg-white/10" />
                  </div>
                </FadeInWhenVisible>
                
                <FadeInWhenVisible delay={0.2}>
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter mb-10 leading-[0.85] uppercase">
                    {project.title}
                  </h1>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.3}>
                  <p className="text-secondary text-lg md:text-xl leading-relaxed font-light max-w-3xl mb-12 border-l-2 border-accent-crimson/30 pl-8 italic">
                    {project.overview}
                  </p>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.4}>
                  <div className="flex flex-wrap gap-6">
                    {project.liveUrl && (
                      <motion.a 
                        href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-4 px-10 py-5 bg-primary text-surface rounded-2xl font-black uppercase tracking-widest text-xs group relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="absolute inset-0 bg-accent-crimson translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <Globe size={18} className="relative z-10 group-hover:text-white transition-colors" />
                        <span className="relative z-10 group-hover:text-white transition-colors">Live Deployment</span>
                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform group-hover:text-white" />
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a 
                        href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:border-accent-crimson/50 transition-all group"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Github size={18} className="text-tertiary group-hover:text-accent-crimson transition-colors" />
                        <span className="text-secondary group-hover:text-white transition-colors">Source Protocol</span>
                      </motion.a>
                    )}
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Content Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-20">
            
            <div className="lg:col-span-8 space-y-32">
              {/* Problem Section */}
              <FadeInWhenVisible>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8 text-accent-crimson">
                    <ShieldAlert size={20} />
                    <h2 className="text-xs font-mono font-black uppercase tracking-[0.5em]">The Core Conflict</h2>
                  </div>
                  <div className="relative p-10 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-crimson/50" />
                    <p className="text-secondary text-lg md:text-xl leading-relaxed font-light">
                      {project.problem || 'No problem description available.'}
                    </p>
                    <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/[0.02] rotate-12" />
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Solution Section */}
              <FadeInWhenVisible>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8 text-accent-glow">
                    <Boxes size={20} />
                    <h2 className="text-xs font-mono font-black uppercase tracking-[0.5em]">The Resolved Architecture</h2>
                  </div>
                  <div className="relative p-10 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-accent-glow/50" />
                    <p className="text-secondary text-lg md:text-xl leading-relaxed font-light">
                      {project.solution || 'No solution description available.'}
                    </p>
                    <Terminal className="absolute -bottom-4 -left-4 w-24 h-24 text-white/[0.02] -rotate-12" />
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* Sidebar - Tech Stack */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <FadeInWhenVisible direction="left">
                  <div className="p-10 bg-[#111]/40 border border-white/5 rounded-[2.5rem] backdrop-blur-2xl">
                    <div className="flex items-center gap-3 mb-10 text-accent-crimson">
                      <Terminal size={16} />
                      <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">System Specs</h3>
                    </div>
                    <div className="space-y-4">
                      {project.techStack.map((tech, idx) => (
                        <motion.div 
                          key={tech}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between py-3 border-b border-white/5 group/tech"
                        >
                          <span className="text-xs font-mono text-tertiary group-hover/tech:text-white transition-colors">{tech}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-crimson/20 group-hover/tech:bg-accent-crimson transition-all shadow-[0_0_8px_rgba(200,16,46,0)] group-hover/tech:shadow-[0_0_8px_rgba(200,16,46,0.8)]" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Terminal - Gallery */}
      <section className="py-32 relative bg-[#080808]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.02)_0%,transparent_70%)]" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <FadeInWhenVisible>
            <div className="flex items-center gap-8 mb-20">
              <h2 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter">INTERFACE <span className="text-accent-crimson">DATA</span></h2>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 gap-12">
            {project.images.map((img, idx) => (
              <FadeInWhenVisible key={idx} delay={idx * 0.1}>
                <motion.div 
                  className="relative rounded-[2rem] overflow-hidden cursor-pointer group bg-[#111] border border-white/5 shadow-2xl"
                  onClick={() => openLightbox(idx)}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <img src={img} alt="" className="w-full aspect-video object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-accent-crimson/0 group-hover:bg-accent-crimson/5 transition-colors duration-500" />
                  <div className="absolute bottom-8 left-8 px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-mono uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Visual Core {idx + 1}
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects - Immersive Carousel */}
      {relatedProjects.length > 0 && (
        <section className="py-32 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <FadeInWhenVisible>
              <div className="flex justify-between items-end mb-16">
                <div>
                  <span className="text-[10px] font-mono text-tertiary uppercase tracking-[0.5em] block mb-4">Discover More</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter">RELATED <span className="text-accent-crimson">ASSETS</span></h2>
                </div>
                <Link to="/projects" className="hidden md:flex items-center gap-2 text-accent-crimson font-mono text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Full Archive <ArrowRight size={16} />
                </Link>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((related, idx) => (
                <FadeInWhenVisible key={related.id} delay={idx * 0.1}>
                  <Link to={`/projects/${related.slug}`} className="group block bg-[#111]/50 border border-white/5 rounded-3xl overflow-hidden hover:border-accent-crimson/30 transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-video overflow-hidden relative">
                      {related.images[0] ? (
                        <img src={related.images[0]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
                      ) : (
                        <div className="w-full h-full bg-elevated flex items-center justify-center text-tertiary">
                          <FolderGit2 size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent-crimson transition-colors mb-2 leading-tight uppercase tracking-tight">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-tertiary uppercase tracking-widest">
                        <span>View Project</span>
                        <div className="w-4 h-px bg-tertiary" />
                      </div>
                    </div>
                  </Link>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetail;
