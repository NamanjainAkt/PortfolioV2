import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
  usePageMeta({
    title: '404 — Page Not Found',
    description: 'The requested page could not be found.',
    noindex: true,
  });

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <section className="border-b border-line">
        <div className="page-column flex min-h-[60vh] flex-col justify-center py-16 sm:py-24">
          <p className="mono-label">Error — 404</p>

          <h1 className="mt-4 text-[6rem] font-medium leading-none tracking-tightest sm:text-[10rem]">
            404
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary">
            That page doesn&apos;t exist, or it moved somewhere I haven&apos;t linked yet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <Link to="/" className="btn-solid">
              <ArrowLeft size={14} />
              Back home
            </Link>
            <Link to="/projects" className="btn-outline">
              View projects
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
            <span>Status — missing</span>
            <span>Page — unknown</span>
            <Link to="/contact" className="text-secondary hover:text-primary">
              Report it
            </Link>
          </div>
        </div>
      </section>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default NotFound;
