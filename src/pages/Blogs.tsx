import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage?: string;
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

  // Calculate reading time (rough estimate: 200 words per minute)
  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="pt-32 container mx-auto px-4 min-h-screen max-w-5xl">
        <div className="text-center text-secondary">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>Loading thoughts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen max-w-5xl pb-20">
      <FadeInWhenVisible>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Writings
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Thoughts on development, design, and building digital products.
          </p>
        </div>
      </FadeInWhenVisible>

      {blogs.length > 0 ? (
        <div className="grid gap-8">
          {/* Featured Post (First Post) */}
          {blogs[0] && (
            <FadeInWhenVisible>
              <Link to={`/blogs/${blogs[0].slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-surface border border-border hover:border-accent-crimson/50 transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                      {blogs[0].featuredImage ? (
                        <img
                          src={blogs[0].featuredImage}
                          alt={blogs[0].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-elevated flex items-center justify-center">
                          <BookOpen size={64} className="text-tertiary" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                        <span className="text-accent-crimson font-medium">Featured</span>
                        <span>•</span>
                        <span>{format(new Date(blogs[0].createdAt), 'MMMM d, yyyy')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {getReadingTime(blogs[0].content)}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent-crimson transition-colors">
                        {blogs[0].title}
                      </h2>
                      <p className="text-secondary line-clamp-3 mb-6">
                        {blogs[0].content.slice(0, 200).replace(/[#*_]/g, '')}...
                      </p>
                      <div className="flex items-center text-accent-crimson font-medium">
                        Read article
                        <ArrowUpRight size={18} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInWhenVisible>
          )}

          {/* Rest of the Posts */}
          <div className="grid md:grid-cols-2 gap-6">
            {blogs.slice(1).map((blog, index) => (
              <FadeInWhenVisible key={blog.id} delay={index * 0.1}>
                <Link to={`/blogs/${blog.slug}`} className="group block h-full">
                  <div className="h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-accent-crimson/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-crimson/5">
                    <div className="aspect-video overflow-hidden">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-elevated flex items-center justify-center">
                          <BookOpen size={40} className="text-tertiary" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-secondary mb-3">
                        <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-accent-crimson transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      ) : (
        <FadeInWhenVisible>
          <div className="text-center py-20">
            <BookOpen size={64} className="mx-auto mb-4 text-tertiary" />
            <p className="text-tertiary text-lg">No thoughts recorded yet.</p>
            <p className="text-secondary text-sm mt-2">Check back soon for new content.</p>
          </div>
        </FadeInWhenVisible>
      )}
    </div>
  );
};

export default Blogs;
