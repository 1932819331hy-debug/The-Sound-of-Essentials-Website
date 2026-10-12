import React from 'react';
import KineticHeadline from '../components/KineticHeadline';

/**
 * CharSplitText — Upgraded with GreenSock SplitText.
 * Preserves the exact same API contract while providing physics-based kinetic reveals.
 */
const CharSplitText = ({
  tag = 'h1',
  children,
  className = '',
  stagger = 25,
  variant = 'musical-bounce',
  ...props
}) => {
  // Convert millisecond delay (e.g. stagger={28}) to seconds for GSAP
  const staggerSeconds = typeof stagger === 'number' && stagger > 1 ? stagger / 1000 : (stagger || 0.025);

  return (
    <KineticHeadline
      tag={tag}
      className={`v2-char-split ${className}`}
      variant={variant}
      stagger={staggerSeconds}
      {...props}
    >
      {children}
    </KineticHeadline>
  );
};

export default CharSplitText;

