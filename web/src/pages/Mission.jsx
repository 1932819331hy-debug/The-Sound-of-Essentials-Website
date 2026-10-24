import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAnimeReveal } from '../hooks/useAnimeReveal';
import GooeyMarquee from '../components/GooeyMarquee';
import StoryScroll, { FlowSection } from '../components/StoryScroll';
import { assetCssUrl, assetPath } from '../utils/assetPath';
import PhilanthropicDonationSection from '../components/PhilanthropicDonationSection';
import KineticHeadline from '../components/KineticHeadline';
import JsonLd from '../components/JsonLd';
import { missionSchema } from '../utils/schema';

/* ── Reveal Hook ── */
const useReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
};

const RevealSection = ({ children, className = '', delay = 0 }) => {
    const ref = useReveal();
    return (
        <div ref={ref} className={`reveal-block ${className}`} style={{ animationDelay: `${delay}s` }}>
            {children}
        </div>
    );
};

/* ── Animated Counter ── */
const AnimatedStat = ({ value, suffix = '', label, color }) => {
    const ref = useRef(null);
    const numRef = useRef(null);

    const animateCount = () => {
        const target = parseInt(value);
        const dur = 2000;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (numRef.current) {
                numRef.current.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            }
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animateCount();
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="mission-stat glass-card">
            <span ref={numRef} className="mission-stat__number" style={{ color }}>0{suffix}</span>
            <span className="mission-stat__label">{label}</span>
        </div>
    );
};

/* ── Ambient Scene Gallery ── */
const SCENES = [
  { src: 'soe-globe-earth.webp',       caption: 'The Seven Lands Universe', land: 'All Seven Lands' },
  { src: 'b-roll-boats.webp',          caption: 'On the Water',            land: 'Luminosity' },
  { src: 'b-roll-flowers.webp',        caption: 'Through the Fields',      land: 'Terrasol' },
  { src: 'climb-numeria.webp',         caption: 'Climbing Numeria',        land: 'Numeria' },
  { src: 'donkey.webp',                caption: 'A Trusty Companion',      land: 'Animalia' },
  { src: 'drums.webp',                 caption: 'The Beat Goes On',        land: 'Harmonia' },
  { src: 'seriphia-in-celestia.webp',  caption: 'Seriphia at the Gate',    land: 'Celestia' },
  { src: 'touch-your-toes.webp',       caption: 'Body in Motion',          land: 'Kinesthia' },
  { src: 'wave.webp',                  caption: 'Riding the Wave',         land: 'Aquaria' },
  // ── New scenes ──
  { src: 'excited-to-learn.webp',      caption: 'Excited to Learn',        land: 'All Lands' },
  { src: 'floating-letters.webp',      caption: 'Floating Letters',        land: 'Luminosity' },
  { src: 'counting-claps.webp',        caption: 'Counting Claps',          land: 'Numeria' },
  { src: 'path-to-terrasol.webp',      caption: 'Path to Terrasol',        land: 'Terrasol' },
  { src: 'living-food.webp',           caption: 'Living Food',             land: 'Vitalis' },
  { src: 'kwame-counting.webp',        caption: 'Kwame at Work',           land: 'Numeria' },
  { src: 'march-luminosity.webp',      caption: 'March of Luminosity',     land: 'Luminosity' },
  { src: 'sundial-weather.webp',       caption: 'Reading the Sundial',     land: 'Celestia' },
];

