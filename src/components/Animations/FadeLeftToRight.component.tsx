const { motion } = require('framer-motion');
import React from 'react';
import type { IAnimateStaggerWithDelayProps } from './types/Animations.types';

/**
 * Fade content left to right. Needs to be used with FadeLeftToRightItem
 * @function FadeLeftToRight
 * @param {ReactNode} children - Children content to render
 * @param {string} cssClass - CSS classes to apply to component
 * @param {number} delay - Time to wait before starting animation
 * @param {number} staggerDelay - Time to wait before starting animation for children items
 * @param {boolean} animateNotReverse - Start animation backwards
 * @param {number[]} activeIndexes - Array of indexes of children to animate
 * @returns {JSX.Element} - Rendered component
 */

const FadeLeftToRight = ({
  children,
  cssClass,
  delay,
  staggerDelay,
  animateNotReverse,
  activeIndexes = [],
}: IAnimateStaggerWithDelayProps & { activeIndexes?: number[] }) => {
  const FadeLeftToRightVariants = {
    visible: {
      x: 0, // No horizontal offset
      transition: {
        when: 'beforeChildren',
        staggerChildren: staggerDelay || 0.5,
        delay,
        ease: 'easeInOut',
        staggerDirection: 1,
      },
    },
    hidden: {
      x: '-100%', // Slide from left (no opacity animation)
      transition: {
        when: 'afterChildren',
        staggerChildren: staggerDelay || 0.5,
        staggerDirection: -1,
      },
    },
  };

  const childVariants = {
    visible: (index: number) =>
      activeIndexes.includes(index)
        ? {
            x: 0, // Visible position
            transition: { duration: 0.5, ease: 'easeInOut' },
          }
        : {}, // Skip animation for other items
    hidden: {
      x: '-100%', // Hidden position (no opacity change)
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={animateNotReverse ? 'visible' : 'hidden'}
      variants={FadeLeftToRightVariants}
      className={cssClass}
      data-testid="fadelefttoright"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          custom={index}
          variants={childVariants}
          key={`fade-left-to-right-${index}`}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FadeLeftToRight;
