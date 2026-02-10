import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Blog {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="pt-32 text-center text-secondary">Loading thoughts...</div>;
  }

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center"
      >
        Writings
      </motion.h1>

      <div className="space-y-8">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/blogs/${blog.slug}`} className="block border-b border-border pb-8 hover:border-accent-crimson transition-colors">
              <span className="text-sm text-accent-glow font-mono mb-2 block">
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </span>
              <h2 className="text-2xl font-bold group-hover:text-accent-crimson transition-colors">
                {blog.title}
              </h2>
            </Link>
          </motion.div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center text-tertiary py-20">
            No thoughts recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
