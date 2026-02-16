import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, ArrowUpRight, Search, Zap, Terminal, Hash, Fingerprint } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage?: string;
  createdAt: string;
  category?: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-crimson/20 border-t-accent-crimson rounded-full animate-spin" />
        <p className="font-mono text-[9px] text-accent-glow uppercase tracking-[0.4em]">Decrypting Neural Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent-crimson/30 overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.03)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(200,16,46,0.02)_0%,transparent_70%)]" />
      </div>

      {/* Header Section */}
      <section className="relative pt-32 pb-12 z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <FadeInWhenVisible>
                <div className="flex items-center gap-3">
                  <Fingerprint size={16} className="text-accent-crimson" />
                  <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.5em]">Identity Archive</span>
                </div>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.1}>
                <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tight uppercase leading-[0.8]">
                  JOURNAL <span className="text-accent-crimson">.</span>
                </h1>
              </FadeInWhenVisible>
            </div>

            <FadeInWhenVisible delay={0.2} className="w-full md:w-96">
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent-crimson transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="FILTER BY PROTOCOL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 text-[10px] font-mono tracking-widest uppercase focus:outline-none focus:border-accent-crimson transition-all placeholder:text-tertiary/20"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Modern List Grid */}
      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="grid gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, index) => (
              <motion.div 
                key={blog.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-[#050505] group"
              >
                <Link to={`/blogs/${blog.slug}`} className="block p-8 md:p-12 relative overflow-hidden">
                  {/* Background Blur Overlay on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none overflow-hidden">
                    {blog.featuredImage && (
                      <img src={blog.featuredImage} className="w-full h-full object-cover blur-2xl scale-110 saturate-150" alt="" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-accent-crimson font-black uppercase tracking-[0.3em]">
                          {blog.category || 'Architecture'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[9px] font-mono text-tertiary uppercase tracking-widest">
                          {format(new Date(blog.createdAt), 'dd.MM.yyyy')}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white group-hover:text-accent-crimson transition-all duration-500 leading-tight">
                        {blog.title}
                      </h2>
                      
                      <p className="text-secondary text-sm md:text-base font-light line-clamp-1 max-w-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 italic">
                        {blog.content.slice(0, 150).replace(/[#*_]/g, '')}...
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] font-mono text-tertiary uppercase tracking-widest">Read Latency</span>
                        <span className="text-xs font-mono text-white">{Math.ceil(blog.content.split(/\s+/).length / 200)}M</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-accent-crimson group-hover:border-accent-crimson transition-all duration-500">
                        <ArrowUpRight size={20} className="text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-40 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
            <Terminal size={48} className="text-white/5 mx-auto mb-6" />
            <p className="font-mono text-[10px] text-tertiary uppercase tracking-[0.5em]">No synchronization protocols found for requested query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
