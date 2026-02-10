import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, LogOut, Edit } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';
import BlogForm from '../components/BlogForm';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs'>('projects');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchItems();
  }, [activeTab]);

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
      await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
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

  return (
    <div className="pt-24 container mx-auto px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-accent-crimson hover:text-white transition-colors">
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-accent-crimson text-primary' : 'text-secondary'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-2 px-4 ${activeTab === 'blogs' ? 'border-b-2 border-accent-crimson text-primary' : 'text-secondary'}`}
        >
          Blogs
        </button>
      </div>

      <div className="mb-6">
        <button 
          onClick={handleCreate}
          className="bg-white text-black px-4 py-2 rounded font-medium flex items-center hover:bg-gray-200 transition-colors"
        >
          <Plus size={18} className="mr-2" /> Add New {activeTab === 'projects' ? 'Project' : 'Blog'}
        </button>
      </div>

      {loading ? (
        <div className="text-secondary">Loading...</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-surface border border-border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-secondary font-mono">/{item.slug}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                    onClick={() => handleEdit(item)}
                    className="text-secondary hover:text-primary transition-colors"
                    title="Edit"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => handleDelete(item.id)}
                    className="text-tertiary hover:text-accent-crimson transition-colors"
                    title="Delete"
                >
                    <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-tertiary">No items found.</div>}
        </div>
      )}

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
    </div>
  );
};

export default Admin;
