import React, { useState } from 'react';
import { X, Loader2, ImageIcon, Newspaper, Info, FileText, Sparkles, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
        const token = localStorage.getItem('token');
        const file = files[0];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('folder', 'portfolio/blogs');

        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData
        });

        const data = await uploadRes.json();
        
        if (!uploadRes.ok || data.error) {
            throw new Error(data.error || `Upload failed: ${uploadRes.status}`);
        }
        
        if (data.url) {
            setFormData(prev => ({
                ...prev,
                featuredImage: data.url
            }));
        }

    } catch (err: any) {
        console.error('[Upload] Error:', err);
        setError(err.message || 'Image upload failed');
    } finally {
        setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
        ...prev,
        featuredImage: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/blogs/${initialData.id}` : '/api/blogs';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save blog');

      onSuccess();
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#0a0a0a] border border-white/5 w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-crimson rounded-2xl flex items-center justify-center shadow-lg shadow-accent-crimson/20">
              <Newspaper className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none">
                {initialData ? 'Modify' : 'Publish'} <span className="text-accent-crimson">Article</span>
              </h2>
              <p className="text-[10px] font-mono text-tertiary uppercase tracking-[0.4em] mt-1">Content Management System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-tertiary hover:text-white hover:bg-white/10 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Info size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Metadata</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Article Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="The future of systems..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">URL Slug</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="article-slug"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ImageIcon size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Visual Identity</span>
            </div>

            {formData.featuredImage ? (
              <div className="relative group aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-white/5">
                <img 
                  src={formData.featuredImage} 
                  alt="Featured" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-accent-crimson text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold uppercase tracking-widest text-xs shadow-xl"
                  >
                    <Trash size={16} />
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/5 rounded-[2rem] cursor-pointer hover:border-accent-crimson/50 hover:bg-white/[0.02] transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <Loader2 size={32} className="text-accent-crimson animate-spin mb-3" />
                  ) : (
                    <Sparkles size={32} className="text-tertiary group-hover:text-accent-crimson transition-colors mb-3" />
                  )}
                  <p className="text-xs font-mono text-tertiary uppercase tracking-widest group-hover:text-white transition-colors">
                    {uploading ? 'Processing Image...' : 'Deploy Featured Visual'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <FileText size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Article Body</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Markdown Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article in markdown..."
                className="w-full h-96 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-8 text-white focus:border-accent-crimson outline-none transition-colors font-mono text-sm resize-none custom-scrollbar"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-accent-crimson/10 border border-accent-crimson/20 rounded-2xl flex items-center gap-4">
              <X size={20} className="text-accent-crimson" />
              <p className="text-accent-crimson text-xs font-mono uppercase tracking-widest">{error}</p>
            </div>
          )}
        </form>

        <div className="p-8 border-t border-white/5 sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-10 rounded-b-lg flex justify-end gap-6">
            <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-tertiary hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
            >
                Discard
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-crimson hover:text-white transition-all duration-500 shadow-xl shadow-white/5 disabled:opacity-50 flex items-center"
            >
                {loading && <Loader2 size={16} className="animate-spin mr-3" />}
                {initialData ? 'Update Core' : 'Execute Publication'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogForm;
