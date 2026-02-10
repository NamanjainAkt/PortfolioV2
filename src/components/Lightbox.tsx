import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
      }
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                disabled={currentIndex === 0}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={32} />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                disabled={currentIndex === images.length - 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={32} />
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium"
          >
            {currentIndex + 1} / {images.length}
          </motion.div>

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-[90vw] max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (idx < currentIndex) {
                      for (let i = currentIndex; i > idx; i--) onPrev();
                    } else if (idx > currentIndex) {
                      for (let i = currentIndex; i < idx; i++) onNext();
                    }
                  }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-accent-crimson opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
