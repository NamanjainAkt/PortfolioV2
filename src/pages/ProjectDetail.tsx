import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

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

    fetchProject();
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-secondary">Loading...</div>;
  if (!project) return <div className="pt-32 text-center text-secondary">Project not found</div>;

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen max-w-5xl pb-20">
      <Link to="/projects" className="inline-flex items-center text-sm font-medium text-secondary hover:text-accent-crimson transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{project.title}</h1>
        <p className="text-xl text-secondary mb-8 max-w-3xl leading-relaxed">{project.overview}</p>

        <div className="flex flex-wrap gap-4 mb-12">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 border border-border rounded hover:bg-elevated transition-colors">
              <Github size={20} className="mr-2" /> Repository
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors">
              <ExternalLink size={20} className="mr-2" /> Live Demo
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">The Problem</h2>
              <p className="text-secondary leading-relaxed">{project.problem || 'No problem description.'}</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">The Solution</h2>
              <p className="text-secondary leading-relaxed">{project.solution || 'No solution description.'}</p>
            </section>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Tech Stack</h3>
            <ul className="space-y-2">
              {project.techStack.map((tech) => (
                <li key={tech} className="text-secondary flex items-center">
                  <span className="w-1.5 h-1.5 bg-accent-crimson rounded-full mr-3" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          {project.images.map((img, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border border-border">
              <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail;
