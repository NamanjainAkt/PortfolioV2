import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        break;
      case 'message':
        if (value.length < 10) return 'Message must be at least 10 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocusedField(null);
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTouched({});
    setErrors({});
  };

  const contactChannels = [
    {
      icon: Mail,
      name: 'Email',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com',
    },
    {
      icon: Github,
      name: 'GitHub',
      value: 'github.com/username',
      href: 'https://github.com',
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      value: 'linkedin.com/in/username',
      href: 'https://linkedin.com',
    },
  ];

  const inputClasses = (fieldName: string, hasError: boolean) => `
    w-full bg-elevated border-2 rounded-lg px-4 py-3 text-primary 
    transition-all duration-300 outline-none
    ${hasError 
      ? 'border-warning/50 focus:border-warning' 
      : focusedField === fieldName 
        ? 'border-accent-crimson' 
        : touched[fieldName] && !errors[fieldName as keyof FormErrors]
          ? 'border-success/50 focus:border-success'
          : 'border-border focus:border-accent-crimson'
    }
  `;

  return (
    <div className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <FadeInWhenVisible>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center">
            Initiate <span className="text-accent-crimson">Communication</span>
          </h1>
        </FadeInWhenVisible>
        
        <FadeInWhenVisible delay={0.1}>
          <p className="text-xl text-secondary text-center mb-16 max-w-2xl mx-auto">
            Open for high-impact opportunities, technical consulting, and collaborative ventures.
          </p>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <FadeInWhenVisible delay={0.2}>
              <h2 className="text-2xl font-bold mb-6">Direct Channels</h2>
            </FadeInWhenVisible>
            
            {contactChannels.map((channel, index) => (
              <FadeInWhenVisible key={channel.name} delay={0.3 + index * 0.1}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={channel.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="flex items-center space-x-4 p-4 bg-surface border border-border rounded-lg hover:border-accent-crimson transition-colors group"
                >
                  <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-colors">
                    <channel.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">{channel.name}</h3>
                    <span className="text-secondary group-hover:text-primary transition-colors">
                      {channel.value}
                    </span>
                  </div>
                </a>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Contact Form */}
          <FadeInWhenVisible delay={0.4} direction="left">
            <div className="bg-surface p-8 rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-6">Send a Transmission</h2>
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-success/10 border border-success/30 text-success p-8 rounded-lg text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check size={32} className="text-white" />
                    </motion.div>
                    <h3 className="font-bold text-xl mb-2">Message Received!</h3>
                    <p className="mb-4">I will respond to your inquiry shortly.</p>
                    <motion.button 
                      onClick={() => setSubmitted(false)}
                      className="text-sm underline hover:text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name Field */}
                    <div className="relative">
                      <motion.label
                        htmlFor="name"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focusedField === 'name' || formData.name 
                            ? '-top-2.5 text-xs bg-surface px-1 text-accent-crimson' 
                            : 'top-3.5 text-secondary'
                        }`}
                      >
                        Name
                      </motion.label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        className={inputClasses('name', !!errors.name)}
                      />
                      <AnimatePresence>
                        {errors.name && touched.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-1 text-warning text-sm"
                          >
                            <AlertCircle size={14} />
                            {errors.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <motion.label
                        htmlFor="email"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focusedField === 'email' || formData.email 
                            ? '-top-2.5 text-xs bg-surface px-1 text-accent-crimson' 
                            : 'top-3.5 text-secondary'
                        }`}
                      >
                        Email
                      </motion.label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        className={inputClasses('email', !!errors.email)}
                      />
                      <AnimatePresence>
                        {errors.email && touched.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-1 text-warning text-sm"
                          >
                            <AlertCircle size={14} />
                            {errors.email}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message Field */}
                    <div className="relative">
                      <motion.label
                        htmlFor="message"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focusedField === 'message' || formData.message 
                            ? '-top-2.5 text-xs bg-surface px-1 text-accent-crimson' 
                            : 'top-3.5 text-secondary'
                        }`}
                      >
                        Message
                      </motion.label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => handleFocus('message')}
                        onBlur={handleBlur}
                        className={inputClasses('message', !!errors.message)}
                      />
                      <AnimatePresence>
                        {errors.message && touched.message && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-1 text-warning text-sm"
                          >
                            <AlertCircle size={14} />
                            {errors.message}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-accent-crimson text-white font-bold py-3 rounded-lg hover:bg-accent-glow hover:shadow-[0_0_20px_rgba(200,16,46,0.4)] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Send Message 
                          <motion.span
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <Send size={18} />
                          </motion.span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Contact;
