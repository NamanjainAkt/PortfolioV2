import { motion, Variants } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const NameFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@example.com' },
  ];

  const name = 'NAMAN JAIN';

  return (
    <footer className="relative h-[50vh] min-h-[450px] flex flex-col items-center justify-center bg-background overflow-hidden border-t border-border/30">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(107, 107, 107, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(107, 107, 107, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-crimson/5 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-crimson/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, Math.random() * -300 + 'px'],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.button
        onClick={scrollToTop}
        className="relative group cursor-pointer focus:outline-none"
        whileHover="hover"
        initial="initial"
      >
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 group-hover:w-48 h-0.5 bg-gradient-to-r from-transparent via-accent-crimson to-transparent transition-all duration-500 ease-out" />

        <div className="relative flex gap-1">
          {name.split('').map((char, index) => (
            <motion.span
              key={index}
              className="text-7xl md:text-8xl lg:text-9xl font-sans font-bold tracking-widest text-primary select-none relative"
              initial={{ y: 0, opacity: 0.7 }}
              whileHover={{ 
                y: -15,
                opacity: 1,
                textShadow: `
                  0 0 20px rgba(220, 38, 38, 0.8),
                  0 0 40px rgba(220, 38, 38, 0.6),
                  0 0 60px rgba(220, 38, 38, 0.4)
                `,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: index * 0.03,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.button>

      <div className="flex gap-8 mt-20 relative z-10">
        {socialLinks.map((social) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 text-tertiary hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <social.icon size={24} />
          </motion.a>
        ))}
      </div>

      <motion.div
        className="absolute bottom-8 text-tertiary/50 text-xs tracking-[0.3em] uppercase"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Click to scroll up
      </motion.div>
    </footer>
  );
};

export default NameFooter;
