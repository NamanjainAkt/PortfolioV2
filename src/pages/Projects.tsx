import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  techStack: string[];
  images: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
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

  if (loading) {
    return <div className="pt-32 text-center text-secondary">Loading projects...</div>;
  }

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center"
      >
        Selected Works
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block bg-surface border border-border rounded-lg overflow-hidden hover:border-accent-crimson/50 transition-all"
          >
            <Link to={`/projects/${project.slug}`}>
              <div className="aspect-video bg-elevated relative overflow-hidden">
                {project.images[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tertiary">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-accent-crimson transition-colors">
                  {project.title}
                </h2>
                <p className="text-secondary text-sm mb-4 line-clamp-2">
                  {project.overview}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-elevated text-xs rounded text-tertiary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-2 text-center text-tertiary py-20">
            No projects found. Use Admin Mode (Ctrl+Shift+P) to add some.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
