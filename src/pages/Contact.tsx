import React, { useState, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, Check, Loader2, Radio, Globe, Zap } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment } from '@react-three/drei';
import { Satellite } from '../components/Satellite';
import { FadeInWhenVisible } from '../components/FadeInWhenVisible';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const MouseFollowSatellite = () => {
  const { mouse, viewport } = useThree();
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (satelliteRef.current) {
      // Position satellite to the right of the text
      // In Three.js units, we'll aim for x = viewport.width / 4 or similar
      const targetX = (mouse.x * viewport.width) / 4 - 0.5;
      const targetY = (mouse.y * viewport.height) / 4 + 1;
      
      satelliteRef.current.position.x = THREE.MathUtils.lerp(satelliteRef.current.position.x, targetX, 0.05);
      satelliteRef.current.position.y = THREE.MathUtils.lerp(satelliteRef.current.position.y, targetY, 0.05);
      
      // Also slight rotation based on mouse
      satelliteRef.current.rotation.y = THREE.MathUtils.lerp(satelliteRef.current.rotation.y, mouse.x * 0.5, 0.05);
      satelliteRef.current.rotation.x = THREE.MathUtils.lerp(satelliteRef.current.rotation.x, -mouse.y * 0.3, 0.05);
    }
  });

  return (
    <group ref={satelliteRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Satellite scale={0.9} />
      </Float>
    </group>
  );
};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Naman',
          to_email: 'namanjainakt007@gmail.com',
        },
        PUBLIC_KEY
      );

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch (error) {
      console.error('Email send failed:', error);
      setErrors(prev => ({ ...prev, message: 'Transmission failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactChannels = [
    { icon: Mail, name: 'Email', value: 'namanjainakt007@gmail.com', href: 'mailto:namanjainakt007@gmail.com', label: 'DIRECT_LINK' },
    { icon: Github, name: 'GitHub', value: 'github.com/namanjainakt', href: 'https://github.com/namanjainakt', label: 'SOURCE_CORE' },
    { icon: Linkedin, name: 'LinkedIn', value: 'linkedin.com/in/naman-jain-akt', href: 'https://linkedin.com/in/naman-jain-akt', label: 'NEURAL_NET' },
  ];

  const inputClasses = (fieldName: string, hasError: boolean) => `
    w-full bg-[#0A0A0A]/60 backdrop-blur-md border rounded-lg px-4 py-3 text-white 
    transition-all duration-300 outline-none font-mono text-sm
    ${hasError 
      ? 'border-red-500/50 focus:border-red-500' 
      : focusedField === fieldName 
        ? 'border-accent-crimson shadow-[0_0_15px_rgba(200,16,46,0.2)]' 
        : 'border-white/10 focus:border-accent-crimson'
    }
  `;

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
      {/* 3D Background Layer - Hidden on small screens */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} frameloop="demand">
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C8102E" />
            
            <MouseFollowSatellite />
            
            <Environment preset="night" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 pt-28 pb-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side: Space HUD Theme Info */}
            <div className="space-y-12">
              <FadeInWhenVisible>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[2px] w-12 bg-accent-crimson shadow-[0_0_10px_rgba(200,16,46,0.8)]" />
                    <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.5em] animate-pulse">Establishing Connection</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-serif font-black text-white uppercase leading-none">
                    GET IN <br />
                    <span className="text-accent-crimson">ORBIT</span>
                  </h1>
                  <p className="text-gray-400 font-mono text-sm max-w-md leading-relaxed">
                    Ready to receive high-bandwidth transmissions. Whether it's a new project, technical query, or just a ping from across the digital void.
                  </p>
                </div>
              </FadeInWhenVisible>

              <div className="grid sm:grid-cols-1 gap-4">
                {contactChannels.map((channel, index) => (
                  <FadeInWhenVisible key={channel.name} delay={0.2 + index * 0.1}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-xl hover:border-accent-crimson/50 hover:bg-white/[0.05] transition-all duration-500"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent-crimson/10 flex items-center justify-center text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-all">
                          <channel.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-accent-glow uppercase tracking-widest">{channel.label}</p>
                          <h3 className="text-white font-bold text-sm tracking-tight">{channel.value}</h3>
                        </div>
                      </div>
                      <Radio size={14} className="text-white/20 group-hover:text-accent-crimson animate-pulse" />
                    </a>
                  </FadeInWhenVisible>
                ))}
              </div>

              {/* Orbital Telemetry HUD */}
              <FadeInWhenVisible delay={0.5}>
                <div className="p-4 border-t border-white/5 flex gap-8 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                   <div className="font-mono text-[9px] space-y-1">
                      <p className="text-accent-glow">LAT: 21.2514° N</p>
                      <p className="text-accent-glow">LON: 81.6296° E</p>
                   </div>
                   <div className="font-mono text-[9px] space-y-1">
                      <p className="text-white">SIG_STRENGTH: 98%</p>
                      <p className="text-white">STATUS: LISTENING</p>
                   </div>
                   <div className="ml-auto">
                      <Globe size={24} className="text-accent-crimson animate-spin-slow" />
                   </div>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* Right Side: Transmission Form */}
            <FadeInWhenVisible delay={0.3} direction="left">
              <div className="relative group">
                {/* HUD Frame Decorations */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent-crimson/30 group-hover:border-accent-crimson transition-colors" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent-crimson/30 group-hover:border-accent-crimson transition-colors" />
                
                <div className="bg-[#0A0A0A]/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-tight">Transmission_Buffer</h2>
                    <Zap size={16} className="text-accent-glow animate-bounce" />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-12 text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-accent-crimson/20 rounded-full flex items-center justify-center mx-auto border border-accent-crimson/30">
                          <Check size={40} className="text-accent-crimson" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Signal Sent!</h3>
                          <p className="text-gray-400 font-mono text-xs mt-2">Packet delivered to the neural core.</p>
                        </div>
                        <button 
                          onClick={() => setSubmitted(false)}
                          className="px-6 py-2 border border-white/10 rounded-full text-xs font-mono text-gray-400 hover:text-white hover:border-accent-crimson transition-all"
                        >
                          Send Another_Packet
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Identity.name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={handleBlur}
                            placeholder="COMM_OPERATOR_NAME"
                            className={inputClasses('name', !!errors.name)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Identity.email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={handleBlur}
                            placeholder="REPLY_NODE_ADDRESS"
                            className={inputClasses('email', !!errors.email)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Packet.payload</label>
                          <textarea
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={handleBlur}
                            placeholder="ENTER_DATA_TO_TRANSMIT..."
                            className={inputClasses('message', !!errors.message)}
                          />
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full relative overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-accent-crimson translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500" />
                          <div className="relative border border-accent-crimson/50 px-8 py-4 flex items-center justify-center gap-3 text-white font-mono text-sm tracking-[0.2em] uppercase transition-colors group-hover/btn:text-white">
                            {isSubmitting ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <>
                                Execute_Send
                                <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </>
                            )}
                          </div>
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>

      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-crimson/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default Contact;
