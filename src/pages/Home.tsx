import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Download,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import SkillSection from '../components/SkillSection';
import GitHubContributions from '../components/GitHubContributions';
import LeetCodeStats from '../components/LeetCodeStats';
import RemoteOverlap from '../components/RemoteOverlap';
import Signature from '../components/Signature';
import WorkExperience from '../components/WorkExperience';
import { LeetCodeIcon } from '../components/LeetCodeIcon';
import { usePageMeta } from '../hooks/usePageMeta';
import { getOptimizedImageUrl, ImageSizes } from '../lib/imageUtils';
import type { Project } from '../types/project';

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  category?: string;
}

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/namanjainakt/', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/naman-jain-akt/', icon: Linkedin },
  { label: 'LeetCode', href: 'https://leetcode.com/u/namanjainakt/', icon: LeetCodeIcon },
  { label: 'Email', href: 'mailto:namanjainakt007@gmail.com', icon: Mail },
] as const;

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

const ABOUT_POINTS = [
  'Start from the data model. If the schema is wrong, the API and the UI are just debt with extra steps.',
  'Boring by default. One database, clear boundaries, no abstraction until the second real use.',
  'Finish the last 10%. Deploy, logging and error states are what turn a demo into a product.',
];

const readTime = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

const Home = () => {
  usePageMeta({
    title: 'Naman Jain — Full Stack Engineer (React, Node, TypeScript)',
    description:
      'Full-stack engineer building products end to end — design, schema, API, interface and deploy. React, TypeScript and Node on the surface, MongoDB and Prisma underneath.',
    path: '/',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const update = () =>
      setLocalTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?limit=5&orderBy=displayOrder', { signal });
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const data = await res.json();
        if (!signal.aborted && Array.isArray(data)) setProjects(data);
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch projects');
      } finally {
        if (!signal.aborted) setLoadingProjects(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs', { signal });
        if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
        const data = await res.json();
        if (!signal.aborted && Array.isArray(data)) setBlogs(data.slice(0, 3));
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch blogs');
      } finally {
        if (!signal.aborted) setLoadingBlogs(false);
      }
    };

    fetchProjects();
    fetchBlogs();
    return () => controller.abort();
  }, []);

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      {/* Hero */}
      <section className="border-b border-line">
        <div className="page-column pb-10 pt-12 sm:pb-14 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_270px] lg:gap-16">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative w-fit shrink-0">
                  <picture>
                    <source srcSet="/User_img-512.webp" type="image/webp" />
                    <img
                      src="/User_img-512.jpg"
                      alt="Naman Jain"
                      width={512}
                      height={512}
                      loading="eager"
                      decoding="async"
                      className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl border border-line/60 object-cover mix-blend-multiply dark:mix-blend-normal"
                    />
                  </picture>
                  <span
                    className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-success"
                    aria-label="Available for work"
                    title="Available for work"
                  />
                </div>
                <div>
                  <h1 className="text-[2.6rem] leading-[0.98] tracking-tightest sm:text-6xl">Naman Jain</h1>
                  <p className="mt-2 text-sm text-secondary">Full Stack Engineer — React, Node, Postgres</p>
                </div>
              </div>

              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-secondary">
                I build software from scratch: data model first, then the API, then the interface. Mostly
                React and TypeScript on top, Node and Postgres underneath.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <a
                  href="/Naman_s_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid"
                >
                  <Download size={14} />
                  Resume
                </a>
                <a
                  href="https://cal.com/naman-jain-akt/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Calendar size={14} />
                  Book a call
                </a>

                <div className="ml-1 flex items-center gap-1.5">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-secondary transition-colors duration-200 hover:border-primary hover:text-primary"
                    >
                      <social.icon size={15} strokeWidth={1.6} />
                    </a>
                  ))}
                </div>
              </div>

              <Signature className="mt-9" />
            </div>

            <aside>
              <div className="border-t border-line">
                <div className="meta-row">
                  <span className="mono-label">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Open to work
                  </span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Role</span>
                  <span className="text-right text-[13px]">Full Stack Dev @ Flick</span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Based in</span>
                  <span className="text-right text-[13px]">Bhilai, Chhattisgarh</span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Local time</span>
                  <span className="font-mono text-[12px] text-secondary">{localTime} IST</span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Email</span>
                  <a
                    href="mailto:namanjainakt007@gmail.com"
                    className="link-underline break-all text-right text-[13px] text-secondary hover:text-primary"
                  >
                    namanjainakt007@gmail.com
                  </a>
                </div>
              </div>

              <RemoteOverlap />
            </aside>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader
            label="About"
            title="I care about the parts users never see."
          />
          <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_1.35fr] sm:gap-12">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-secondary">
                I&apos;m a full-stack engineer based in Bhilai, Chhattisgarh. Most of my work lives at the
                intersection of product thinking and implementation: shaping the data model, then
                carrying it through the API and interface.
              </p>
              <p className="text-sm leading-relaxed text-secondary">
                I prefer small systems with clear edges, readable code and interfaces that explain
                themselves. When I&apos;m not shipping, I&apos;m usually reading about systems,
                design or the web platform.
              </p>
            </div>
            <ul className="space-y-4">
              {ABOUT_POINTS.map((point, index) => (
                <li key={point} className="flex gap-4 text-sm leading-relaxed text-secondary">
                  <span className="select-none font-mono text-[11px] text-tertiary pt-0.5">
                    0{index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader
            label="Stack"
            title="Tools I reach for."
            description="A pragmatic stack, chosen for speed of delivery and long-term maintainability."
          />
          <div className="mt-7">
            <SkillSection />
          </div>
        </div>
      </section>

      {/* Activity */}
      <section id="activity" className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader
            label="Activity"
            title="Shipping, most days."
            description="A year of public commits, pull requests and issues, plus the problem sets keeping the fundamentals sharp."
          />
          <div className="mt-7 space-y-4">
            <GitHubContributions />
            <LeetCodeStats />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader label="Experience" title="Where I've worked." />
          <div className="mt-7">
            <WorkExperience />
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader
            label="Selected work"
            title="Things I've shipped."
            action={{ label: 'All projects', to: '/projects' }}
          />

          <div className="mt-6">
            {loadingProjects ? (
              <div className="space-y-4" aria-label="Loading projects">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4 border-b border-line py-4">
                    <div className="h-12 w-16 bg-surface" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-surface" />
                      <div className="h-2.5 w-2/3 bg-surface" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="border-b border-line py-8 text-sm text-tertiary">
                No projects published yet.
              </p>
            ) : (
              <div className="border-t border-line">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="group grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors last:border-b-0 hover:bg-surface sm:grid-cols-[96px_1fr_auto] sm:gap-5"
                  >
                    <div className="h-11 w-16 overflow-hidden border border-line bg-surface sm:h-14 sm:w-24">
                      {project.images[0] ? (
                        <img
                          src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.thumbnail })}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center font-mono text-[9px] text-tertiary">
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-medium tracking-tight text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[13px] text-secondary">
                        {project.overview}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-tertiary">
                        <span>{project.category || 'Development'}</span>
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className="flex items-center gap-1">
                            <span aria-hidden="true">·</span>
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
        </div>
      </section>

      {/* Writing */}
      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <SectionHeader
            label="Writing"
            title="Notes and thinking."
            action={{ label: 'All writing', to: '/blogs' }}
          />

          <div className="mt-6">
            {loadingBlogs ? (
              <div className="space-y-4" aria-label="Loading posts">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse border-b border-line py-4">
                    <div className="h-2.5 w-24 bg-surface" />
                    <div className="mt-2 h-4 w-2/3 bg-surface" />
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <p className="border-b border-line py-8 text-sm text-tertiary">
                No posts published yet.
              </p>
            ) : (
              <div className="border-t border-line">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className="group flex items-start justify-between gap-6 border-b border-line py-4 transition-colors last:border-b-0 hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
                        {blog.category || 'Notes'} · {formatDate(blog.createdAt)}
                      </p>
                      <h3 className="mt-1.5 text-[15px] font-medium tracking-tight text-primary">
                        {blog.title}
                      </h3>
                    </div>
                    <span className="shrink-0 pt-1 font-mono text-[10px] text-tertiary">
                      {readTime(blog.content || '')} min
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="page-column py-14 sm:py-24">
          <p className="mono-label">Next</p>
          <div className="mt-4 flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-2xl text-3xl font-medium tracking-tightest sm:text-5xl">
              Let&apos;s build something <span className="text-tertiary">worth keeping.</span>
            </h2>
            <a href="mailto:namanjainakt007@gmail.com" className="btn-solid shrink-0">
              Say hello
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Available for select work
            </span>
            <span>Bhilai, IN</span>
            <Link to="/contact" className="inline-flex items-center gap-1 text-secondary hover:text-primary">
              Contact <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default Home;
