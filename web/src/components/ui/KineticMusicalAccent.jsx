import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

/**
 * KineticMusicalAccent — GreenSock DrawSVG-powered musical line art for SOE.
 * Draws kinetic acoustic waveforms, staff curves, and musical notes that respond to scroll and playback.
 *
 * @param {string} [color='#FF6F00'] — Primary stroke color
 * @param {string} [secondaryColor='#4CAF50'] — Secondary accent note color
 * @param {boolean} [isPlaying=false] — Triggers continuous acoustic pulsing
 * @param {'staff-wave'|'compact-pulse'} [variant='staff-wave'] — Display layout
 * @param {string} [className=''] — Additional class names
 * @param {React.CSSProperties} [style={}] — Inline styles
 */
export const KineticMusicalAccent = ({
  color = '#FF6F00',
  secondaryColor = '#5ba4c9',
  isPlaying = false,
  variant = 'staff-wave',
  className = '',
  style = {},
}) => {
  const svgRef = useRef(null);
  const pulseTweenRef = useRef(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const paths = el.querySelectorAll('.draw-path');
    const notes = el.querySelectorAll('.draw-note');

    // Initial kinetic draw-in triggered on viewport entry
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 1.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        notes,
        { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.6,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, svgRef);

    return () => ctx.revert();
  }, []);

  // Reactive animation loop when audio playback begins
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    if (isPlaying) {
      const activeWave = el.querySelector('.pulse-wave');
      if (activeWave) {
        pulseTweenRef.current = gsap.to(activeWave, {
          drawSVG: '15% 85%',
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: 'sine.inOut',
        });
      }
    } else {
      if (pulseTweenRef.current) {
        pulseTweenRef.current.kill();
        const activeWave = el.querySelector('.pulse-wave');
        if (activeWave) {
          gsap.to(activeWave, { drawSVG: '100%', duration: 0.4 });
        }
      }
    }

    return () => {
      if (pulseTweenRef.current) {
        pulseTweenRef.current.kill();
      }
    };
  }, [isPlaying]);

  if (variant === 'compact-pulse') {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 120 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`kinetic-musical-accent kinetic-musical-accent--compact ${className}`}
        style={{ width: '120px', height: '30px', ...style }}
        aria-hidden="true"
      >
        <path
          className="draw-path pulse-wave"
          d="M 5 15 Q 20 4, 35 15 T 65 15 T 95 15 T 115 15"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle className="draw-note" cx="35" cy="15" r="3" fill={color} />
        <circle className="draw-note" cx="95" cy="15" r="3" fill={secondaryColor} />
      </svg>
    );
  }

  return (
    <div
      className={`kinetic-musical-wrapper ${className}`}
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0.75rem auto 1.5rem auto',
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 500 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Five Staff Rhythm Lines */}
        <path
          className="draw-path"
          d="M 10 12 C 120 20, 240 4, 490 12"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
        <path
          className="draw-path"
          d="M 10 20 C 130 28, 260 12, 490 20"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
        <path
          className="draw-path pulse-wave"
          d="M 10 28 C 140 38, 270 18, 490 28"
          stroke={color}
          strokeWidth="2.4"
          strokeOpacity="0.9"
          strokeLinecap="round"
        />
        <path
          className="draw-path"
          d="M 10 36 C 150 46, 280 26, 490 36"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
        <path
          className="draw-path"
          d="M 10 44 C 160 54, 290 34, 490 44"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />

        {/* Tactile Rhythm Note Symbols (Floating Musical Pulses) */}
        <g className="draw-note">
          <ellipse cx="90" cy="28" rx="5" ry="4" transform="rotate(-20 90 28)" fill={color} />
          <line x1="94" y1="26" x2="94" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g className="draw-note">
          <ellipse cx="210" cy="24" rx="5" ry="4" transform="rotate(-20 210 24)" fill={secondaryColor} />
          <line x1="214" y1="22" x2="214" y2="6" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g className="draw-note">
          <ellipse cx="330" cy="32" rx="5" ry="4" transform="rotate(-20 330 32)" fill={color} />
          <line x1="334" y1="30" x2="334" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g className="draw-note">
          <ellipse cx="430" cy="26" rx="5" ry="4" transform="rotate(-20 430 26)" fill={secondaryColor} />
          <line x1="434" y1="24" x2="434" y2="8" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default KineticMusicalAccent;
