import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Globe, Github, Info, Layers, Target, Rocket, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '../types/project';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onClose: () => void;
  onSuccess: () => void;
}

const FIELD_CLASS =
  'w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-primary transition-colors duration-200 placeholder:text-tertiary focus:border-primary';

const ICON_FIELD_CLASS = `${FIELD_CLASS} pl-10 font-mono`;

const SECTION_LABEL = 'mono-label';

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

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

    } catch (err) {
        console.error('[Upload] Error:', err);
        setError(err instanceof Error ? err.message : 'Image upload failed');
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
    } catch {
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
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-background/70 p-4 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-form-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-primary">
              <Rocket size={18} />
            </div>
            <div>
              <h2 id="project-form-title" className="text-lg font-medium tracking-tight">
                {initialData ? 'Edit project' : 'New project'}
              </h2>
              <p className="mono-label mt-0.5">Project metadata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <X size={17} />
          </button>
        </div>

        <form id="project-form" onSubmit={handleSubmit} className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8">
          {/* Section 1: Core identity */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Info size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Core identity</span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="project-title" className="mono-label block">Title</label>
                <input
                  id="project-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className={FIELD_CLASS}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-slug" className="mono-label block">Slug</label>
                <input
                  id="project-slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="project-identifier"
                  className={`${FIELD_CLASS} font-mono`}
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="project-overview" className="mono-label block">Overview</label>
              <textarea
                id="project-overview"
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={3}
                placeholder="High-level description of the project…"
                className={`${FIELD_CLASS} resize-none`}
                required
              />
            </div>
          </div>

          {/* Section 2: Case study */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Target size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Case study</span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
               <div className="space-y-2">
                  <label htmlFor="project-problem" className="mono-label block">The challenge</label>
                  <textarea
                    id="project-problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What problem were you solving?"
                    className={`${FIELD_CLASS} resize-none`}
                  />
               </div>
               <div className="space-y-2">
                  <label htmlFor="project-solution" className="mono-label block">The solution</label>
                  <textarea
                    id="project-solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={4}
                    placeholder="How did you solve it?"
                    className={`${FIELD_CLASS} resize-none`}
                  />
               </div>
            </div>
          </div>

          {/* Section 3: Tech & assets */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Layers size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Tech and assets</span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="project-tech" className="mono-label block">Tech stack</label>
                <input
                  id="project-tech"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, TypeScript…"
                  className={FIELD_CLASS}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-category" className="mono-label block">Category</label>
                <div className="relative">
                  <select
                    id="project-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${FIELD_CLASS} appearance-none pr-10`}
                  >
                    <option value="Development" className="bg-background text-primary">Development</option>
                    <option value="Design" className="bg-background text-primary">Design</option>
                    <option value="System" className="bg-background text-primary">System</option>
                    <option value="Cloud" className="bg-background text-primary">Cloud</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-tertiary" size={15} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="project-github" className="mono-label block">Repository URL</label>
                <div className="relative">
                  <Github className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" size={15} />
                  <input
                    id="project-github"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className={ICON_FIELD_CLASS}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="project-live" className="mono-label block">Live URL</label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" size={15} />
                  <input
                    id="project-live"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className={ICON_FIELD_CLASS}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="mono-label block">Images</span>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {formData.images.map((img: string, idx: number) => (
                      <div key={idx} className="group relative aspect-video overflow-hidden rounded-md border border-line bg-surface">
                          <img src={img} alt={`Project ${idx + 1}`} width={320} height={180} className="h-full w-full object-cover" />
                          <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              aria-label="Remove image"
                              className="absolute right-1.5 top-1.5 rounded-md border border-line bg-background/90 p-1.5 text-primary opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                          >
                              <X size={13} />
                          </button>
                      </div>
                  ))}
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-line text-tertiary transition-colors hover:border-primary hover:text-primary">
                      {uploading ? (
                          <Loader2 size={18} className="animate-spin" />
                      ) : (
                          <>
                              <Upload size={18} className="mb-1.5" />
                              <span className="mono-label">Add image</span>
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
            <div role="alert" className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3">
              <X size={15} className="shrink-0 text-primary" aria-hidden="true" />
              <p className="text-xs text-primary">{error}</p>
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-line bg-background px-6 py-4 sm:px-8">
            <button type="button" onClick={onClose} className="btn-outline">
                Cancel
            </button>
            <button
                type="submit"
                form="project-form"
                disabled={loading}
                className="btn-solid disabled:opacity-50"
            >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {initialData ? 'Save changes' : 'Create project'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectForm;
