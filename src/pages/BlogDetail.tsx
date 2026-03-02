import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, List, Type, Palette, Maximize2, Terminal, Share2, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';

// Lazy load heavy markdown components
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(mod => ({ default: mod.Prism }))
);
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

type ThemeType = 'slate' | 'warm' | 'cyber';
type FontFamilyType = 'sans' | 'serif' | 'mono';
type FontSizeType = 'sm' | 'md' | 'lg';

// Static theme configuration
const THEME_CLASSES: Record<ThemeType, string> = {
  slate: 'bg-[#0A0A0A] text-[#EDEDED] selection:bg-white/20',
  warm: 'bg-[#FDF6E3] text-[#433422] selection:bg-[#b58900]/20',
  cyber: 'bg-[#050505] text-[#FF6B6B] selection:bg-[#C8102E]/30'
};

const FONT_CLASSES: Record<FontFamilyType, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
};

const SIZE_CLASSES: Record<FontSizeType, string> = {
  sm: 'prose-sm',
  md: 'prose-base',
  lg: 'prose-lg md:prose-xl'
};

// Markdown loading fallback
const MarkdownFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-white/5 rounded w-3/4" />
    <div className="h-4 bg-white/5 rounded w-full" />
    <div className="h-4 bg-white/5 rounded w-5/6" />
    <div className="h-4 bg-white/5 rounded w-4/5" />
  </div>
);

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Reader Customization State
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('blogTheme') as ThemeType) || 'slate';
    }
    return 'slate';
  });
  
  const [fontFamily, setFontFamily] = useState<FontFamilyType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('blogFont') as FontFamilyType) || 'sans';
    }
    return 'sans';
  });
  
  const [fontSize, setFontSize] = useState<FontSizeType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('blogFontSize') as FontSizeType) || 'md';
    }
    return 'md';
  });

  // Parallax Logic
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('blogTheme', theme);
    localStorage.setItem('blogFont', fontFamily);
    localStorage.setItem('blogFontSize', fontSize);
  }, [theme, fontFamily, fontSize]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch {
        console.error('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  // Memoized headings extraction
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

  // Memoized scroll handler
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      setActiveHeading(id);
    }
  }, []);

  // Intersection observer for active heading
  useEffect(() => {
    if (!headings.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { 
        if (entry.isIntersecting) setActiveHeading(entry.target.id); 
      });
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });
    
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [headings]);

  // Memoized markdown components
  const markdownComponents = useMemo(() => ({
    code({ className, children }: { className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
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
          <Suspense fallback={<div className="p-8 text-tertiary font-mono text-sm">Loading code...</div>}>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="!m-0 !p-8 !bg-transparent"
            >
              {codeString}
            </SyntaxHighlighter>
          </Suspense>
        </div>
      ) : (
        <code className="px-1.5 py-0.5 rounded font-mono text-[0.9em] bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20">
          {children}
        </code>
      );
    },
    h1: ({ children }: { children?: React.ReactNode }) => {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h1 id={id} className="pt-12 mb-8 flex items-center gap-4 group scroll-mt-24">
          <span className="text-accent-crimson opacity-20 group-hover:opacity-100 transition-opacity font-mono">#</span>
          {children}
        </h1>
      );
    },
    h2: ({ children }: { children?: React.ReactNode }) => {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h2 id={id} className="pt-12 mb-6 flex items-center gap-4 group scroll-mt-24">
          <span className="text-accent-crimson opacity-20 group-hover:opacity-100 transition-opacity font-mono">##</span>
          {children}
        </h2>
      );
    }
  }), []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent-crimson/20 border-t-accent-crimson rounded-full animate-spin" />
    </div>
  );
  
  if (!blog) return <div className="pt-32 text-center text-secondary min-h-screen font-mono">Protocol Null</div>;

  return (
    <div className={clsx('min-h-screen transition-all duration-700 relative overflow-x-hidden', THEME_CLASSES[theme])}>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-crimson z-[100] origin-left" 
        style={{ scaleX, willChange: 'transform' }} 
      />

      {/* Parallax Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, willChange: 'transform' }} 
          className="absolute inset-0 z-0"
        >
          {blog.featuredImage ? (
            <>
              <img 
                src={blog.featuredImage} 
                className="w-full h-[120%] object-cover saturate-[0.8] brightness-[0.4]" 
                alt="" 
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-current opacity-100" />
              <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
            </>
          ) : (
            <div className="w-full h-full bg-[#111]" />
          )}
        </motion.div>

        <motion.div 
          style={{ opacity, y: titleY, willChange: 'transform, opacity' }} 
          className="container mx-auto px-4 relative z-10 text-center"
        >
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 bg-accent-crimson/20 border border-accent-crimson/30 rounded-full text-[10px] font-mono text-white uppercase font-black tracking-[0.3em] backdrop-blur-md">
                {blog.category || 'Architecture'}
              </span>
              <div className="w-1 h-1 rounded-full bg-accent-crimson" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-70 text-white">
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </span>
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
                      {(['slate', 'warm', 'cyber'] as ThemeType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
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
                      {(['sans', 'serif', 'mono'] as FontFamilyType[]).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFontFamily(f)}
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
                      {(['sm', 'md', 'lg'] as FontSizeType[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setFontSize(s)}
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
              FONT_CLASSES[fontFamily],
              SIZE_CLASSES[fontSize],
              'prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-p:font-light prose-p:leading-loose prose-img:rounded-[2.5rem] prose-img:border prose-img:border-white/5 prose-blockquote:border-l-4 prose-blockquote:border-accent-crimson prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-2xl prose-a:text-accent-crimson prose-a:no-underline hover:prose-a:underline'
            )}>
              <Suspense fallback={<MarkdownFallback />}>
                <ReactMarkdown components={markdownComponents}>
                  {blog.content}
                </ReactMarkdown>
              </Suspense>
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
              <div 
                className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent-crimson/30 hover:scrollbar-thumb-accent-crimson/50 scrollbar-thumb-rounded-full pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(200, 16, 46, 0.3) transparent',
                }}
              >
                <div className="flex items-center gap-3 mb-6 text-accent-crimson">
                  <List size={16} />
                  <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Neural Index</h3>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToHeading(h.id)}
                      className={clsx(
                        'text-left py-2.5 px-3 rounded-lg transition-all duration-300 border border-transparent',
                        activeHeading === h.id 
                          ? 'bg-accent-crimson text-white font-bold shadow-lg shadow-accent-crimson/30'
                          : 'text-tertiary hover:bg-white/5 hover:text-white',
                        // Indentation based on heading level
                        h.level === 1 && 'text-[10px] font-mono uppercase tracking-wider',
                        h.level === 2 && 'text-[9px] font-mono uppercase tracking-wider ml-3',
                        h.level === 3 && 'text-[8px] font-mono uppercase tracking-wider ml-6 opacity-80',
                        h.level >= 4 && 'text-[8px] font-mono uppercase tracking-wider ml-9 opacity-60'
                      )}
                    >
                      <span className={clsx(
                        'mr-2 opacity-40',
                        activeHeading === h.id && 'opacity-70'
                      )}>
                        {h.level === 1 && '#'}
                        {h.level === 2 && '##'}
                        {h.level === 3 && '###'}
                        {h.level >= 4 && '####'}
                      </span>
                      <span className="line-clamp-1">{h.text}</span>
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
