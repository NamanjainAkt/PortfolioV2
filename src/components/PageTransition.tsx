import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  initial?: boolean;
}

export const PageTransition = ({ children, initial = true }: PageTransitionProps) => {
  return (
    <motion.div
      initial={initial ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
