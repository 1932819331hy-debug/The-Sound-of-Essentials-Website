import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './StickyThumbCta.css';

/**
 * StickyThumbCta — Fitts's Law mobile conversion anchor.
 * Floats in the natural thumb reach zone on mobile after scrolling past hero.
 */
export const StickyThumbCta = ({
  targetUrl = '#optin',
  label = '🎧 Unlock 19 Tracks Free →',
  subtext = '100% Free • Instant Access',
  badge = '⚡️ Instant Access',
  onClick,
  isExternal = false,
  showThreshold = 320,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const visible = currentScroll > showThreshold;
      setIsVisible(visible);
      if (visible) {
        document.body.classList.add('has-sticky-cta');
        document.documentElement.style.setProperty('--sticky-cta-height', '72px');
      } else {
        document.body.classList.remove('has-sticky-cta');
        document.documentElement.style.setProperty('--sticky-cta-height', '0px');
      }
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      document.body.classList.remove('has-sticky-cta');
      document.documentElement.style.setProperty('--sticky-cta-height', '0px');
    };
  }, [showThreshold]);

  const isAnchor = targetUrl.startsWith('#');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="sticky-thumb-cta"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280, mass: 0.8 }}
        >
          <div className="sticky-thumb-cta__inner">
            <div className="sticky-thumb-cta__content">
              {badge && <span className="sticky-thumb-cta__badge">{badge}</span>}
              <span className="sticky-thumb-cta__subtext">{subtext}</span>
            </div>

            <div className="sticky-thumb-cta__btn-wrap">
              {isAnchor ? (
                <a
                  href={targetUrl}
                  className="sticky-thumb-cta__btn"
                  onClick={onClick}
                >
                  {label}
                </a>
              ) : isExternal ? (
                <a
                  href={targetUrl}
                  className="sticky-thumb-cta__btn"
                  rel="noopener noreferrer"
                  onClick={onClick}
                >
                  {label}
                </a>
              ) : (
                <Link
                  to={targetUrl}
                  className="sticky-thumb-cta__btn"
                  onClick={onClick}
                >
                  {label}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyThumbCta;
