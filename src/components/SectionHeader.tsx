import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  action?: { label: string; to: string };
}

export const SectionHeader = ({ label, title, description, action }: SectionHeaderProps) => (
  <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="mono-label flex items-center gap-2">
        <span className="h-1 w-1 bg-primary" aria-hidden="true" />
        {label}
      </p>
      <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">{title}</h2>
      {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">{description}</p>}
    </div>
    {action && (
      <Link
        to={action.to}
        className="link-underline shrink-0 text-[12px] font-medium text-secondary transition-colors hover:text-primary"
      >
        {action.label}
        <ArrowUpRight size={13} />
      </Link>
    )}
  </div>
);
