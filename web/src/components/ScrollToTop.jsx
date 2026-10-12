import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    const [visible, setVisible] = useState(false);
    const lenis = useLenis();

    // Scroll to anchor or top on route/hash change
    useEffect(() => {
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                if (lenis) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }
            const timer = setTimeout(() => {
                const retryTarget = document.querySelector(hash);
                if (retryTarget) {
                    if (lenis) {
                        lenis.scrollTo(retryTarget, { offset: -80, duration: 1.2 });
                    } else {
                        retryTarget.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 150);
            return () => clearTimeout(timer);
        }
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash, lenis]);

    // Show button after 300px scroll
    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBackToTop = () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <button
            className={`scroll-top-btn ${visible ? 'scroll-top-btn--visible' : ''}`}
            onClick={handleBackToTop}
            aria-label="Scroll to top"
            title="Back to top"
        >
            ↑
        </button>
    );
};

export default ScrollToTop;
