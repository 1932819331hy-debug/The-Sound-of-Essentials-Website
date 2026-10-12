import { useEffect, useRef, useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTriggerSync — Keeps GSAP ScrollTrigger updated on every Lenis scroll event.
 */
function ScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

/**
 * SmoothScrollProvider — Configures Lenis smooth scrolling for the application,
 * synchronizing with GSAP's animation ticker and respecting accessibility preferences.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPref = () => setReducedMotion(mq.matches);
    updateMotionPref();
    mq.addEventListener('change', updateMotionPref);
    return () => mq.removeEventListener('change', updateMotionPref);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Connect Lenis RAF loop to GSAP's ticker to eliminate micro-stutters and keep them in lockstep
    const handleTicker = (time) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(handleTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(handleTicker);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      autoRaf={false}
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

export default SmoothScrollProvider;
