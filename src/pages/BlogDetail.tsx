import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Sun, Moon, Clock, BookOpen } from 'lucide-react';
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

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  // Calculate reading time
  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
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
    slate: 'bg-background text-primary',
    warm: 'bg-[#fdf6e3] text-[#433422]',
  };

  return (
    <div className={clsx('min-h-screen transition-colors duration-500', modeStyles[readingMode])}>
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

      <div className="container mx-auto px-4 max-w-3xl pt-8 pb-20 -mt-32 relative z-10">
        <FadeInWhenVisible>
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/blogs" 
              className="flex items-center text-sm font-medium hover:text-accent-crimson transition-colors group bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Writings
            </Link>
            <motion.button
              onClick={() => setReadingMode(readingMode === 'slate' ? 'warm' : 'slate')}
              className="p-2 rounded-full border border-border hover:bg-elevated transition-colors bg-surface/80 backdrop-blur-sm"
              title="Toggle Reading Mode"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {readingMode === 'slate' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
        </FadeInWhenVisible>

        <article>
          <FadeInWhenVisible delay={0.1}>
            <header className="mb-12">
              <div className="flex items-center gap-4 text-sm text-secondary mb-6">
                <span className="bg-accent-crimson/10 text-accent-crimson px-3 py-1 rounded-full font-medium">
                  Article
                </span>
                <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {getReadingTime(blog.content)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              {!blog.featuredImage && (
                <div className="w-20 h-1 bg-accent-crimson rounded-full" />
              )}
            </header>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className={clsx(
                "prose prose-lg max-w-none prose-headings:font-serif prose-code:font-mono prose-img:rounded-lg",
                readingMode === 'slate' ? 'prose-invert' : 'prose-stone'
            )}>
              <ReactMarkdown
                components={{
                  code({node, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} bg-elevated/50 px-1 py-0.5 rounded text-sm`} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </FadeInWhenVisible>

          {/* Article Footer */}
          <FadeInWhenVisible delay={0.3}>
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-secondary text-sm">
                  Published on {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                </p>
                <Link 
                  to="/blogs" 
                  className="text-accent-crimson hover:underline flex items-center gap-2"
                >
                  Read more articles
                  <ArrowLeft size={16} className="rotate-180" />
                </Link>
              </div>
            </div>
          </FadeInWhenVisible>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
