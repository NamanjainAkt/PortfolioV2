import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Server, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  images: string[];
}

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (Array.isArray(data)) {
            setProjects(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-3xl text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            FORGED IN <span className="text-accent-crimson">SILENCE</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Building production-grade systems with high confidence, deep focus, and solitude-driven work ethic.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/projects"
              className="px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              View Projects <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-border text-primary font-medium rounded hover:bg-elevated transition-colors"
            >
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-surface/50 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-serif font-bold mb-12 text-center"
          >
            Core Technologies
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Code />, name: 'Frontend', items: 'React, Next.js, Tailwind' },
              { icon: <Server />, name: 'Backend', items: 'Node.js, Express, Prisma' },
              { icon: <Database />, name: 'Database', items: 'MongoDB, PostgreSQL' },
              { icon: <Layers />, name: 'DevOps', items: 'Docker, Vercel, AWS' },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-elevated border border-border rounded-lg text-center hover:border-accent-crimson/50 transition-colors"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-4 text-accent-crimson">
                  {tech.icon}
                </div>
                <h3 className="font-bold mb-2">{tech.name}</h3>
                <p className="text-sm text-secondary">{tech.items}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline (Simplified) */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center">Journey</h2>
        <div className="max-w-3xl mx-auto space-y-12 relative border-l border-border ml-4 md:ml-auto md:pl-8">
          {[
            { role: 'Senior Developer', company: 'Tech Corp', year: '2023 - Present', desc: 'Leading frontend architecture and team mentorship.' },
            { role: 'Full Stack Engineer', company: 'Startup Inc', year: '2021 - 2023', desc: 'Built MVP to scale, handled CI/CD and cloud infra.' },
            { role: 'Frontend Developer', company: 'Web Agency', year: '2019 - 2021', desc: 'Delivered 20+ client projects with high-performance metrics.' },
          ].map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8"
            >
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-accent-crimson rounded-full" />
              <span className="text-sm text-accent-glow font-mono mb-1 block">{exp.year}</span>
              <h3 className="text-xl font-bold">{exp.role}</h3>
              <p className="text-secondary text-sm mb-2">{exp.company}</p>
              <p className="text-tertiary">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif font-bold">Featured Work</h2>
            <Link to="/projects" className="text-accent-crimson hover:underline text-sm font-medium">View All</Link>
          </div>
          
          {loading ? (
             <div className="text-center text-secondary">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative aspect-video bg-elevated border border-border rounded-lg overflow-hidden"
                >
                    {project.images && project.images.length > 0 ? (
                        <img 
                            src={project.images[0]} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-tertiary bg-elevated">
                            No Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{project.overview}</p>
                    <Link 
                        to={`/projects/${project.slug}`}
                        className="text-accent-crimson text-sm font-medium hover:underline"
                    >
                        View Case Study &rarr;
                    </Link>
                    </div>
                </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center text-tertiary">
                No projects found. <Link to="/admin" className="underline">Add some?</Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Forge?</h2>
        <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
          Open for high-impact opportunities and technical consulting.
        </p>
        <Link
          to="/contact"
          className="inline-block px-8 py-4 bg-accent-crimson text-white font-bold rounded hover:bg-red-700 transition-colors"
        >
          Initiate Communication
        </Link>
      </section>
    </div>
  );
};

export default Home;
