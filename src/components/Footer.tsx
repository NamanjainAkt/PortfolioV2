import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ArrowUp } from 'lucide-react';
import FooterWalker from './FooterWalker';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/namanjainakt/' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/naman-jain-akt/' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Email', icon: Mail, href: 'mailto:namanjainakt@gmail.com' },
  ];

  const name = "NAMAN JAIN";
  const containerRef = useRef<HTMLDivElement>(null)
  const leftNRef = useRef<HTMLSpanElement>(null)
  const rightNRef = useRef<HTMLSpanElement>(null)
  const spaceIndex = name.indexOf(' ')
  const leftNIndex = (() => {
    for (let i = spaceIndex - 1; i >= 0; i--) if (name[i] === 'N') return i
    return 0
  })()
  const rightNIndex = (() => {
    for (let i = name.length - 1; i > spaceIndex; i--) if (name[i] === 'N') return i
    return name.length - 1
  })()

  const footerRef = useRef<HTMLElement>(null)

  return (
    <footer ref={footerRef} className="relative py-24 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Massive Name / Scroll to Top */}
        <button 
          onClick={scrollToTop}
          className="group relative cursor-pointer mb-12"
        >
          <div ref={containerRef} className="relative flex overflow-hidden">
            {name.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 0 }}
                whileHover={{ y: -20, color: '#C8102E' }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-serif font-black tracking-tighter text-white leading-none inline-block select-none"
                ref={i === leftNIndex ? leftNRef : i === rightNIndex ? rightNRef : undefined}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          
          {/* Hover Indicator */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <ArrowUp size={24} className="text-accent-crimson animate-bounce" />
            <span className="text-[10px] font-mono text-accent-glow uppercase tracking-[0.5em]">Back to Top</span>
          </div>
        </button>

        {/* Social Links */}
        <div className="flex gap-8 md:gap-12 relative z-10">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-white transition-all duration-300"
              whileHover={{ y: -5, scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <social.icon size={24} strokeWidth={1.5} />
            </motion.a>
          ))}
        </div>

        {/* Minimal Copyright */}
        <div className="mt-20 text-[9px] font-mono text-tertiary/80 uppercase tracking-[0.5em]">
          © 2026 Developed by Naman Jain
        </div>
      </div>

      {/* Atmospheric Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-accent-crimson/5 blur-[120px] pointer-events-none" />
      <FooterWalker startRef={leftNRef} endRef={rightNRef} containerRef={footerRef} />
    </footer>
  );
};

export default Footer;
