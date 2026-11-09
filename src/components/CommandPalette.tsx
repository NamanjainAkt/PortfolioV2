import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, FileText, Folder, Home, Mail, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string[];
}

const createCommands = (navigate: (path: string) => void): CommandItem[] => [
  {
    id: 'home',
    name: 'Go to Home',
    shortcut: 'H',
    icon: Home,
    action: () => navigate('/'),
    keywords: ['home', 'index', 'main', 'start'],
  },
  {
    id: 'projects',
    name: 'View Work',
    shortcut: 'P',
    icon: Folder,
    action: () => navigate('/projects'),
    keywords: ['projects', 'work', 'portfolio', 'case studies'],
  },
  {
    id: 'blogs',
    name: 'Read Writing',
    shortcut: 'B',
    icon: BookOpen,
    action: () => navigate('/blogs'),
    keywords: ['blog', 'articles', 'writing', 'posts'],
  },
  {
    id: 'contact',
    name: 'Contact Me',
    shortcut: 'C',
    icon: Mail,
    action: () => navigate('/contact'),
    keywords: ['contact', 'email', 'reach out', 'hire'],
  },
  {
    id: 'resume',
    name: 'Open Resume',
    icon: FileText,
    action: () => window.open('/Naman_s_Resume.pdf', '_blank'),
    keywords: ['resume', 'cv', 'download', 'pdf'],
  },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const stateRef = useRef({ isOpen, selectedIndex, searchQuery });
  stateRef.current = { isOpen, selectedIndex, searchQuery };

  const commands = useMemo(() => createCommands(navigate), [navigate]);

  const filteredCommands = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return commands;
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }, [commands, searchQuery]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { isOpen, selectedIndex } = stateRef.current;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape' && isOpen) close();

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      }
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        close();
      }
    },
    [filteredCommands, close]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-command-palette', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] bg-black/25 px-4 backdrop-blur-[2px] dark:bg-black/60"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-[12vh] w-full max-w-lg overflow-hidden border border-line bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search size={16} className="text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-tertiary"
                autoFocus
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-tertiary">
                Esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-1.5">
              {filteredCommands.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-tertiary">No results.</p>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      close();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      index === selectedIndex ? 'bg-surface text-primary' : 'text-secondary'
                    )}
                  >
                    <cmd.icon size={15} strokeWidth={1.6} />
                    <span className="flex-1">{cmd.name}</span>
                    {cmd.shortcut && (
                      <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-tertiary">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
              <span className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </span>
              <span>{filteredCommands.length} actions</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
