import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Pen } from 'lucide-react';

const Signature = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSigned(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSigned(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-signed={signed} className={clsx('signature', className)}>
      <div className="flex items-end gap-3">
        <span className="signature-mark">
          <span className="signature-text font-hand" aria-hidden="true">
            Njain
          </span>
          <Pen className="signature-pen" size={14} strokeWidth={1.5} aria-hidden="true" />
          <svg
            className="signature-underline"
            viewBox="0 0 120 8"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 6.5C22 2.5 48 1.5 72 3.2C89 4.4 101 4 118 2.2"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="signature-caption pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-tertiary">
          Naman Jain
        </span>
      </div>

      <span className="sr-only">Signature: Njain</span>
    </div>
  );
};

export default Signature;
