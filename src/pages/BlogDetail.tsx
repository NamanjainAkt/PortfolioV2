import { useEffect, useState, useMemo, useCallback, Suspense, lazy, isValidElement, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { usePageMeta } from '../hooks/usePageMeta';

const MarkdownRenderer = lazy(() =>
  import('../components/MarkdownRenderer').then((m) => ({ default: m.MarkdownRenderer }))
);

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

const MarkdownFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-7 w-3/4 bg-surface" />
    <div className="h-4 w-full bg-surface" />
    <div className="h-4 w-5/6 bg-surface" />
    <div className="h-4 w-4/5 bg-surface" />
  </div>
);

const extractPlainText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractPlainText).join('');
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractPlainText(children.props.children);
  }
  return String(children);
};

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');

  const description = useMemo(() => {
    if (!blog?.content) return 'Read this article by Naman Jain on software engineering and systems.';
    return blog.content
      .replace(/^#\s+.+\r?\n+/, '')
      .replace(/[#*_>`[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
  }, [blog?.content]);

  usePageMeta({
    title: blog ? `${blog.title} — Writing` : 'Writing',
    description,
    path: `/blogs/${slug}`,
    image: blog?.featuredImage,
    type: 'article',
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`, { signal });
        if (res.ok) {
          const data = await res.json();
          if (!signal.aborted) setBlog(data);
        }
      } catch (e) {
        if ((e as Error)?.name !== 'AbortError') console.error('Failed to fetch blog');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [slug]);

  const content = useMemo(
    () => (blog?.content ? blog.content.replace(/^#\s+.+\r?\n+/, '') : ''),
    [blog?.content]
  );

  const headings = useMemo<Heading[]>(() => {
    if (!content) return [];
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      matches.push({ id, text, level: match[1].length });
    }
    return matches;
  }, [content]);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      setActiveHeading(id);
    }
  }, []);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const markdownComponents = useMemo(
    () => ({
      h1: ({ children }: { children?: ReactNode }) => {
        const id = extractPlainText(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return (
          <h1 id={id} className="scroll-mt-24">
            {children}
          </h1>
        );
      },
      h2: ({ children }: { children?: ReactNode }) => {
        const id = extractPlainText(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return (
          <h2 id={id} className="scroll-mt-24">
            {children}
          </h2>
        );
      },
      h3: ({ children }: { children?: ReactNode }) => {
        const id = extractPlainText(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return (
          <h3 id={id} className="scroll-mt-24">
            {children}
          </h3>
        );
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="frame min-h-[70vh]">
        <div className="page-column py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-2.5 w-32 bg-surface" />
            <div className="h-12 w-3/4 bg-surface" />
            <div className="h-4 w-1/2 bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="frame">
        <div className="page-column py-24 text-center">
          <p className="mono-label">404 — Not found</p>
          <p className="mt-4 text-sm text-secondary">This post doesn&apos;t exist or was removed.</p>
          <Link to="/blogs" className="btn-outline mt-6">
            <ArrowLeft size={14} />
            Back to writing
          </Link>
        </div>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil((blog.content || '').split(/\s+/).length / 200));

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <article>
        <header className="border-b border-line">
          <div className="page-column py-10 sm:py-14">
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary transition-colors hover:text-primary"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              All writing
            </Link>

            <p className="mono-label mt-8">
              {blog.category || 'Notes'} · {formatDate(blog.createdAt)} · {readTime} min read
            </p>

            <h1 className="mt-3 text-3xl font-medium leading-[1.05] tracking-tightest sm:text-5xl">
              {blog.title}
            </h1>
          </div>

          {blog.featuredImage && (
            <div className="page-column pb-10 sm:pb-14">
              <div className="overflow-hidden border border-line bg-surface">
                <img
                  src={blog.featuredImage}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          )}
        </header>

        <div className="page-column py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_190px] lg:gap-14">
            <div className="min-w-0">
              <div className="prose prose-sm max-w-none sm:prose-base prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-img:border prose-img:border-line prose-blockquote:border-l-2 prose-blockquote:border-line prose-blockquote:font-normal prose-blockquote:not-italic prose-a:underline prose-a:decoration-line prose-a:underline-offset-4 hover:prose-a:decoration-primary">
                <Suspense fallback={<MarkdownFallback />}>
                  <MarkdownRenderer content={content} components={markdownComponents} />
                </Suspense>
              </div>

              <div className="mt-14 flex items-center justify-between border-t border-line pt-5">
                <Link
                  to="/blogs"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary transition-colors hover:text-primary"
                >
                  <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Back to writing
                </Link>
                <a
                  href={`mailto:namanjainakt@gmail.com?subject=${encodeURIComponent(`Re: ${blog.title}`)}`}
                  className="link-underline inline-flex items-center gap-1 text-[12px] text-secondary hover:text-primary"
                >
                  Reply
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="mono-label">On this page</p>
                  <nav className="mt-4 border-l border-line">
                    {headings.map((h, i) => (
                      <button
                        key={`${h.id}-${i}`}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={clsx(
                          'block w-full border-l py-1.5 text-left text-[12px] leading-snug transition-colors duration-200',
                          h.level === 1 && 'pl-3',
                          h.level === 2 && 'pl-3',
                          h.level === 3 && 'pl-6',
                          activeHeading === h.id
                            ? '-ml-px border-primary pl-3 text-primary'
                            : '-ml-px border-transparent text-tertiary hover:text-primary'
                        )}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default BlogDetail;
