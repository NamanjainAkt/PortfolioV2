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
  Settings,
  ArrowRight,
  Search,
  BarChart3,
  ExternalLink,
  ChevronLeft,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectForm from '../components/ProjectForm';
import BlogForm from '../components/BlogForm';
import SortableProjectList from '../components/admin/SortableProjectList';
import { Project } from '../types/project';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs' | 'reorder'>('projects');
  const [items, setItems] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    if (activeTab === 'reorder') {
      fetchProjects();
    } else {
      fetchItems();
    }
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?orderBy=displayOrder');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${activeTab}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
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
        fetchItems();
      }
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchItems();
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-6 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-crimson rounded-lg flex items-center justify-center">
            <Settings size={16} />
          </div>
          <span className="font-serif font-black tracking-tighter uppercase text-sm">Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-tertiary">
          {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-50 md:relative md:flex md:w-80 bg-[#0a0a0a] border-r border-white/5 flex-col sticky top-0 h-screen overflow-y-auto transition-transform duration-500
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8">
          <div className="flex flex-col gap-8 mb-12">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-tertiary hover:text-white transition-colors text-[10px] font-mono uppercase tracking-[0.2em] group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Site
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-crimson rounded-2xl flex items-center justify-center shadow-2xl shadow-accent-crimson/30 ring-1 ring-white/10">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none">
                  CORE <span className="text-accent-crimson">ADMIN</span>
                </h1>
                <span className="text-[9px] font-mono text-tertiary uppercase tracking-[0.4em] block mt-1">v2.0.48 // SECURE</span>
              </div>
            </div>
          </div>

          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group ${
                activeTab === 'projects' 
                ? 'bg-accent-crimson text-white shadow-2xl shadow-accent-crimson/20' 
                : 'text-tertiary hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <FolderGit2 size={20} className={activeTab === 'projects' ? 'text-white' : 'text-accent-crimson'} />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Projects</span>
              </div>
              {activeTab === 'projects' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group ${
                activeTab === 'blogs' 
                ? 'bg-accent-crimson text-white shadow-2xl shadow-accent-crimson/20' 
                : 'text-tertiary hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <Newspaper size={20} className={activeTab === 'blogs' ? 'text-white' : 'text-accent-crimson'} />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Journal</span>
              </div>
              {activeTab === 'blogs' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>

            <button
              onClick={() => setActiveTab('reorder')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group ${
                activeTab === 'reorder' 
                ? 'bg-accent-crimson text-white shadow-2xl shadow-accent-crimson/20' 
                : 'text-tertiary hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <GripVertical size={20} className={activeTab === 'reorder' ? 'text-white' : 'text-accent-crimson'} />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Sequencing</span>
              </div>
              {activeTab === 'reorder' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-glow animate-pulse" />
              <span className="text-[9px] font-mono text-tertiary uppercase tracking-widest">System Status</span>
            </div>
            <p className="text-[10px] text-secondary font-medium leading-relaxed">
              All nodes operational. Encrypted connection established via RSA-4096.
            </p>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-tertiary hover:text-accent-crimson hover:border-accent-crimson/30 hover:bg-accent-crimson/5 transition-all duration-500 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-mono uppercase tracking-widest font-black">De-Authorize</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto bg-[#050505] relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-crimson/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent-crimson" />
              <span className="text-[10px] font-mono text-accent-crimson uppercase tracking-[0.5em] font-bold">Command Center</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase leading-[0.8] mb-4">
              {activeTab} <span className="text-accent-crimson">Vault</span>
            </h2>
            <div className="flex items-center gap-4 text-tertiary font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>UID: {activeTab.substring(0, 3)}-{Math.floor(Math.random() * 9000) + 1000}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>Timestamp: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent-crimson transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-[1.5rem] pl-16 pr-8 py-5 text-sm focus:border-accent-crimson/50 focus:bg-white/[0.08] outline-none transition-all duration-500 placeholder:text-tertiary/50"
              />
            </div>

            {activeTab !== 'reorder' && (
              <button 
                onClick={handleCreate}
                className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-[1.5rem] hover:bg-accent-crimson hover:text-white transition-all duration-500 font-black shadow-2xl shadow-white/5 hover:shadow-accent-crimson/20 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[11px] uppercase tracking-[0.2em]">New Entity</span>
              </button>
            )}
          </div>
        </header>

        {/* Stats Grid (Optional) */}
        {activeTab !== 'reorder' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-tertiary text-[10px] font-mono uppercase tracking-widest mb-1">Total {activeTab}</p>
                <h4 className="text-3xl font-serif font-black">{items.length}</h4>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-accent-glow" size={24} />
              </div>
            </div>
            {/* Add more stats if needed */}
          </div>
        )}

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent-crimson border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'reorder' ? (
                <motion.div
                  key="reorder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SortableProjectList 
                    projects={projects} 
                    onReorder={handleReorder}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center hover:border-accent-crimson/30 transition-all duration-500 gap-6"
                    >
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                          {(item.images?.[0] || item.featuredImage) ? (
                            <img 
                              src={item.images?.[0] || item.featuredImage} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-tertiary">
                              <LayoutDashboard size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-serif font-black uppercase tracking-tight mb-1 group-hover:text-accent-crimson transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest">/{item.slug}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <a 
                          href={activeTab === 'projects' ? `/projects/${item.slug}` : `/blogs/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-white/5 rounded-xl text-tertiary hover:text-white hover:bg-white/10 transition-all"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-3 bg-white/5 rounded-xl text-tertiary hover:text-white hover:bg-white/10 transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-3 bg-white/5 rounded-xl text-tertiary hover:text-accent-crimson hover:bg-accent-crimson/10 transition-all"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-[3rem]">
                      <Search className="text-white/5 mx-auto mb-4" size={48} />
                      <p className="text-tertiary font-mono text-[10px] uppercase tracking-[0.4em]">No matching entities identified.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Forms Modals */}
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
