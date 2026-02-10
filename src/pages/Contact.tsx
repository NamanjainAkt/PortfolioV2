import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center">
          Initiate <span className="text-accent-crimson">Communication</span>
        </h1>
        <p className="text-xl text-secondary text-center mb-16 max-w-2xl mx-auto">
          Open for high-impact opportunities, technical consulting, and collaborative ventures.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Direct Channels</h2>
            
            <div className="flex items-center space-x-4 p-4 bg-surface border border-border rounded-lg hover:border-accent-crimson transition-colors group">
              <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold">Email</h3>
                <a href="mailto:contact@example.com" className="text-secondary hover:text-primary transition-colors">
                  contact@example.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-surface border border-border rounded-lg hover:border-accent-crimson transition-colors group">
              <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-colors">
                <Github size={24} />
              </div>
              <div>
                <h3 className="font-bold">GitHub</h3>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
                  github.com/username
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-surface border border-border rounded-lg hover:border-accent-crimson transition-colors group">
              <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-colors">
                <Linkedin size={24} />
              </div>
              <div>
                <h3 className="font-bold">LinkedIn</h3>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
                  linkedin.com/in/username
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-6">Send a Transmission</h2>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-800 text-green-400 p-6 rounded-lg text-center"
              >
                <h3 className="font-bold text-lg mb-2">Message Received</h3>
                <p>I will respond to your inquiry shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm underline hover:text-white"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-elevated border border-border rounded px-4 py-3 text-primary focus:outline-none focus:border-accent-crimson transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-elevated border border-border rounded px-4 py-3 text-primary focus:outline-none focus:border-accent-crimson transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-elevated border border-border rounded px-4 py-3 text-primary focus:outline-none focus:border-accent-crimson transition-colors"
                    placeholder="Project details or inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-crimson text-white font-bold py-3 rounded hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Transmitting...'
                  ) : (
                    <>
                      Send Message <Send size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
