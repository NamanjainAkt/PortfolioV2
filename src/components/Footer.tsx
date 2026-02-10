import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ArrowUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeInWhenVisible } from './FadeInWhenVisible';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Blogs', path: '/blogs' },
      { name: 'Contact', path: '/contact' },
    ],
    social: [
      { name: 'GitHub', icon: Github, href: 'https://github.com' },
      { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
      { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
      { name: 'Email', icon: Mail, href: 'mailto:contact@example.com' },
    ],
  };

  return (
    <footer className="border-t border-border bg-surface/30 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <FadeInWhenVisible delay={0}>
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-4 tracking-tight">
                NAMAN <span className="text-accent-crimson">JAIN</span>
              </h3>
              <p className="text-secondary mb-6 max-w-md leading-relaxed">
                Building scalable, high-performance applications with a focus on exceptional user experience and robust system design.
              </p>
              <div className="flex gap-4">
                {footerLinks.social.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-elevated border border-border overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-accent-crimson scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                    <social.icon size={18} className="relative z-10 text-secondary group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Navigation Column */}
          <FadeInWhenVisible delay={0.1}>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-tertiary mb-4">
                Navigation
              </h4>
              <ul className="space-y-3">
                {footerLinks.navigation.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary hover:text-accent-crimson transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[2px] bg-accent-crimson mr-0 group-hover:mr-2 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Contact Column */}
          <FadeInWhenVisible delay={0.2}>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-tertiary mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact@example.com"
                    className="text-secondary hover:text-accent-crimson transition-colors"
                  >
                    contact@example.com
                  </a>
                </li>
                <li className="text-secondary">
                  Available for freelance
                </li>
                <li className="text-secondary">
                  Open to opportunities
                </li>
              </ul>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Bottom Bar */}
        <FadeInWhenVisible delay={0.3}>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-tertiary flex items-center gap-1">
              &copy; {currentYear} Naman Jain. Made with <Heart size={14} className="text-accent-crimson fill-accent-crimson" /> and code.
            </p>
            
            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-sm text-secondary hover:text-accent-crimson transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Back to top</span>
              <motion.div
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-accent-crimson transition-colors"
                whileHover={{ y: -2 }}
              >
                <ArrowUp size={16} />
              </motion.div>
            </motion.button>
          </div>
        </FadeInWhenVisible>
      </div>
    </footer>
  );
};

export default Footer;
