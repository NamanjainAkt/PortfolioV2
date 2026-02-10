import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FolderGit2, BookOpen, Mail } from 'lucide-react';
import { clsx } from 'clsx';

const BottomNav = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Blogs', path: '/blogs', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-md border-t border-border md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-accent-crimson' : 'text-secondary hover:text-primary'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
