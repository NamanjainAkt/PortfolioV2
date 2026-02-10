import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink(!blink);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index === words.length) {
        setIndex(0);
        return;
    }

    if (subIndex === words[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {words[index].substring(0, subIndex)}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-accent-crimson ml-1 align-middle"
      />
    </span>
  );
};

export default Typewriter;
