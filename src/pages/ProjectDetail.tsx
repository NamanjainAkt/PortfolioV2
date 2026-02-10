import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowRight, FolderGit2 } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { Lightbox } from '../components/Lightbox';
import { TiltCard } from '../components/TiltCard';

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
  demoUrl: string;
}

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  }, [slug]);

  // Get related projects (excluding current, max 3)
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (project && currentImageIndex < project.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  if (loading) return <div className="pt-32 text-center text-secondary">Loading...</div>;
  if (!project) return <div className="pt-32 text-center text-secondary">Project not found</div>;

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen max-w-5xl pb-20">
      {/* Lightbox */}
      <Lightbox
        images={project.images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />

      <FadeInWhenVisible>
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-secondary hover:text-accent-crimson transition-colors mb-8 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.1}>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{project.title}</h1>
      </FadeInWhenVisible>
      
      <FadeInWhenVisible delay={0.2}>
        <p className="text-xl text-secondary mb-8 max-w-3xl leading-relaxed">{project.overview}</p>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.3}>
        <div className="flex flex-wrap gap-4 mb-12">
          {project.githubUrl && (
            <motion.a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-6 py-3 border border-border rounded hover:bg-elevated transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github size={20} className="mr-2" /> Repository
            </motion.a>
          )}
          {project.demoUrl && (
            <motion.a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink size={20} className="mr-2" /> Live Demo
            </motion.a>
          )}
        </div>
      </FadeInWhenVisible>

      <div className="grid md:grid-cols-3 gap-12 mb-20">
        <div className="md:col-span-2 space-y-12">
          <FadeInWhenVisible delay={0.4}>
            <section>
              <h2 className="text-2xl font-bold mb-4">The Problem</h2>
              <p className="text-secondary leading-relaxed">{project.problem || 'No problem description.'}</p>
            </section>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.5}>
            <section>
              <h2 className="text-2xl font-bold mb-4">The Solution</h2>
              <p className="text-secondary leading-relaxed">{project.solution || 'No solution description.'}</p>
            </section>
          </FadeInWhenVisible>
        </div>
        
        <FadeInWhenVisible delay={0.4} direction="left">
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Tech Stack</h3>
            <ul className="space-y-2">
              {project.techStack.map((tech, idx) => (
                <motion.li 
                  key={tech} 
                  className="text-secondary flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 bg-accent-crimson rounded-full mr-3" />
                  {tech}
                </motion.li>
              ))}
            </ul>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* Project Images with Lightbox */}
      <div className="mb-20">
        <FadeInWhenVisible>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <FolderGit2 className="text-accent-crimson" />
            Project Gallery
          </h2>
        </FadeInWhenVisible>
        
        <div className="space-y-8">
          {project.images.map((img, idx) => (
            <FadeInWhenVisible key={idx} delay={idx * 0.1}>
              <motion.div 
                className="rounded-lg overflow-hidden border border-border cursor-pointer group"
                onClick={() => openLightbox(idx)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <img 
                    src={img} 
                    alt={`${project.title} screenshot ${idx + 1}`} 
                    className="w-full transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                      Click to enlarge
                    </span>
                  </div>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="border-t border-border pt-16">
          <FadeInWhenVisible>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">More Projects</h2>
              <Link 
                to="/projects" 
                className="text-accent-crimson hover:text-white transition-colors flex items-center gap-1 group"
              >
                View all
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedProjects.map((relatedProject, idx) => (
              <FadeInWhenVisible key={relatedProject.id} delay={idx * 0.1}>
                <TiltCard tiltAmount={5}>
                  <Link 
                    to={`/projects/${relatedProject.slug}`} 
                    className="group block bg-surface border border-border rounded-lg overflow-hidden hover:border-accent-crimson/50 transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden">
                      {relatedProject.images[0] ? (
                        <img
                          src={relatedProject.images[0]}
                          alt={relatedProject.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-elevated flex items-center justify-center text-tertiary">
                          <FolderGit2 size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-accent-crimson transition-colors line-clamp-1">
                        {relatedProject.title}
                      </h3>
                    </div>
                  </Link>
                </TiltCard>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
