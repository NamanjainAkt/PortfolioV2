import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import FuturisticLogo from './FuturisticLogo';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  const navLinks = useMemo(() => (
    LINKS.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className="relative px-4 py-2 group"
      >
        {location.pathname === link.path && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-accent-crimson/15 rounded-lg"
            style={{
              boxShadow: '0 0 20px rgba(200, 16, 46, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.1)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          />
        )}
        <span
          className={clsx(
            'relative z-10 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
            location.pathname === link.path 
              ? 'text-accent-crimson font-semibold' 
              : 'text-secondary group-hover:text-primary'
          )}
        >
          {link.name}
        </span>
      </Link>
    ))
  ), [location.pathname]);

  const mobileLinks = useMemo(() => (
    LINKS.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className={clsx(
          'px-6 py-4 rounded-xl transition-all duration-200 text-base font-medium',
          location.pathname === link.path
            ? 'bg-accent-crimson/20 text-accent-crimson border border-accent-crimson/30'
            : 'text-secondary hover:bg-white/5 hover:text-primary border border-transparent'
        )}
      >
        {link.name}
      </Link>
    ))
  ), [location.pathname]);

  return (
    <nav
      className={clsx(
        'fixed left-0 right-0 z-50 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled ? 'max-w-[672px] translate-y-4 px-4 md:px-0' : 'max-w-full translate-y-0 px-0'
      )}
    >
      <div
        className={clsx(
          'relative h-14 md:h-16 flex items-center justify-between overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled
            ? 'rounded-full px-5 md:px-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/10'
            : 'rounded-none px-4 md:px-8 border-b border-b-white/10 border-t-transparent border-x-transparent shadow-none'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(30, 30, 30, 0.7)' : 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Animated gradient shimmer for liquid effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              willChange: 'transform',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Inner glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Border gradient overlay */}
        {scrolled && (
          <>
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '1px',
              }}
            />
            <div 
              className="absolute inset-0 rounded-full opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </>
        )}

        {/* Content */}
        <Link 
          to="/" 
          className="relative z-10"
        >
          <FuturisticLogo scrolled={scrolled} />
        </Link>

        {/* Desktop Links */}
        <div className="relative z-10 hidden md:flex items-center gap-1">
          {navLinks}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden relative z-10">
          <button
            onClick={toggleMenu}
            className="p-2 text-primary focus:outline-none"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-20 left-4 right-4 z-40 md:hidden overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex flex-col p-4 gap-2">
              {mobileLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
