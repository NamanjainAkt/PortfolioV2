import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Folder, Home, Mail, BookOpen, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string[];
}

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
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
      name: 'View Projects',
      shortcut: 'P',
      icon: Folder,
      action: () => navigate('/projects'),
      keywords: ['projects', 'work', 'portfolio', 'case studies'],
    },
    {
      id: 'blogs',
      name: 'Read Blog',
      shortcut: 'B',
      icon: BookOpen,
      action: () => navigate('/blogs'),
      keywords: ['blog', 'articles', 'writings', 'posts'],
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
      name: 'Download Resume',
      icon: FileText,
      action: () => window.open('/resume.pdf', '_blank'),
      keywords: ['resume', 'cv', 'download', 'pdf'],
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
          setSearchQuery('');
        }
      }
    },
    [isOpen, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return (
    <>
      {/* Command Palette Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 flex items-center gap-2 px-3 py-2.5 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full text-secondary hover:text-primary hover:border-accent-crimson/50 hover:bg-accent-crimson/5 transition-all duration-300 shadow-lg shadow-black/20 group"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="w-7 h-7 rounded-full bg-accent-crimson/10 flex items-center justify-center group-hover:bg-accent-crimson/20 transition-colors">
          <Command size={14} className="text-accent-crimson" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">Command</span>
        <kbd className="hidden md:flex items-center gap-0.5 ml-1 px-1.5 py-0.5 text-[10px] bg-elevated rounded border border-border/50 text-tertiary group-hover:border-accent-crimson/30 transition-colors">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Command Palette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] md:pt-[20vh] px-4 pointer-events-none"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-2xl bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden pointer-events-auto"
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
                  <Search size={20} className="text-accent-crimson" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search commands..."
                    className="flex-1 bg-transparent outline-none text-primary placeholder:text-tertiary text-lg"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-elevated/50 rounded border border-border/50 text-tertiary">
                    ESC
                  </kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-[50vh] md:max-h-[400px] overflow-y-auto py-2">
                  {filteredCommands.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <div className="w-16 h-16 bg-elevated/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-tertiary" />
                      </div>
                      <p className="text-secondary">No commands found</p>
                      <p className="text-tertiary text-sm mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-4 px-4 py-3.5 text-left transition-all duration-200 mx-2 rounded-lg w-[calc(100%-16px)] ${
                          index === selectedIndex
                            ? 'bg-accent-crimson/10 text-accent-crimson'
                            : 'text-secondary hover:bg-elevated/50'
                        }`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === selectedIndex ? 'bg-accent-crimson/20' : 'bg-elevated'
                        }`}>
                          <cmd.icon size={16} />
                        </div>
                        <span className="flex-1 font-medium">{cmd.name}</span>
                        {cmd.shortcut && (
                          <kbd className="px-2 py-0.5 text-xs bg-elevated/50 rounded border border-border/50 text-tertiary">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-tertiary bg-elevated/20">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50 text-secondary">↑↓</kbd>
                      <span className="hidden sm:inline">to navigate</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50 text-secondary">↵</kbd>
                      <span className="hidden sm:inline">to select</span>
                    </span>
                  </div>
                  <span className="text-secondary">{filteredCommands.length} commands</span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
