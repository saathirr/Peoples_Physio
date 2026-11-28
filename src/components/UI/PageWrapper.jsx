import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial:  { opacity: 0, y: 22, scale: 0.98 },
  animate:  {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

export default PageWrapper;
