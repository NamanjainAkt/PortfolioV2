import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage?: string;
  createdAt: string;
  category?: string;
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const plainText = (content: string) => {
  if (!content) return '';
  return content
    .replace(/^#\s+.+\r?\n+/, '')
    .replace(/[#*_>`[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const readTime = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    const query = searchQuery.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        (blog.category && blog.category.toLowerCase().includes(query))
    );
  }, [blogs, searchQuery]);

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <p className="mono-label">Notes — Writing</p>

          <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-medium tracking-tightest sm:text-6xl">Writing.</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary">
                Occasional notes on systems, interfaces and the craft of building software.
              </p>
            </div>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
              {loading ? '—' : String(blogs.length).padStart(2, '0')} posts
            </p>
          </div>

          <div className="mt-9 border-t border-line pt-4">
            <label className="flex items-center gap-3">
              <Search size={14} className="shrink-0 text-tertiary" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts"
                aria-label="Search posts"
                className="w-full bg-transparent py-1.5 text-sm text-primary outline-none placeholder:text-tertiary"
              />
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="page-column py-8 sm:py-10">
          {loading ? (
            <div className="border-t border-line" aria-label="Loading posts">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border-b border-line py-5">
                  <div className="h-2.5 w-28 bg-surface" />
                  <div className="mt-3 h-5 w-2/3 bg-surface" />
                  <div className="mt-2 h-3 w-full bg-surface" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="border-y border-line py-20 text-center">
              <p className="mono-label">No posts</p>
              <p className="mt-3 text-sm text-secondary">
                {searchQuery ? `Nothing matches “${searchQuery}”.` : 'No posts published yet.'}
              </p>
            </div>
          ) : (
            <div className="border-t border-line">
              {filteredBlogs.map((blog) => {
                const excerpt = plainText(blog.content);
                return (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-start gap-4 border-b border-line py-5 transition-colors duration-300 hover:bg-surface sm:gap-6 sm:py-6"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary">
                        {blog.category || 'Notes'} · {formatDate(blog.createdAt)}
                        <span className="sm:hidden"> · {readTime(blog.content || '')} min</span>
                      </p>
                      <h2 className="mt-1.5 text-lg font-medium tracking-tight sm:text-xl">
                        {blog.title}
                      </h2>
                      {excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-secondary">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <span className="hidden shrink-0 font-mono text-[10px] text-tertiary sm:block">
                        {readTime(blog.content || '')} min
                      </span>
                      <ArrowUpRight
                        size={15}
                        className="text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default Blogs;
