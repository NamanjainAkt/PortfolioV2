import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(true);
        checkStatus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsInitialized(data.initialized);
    } catch (err) {
      console.error('Failed to check admin status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isInitialized ? '/api/auth/login' : '/api/auth/setup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isInitialized) {
            localStorage.setItem('token', data.token);
            setIsOpen(false);
            navigate('/admin');
        } else {
            // After setup, automatically login or ask to login
            // For simplicity, let's just say "Initialized" and switch mode
            setIsInitialized(true);
            setError('System initialized. Please log in.');
            setPassword('');
        }
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-surface border border-border p-8 rounded-lg shadow-2xl relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center mb-4 text-accent-crimson">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-primary">
                {isInitialized ? 'System Access' : 'Initialize System'}
              </h2>
              <p className="text-secondary text-sm">
                {isInitialized ? 'Enter passphrase to proceed' : 'Set your admin passphrase'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isInitialized ? "Passphrase" : "Create Passphrase"}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-primary focus:outline-none focus:border-accent-crimson transition-colors"
                  autoFocus
                />
              </div>

              {error && (
                <p className={`text-sm text-center ${error.includes('initialized') ? 'text-success' : 'text-accent-crimson'}`}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isInitialized ? 'Unlock' : 'Initialize')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;
