import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Work', to: '/projects' },
  { label: 'Writing', to: '/blogs' },
  { label: 'Contact', to: '/contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/namanjainakt/', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/naman-jain-akt/', icon: Linkedin },
  { label: 'Email', href: 'mailto:namanjainakt@gmail.com', icon: Mail },
];

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="group/link inline-flex w-fit items-center gap-1.5 text-sm text-secondary transition-colors duration-200 hover:text-primary"
  >
    <span className="link-underline">{label}</span>
    <ArrowUpRight
      size={12}
      aria-hidden="true"
      className="-translate-x-1 opacity-0 transition-all duration-200 ease-smooth group-hover/link:translate-x-0 group-hover/link:opacity-100"
    />
  </Link>
);

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-line">
      <div className="frame">
        <div className="page-column py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="mono-label">Available for select work</p>
              <h2 className="mt-3 max-w-md text-2xl font-medium tracking-tight sm:text-3xl">
                Have a project in mind? Let&apos;s build something dependable.
              </h2>
              <a
                href="mailto:namanjainakt@gmail.com"
                className="group/mail link-underline mt-5 inline-flex items-center gap-1 text-sm text-secondary transition-colors duration-200 hover:text-primary"
              >
                namanjainakt@gmail.com
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-smooth group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5"
                />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:gap-16">
              <div>
                <p className="mono-label">Explore</p>
                <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer">
                  <FooterLink to="/" label="Home" />
                  {FOOTER_LINKS.map((link) => (
                    <FooterLink key={link.to} to={link.to} label={link.label} />
                  ))}
                </nav>
              </div>

              <div>
                <p className="mono-label">Elsewhere</p>
                <div className="mt-4 flex flex-col gap-2">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group/social flex w-fit items-center gap-2.5 text-sm text-secondary transition-colors duration-200 hover:text-primary"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-line transition-colors duration-200 group-hover/social:border-primary group-hover/social:bg-surface">
                        <social.icon
                          size={13}
                          strokeWidth={1.6}
                          aria-hidden="true"
                          className="transition-transform duration-300 ease-smooth group-hover/social:-translate-y-0.5"
                        />
                      </span>
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
              © 2026 Naman Jain
            </p>
            <div className="flex items-center gap-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
                Built with React &amp; care
              </span>
              <button
                onClick={scrollToTop}
                className="group/top flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary transition-colors duration-200 hover:text-primary active:scale-[0.98]"
              >
                Back to top
                <ArrowUp
                  size={12}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-smooth group-hover/top:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="wordmark-block group relative overflow-hidden border-t border-line">
          <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

          <div className="px-4 pt-6">
            <div className="relative">
              <p aria-hidden="true" className="footer-wordmark">
                NAMAN JAIN
              </p>
              <span
                aria-hidden="true"
                className="footer-wordmark footer-wordmark-fill absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              >
                NAMAN JAIN
              </span>
            </div>
          </div>

          <div className="hatch mt-6 h-2.5 border-t border-line" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