const MissionSceneGallery = () => {
  const gridRef = useAnimeReveal({ selector: '.mission-scene', staggerMs: 85, translateY: [24, 0], scale: [0.96, 1] });

  return (
    <section className="section mission-scene-section">
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">🌍 The Seven Lands</div>
          <KineticHeadline
            tag="h2"
            className="section-title"
            variant="musical-bounce"
          >
            A World Built for <span className="text-gold">Every Child</span>
          </KineticHeadline>
          <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
            Each land in the Rhythm Quest universe mirrors a real domain of learning —
            bringing vocabulary, music, and movement to life through immersive scenes.
          </p>
        </RevealSection>

        <div className="mission-scene-mosaic" ref={gridRef}>
          {SCENES.map((s) => (
            <div key={s.src} className="mission-scene anime-item">
              <img
                src={assetPath(`/assets/scenes/${s.src}`)}
                alt={s.caption}
                loading="lazy"
              />
              <div className="mission-scene__label">
                <span className="mission-scene__land">{s.land}</span>
                <span className="mission-scene__caption">{s.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Mission = () => {
    React.useEffect(() => { document.title = 'Our Mission — SOE Rhythm Quest'; }, []);
    return (
        <div className="mission-page">
            <JsonLd data={missionSchema()} />
            {/* ── Fixed Cosmic 7 Lands Background Layer ── */}
            <div className="mission-bg-layer" aria-hidden="true">
                <div className="mission-bg-img" />
                <div className="mission-bg-overlay" />
            </div>

            {/* ── Hero ── */}
            <header className="mission-hero">
                <div className="container text-center">
                    <div className="mission-hero-card animate-fade-up">
                        <div className="section-label">Our Mission</div>
                        <KineticHeadline
                            tag="h1"
                            variant="musical-bounce"
                            delay={0.1}
                            scrollTrigger={false}
                        >
                            A <span className="accent-text">State of Emergency</span>
                        </KineticHeadline>
                        <p className="section-subtitle">
                            The world's most vulnerable children are running out of time.
                            SOE exists to change that equation through the universal language of music.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Brand Proof Marquee ── */}
            <section className="mission-marquee-section" aria-label="Brand statement">
                <GooeyMarquee
                    text='They called music "non-essential." We called it The Sound of Essentials.'
                    speed={20}
                    color="var(--color-gold)"
                    fontSize="clamp(2rem, 6vw, 4.5rem)"
                />
            </section>

            {/* ══════════════════════════════════════════════════
                 STORY SCROLL — The SOE Brand Story & Manifesto
                 Five immersive sections told through scroll
                 ══════════════════════════════════════════════════ */}
            <StoryScroll aria-label="The Sound of Essentials — Our Story">

              {/* ── 01: THE ORIGIN ── */}
              <FlowSection aria-label="The Origin" style={{ backgroundColor: '#FF6F00', color: '#fff' }}>
                <p className="flow-section__label">01 — The Origin</p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.35)' }} />
                <div>
                  <KineticHeadline
                    tag="h2"
                    className="flow-section__headline"
                    variant="musical-bounce"
                  >
                    A Solution.<br />
                    Not<br />
                    A Sale.
                  </KineticHeadline>
                </div>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.35)' }} />
                <p className="flow-section__body">
                  Created with devotion and care, offering an unhurried musical foundation your family can trust.
                  Our front door is a complete, 19-track album of acoustic music,
                  gifted 100% free to every family. Foundational sensory learning is a birthright, not a luxury.
                  We do not ask parents to trust a promise; we give them the living proof first.
                </p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.35)' }} />
                <div className="flow-columns">
                  <div className="flow-column">
                    <p className="flow-column__title">19 Free Tracks</p>
                    <p className="flow-column__text">
                      A complete original studio album gifted freely to every home, without subscription gates or paywalls.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">The Living Solution</p>
                    <p className="flow-column__text">
                      An acoustic antidote to screen fatigue, sensory overload, and fractured childhood attention.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">Ages 2–7 Sanctuary</p>
                    <p className="flow-column__text">
                      Targeted early immersion during the most critical neural development window of a child&apos;s life.
                    </p>
                  </div>
                </div>
              </FlowSection>

              {/* ── 02: THE EQUITABLE EXCHANGE ── */}
              <FlowSection aria-label="The Equitable Exchange" style={{ backgroundColor: '#1a1a2e', color: '#fff' }}>
                <p className="flow-section__label">02 — The Equitable Exchange</p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
                <div>
                  <KineticHeadline
                    tag="h2"
                    className="flow-section__headline"
                    variant="musical-bounce"
                  >
                    An<br />
                    Equitable<br />
                    Exchange
                  </KineticHeadline>
                </div>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
                <p className="flow-section__body">
                  When families choose our physical workbooks, illustrated picture dictionaries, and learning tools,
                  it is never an extraction. It is an equitable exchange: a willing investment made by parents
                  for the profound calm, focus, and cognitive transformation we bring into their home sanctuary.
                </p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
                <div className="flow-columns">
                  <div className="flow-column">
                    <p className="flow-column__title">A Willing Investment</p>
                    <p className="flow-column__text">
                      Parents invest willingly in tangible, screen-free mastery their children can hold, turn, and master.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">Home Sanctuary</p>
                    <p className="flow-column__text">
                      Restoring peace to family life by replacing overstimulating digital noise with focused acoustic presence.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">Profound Equity</p>
                    <p className="flow-column__text">
                      Transformative early literacy, numeracy, and motor foundations that level the playing field for life.
                    </p>
                  </div>
                </div>
              </FlowSection>

              {/* ── 03: THE NEW STANDARD ── */}
              <FlowSection aria-label="The New Standard" style={{ backgroundColor: '#2E7D32', color: '#fff' }}>
                <p className="flow-section__label">03 — The New Standard</p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                <div>
                  <KineticHeadline
                    tag="h2"
                    className="flow-section__headline"
                    variant="musical-bounce"
                  >
                    Integrity.<br />
                    Not<br />
                    Extraction.
                  </KineticHeadline>
                </div>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                <p className="flow-section__body">
                  We did not enter this market as another corporate pillager or cold proprietor peddling screen addiction
                  and dopamine loops. We are establishing an uncompromising standard of integrity, beauty, and presence
                  in early childhood development.
                </p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                <div className="flow-columns">
                  <div className="flow-column">
                    <p className="flow-column__title">No Dopamine Loops</p>
                    <p className="flow-column__text">
                      Zero dark patterns, flashing visual hooks, or watch-time traps designed to keep children glued to screens.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">7 Lands Universe</p>
                    <p className="flow-column__text">
                      15 diverse heroes across 5 core developmental domains, brought to life through visionary generative AI artistry and scored with original acoustic music recorded live in studio sessions.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">Uncompromising Presence</p>
                    <p className="flow-column__text">
                      Every artifact is crafted to deepen parent-child connection and protect the sanctuary of childhood.
                    </p>
                  </div>
                </div>
              </FlowSection>

              {/* ── 04: TRUE TITANS ── */}
              <FlowSection aria-label="True Titans" style={{ backgroundColor: '#faf9f7', color: '#1a1a2e' }}>
                <p className="flow-section__label">04 — True Titans</p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />
                <div>
                  <KineticHeadline
                    tag="h2"
                    className="flow-section__headline"
                    variant="musical-bounce"
                  >
                    Apps Fade.<br />
                    Truth<br />
                    Endures.
                  </KineticHeadline>
                </div>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />
                <p className="flow-section__body">
                  As parents and educators who lived through the early learning crisis, we understand what the digital industry ignores:
                  apps fade, algorithms shift, and screens break attention spans. But acoustic harmony, spoken language, and human connection
                  stay with a child for life. <strong>The Sound of Essentials is an evergreen sanctuary of sound.</strong>
                </p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />
                <div className="flow-columns">
                  <div className="flow-column">
                    <p className="flow-column__title">Apps Fade</p>
                    <p className="flow-column__text">
                      Software becomes obsolete, operating systems change, and screens dull sensory sensitivity.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">Algorithms Shift</p>
                    <p className="flow-column__text">
                      Tech platforms optimize for ad impressions; foundational developmental needs never change.
                    </p>
                  </div>
                  <div className="flow-column">
                    <p className="flow-column__title">The Eternal Sound</p>
                    <p className="flow-column__text">
                      Acoustic rhythms, poetic lyrics, and bodily movement woven permanently into a child&apos;s mind.
                    </p>
                  </div>
                </div>
              </FlowSection>

              {/* ── 05: THE INVITATION ── */}
              <FlowSection aria-label="The Invitation" style={{ backgroundColor: '#7B1FA2', color: '#fff' }}>
                <p className="flow-section__label">05 — The Invitation</p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <div>
                  <KineticHeadline
                    tag="h2"
                    className="flow-section__headline"
                    variant="musical-bounce"
                  >
                    Join<br />
                    The<br />
                    Quest
                  </KineticHeadline>
                </div>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <p className="flow-section__body">
                  Tailor-made education for your child&apos;s developing brain.
                  Not mass-produced. Not algorithmic.
                  Measured, cut, and stitched with love.
                </p>
                <hr className="flow-section__divider" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <p className="flow-section__body flow-section__body--right">
                  Listen free. See if it fits.
                  Your child will know in one song.
                </p>
                <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>— The Founders</p>
                  <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0.35rem 0 0', fontStyle: 'italic' }}>
                    Crafted by a father&apos;s heart and a mother&apos;s love
                  </p>
                </div>
              </FlowSection>

            </StoryScroll>

            {/* ── Ambient Scene Gallery ── */}
            <MissionSceneGallery />

            {/* ── Concord CTA Marquee ── */}
            <section className="mission-marquee-section mission-marquee-section--concord" aria-label="Join the movement">
                <GooeyMarquee
                    text="Calling all dreamers, curators, creators — the quest needs you."
                    speed={22}
                    color="var(--color-sage)"
                    fontSize="clamp(1.8rem, 5vw, 3.5rem)"
                />
            </section>
 
            {/* ── Philanthropic Giving & Mission Sponsorship ── */}
            <RevealSection>
                <PhilanthropicDonationSection />
            </RevealSection>

            {/* ── Tailor-Made CTA ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="manifesto-cta">
                            <h3 style={{ marginBottom: '1rem' }}>
                                Tailor-Made for <span className="accent-text">Your Child</span>
                            </h3>
                            <p className="section-subtitle" style={{ margin: '1rem auto 0' }}>
                                Tailor-made education for your child's developing brain.
                                Not mass-produced. Not algorithmic. Measured, cut, and stitched with love.
                            </p>
                            <div style={{ marginTop: '2rem' }}>
                                <Link to="/media" className="btn btn-gold">
                                    Explore the Quest →
                                </Link>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <style>{`
        .mission-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .mission-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Ken Burns keyframes ── */
        @keyframes kenBurnsMission {
          0%   { transform: scale(1.0) translate(0, 0); }
          25%  { transform: scale(1.06) translate(-1.2%, -0.6%); }
          50%  { transform: scale(1.10) translate(0.8%, -1.2%); }
          75%  { transform: scale(1.04) translate(1.4%, -0.4%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }

        /* ── Full-page SOE 7 Lands Cosmic Earth Background ── */
        .mission-page {
          position: relative;
          min-height: 100vh;
          background: transparent;
        }

        .mission-bg-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .mission-bg-img {
          position: absolute;
          inset: -6%;
          width: 112%;
          height: 112%;
          background:
            ${assetCssUrl('/assets/backgrounds/soe-globe-earth.webp')} center center / cover no-repeat;
          animation: kenBurnsMission 42s ease-in-out infinite;
          will-change: transform;
        }

        .mission-bg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at 50% 25%,
              rgba(255, 248, 240, 0.05) 0%,
              rgba(14, 12, 28, 0.30) 50%,
              rgba(8, 7, 18, 0.65) 100%
            ),
            linear-gradient(
              180deg,
              rgba(255, 248, 240, 0.20) 0%,
              rgba(255, 248, 240, 0.02) 12%,
              rgba(12, 10, 24, 0.12) 45%,
              rgba(255, 248, 240, 0.12) 75%,
              rgba(255, 248, 240, 0.40) 100%
            );
        }

        .mission-page > header,
        .mission-page > section,
        .mission-page > div:not(.mission-bg-layer) {
          position: relative;
          z-index: 1;
        }

        .mission-hero {
          padding: 8.5rem 0 3rem;
          position: relative;
        }

        .mission-hero-card {
          max-width: 820px;
          margin: 0 auto;
          padding: 2.5rem 2.5rem;
          background: rgba(255, 248, 240, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: var(--radius-xl, 36px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 111, 0, 0.12);
        }

        .mission-hero h1 {
          color: var(--color-text-dark, #2B2016);
          margin-bottom: 0.8rem;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
        }

        .mission-hero .section-subtitle {
          color: var(--color-text-dark-secondary, #5D4037);
          font-family: var(--font-body);
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-style: normal;
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto;
        }

        .manifesto-block {
          background: rgba(255, 248, 240, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: var(--radius-lg);
          padding: 3.5rem 2.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25), 0 0 40px rgba(255, 111, 0, 0.10);
        }

        .manifesto-block h2 {
          color: var(--color-text-dark, #1a1a2e);
        }

        .manifesto-block .section-subtitle {
          color: var(--color-text-dark-secondary, #4a4a68);
        }

        /* ── Story Scroll Slides Paragraph Body in Milky Week ── */
        .mission-page .flow-section__body {
          font-family: var(--font-milky);
          font-size: clamp(1.25rem, 2.7vw, 2.1rem);
          line-height: 1.55;
          letter-spacing: 0.02em;
        }

        .mission-page .flow-column__text {
          font-family: var(--font-milky);
          font-size: clamp(0.95rem, 1.4vw, 1.2rem);
          line-height: 1.55;
          letter-spacing: 0.01em;
          opacity: 0.95;
        }

        /* ── Stats ── */
        .manifesto-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .mission-stat {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .mission-stat__number {
          display: block;
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }

        .mission-stat__label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* ── Biological Window ── */
        .bio-window {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .bio-window__content h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          line-height: 1.3;
        }

        .bio-window__content p {
          color: var(--color-text-secondary);
          line-height: 1.8;
        }

        .neural-viz {
          position: relative;
          width: 320px;
          height: 320px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
        }

        .neural-brain-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          animation: softPulse 4s ease-in-out infinite;
          box-shadow: 0 20px 60px rgba(123, 31, 162, 0.15);
        }

        .neural-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(0,0,0,0.35) 0%, transparent 70%);
          border-radius: 50%;
        }

        .neural-number {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .neural-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.85);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 1;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }

        /* ── Biological Imperative block inside Emergency FlowSection ── */
        .flow-bio-block {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 0;
        }

        .flow-bio-block__visual {
          flex-shrink: 0;
        }

        .flow-bio-block__visual .neural-viz {
          width: 180px;
          height: 180px;
        }

        .flow-bio-block__visual .neural-number {
          font-size: 1.8rem;
        }

        .flow-bio-block__title {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-gold);
          margin-bottom: 0.5rem;
        }

        .flow-bio-block__body {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.88);
        }

        @media (max-width: 600px) {
          .flow-bio-block {
            flex-direction: column;
            text-align: center;
          }
          .flow-bio-block__visual .neural-viz {
            width: 140px;
            height: 140px;
          }
          .flow-bio-block__visual .neural-number {
            font-size: 1.4rem;
          }
        }

        /* ── Solution Grid ── */
        .solution-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin: 3rem 0;
        }

        .solution-card {
          padding: 2.5rem;
        }

        .solution-card__icon {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .solution-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .solution-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        .manifesto-cta {
          margin-top: 3rem;
          padding: 3rem;
          background: var(--color-bg-card);
          --color-text-primary: var(--color-text-dark);
          --color-text-secondary: var(--color-text-dark-secondary);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        /* ── Marquee Sections ── */
        .mission-marquee-section {
          padding: 1.75rem 0;
          position: relative;
          overflow: hidden;
          background: rgba(255, 248, 240, 0.70);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }

        .mission-marquee-section--concord {
          padding: 2.5rem 0;
        }

        @media (max-width: 968px) {
          .manifesto-stats {
            grid-template-columns: 1fr;
          }
          .bio-window {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          .bio-window__content p {
            margin-left: auto;
            margin-right: auto;
          }
          .solution-grid {
            grid-template-columns: 1fr;
          }
          .mission-hero {
            padding: 7rem 0 2.5rem;
          }
          .neural-viz {
            width: 240px;
            height: 240px;
          }
          .neural-number {
            font-size: 2.2rem;
          }
          .mission-stat__number {
            font-size: 2.5rem;
          }
          .mission-stat {
            padding: 1.5rem 1rem;
          }
          .manifesto-cta {
            padding: 2rem 1.5rem;
          }
        }

        /* ── Mission Scene Mosaic ── */
        .mission-scene-mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 220px;
          gap: 0.75rem;
        }

        /* Make first scene span 2 cols for visual interest */
        .mission-scene:first-child {
          grid-column: span 2;
        }

        .mission-scene {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: default;
          opacity: 0;
          will-change: transform, opacity;
        }

        .mission-scene img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s var(--ease-gentle);
        }

        .mission-scene:hover img {
          transform: scale(1.07);
          animation: kenBurns 10s ease-in-out infinite alternate;
        }

        .mission-scene__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .mission-scene:hover .mission-scene__label {
          opacity: 1;
        }

        .mission-scene__land {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        .mission-scene__caption {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .mission-scene-mosaic { grid-template-columns: repeat(2, 1fr); }
          .mission-scene:first-child { grid-column: span 2; }
        }

        @media (max-width: 540px) {
          .mission-scene-mosaic { grid-template-columns: 1fr; grid-auto-rows: 180px; }
          .mission-scene:first-child { grid-column: span 1; }
          .mission-scene__label { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Mission;
