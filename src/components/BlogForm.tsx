import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-lg shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-lg">
          <h2 className="text-2xl font-serif font-bold text-primary">
            {initialData ? 'Edit Blog' : 'New Blog Post'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-secondary text-sm mb-2">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-secondary text-sm mb-2">Slug</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
                required
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full min-h-[400px]">
            <label className="block text-secondary text-sm mb-2">Content (Markdown)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full flex-1 bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none font-mono text-sm"
              required
            />
          </div>

          {error && <p className="text-accent-crimson text-sm">{error}</p>}
        </form>

        <div className="p-6 border-t border-border sticky bottom-0 bg-surface z-10 rounded-b-lg flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-secondary hover:text-primary mr-4"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
            >
                {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                {initialData ? 'Update Blog' : 'Publish Blog'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
