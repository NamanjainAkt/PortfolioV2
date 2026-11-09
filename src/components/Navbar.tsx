import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, Github, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const LINKS = [
  { name: 'Work', path: '/projects' },
  { name: 'Writing', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const isActive = (pathname: string, path: string) =>
  path === '/' ? pathname === '/' : pathname.startsWith(path);

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const openPalette = useCallback(() => {
    window.dispatchEvent(new Event('open-command-palette'));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between gap-4 px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Naman Jain, home">
          <span className="grid h-7 w-7 place-items-center border border-primary font-mono text-[10px] font-medium leading-none transition-colors duration-300 group-hover:bg-primary group-hover:text-background">
            NJ
          </span>
          <span className="text-sm font-medium tracking-tight">Naman Jain</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active = isActive(location.pathname, link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200',
                  active ? 'text-primary' : 'text-secondary hover:text-primary'
                )}
              >
                {link.name}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-secondary transition-colors duration-200 hover:border-primary hover:text-primary sm:flex"
            aria-label="Open command palette"
          >
            <Search size={13} />
            <span className="hidden lg:inline">Search</span>
            <kbd className="ml-1 hidden rounded border border-line px-1 py-0.5 font-mono text-[9px] text-tertiary lg:inline">
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={openPalette}
            className="grid h-8 w-8 place-items-center rounded-full text-secondary transition-colors hover:text-primary sm:hidden"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <a
            href="https://github.com/namanjainakt/"
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-8 w-8 place-items-center rounded-full text-secondary transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <Github size={16} strokeWidth={1.6} />
          </a>

          <button
            onClick={toggleTheme}
            className="grid h-8 w-8 place-items-center rounded-full text-secondary transition-colors hover:text-primary"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
          </button>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="grid h-8 w-8 place-items-center rounded-full text-secondary transition-colors hover:text-primary md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-background md:hidden"
            aria-label="Mobile"
          >
            <div className="mx-auto flex max-w-wide flex-col px-6 py-3">
              <Link
                to="/"
                className={clsx(
                  'border-b border-line py-3 text-lg tracking-tight',
                  location.pathname === '/' ? 'text-primary' : 'text-secondary'
                )}
              >
                Home
              </Link>
              {LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'border-b border-line py-3 text-lg tracking-tight last:border-b-0',
                    isActive(location.pathname, link.path) ? 'text-primary' : 'text-secondary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
                <button onClick={openPalette} className="flex items-center gap-2 hover:text-primary">
                  <Search size={13} /> Search
                </button>
                <span>Ctrl K</span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
