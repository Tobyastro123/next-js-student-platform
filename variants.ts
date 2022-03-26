import { Variants } from 'framer-motion';

export const fadeIn = (direction = 'up'): Variants => {
  return {
    initial: {
      y: direction === 'up' ? 40 : -60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.7,
      staggerChildren: 0.5,
    },
  },
};

export const imageWrapper: Variants = {
  initial: {
    y: -1000,
  },
  animate: {
    y: 0,
    transition: {
      delay: 2.6,
      duration: 0.8,
      type: 'spring',
      stiffness: 50,
    },
  },
};
export const imageWrapper1: Variants = {
  initial: {
    x: -1000,
  },
  animate: {
    x: 0,
    transition: {
      delay: 2.6,
      duration: 0.2,
      type: 'spring',
      stiffness: 50,
    },
  },
};

export const imageLandingPage: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [10, 0, 10],
    transition: {
      duration: 4,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const imageLandingPage1: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [10, 0, 10],
    transition: {
      duration: 4,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};
