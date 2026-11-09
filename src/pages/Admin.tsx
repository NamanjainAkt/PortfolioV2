import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Trash,
  LogOut,
  Edit,
  GripVertical,
  LayoutDashboard,
  FolderGit2,
  Newspaper,
  Search,
  ExternalLink,
  ChevronLeft,
  Menu,
  X as CloseIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectForm from '../components/ProjectForm';
import BlogForm from '../components/BlogForm';
import SortableProjectList from '../components/admin/SortableProjectList';
import { Project } from '../types/project';
import { usePageMeta } from '../hooks/usePageMeta';

const TABS = [
  {
    id: 'projects' as const,
    label: 'Projects',
    icon: FolderGit2,
    title: 'Projects',
    description: 'Create, edit, and publish case studies.',
  },
  {
    id: 'blogs' as const,
    label: 'Journal',
    icon: Newspaper,
    title: 'Journal',
    description: 'Draft and manage journal entries.',
  },
  {
    id: 'reorder' as const,
    label: 'Sequence',
    icon: GripVertical,
    title: 'Sequence',
    description: 'Drag to set the order projects appear in.',
  },
];

const ACTION_CLASS =
  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-secondary transition-colors duration-200 ease-smooth hover:border-primary hover:text-primary active:scale-[0.96]';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : DATE_FORMAT.format(date);
};

interface AdminEntry {
  id: string;
  title: string;
  slug: string;
  createdAt?: string;
  images?: string[];
  featuredImage?: string;
}

