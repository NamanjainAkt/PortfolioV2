import React, { useState, useEffect } from 'react';
import { X, Loader2, ImageIcon, Newspaper, Info, FileText, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogFormProps {
  initialData?: Partial<BlogDraft>;
  onClose: () => void;
  onSuccess: () => void;
}

interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
}

const FIELD_CLASS =
  'w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-primary transition-colors duration-200 placeholder:text-tertiary focus:border-primary';

const SECTION_LABEL = 'mono-label';

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

    } catch (err) {
        console.error('[Upload] Error:', err);
        setError(err instanceof Error ? err.message : 'Image upload failed');
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
        aria-labelledby="blog-form-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-primary">
              <Newspaper size={18} />
            </div>
            <div>
              <h2 id="blog-form-title" className="text-lg font-medium tracking-tight">
                {initialData ? 'Edit entry' : 'New entry'}
              </h2>
              <p className="mono-label mt-0.5">Journal entry</p>
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

        <form id="blog-form" onSubmit={handleSubmit} className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Info size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Metadata</span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="blog-title" className="mono-label block">Title</label>
                <input
                  id="blog-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="The future of systems…"
                  className={FIELD_CLASS}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="blog-slug" className="mono-label block">Slug</label>
                <input
                  id="blog-slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="article-slug"
                  className={`${FIELD_CLASS} font-mono`}
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <ImageIcon size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Featured image</span>
            </div>

            {formData.featuredImage ? (
              <div className="group relative aspect-video overflow-hidden rounded-md border border-line bg-surface">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  width={320}
                  height={180}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-outline bg-background"
                  >
                    <Trash size={14} />
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-line text-tertiary transition-colors hover:border-primary hover:text-primary">
                <div className="flex flex-col items-center justify-center">
                  {uploading ? (
                    <Loader2 size={22} className="mb-2 animate-spin" />
                  ) : (
                    <ImageIcon size={22} className="mb-2" />
                  )}
                  <p className="mono-label">
                    {uploading ? 'Uploading image…' : 'Upload featured image'}
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

          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <FileText size={14} className="text-tertiary" />
              <span className={SECTION_LABEL}>Article body</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="blog-content" className="mono-label block">Markdown</label>
              <textarea
                id="blog-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article in markdown…"
                className={`${FIELD_CLASS} h-96 resize-none py-3 font-mono text-[13px] leading-relaxed`}
                spellCheck={false}
                required
              />
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
                Discard
            </button>
            <button
                type="submit"
                form="blog-form"
                disabled={loading}
                className="btn-solid disabled:opacity-50"
            >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {initialData ? 'Save changes' : 'Publish entry'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogForm;
