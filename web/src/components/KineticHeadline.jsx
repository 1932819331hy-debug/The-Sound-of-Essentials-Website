import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * KineticHeadline — GreenSock SplitText-powered typography for SOE.
 * Provides musical, playful character and word reveals synchronized with Lenis and ScrollTrigger.
 *
 * @param {string|React.ReactNode} children — Text content to split and animate
 * @param {string} [tag='h2'] — Semantic HTML heading or text tag
 * @param {'musical-bounce'|'fade-up'|'mask-slide'|'wave'} [variant='musical-bounce'] — Animation style
 * @param {'chars,words'|'words'|'lines'} [type='chars,words'] — Split configuration
 * @param {number} [stagger=0.025] — Stagger delay between tokens in seconds
 * @param {number} [duration=0.8] — Tween duration in seconds
 * @param {number} [delay=0] — Additional delay in seconds before animation begins
 * @param {boolean} [scrollTrigger=true] — Whether animation is triggered on scroll entry
 * @param {string} [start='top 88%'] — ScrollTrigger start position
 * @param {string} [className=''] — Additional CSS class names
 * @param {React.CSSProperties} [style={}] — Inline styles
 */
export const KineticHeadline = ({
  children,
  tag = 'h2',
  variant = 'musical-bounce',
  type = 'chars,words',
  stagger = 0.025,
  duration = 0.8,
  delay = 0,
  scrollTrigger = true,
  start = 'top 88%',
  className = '',
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(mq.matches);
    updateMotion();
    mq.addEventListener('change', updateMotion);
    return () => mq.removeEventListener('change', updateMotion);
  }, []);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || reducedMotion) return;

      // Extract raw text or verify element is splittable
      const text = el.innerText || el.textContent;
      if (!text || text.trim().length === 0) return;

      let split;
      try {
        split = new SplitText(el, {
          type,
          charsClass: 'kinetic-char',
          wordsClass: 'kinetic-word',
          linesClass: 'kinetic-line',
        });
      } catch {
        // Fallback gracefully if splitting is prevented by DOM structure
        return;
      }

      const targets = type.includes('chars') && split.chars.length > 0 ? split.chars : split.words;
      if (!targets || targets.length === 0) {
        split.revert();
        return;
      }

      let animationVars = {};

      switch (variant) {
        case 'fade-up':
          animationVars = {
            y: 32,
            opacity: 0,
            duration,
            stagger,
            ease: 'power3.out',
          };
          break;

        case 'mask-slide':
          if (split.words) {
            gsap.set(split.words, { overflow: 'hidden' });
          }
          animationVars = {
            yPercent: 110,
            opacity: 0,
            duration,
            stagger,
            ease: 'power4.out',
          };
          break;

        case 'wave':
          animationVars = {
            y: (i) => Math.sin(i * 0.4) * 20 + 20,
            opacity: 0,
            duration: duration * 1.1,
            stagger,
            ease: 'elastic.out(1, 0.4)',
          };
          break;

        case 'musical-bounce':
        default:
          animationVars = {
            y: 36,
            opacity: 0,
            scale: 0.85,
            rotationZ: (i) => (i % 2 === 0 ? 5 : -5),
            duration,
            stagger,
            ease: 'back.out(1.8)',
          };
          break;
      }

      const tweenVars = {
        ...animationVars,
        delay,
      };

      if (scrollTrigger) {
        tweenVars.scrollTrigger = {
          trigger: el,
          start,
          once: true,
        };
      }

      gsap.from(targets, tweenVars);

      return () => {
        if (split) {
          split.revert();
        }
      };
    },
    { scope: containerRef, dependencies: [children, variant, reducedMotion] }
  );

  const Tag = tag;

  return (
    <Tag
      ref={containerRef}
      className={`kinetic-headline kinetic-headline--${variant} ${className}`}
      style={{
        display: tag === 'span' ? 'inline-block' : 'block',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default KineticHeadline;
