import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * FlowSection — A single full-height scroll section within the StoryScroll.
 *
 * Props:
 *   className  — Extra classes
 *   style      — Inline styles (use for background/text colors per section)
 *   children   — Section content
 *   aria-label — Accessibility label
 */
export const FlowSection = ({
  className = '',
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={`flow-section ${className}`}
  >
    <div
      data-flow-inner
      className="flow-art-container"
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {children}
    </div>
  </section>
);

/**
 * StoryScroll — GSAP-powered scroll story with pinning and rotation reveals.
 * Adapted from FlowArt for SOE's vanilla CSS design system.
 *
 * Props:
 *   children   — FlowSection children
 *   className  — Extra classes on the wrapper
 *   aria-label — Accessibility label
 */
const StoryScroll = ({
  children,
  className = '',
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll('[data-flow-section]')
      );
      if (sections.length === 0) return;

      const triggers = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            })
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [React.Children.count(children), reducedMotion] }
  );

  return (
    <>
      <div
        ref={containerRef}
        aria-label={ariaLabel}
        className={`story-scroll ${className}`}
      >
        {children}
      </div>

      <style>{`
        /* ── Story Scroll — Core Layout ── */
        .story-scroll {
          width: 100%;
          overflow-x: hidden;
        }

        .flow-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .flow-art-container {
          position: relative;
          display: flex;
          min-height: 100vh;
          width: 100%;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
          padding: clamp(2rem, 8vw, 4vw) 4vw 4vw;
          will-change: transform;
        }

        /* ── Section typography ── */
        .flow-section__label {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: inherit;
        }

        .flow-section__divider {
          border: none;
          height: 1px;
          margin: 2vw 0;
          opacity: 0.35;
          background-color: currentColor;
        }

        .flow-section__headline {
          font-family: var(--font-sugar);
          font-size: clamp(3rem, 10vw, 10rem);
          font-weight: 400;
          line-height: 0.88;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          color: inherit;
        }

        .flow-section__body {
          max-width: 55ch;
          font-family: var(--font-milky);
          font-size: clamp(1.25rem, 2.7vw, 2.1rem);
          font-weight: 400;
          line-height: 1.55;
          letter-spacing: 0.02em;
          color: inherit;
        }

        .flow-section__body--right {
          margin-left: auto;
          text-align: right;
        }

        /* ── Info columns ── */
        .flow-columns {
          display: flex;
          flex-wrap: wrap;
          gap: 3vw;
        }

        .flow-column {
          min-width: 180px;
          flex: 1;
        }

        .flow-column__title {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.5rem;
          color: inherit;
        }

        .flow-column__text {
          font-family: var(--font-milky);
          font-size: clamp(0.95rem, 1.4vw, 1.2rem);
          line-height: 1.55;
          letter-spacing: 0.01em;
          opacity: 0.95;
          color: inherit;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .flow-art-container {
            padding: 2rem 1.25rem;
          }

          .flow-section__headline {
            font-size: clamp(2.5rem, 12vw, 5rem);
          }

          .flow-columns {
            flex-direction: column;
            gap: 1.5rem;
          }

          .flow-column {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default StoryScroll;
