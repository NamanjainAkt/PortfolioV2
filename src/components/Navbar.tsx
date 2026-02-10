import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold tracking-tight">
          FORGED IN SILENCE
        </Link>
        <div className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-accent-crimson',
                location.pathname === link.path ? 'text-primary' : 'text-secondary'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
