import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';

interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  images: string[];
  githubUrl: string;
  liveUrl: string;
  category?: string;
  createdAt?: string;
}

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`, { signal });
        if (res.ok) {
          const data = await res.json();
          if (!signal.aborted) setProject(data);
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch project', error);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await fetch('/api/projects', { signal });
        if (res.ok) {
          const data = await res.json();
          if (!signal.aborted) setAllProjects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch projects', error);
      }
    };

    fetchProject();
    fetchAllProjects();
    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [slug]);

  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const year = project?.createdAt ? new Date(project.createdAt).getFullYear() : null;

  if (loading) {
    return (
      <div className="frame min-h-[70vh]">
        <div className="page-column py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-2.5 w-24 bg-surface" />
            <div className="h-12 w-2/3 bg-surface" />
            <div className="h-4 w-1/2 bg-surface" />
            <div className="mt-10 aspect-[16/9] w-full bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="frame">
        <div className="page-column py-24 text-center">
          <p className="mono-label">404 — Not found</p>
          <p className="mt-4 text-sm text-secondary">This project doesn&apos;t exist or was removed.</p>
          <Link to="/projects" className="btn-outline mt-6">
            <ArrowLeft size={14} />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <Lightbox
        images={project.images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((p) => (p + 1) % project.images.length)}
        onPrev={() => setCurrentImageIndex((p) => (p - 1 + project.images.length) % project.images.length)}
        onGoTo={(idx) => setCurrentImageIndex(idx)}
      />

      <article>
        <header className="border-b border-line">
          <div className="page-column py-10 sm:py-14">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary transition-colors hover:text-primary"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              All projects
            </Link>

            <p className="mono-label mt-8">
              {project.category || 'Development'}
              {year ? ` — ${year}` : ''}
            </p>

            <h1 className="mt-3 text-4xl font-medium leading-[0.95] tracking-tightest sm:text-6xl">
              {project.title}
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-secondary">
              {project.overview}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-solid">
                  Visit live
                  <ArrowUpRight size={14} />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Github size={14} strokeWidth={1.6} />
                  Source
                </a>
              )}
            </div>
          </div>

          {project.images[0] && (
            <div className="page-column pb-10 sm:pb-14">
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="group block w-full overflow-hidden border border-line bg-surface"
                aria-label="Open cover image"
              >
                <img
                  src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.hero })}
                  alt={project.title}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.015]"
                  loading="eager"
                />
              </button>
            </div>
          )}
        </header>

        {(project.problem || project.solution) && (
          <section className="border-b border-line">
            <div className="page-column py-12 sm:py-16">
              <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                {project.problem && (
                  <div>
                    <p className="mono-label flex items-center gap-2">
                      <span className="h-1 w-1 bg-primary" aria-hidden="true" />
                      Problem
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-secondary">{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="mono-label flex items-center gap-2">
                      <span className="h-1 w-1 bg-primary" aria-hidden="true" />
                      Solution
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-secondary">{project.solution}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {project.techStack.length > 0 && (
          <section className="border-b border-line">
            <div className="page-column py-12 sm:py-16">
              <div className="grid gap-8 sm:grid-cols-[220px_1fr] sm:gap-12">
                <div>
                  <p className="mono-label">Stack</p>
                  <p className="mt-2 text-sm text-secondary">Tools and services used.</p>
                </div>
                <div className="border-t border-line">
                  {project.techStack.map((tech) => (
                    <div key={tech} className="meta-row">
                      <span className="font-mono text-[11px] text-primary">{tech}</span>
                      <span className="mono-label">used</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {project.images.length > 1 && (
          <section className="border-b border-line">
            <div className="page-column py-12 sm:py-16">
              <div className="flex items-end justify-between border-b border-line pb-5">
                <div>
                  <p className="mono-label">Gallery</p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight">Screens</h2>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
                  {String(project.images.length).padStart(2, '0')} images
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="group relative overflow-hidden border border-line bg-surface text-left"
                    aria-label={`Open image ${idx + 1}`}
                  >
                    <img
                      src={getOptimizedImageUrl(img, { width: ImageSizes.large })}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover grayscale transition-all duration-700 ease-smooth group-hover:scale-[1.02] group-hover:grayscale-0"
                    />
                    <span className="absolute bottom-3 left-3 bg-background/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-secondary backdrop-blur">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {relatedProjects.length > 0 && (
        <section>
          <div className="page-column py-12 sm:py-16">
            <div className="flex items-end justify-between border-b border-line pb-5">
              <div>
                <p className="mono-label">More</p>
                <h2 className="mt-2 text-xl font-medium tracking-tight">Other projects.</h2>
              </div>
              <Link to="/projects" className="link-underline text-[12px] text-secondary hover:text-primary">
                All projects
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-2">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  to={`/projects/${related.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-line py-4 transition-colors duration-300 last:border-b-0 hover:bg-surface"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary">
                      {related.category || 'Development'}
                    </p>
                    <h3 className="mt-1 truncate text-[15px] font-medium tracking-tight">{related.title}</h3>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="shrink-0 text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default ProjectDetail;
