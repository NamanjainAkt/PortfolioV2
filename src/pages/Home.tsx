import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Server, Layers, Github, Linkedin, Mail, Twitter, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import { TiltCard } from '../components/TiltCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { MagneticSocialIcon } from '../components/MagneticSocialIcon';

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

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Native Developer"
  ];

  const skills = [
    { name: "React", icon: Code },
    { name: "Node.js", icon: Server },
    { name: "Database", icon: Database },
    { name: "System Design", icon: Layers },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: Github, href: "https://github.com" },
    { icon: Mail, href: "mailto:contact@example.com" },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center container mx-auto px-4 relative">
        <ParticleBackground />
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-4xl text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(200,16,46,0.3)]"
          >
            Na<span className="text-accent-crimson drop-shadow-[0_0_25px_rgba(200,16,46,0.6)]">man</span> Jain
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-3xl font-mono text-white mb-6 h-8"
          >
            I'm a <Typewriter words={roles} typingSpeed={80} deletingSpeed={50} pauseTime={2000} className="text-accent-crimson" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            I build <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded text-sm font-medium">Scalable</span>, high-performance AI applications and modern web solutions with a focus on exceptional <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded text-sm font-medium">User Experience</span> and robust <span className="text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded text-sm font-medium">System Design</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <skill.icon size={20} />
                <span className="font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FileText size={18} /> Resume / CV
            </motion.button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-3 border border-border text-primary font-bold rounded hover:bg-elevated transition-colors flex items-center gap-2"
              >
                <Mail size={18} /> Get in touch
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-amber-700/20 text-amber-500 border border-amber-700/50 font-bold rounded hover:bg-amber-700/30 transition-colors flex items-center gap-2"
            >
              <Calendar size={18} /> Schedule Call
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex justify-center gap-4 text-secondary"
          >
            {socialLinks.map((social, index) => (
              <MagneticSocialIcon 
                key={index}
                icon={social.icon}
                href={social.href}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-surface/50 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-sm font-bold tracking-widest text-secondary uppercase text-center mb-4">
              Tech Stack
            </h2>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.1}>
            <h3 className="text-4xl font-serif font-bold text-center mb-4">
              Skills
            </h3>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.2}>
            <p className="text-secondary text-center mb-12">
              The technologies I build with.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Code />, name: 'Frontend', items: 'React, Next.js, Tailwind' },
              { icon: <Server />, name: 'Backend', items: 'Node.js, Express, Prisma' },
              { icon: <Database />, name: 'Database', items: 'PostgreSQL, MongoDB' },
              { icon: <Layers />, name: 'DevOps', items: 'Docker, AWS, CI/CD' },
            ].map((stack, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <TiltCard tiltAmount={8}>
                  <div className="p-6 bg-background border border-border rounded-lg hover:border-accent-crimson/50 transition-colors group">
                    <div className="w-12 h-12 bg-elevated rounded-lg flex items-center justify-center mb-4 text-accent-crimson group-hover:scale-110 transition-transform duration-300">
                      {stack.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{stack.name}</h3>
                    <p className="text-secondary text-sm">{stack.items}</p>
                  </div>
                </TiltCard>
              </FadeInWhenVisible>
            ))}
          </div>
          
          <FadeInWhenVisible delay={0.5}>
            <div className="flex justify-center mt-12">
              <div className="px-6 py-2 bg-elevated rounded-full border border-border text-sm text-secondary font-mono">
                &lt;&gt; 23+ technologies in my arsenal
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <FadeInWhenVisible>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Work</h2>
                <p className="text-secondary max-w-xl">
                  A selection of projects that demonstrate my ability to solve complex problems.
                </p>
              </div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.1}>
              <Link 
                to="/projects" 
                className="hidden md:flex items-center text-accent-crimson hover:text-white transition-colors font-medium group"
              >
                View all projects 
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeInWhenVisible>
          </div>

          {loading ? (
             <div className="text-center py-20 text-secondary">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <FadeInWhenVisible key={project.id} delay={index * 0.1}>
                  <Link to={`/projects/${project.slug}`} className="group block h-full">
                    <TiltCard tiltAmount={5} className="h-full">
                      <div className="bg-surface border border-border rounded-lg overflow-hidden h-full hover:border-accent-crimson/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-crimson/10">
                        <div className="aspect-video bg-elevated overflow-hidden">
                          {project.images[0] ? (
                            <img 
                              src={project.images[0]} 
                              alt={project.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-tertiary">
                              <Code size={48} />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-accent-crimson transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-secondary line-clamp-3 text-sm leading-relaxed">
                            {project.overview}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </FadeInWhenVisible>
              ))}
            </div>
          ) : (
            <FadeInWhenVisible>
              <div className="text-center py-20 bg-surface/30 rounded-lg border border-border border-dashed">
                <p className="text-secondary mb-4">No projects found. Add some from the Admin panel.</p>
                <Link to="/admin" className="text-accent-crimson hover:underline">Go to Admin</Link>
              </div>
            </FadeInWhenVisible>
          )}

          <FadeInWhenVisible delay={0.4}>
            <div className="mt-8 text-center md:hidden">
              <Link 
                to="/projects" 
                className="inline-flex items-center text-accent-crimson hover:text-white transition-colors font-medium"
              >
                View all projects <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};

export default Home;
