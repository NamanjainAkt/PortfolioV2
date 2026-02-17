import React, { useState } from 'react';
import { X, Upload, Loader2, Sparkles, Globe, Github, Info, Layers, Target, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    overview: initialData?.overview || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    techStack: initialData?.techStack?.join(', ') || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    images: initialData?.images || [] as string[],
    category: initialData?.category || 'Development',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
        const token = localStorage.getItem('token');
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'portfolio');

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await uploadRes.json();
            
            if (!uploadRes.ok || data.error) {
                throw new Error(data.error || `Upload failed: ${uploadRes.status}`);
            }
            
            if (data.url) {
                uploadedUrls.push(data.url);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedUrls]
        }));

    } catch (err: any) {
        console.error('[Upload] Error:', err);
        setError(err.message || 'Image upload failed');
    } finally {
        setUploading(false);
    }
  };

  const removeImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/projects/${initialData.id}` : '/api/projects';

      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save project');

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
              <Rocket className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none">
                {initialData ? 'Synchronize' : 'Deploy'} <span className="text-accent-crimson">Project</span>
              </h2>
              <p className="text-[10px] font-mono text-tertiary uppercase tracking-[0.4em] mt-1">Project Metadata Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-tertiary hover:text-white hover:bg-white/10 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* Section 1: Core Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Info size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Core Identity</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Operational Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Resource Slug</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="project-identifier"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Brief Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={3}
                placeholder="High-level description of the project..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors resize-none"
                required
              />
            </div>
          </div>

          {/* Section 2: Case Study Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Target size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Case Study Architecture</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">The Challenge</label>
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What problem were you solving?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors resize-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">The Solution</label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={4}
                    placeholder="How did you solve it?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors resize-none"
                  />
               </div>
            </div>
          </div>

          {/* Section 3: Technical Specs & Assets */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Layers size={16} className="text-accent-crimson" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">Technological Assets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Tech Stack</label>
                <input
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, TypeScript..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors appearance-none"
                >
                  <option value="Development" className="bg-[#0a0a0a]">Development</option>
                  <option value="Design" className="bg-[#0a0a0a]">Design</option>
                  <option value="System" className="bg-[#0a0a0a]">System</option>
                  <option value="Cloud" className="bg-[#0a0a0a]">Cloud</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Repository URL</label>
                <div className="relative">
                  <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                  <input
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Live Deployment</label>
                <div className="relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                  <input
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:border-accent-crimson outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-tertiary uppercase tracking-widest ml-1">Visual Assets</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img: string, idx: number) => (
                      <div key={idx} className="relative group aspect-video bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                          <img src={img} alt={`Project ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                          >
                              <X size={14} />
                          </button>
                      </div>
                  ))}
                  <label className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-crimson/50 hover:bg-white/[0.02] transition-all aspect-video group">
                      {uploading ? (
                          <Loader2 size={24} className="animate-spin text-accent-crimson" />
                      ) : (
                          <>
                              <Upload size={24} className="mb-2 text-tertiary group-hover:text-accent-crimson transition-colors" />
                              <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest group-hover:text-white transition-colors">Link Media</span>
                          </>
                      )}
                      <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                      />
                  </label>
              </div>
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
                Abort
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-crimson hover:text-white transition-all duration-500 shadow-xl shadow-white/5 disabled:opacity-50 flex items-center"
            >
                {loading && <Loader2 size={16} className="animate-spin mr-3" />}
                {initialData ? 'Update Core' : 'Execute Deployment'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectForm;
