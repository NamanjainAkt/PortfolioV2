import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
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

  if (loading) return <div className="pt-32 text-center text-secondary">Loading...</div>;
  if (!blog) return <div className="pt-32 text-center text-secondary">Blog not found</div>;

  const modeStyles = {
    slate: 'bg-background text-primary',
    warm: 'bg-[#fdf6e3] text-[#433422]',
  };

  return (
    <div className={clsx('min-h-screen transition-colors duration-500', modeStyles[readingMode])}>
      <div className="container mx-auto px-4 max-w-3xl pt-24 pb-20">
        <div className="flex justify-between items-center mb-12">
          <Link to="/blogs" className="flex items-center text-sm font-medium hover:text-accent-crimson transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Writings
          </Link>
          <button
            onClick={() => setReadingMode(readingMode === 'slate' ? 'warm' : 'slate')}
            className="p-2 rounded-full border border-border hover:bg-elevated transition-colors"
            title="Toggle Reading Mode"
          >
            {readingMode === 'slate' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-12 text-center">
            <span className="text-sm font-mono text-accent-glow mb-4 block">
              {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
          </header>

          <div className={clsx(
              "prose prose-lg max-w-none prose-headings:font-serif prose-code:font-mono",
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
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
