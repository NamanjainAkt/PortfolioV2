import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

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
    demoUrl: initialData?.demoUrl || '',
    images: initialData?.images || [] as string[],
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
        const signatureRes = await fetch('/api/upload/signature', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!signatureRes.ok) throw new Error('Failed to get upload signature');
        
        const { signature, timestamp, cloudName, apiKey } = await signatureRes.json();
        
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'portfolio');

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await uploadRes.json();
            if (data.secure_url) {
                uploadedUrls.push(data.secure_url);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedUrls]
        }));

    } catch (err) {
        console.error(err);
        setError('Image upload failed');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-lg shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-lg">
          <h2 className="text-2xl font-serif font-bold text-primary">
            {initialData ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
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

          <div>
            <label className="block text-secondary text-sm mb-2">Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-secondary text-sm mb-2">Problem</label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
                />
             </div>
             <div>
                <label className="block text-secondary text-sm mb-2">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
                />
             </div>
          </div>

          <div>
            <label className="block text-secondary text-sm mb-2">Tech Stack (comma separated)</label>
            <input
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, TypeScript..."
              className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-secondary text-sm mb-2">GitHub URL</label>
              <input
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
              />
            </div>
            <div>
              <label className="block text-secondary text-sm mb-2">Live Demo URL</label>
              <input
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 text-primary focus:border-accent-crimson outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-secondary text-sm mb-2">Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative group aspect-video bg-elevated rounded overflow-hidden">
                        <img src={img} alt={`Project ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <label className="border-2 border-dashed border-border rounded flex flex-col items-center justify-center cursor-pointer hover:border-accent-crimson transition-colors aspect-video text-secondary hover:text-primary">
                    {uploading ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <>
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs">Upload</span>
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
                {initialData ? 'Update Project' : 'Create Project'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