const Admin = () => {
  usePageMeta({
    title: 'Admin Console — Naman Jain',
    description: 'Internal administrative interface.',
    path: '/admin',
    noindex: true,
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs' | 'reorder'>('projects');
  const [items, setItems] = useState<AdminEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminEntry | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    const controller = new AbortController();
    if (activeTab === 'reorder') {
      fetchProjects(controller.signal);
    } else {
      fetchItems(activeTab, controller.signal);
    }
    setIsMobileMenuOpen(false);
    return () => controller.abort();
  }, [activeTab, navigate]);

  const fetchProjects = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?orderBy=displayOrder', { signal });
      const data = await res.json();
      if (!signal?.aborted) setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch projects');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const handleReorder = async (reorderedProjects: Project[]) => {
    const token = localStorage.getItem('token');
    const updates = reorderedProjects.map((p, index) => ({
      id: p.id,
      displayOrder: index,
    }));

    const res = await fetch('/api/projects/reorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projects: updates }),
    });

    if (!res.ok) {
      throw new Error('Failed to reorder');
    }
    // Update local state to reflect new order
    setProjects(reorderedProjects);
  };

  const fetchItems = async (tab: string, signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${tab}`, { signal });
      const data = await res.json();
      if (!signal?.aborted) setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') console.error('Failed to fetch items');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchItems(activeTab);
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const handleEdit = (item: AdminEntry) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchItems(activeTab);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const currentTab = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.slug || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-primary md:flex-row">
      {/* Mobile header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-background/90 px-5 py-3 backdrop-blur md:hidden">
        <Link to="/" className="mono-label transition-colors hover:text-primary">
          Naman Jain
        </Link>
        <div className="flex items-center gap-3">
          <span className="mono-label">Admin</span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-secondary transition-colors hover:text-primary"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-background pt-[60px] transition-transform duration-300 ease-smooth md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 md:pt-0 lg:w-72 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="hidden border-b border-line px-6 py-6 md:block">
          <Link
            to="/"
            className="mono-label inline-flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <ChevronLeft size={13} />
            Back to site
          </Link>
          <p className="mono-label mt-8">Control panel</p>
          <p className="mt-2 text-xl font-medium tracking-tightest">Portfolio admin</p>
        </div>

        <div className="border-b border-line px-6 py-5 md:hidden">
          <p className="mono-label">Control panel</p>
          <p className="mt-1 text-sm font-medium tracking-tight">Portfolio admin</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain p-3">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors duration-200 ease-smooth ${
                  isActive
                    ? 'bg-primary text-background'
                    : 'text-secondary hover:bg-surface hover:text-primary'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="mono-label">Session</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              Signed in. Changes publish to the live portfolio.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs font-medium text-secondary transition-colors duration-200 ease-smooth hover:border-primary hover:text-primary active:scale-[0.98]"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-wide px-5 py-10 sm:px-8 md:py-14">
          <header className="flex flex-col gap-8 border-b border-line pb-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="rule-label">Admin</p>
              <h1 className="mt-3 text-3xl font-medium tracking-tightest md:text-4xl">
                {currentTab.title}
              </h1>
              <p className="mt-2 max-w-md text-sm text-secondary">{currentTab.description}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
              {activeTab !== 'reorder' && (
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
                    size={15}
                  />
                  <input
                    type="search"
                    placeholder="Search by title or slug"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search entries"
                    autoComplete="off"
                    className="w-full rounded-md border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-primary transition-colors duration-200 placeholder:text-tertiary focus:border-primary sm:w-64"
                  />
                </div>
              )}

              {activeTab !== 'reorder' && (
                <button
                  onClick={handleCreate}
                  className="btn-solid whitespace-nowrap"
                >
                  <Plus size={15} />
                  {activeTab === 'projects' ? 'New project' : 'New entry'}
                </button>
              )}
            </div>
          </header>

          {activeTab !== 'reorder' && (
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3 border-b border-line py-5">
              <div>
                <p className="mono-label">Entries</p>
                <p className="mt-1 font-mono text-sm tabular-nums">{items.length}</p>
              </div>
              <div>
                <p className="mono-label">Matches</p>
                <p className="mt-1 font-mono text-sm tabular-nums">{filteredItems.length}</p>
              </div>
              <div>
                <p className="mono-label">Status</p>
                <p className="mt-1 font-mono text-sm">Live</p>
              </div>
            </div>
          )}

          <div className="relative min-h-[320px]">
            {loading ? (
              <div className="divide-y divide-line border-b border-line" aria-busy="true" aria-label="Loading entries">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-4 py-5">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-md bg-surface" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 animate-pulse rounded-sm bg-surface" />
                      <div className="h-2 w-1/4 animate-pulse rounded-sm bg-surface" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'reorder' ? (
                  <motion.div
                    key="reorder"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SortableProjectList
                      projects={projects}
                      onReorder={handleReorder}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="divide-y divide-line border-b border-line"
                  >
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
                            {item.images?.[0] || item.featuredImage ? (
                              <img
                                src={item.images?.[0] || item.featuredImage}
                                alt=""
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-tertiary">
                                <LayoutDashboard size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-medium tracking-tight">
                              {item.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
                              <span className="truncate">/{item.slug}</span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={activeTab === 'projects' ? `/projects/${item.slug}` : `/blogs/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={ACTION_CLASS}
                            title="View live"
                            aria-label={`View ${item.title} live`}
                          >
                            <ExternalLink size={15} />
                          </a>
                          <button
                            onClick={() => handleEdit(item)}
                            className={ACTION_CLASS}
                            title="Edit"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={ACTION_CLASS}
                            title="Delete"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredItems.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-3 border-b-0 px-6 py-20 text-center">
                        <Search className="text-tertiary" size={20} />
                        <p className="text-sm text-secondary">
                          {searchQuery
                            ? `No entries match “${searchQuery}”.`
                            : `No ${activeTab} yet.`}
                        </p>
                        {searchQuery ? (
                          <button onClick={() => setSearchQuery('')} className="btn-outline mt-1">
                            Clear search
                          </button>
                        ) : (
                          <button onClick={handleCreate} className="btn-outline mt-1">
                            <Plus size={14} />
                            Create the first one
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Forms modals */}
      <AnimatePresence>
        {isFormOpen && activeTab === 'projects' && (
          <ProjectForm
            initialData={editingItem}
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {isFormOpen && activeTab === 'blogs' && (
          <BlogForm
            initialData={editingItem}
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
