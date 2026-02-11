import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Sun, Moon, Clock, BookOpen, List } from 'lucide-react';
import clsx from 'clsx';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage?: string;
  createdAt: string;
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
  const [showToc, setShowToc] = useState(true);
  
  // Persistent Reading Mode
  const [readingMode, setReadingMode] = useState<'slate' | 'warm'>(() => {
    return (localStorage.getItem('readingMode') as 'slate' | 'warm') || 'slate';
  });

  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
  }, [readingMode]);

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
  }, [slug]);

  // Extract headings from markdown content
  const headings = useMemo<Heading[]>(() => {
    if (!blog?.content) return [];
    
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;
    
    while ((match = headingRegex.exec(blog.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      matches.push({ id, text, level });
    }
    
    return matches;
  }, [blog?.content]);

  // Scroll to heading
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveHeading(headingId);
    }
  };

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Calculate reading time
  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Add IDs to headings in markdown
  const addHeadingIds = (content: string): string => {
    return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
      const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return `${hashes} ${text}\n<a id="${id}"></a>`;
    });
  };

  if (loading) return (
    <div className="pt-32 text-center text-secondary min-h-screen">
      <BookOpen size={48} className="mx-auto mb-4 animate-pulse" />
      <p>Loading...</p>
    </div>
  );
  
  if (!blog) return (
    <div className="pt-32 text-center text-secondary min-h-screen">
      <BookOpen size={48} className="mx-auto mb-4" />
      <p className="text-xl mb-4">Blog not found</p>
      <Link to="/blogs" className="text-accent-crimson hover:underline">
        Back to writings
      </Link>
    </div>
  );

  const modeStyles = {
    slate: {
      container: 'bg-background text-primary',
      prose: 'prose-invert',
      tocBg: 'bg-surface/80',
      tocBorder: 'border-border',
      tocText: 'text-secondary',
      tocActive: 'text-accent-crimson',
      codeBg: 'bg-elevated/50',
    },
    warm: {
      container: 'bg-[#fdf6e3] text-[#433422]',
      prose: 'prose-stone',
      tocBg: 'bg-[#eee8d5]/80',
      tocBorder: 'border-[#d3cbb8]',
      tocText: 'text-[#586e75]',
      tocActive: 'text-[#b58900]',
      codeBg: 'bg-[#eee8d5]/50',
    },
  };

  const typographyStyles = {
    slate: {
      fontFamily: 'font-sans',
      lineHeight: 'leading-relaxed',
      paragraphSpacing: 'prose-p:my-6',
    },
    warm: {
      fontFamily: 'font-serif',
      lineHeight: 'leading-loose',
      paragraphSpacing: 'prose-p:my-8 prose-p:text-lg',
    },
  };

  const processedContent = addHeadingIds(blog.content);

  return (
    <div className={clsx('min-h-screen transition-colors duration-500', modeStyles[readingMode].container)}>
      {/* Hero Section with Featured Image */}
      {blog.featuredImage && (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="relative">
        {/* Main Content */}
        <div className={clsx(
          'container mx-auto px-4 pt-8 pb-20 relative z-10 transition-all duration-500',
          showToc && headings.length > 0 ? 'max-w-4xl mr-auto lg:mr-[320px] xl:mx-auto xl:max-w-4xl' : 'max-w-3xl'
        )}>
          <FadeInWhenVisible>
            <div className="flex justify-between items-center mb-8">
              <Link 
                to="/blogs" 
                className={clsx(
                  'flex items-center text-sm font-medium transition-colors group px-4 py-2 rounded-full border backdrop-blur-sm',
                  readingMode === 'slate' 
                    ? 'hover:text-accent-crimson bg-surface/80 border-border' 
                    : 'hover:text-[#b58900] bg-[#eee8d5]/80 border-[#d3cbb8]'
                )}
              >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Back to Writings
              </Link>
              <div className="flex items-center gap-2">
                {headings.length > 0 && (
                  <motion.button
                    onClick={() => setShowToc(!showToc)}
                    className={clsx(
                      'p-2 rounded-full border transition-colors backdrop-blur-sm lg:hidden',
                      readingMode === 'slate'
                        ? 'border-border hover:bg-elevated bg-surface/80'
                        : 'border-[#d3cbb8] hover:bg-[#eee8d5] bg-[#fdf6e3]/80'
                    )}
                    title="Toggle Table of Contents"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List size={18} />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setReadingMode(readingMode === 'slate' ? 'warm' : 'slate')}
                  className={clsx(
                    'p-2 rounded-full border transition-colors backdrop-blur-sm',
                    readingMode === 'slate'
                      ? 'border-border hover:bg-elevated bg-surface/80'
                      : 'border-[#d3cbb8] hover:bg-[#eee8d5] bg-[#fdf6e3]/80'
                  )}
                  title="Toggle Reading Mode"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {readingMode === 'slate' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
              </div>
            </div>
          </FadeInWhenVisible>

          <article>
            <FadeInWhenVisible delay={0.1}>
              <header className="mb-12">
                <div className={clsx(
                  'flex items-center gap-4 text-sm mb-6',
                  readingMode === 'slate' ? 'text-secondary' : 'text-[#586e75]'
                )}>
                  <span className={clsx(
                    'px-3 py-1 rounded-full font-medium',
                    readingMode === 'slate' 
                      ? 'bg-accent-crimson/10 text-accent-crimson' 
                      : 'bg-[#b58900]/10 text-[#b58900]'
                  )}>
                    Article
                  </span>
                  <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {getReadingTime(blog.content)}
                  </span>
                </div>
                <h1 className={clsx(
                  'text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight',
                  typographyStyles[readingMode].fontFamily
                )}>
                  {blog.title}
                </h1>
                {!blog.featuredImage && (
                  <div className={clsx(
                    'w-20 h-1 rounded-full',
                    readingMode === 'slate' ? 'bg-accent-crimson' : 'bg-[#b58900]'
                  )} />
                )}
              </header>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <div className={clsx(
                "prose prose-lg max-w-none prose-headings:font-serif prose-code:font-mono prose-img:rounded-lg",
                typographyStyles[readingMode].lineHeight,
                typographyStyles[readingMode].paragraphSpacing,
                modeStyles[readingMode].prose
              )}>
                <ReactMarkdown
                  components={{
                    code({className, children}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={clsx(`${className} px-1 py-0.5 rounded text-sm`, modeStyles[readingMode].codeBg)}>
                          {children}
                        </code>
                      )
                    },
                    h1: ({children, ...props}) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h1 id={id} {...props}>{children}</h1>;
                    },
                    h2: ({children, ...props}) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h2 id={id} {...props}>{children}</h2>;
                    },
                    h3: ({children, ...props}) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h3 id={id} {...props}>{children}</h3>;
                    },
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            </FadeInWhenVisible>

            {/* Article Footer */}
            <FadeInWhenVisible delay={0.3}>
              <div className={clsx(
                'mt-16 pt-8 border-t',
                readingMode === 'slate' ? 'border-border' : 'border-[#d3cbb8]'
              )}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className={clsx(
                    'text-sm',
                    readingMode === 'slate' ? 'text-secondary' : 'text-[#586e75]'
                  )}>
                    Published on {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                  </p>
                  <Link 
                    to="/blogs" 
                    className={clsx(
                      'hover:underline flex items-center gap-2',
                      readingMode === 'slate' ? 'text-accent-crimson' : 'text-[#b58900]'
                    )}
                  >
                    Read more articles
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </div>
            </FadeInWhenVisible>
          </article>
        </div>

        {/* Table of Contents Sidebar */}
        {headings.length > 0 && showToc && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={clsx(
              'hidden lg:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto',
              'backdrop-blur-xl rounded-xl border p-4 z-20',
              modeStyles[readingMode].tocBg,
              modeStyles[readingMode].tocBorder
            )}
          >
            <h3 className={clsx(
              'text-sm font-bold mb-4 uppercase tracking-wider',
              readingMode === 'slate' ? 'text-primary' : 'text-[#433422]'
            )}>
              Contents
            </h3>
            <nav className="space-y-1">
              {headings.map((heading, index) => (
                <button
                  key={`${heading.id}-${index}`}
                  onClick={() => scrollToHeading(heading.id)}
                  className={clsx(
                    'block w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200 truncate',
                    activeHeading === heading.id
                      ? clsx('font-medium', modeStyles[readingMode].tocActive)
                      : modeStyles[readingMode].tocText,
                    heading.level === 1 ? 'font-medium' : '',
                    heading.level === 2 ? 'ml-3' : '',
                    heading.level === 3 ? 'ml-6' : '',
                    heading.level >= 4 ? 'ml-9' : ''
                  )}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </motion.div>
        )}

        {/* Mobile TOC Drawer */}
        {headings.length > 0 && showToc && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={clsx(
              'lg:hidden fixed bottom-0 left-0 right-0 z-50',
              'backdrop-blur-xl border-t max-h-[50vh] overflow-y-auto',
              modeStyles[readingMode].tocBg,
              modeStyles[readingMode].tocBorder
            )}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className={clsx(
                  'text-sm font-bold uppercase tracking-wider',
                  readingMode === 'slate' ? 'text-primary' : 'text-[#433422]'
                )}>
                  Contents
                </h3>
                <button 
                  onClick={() => setShowToc(false)}
                  className={modeStyles[readingMode].tocText}
                >
                  Close
                </button>
              </div>
              <nav className="space-y-1">
                {headings.map((heading, index) => (
                  <button
                    key={`${heading.id}-${index}`}
                    onClick={() => {
                      scrollToHeading(heading.id);
                      setShowToc(false);
                    }}
                    className={clsx(
                      'block w-full text-left text-sm py-2 px-2 rounded transition-all duration-200',
                      activeHeading === heading.id
                        ? clsx('font-medium', modeStyles[readingMode].tocActive)
                        : modeStyles[readingMode].tocText,
                      heading.level === 1 ? 'font-medium' : '',
                      heading.level === 2 ? 'ml-3' : '',
                      heading.level === 3 ? 'ml-6' : '',
                      heading.level >= 4 ? 'ml-9' : ''
                    )}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
