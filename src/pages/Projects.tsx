import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';
import { usePageMeta } from '../hooks/usePageMeta';

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  techStack: string[];
  images: string[];
  category?: string;
}

const Projects = () => {
  usePageMeta({
    title: 'Work — Projects by Naman Jain',
    description:
      'Selected engineering projects across full-stack web applications, tooling, and systems design. Built with React, TypeScript, Node.js and Postgres.',
    path: '/projects',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?orderBy=displayOrder');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(projects.map((p) => p.category || 'Development')))],
    [projects]
  );

  const filteredProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => (p.category || 'Development') === filter)),
    [filter, projects]
  );

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <p className="mono-label">Archive — Selected work</p>

          <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-medium tracking-tightest sm:text-6xl">Projects.</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary">
                A record of the systems, products and interfaces I&apos;ve built — from schema to
                shipped screen.
              </p>
            </div>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
              {loading ? '—' : String(projects.length).padStart(2, '0')} entries
            </p>
          </div>

          {!loading && categories.length > 2 && (
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
              <span className="mono-label">Filter</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={clsx(
                    'font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-200',
                    filter === cat
                      ? 'text-primary'
                      : 'text-tertiary hover:text-primary'
                  )}
                >
                  {filter === cat && <span className="mr-1.5" aria-hidden="true">—</span>}
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="page-column py-8 sm:py-10">
          {loading ? (
            <div className="border-t border-line" aria-label="Loading projects">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 border-b border-line py-5 sm:gap-6">
                  <div className="h-14 w-20 shrink-0 bg-surface sm:h-20 sm:w-32" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-20 bg-surface" />
                    <div className="h-4 w-1/3 bg-surface" />
                    <div className="h-2.5 w-2/3 bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="border-y border-line py-20 text-center">
              <p className="mono-label">No projects</p>
              <p className="mt-3 text-sm text-secondary">
                Nothing published in this category yet.
              </p>
            </div>
          ) : (
            <div className="border-t border-line">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-line py-5 transition-colors duration-300 hover:bg-surface sm:grid-cols-[128px_1fr_auto] sm:gap-6"
                >
                  <div className="h-14 w-20 overflow-hidden border border-line bg-surface sm:h-20 sm:w-32">
                    {project.images[0] ? (
                      <img
                        src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.thumbnail })}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-mono text-[10px] tracking-[0.2em] text-tertiary">
                        {project.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary">
                      {project.category || 'Development'}
                    </p>
                    <h2 className="mt-1 text-lg font-medium tracking-tight sm:text-xl">
                      {project.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-secondary">
                      {project.overview}
                    </p>
                    <div className="mt-2 hidden flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-tertiary sm:flex">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span key={tech} className="flex items-center gap-2">
                          {i > 0 && <span aria-hidden="true">·</span>}
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default Projects;
