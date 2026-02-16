import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Clock, List, Type, Palette, Maximize2, Terminal, ChevronRight, Share2, Bookmark } from 'lucide-react';
import clsx from 'clsx';
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

interface Heading {
  id: string;
  text: string;
  level: number;
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Reader Customization State
  const [theme, setTheme] = useState<'slate' | 'warm' | 'cyber'>(() => (localStorage.getItem('blogTheme') as any) || 'slate');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>(() => (localStorage.getItem('blogFont') as any) || 'sans');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => (localStorage.getItem('blogFontSize') as any) || 'md');

  // Parallax Logic
  const targetRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    localStorage.setItem('blogTheme', theme);
    localStorage.setItem('blogFont', fontFamily);
    localStorage.setItem('blogFontSize', fontSize);
  }, [theme, fontFamily, fontSize]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const headings = useMemo<Heading[]>(() => {
    if (!blog?.content) return [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;
    while ((match = headingRegex.exec(blog.content)) !== null) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      matches.push({ id, text, level: match[1].length });
    }
    return matches;
  }, [blog?.content]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      setActiveHeading(id);
    }
  };

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveHeading(entry.target.id); });
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent-crimson/20 border-t-accent-crimson rounded-full animate-spin" />
    </div>
  );
  
  if (!blog) return <div className="pt-32 text-center text-secondary min-h-screen font-mono">Protocol Null</div>;

  const themeClasses = {
    slate: 'bg-[#0A0A0A] text-[#EDEDED] selection:bg-white/20',
    warm: 'bg-[#FDF6E3] text-[#433422] selection:bg-[#b58900]/20',
    cyber: 'bg-[#050505] text-accent-glow selection:bg-accent-crimson/30'
  };

  const fontClasses = { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' };
  const sizeClasses = { sm: 'prose-sm', md: 'prose-base', lg: 'prose-lg md:prose-xl' };

  return (
    <div className={clsx('min-h-screen transition-all duration-700 relative overflow-x-hidden', themeClasses[theme])}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-crimson z-[100] origin-left" style={{ scaleX }} />

      {/* Parallax Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          {blog.featuredImage ? (
            <>
              <img src={blog.featuredImage} className="w-full h-[120%] object-cover saturate-[0.8] brightness-[0.4]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-current opacity-100" />
              <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
            </>
          ) : (
            <div className="w-full h-full bg-[#111]" />
          )}
        </motion.div>

        <motion.div style={{ opacity, y: titleY }} className="container mx-auto px-4 relative z-10 text-center">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 bg-accent-crimson/20 border border-accent-crimson/30 rounded-full text-[10px] font-mono text-white uppercase font-black tracking-[0.3em] backdrop-blur-md">
                {blog.category || 'Architecture'}
              </span>
              <div className="w-1 h-1 rounded-full bg-accent-crimson" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-70 text-white">{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter leading-[0.85] uppercase text-white drop-shadow-2xl">
              {blog.title}
            </h1>
          </FadeInWhenVisible>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white" />
          <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-white">Scroll to Decrypt</span>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 relative z-10 mt-20 pb-40">
        <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr_300px] gap-12 lg:gap-20">
          
          {/* LEFT SIDE: Editor Controls */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-32 space-y-8">
              <Link to="/blogs" className="inline-flex items-center gap-3 text-[10px] font-mono opacity-50 hover:opacity-100 hover:text-accent-crimson transition-all uppercase tracking-[0.4em] group mb-4">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Archives
              </Link>

              <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-10 shadow-2xl">
                <div className="flex items-center gap-3 text-accent-crimson">
                  <Terminal size={16} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Reader Config</span>
                </div>

                <div className="space-y-6">
                  {/* Theme Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-40">
                      <Palette size={12} /> Environment
                    </div>
                    <div className="flex gap-2">
                      {['slate', 'warm', 'cyber'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t as any)}
                          className={clsx(
                            'flex-1 h-10 rounded-xl border transition-all relative overflow-hidden',
                            theme === t ? 'border-accent-crimson bg-accent-crimson/10 shadow-[0_0_15px_rgba(200,16,46,0.2)]' : 'border-white/5 hover:border-white/20'
                          )}
                        >
                          <div className={clsx('w-3 h-3 mx-auto rounded-full', t === 'slate' ? 'bg-[#0A0A0A]' : t === 'warm' ? 'bg-[#FDF6E3]' : 'bg-[#050505] border border-accent-crimson')} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-40">
                      <Type size={12} /> Typeface
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {['sans', 'serif', 'mono'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFontFamily(f as any)}
                          className={clsx(
                            'w-full py-3 px-4 rounded-xl border text-[10px] uppercase text-left transition-all font-mono',
                            fontFamily === f ? 'border-accent-crimson bg-accent-crimson/10 text-accent-crimson' : 'border-white/5 text-tertiary hover:border-white/20'
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-40">
                      <Maximize2 size={12} /> Magnitude
                    </div>
                    <div className="flex gap-2">
                      {['sm', 'md', 'lg'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setFontSize(s as any)}
                          className={clsx(
                            'flex-1 py-3 rounded-xl border text-[10px] uppercase transition-all font-mono',
                            fontSize === s ? 'border-accent-crimson bg-accent-crimson/10 text-accent-crimson' : 'border-white/5 text-tertiary hover:border-white/20'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Content Area */}
          <main className="order-1 lg:order-2">
            <div className={clsx(
              'mx-auto transition-all duration-500 prose max-w-none',
              theme === 'slate' ? 'prose-invert prose-crimson' : theme === 'warm' ? 'prose-stone' : 'prose-invert prose-red',
              fontClasses[fontFamily],
              sizeClasses[fontSize],
              'prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-p:font-light prose-p:leading-loose prose-p:text-lg md:prose-p:text-xl prose-img:rounded-[2.5rem] prose-img:border prose-img:border-white/5 prose-blockquote:border-l-4 prose-blockquote:border-accent-crimson prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-2xl prose-a:text-accent-crimson prose-a:no-underline hover:prose-a:underline'
            )}>
              <ReactMarkdown
                components={{
                  code({className, children}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <div className="my-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0A0A0A]">
                        <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-accent-crimson" />
                            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">{match[1]}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                            <div className="w-2 h-2 rounded-full bg-green-500/30" />
                          </div>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="!m-0 !p-8 !bg-transparent"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded font-mono text-[0.9em] bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20">
                        {children}
                      </code>
                    )
                  },
                  h1: ({children}) => {
                    const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return <h1 id={id} className="pt-12 mb-8 flex items-center gap-4 group"><span className="text-accent-crimson opacity-20 group-hover:opacity-100 transition-opacity font-mono">#</span>{children}</h1>;
                  },
                  h2: ({children}) => {
                    const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return <h2 id={id} className="pt-12 mb-6 flex items-center gap-4 group"><span className="text-accent-crimson opacity-20 group-hover:opacity-100 transition-opacity font-mono">##</span>{children}</h2>;
                  }
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Bottom Meta */}
            <div className="mt-32 pt-12 border-t border-current/10 flex justify-between items-center opacity-40">
              <div className="flex items-center gap-4">
                <Terminal size={16} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Protocol EOF</span>
              </div>
              <div className="flex gap-6">
                <button className="text-tertiary hover:text-accent-crimson transition-colors"><Share2 size={18} /></button>
                <button className="text-tertiary hover:text-accent-crimson transition-colors"><Bookmark size={18} /></button>
              </div>
            </div>
          </main>

          {/* RIGHT SIDE: Table of Contents */}
          <aside className="order-3 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-8 text-accent-crimson">
                  <List size={16} />
                  <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Neural Index</h3>
                </div>
                <nav className="flex flex-col gap-1">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToHeading(h.id)}
                      className={clsx(
                        'text-left text-[10px] py-3 px-4 rounded-xl transition-all duration-300 font-mono uppercase tracking-widest border border-transparent',
                        activeHeading === h.id 
                          ? 'bg-accent-crimson text-white font-black shadow-lg shadow-accent-crimson/30'
                          : 'text-tertiary hover:bg-white/5'
                      )}
                    >
                      <span className="opacity-40 mr-2">{i + 1}.</span>
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Reading Stats */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest opacity-50">
                  <span>Complexity</span>
                  <span className="text-accent-crimson">High</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest opacity-50">
                  <span>Latency</span>
                  <span className="text-accent-glow">12ms</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
