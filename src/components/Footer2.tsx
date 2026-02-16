import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, Terminal, ShieldCheck } from 'lucide-react';

const Footer2 = () => {
  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/namanjainakt/' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/naman-jain-akt/' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Email', icon: Mail, href: 'mailto:namanjainakt@gmail.com' },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 py-16 overflow-hidden selection:bg-accent-crimson/30">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[40%] h-full bg-accent-crimson/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-full bg-accent-crimson/[0.02] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(200,16,46,0.08),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          
          {/* Logo & Protocol Identity */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="group flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-accent-crimson group-hover:border-accent-crimson transition-all duration-500 shadow-2xl">
                <Terminal size={18} className="text-tertiary group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-3xl font-serif font-black tracking-tighter uppercase inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-accent-crimson/50">
                NAMAN JAIN
              </h2>
            </Link>
            <div className="flex items-center gap-3 text-[9px] font-mono text-tertiary uppercase tracking-[0.3em]">
              <span className="text-accent-crimson font-black">Archive Protocol</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span>Release v2.0.4</span>
            </div>
          </div>

          {/* Social Command Dock */}
          <div className="flex items-center gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-transparent text-tertiary hover:text-white hover:bg-accent-crimson transition-all duration-500 group"
                whileHover={{ y: -4, scale: 1.05 }}
                aria-label={social.name}
              >
                <social.icon size={20} strokeWidth={1.5} />
              </motion.a>
            ))}
          </div>

          {/* Verification Meta */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full">
              <ShieldCheck size={12} className="text-accent-crimson" />
              <span className="text-[9px] font-mono text-secondary uppercase tracking-widest font-bold">Secure Connection</span>
            </div>
            <p className="text-[8px] font-mono text-tertiary uppercase tracking-widest opacity-40">
              Handcrafted with Cinematic Precision © 2026
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer2;
