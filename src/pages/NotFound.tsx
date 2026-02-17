import { motion } from 'framer-motion';
import { ArrowLeft, Home, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '../components/ParticleBackground';
import { Spotlight } from '../components/Spotlight';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <Spotlight className="opacity-50" size={600} />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,16,46,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,16,46,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <div className="relative inline-block">
          <motion.h1
            className="text-[12rem] md:text-[18rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#C8102E] to-[#600816] select-none"
            initial={{ scale: 0.8, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              filter: { duration: 1 }
            }}
          >
            404
          </motion.h1>
          
          {/* Glitch Overlay */}
          <motion.div
            className="absolute inset-0 text-[12rem] md:text-[18rem] font-black leading-none text-[#C8102E]/20 select-none mix-blend-screen"
            animate={{
              x: [-2, 2, -1, 1, 0],
              y: [1, -1, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              ease: "linear",
              repeatDelay: 2
            }}
          >
            404
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 flex flex-col items-center"
        >
          <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-[0.5em]">
            System Error
          </span>
          <div className="h-px w-24 bg-[#C8102E] mt-2 animate-pulse" />
          <p className="mt-4 text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            The coordinates you requested lead to a void in the digital architecture.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/"
            className="group relative px-8 py-4 bg-[#C8102E] text-white font-bold rounded-sm 
                       overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
            <span className="relative flex items-center gap-2">
              <Home className="w-5 h-5" />
              RETURN TO CORE
            </span>
          </Link>

          <Link
            to="/projects"
            className="group px-8 py-4 border border-[#C8102E]/30 text-[#C8102E] font-bold rounded-sm 
                       hover:bg-[#C8102E]/5 transition-all duration-300 flex items-center gap-2"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            VIEW PROJECTS
          </Link>
        </motion.div>
      </motion.div>

      {/* Terminal-like status lines */}
      <div className="absolute bottom-8 left-8 hidden lg:block font-mono text-[10px] text-gray-600 space-y-1">
        <p className="animate-pulse">STATUS: CRITICAL_FAILURE</p>
        <p>LOCATION: UNKNOWN_DOMAIN</p>
        <p>PROTOCOL: ERROR_404</p>
      </div>
    </div>
  );
};

export default NotFound;
