import React, { useEffect, useMemo, useState } from 'react';
import { assetPath } from '../utils/assetPath';
import FullSection from '../components-v2/FullSection';
import CharSplitText from '../components-v2/CharSplitText';
import { RevealV2 } from '../hooks/useScrollReveal';
import heroes from '../data/heroes.json';
import lands from '../data/lands.json';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const HeroesV2 = () => {
  const [activeLand, setActiveLand] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const gridRef = React.useRef(null);

  useEffect(() => {
    document.title = 'The Heroes — SOE Rhythm Quest';
  }, []);

  const filtered = useMemo(() => {
    if (activeLand === 'all') return heroes;
    return heroes.filter((h) => h.landId === activeLand);
  }, [activeLand]);

  const handleFilterChange = (landId) => {
    if (landId === activeLand) return;
    const cards = gridRef.current ? gridRef.current.querySelectorAll('.v2-card') : null;
    const state = cards ? Flip.getState(cards) : null;
    setActiveLand(landId);
    if (state) {
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.5,
          ease: 'power2.inOut',
          stagger: 0.03,
          scale: true,
          onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.35 }),
          onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.88, duration: 0.25 }),
        });
      });
    }
  };

  const handleToggleCard = (heroId) => {
    const cards = gridRef.current ? gridRef.current.querySelectorAll('.v2-card') : null;
    const state = cards ? Flip.getState(cards) : null;
    setExpanded(prev => (prev === heroId ? null : heroId));
    if (state) {
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.45,
          ease: 'power2.out',
          nested: true,
        });
      });
    }
  };

  return (
    <div className="heroes-v2">
      {/* ── Hero ── */}
      <FullSection
        bg={assetPath('/assets/marketing/quest-collage.webp')}
        overlay="light"
        kenBurns
      >
        <div className="v2-container v2-text-center">
          <RevealV2>
            <span className="v2-label">The cast of the quest</span>
          </RevealV2>
          <CharSplitText tag="h1" className="v2-display" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', color: 'var(--v2-accent-orange)', marginTop: '0.5rem' }} stagger={26}>
            THE HEROES
          </CharSplitText>
          <RevealV2 className="v2-reveal--delay-2">
            <p className="v2-body v2-body--lg" style={{ maxWidth: '540px', margin: '1.25rem auto 0' }}>
              Fifteen musical guides — plus Seriphia, the eternal learning mother — each
              carrying one developmental domain through song.
            </p>
          </RevealV2>
        </div>
        <div className="v2-scroll-hint">↓</div>
      </FullSection>

      {/* ── Grid + filters ── */}
      <section className="v2-section">
        <div className="v2-container--wide v2-container">
          {/* Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <button
              className={`v2-btn ${activeLand === 'all' ? 'v2-btn--gold' : 'v2-btn--outline'}`}
              onClick={() => handleFilterChange('all')}
              style={{ fontSize: '0.78rem', padding: '0.55rem 1.4rem' }}
            >
              All
            </button>
            {lands.map((land) => (
              <button
                key={land.id}
                className={`v2-btn ${activeLand === land.id ? 'v2-btn--gold' : 'v2-btn--outline'}`}
                onClick={() => handleFilterChange(land.id)}
                style={{ fontSize: '0.78rem', padding: '0.55rem 1.4rem' }}
              >
                {land.icon} {land.name}
              </button>
            ))}
          </div>

          {/* Card grid */}
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filtered.map((h) => {
              const isOpen = expanded === h.id;
              return (
                <button
                  key={h.id}
                  data-flip-id={`hero-v2-${h.id}`}
                  className="v2-card"
                  onClick={() => handleToggleCard(h.id)}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: `1px solid var(--v2-border)`,
                    borderTop: `3px solid ${h.landColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  aria-expanded={isOpen}
                >
                  <img
                    src={assetPath(h.img)}
                    alt={h.name}
                    loading="lazy"
                    style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: '0.75rem' }}
                  />
                  <h3 className="v2-heading v2-heading--sm">{h.name}</h3>
                  <span className="v2-serif-italic" style={{ color: h.landColor, fontSize: '0.9rem' }}>
                    {h.title}
                  </span>
                  <span className="v2-label" style={{ marginTop: '0.5rem' }}>
                    {h.land}
                  </span>
                  {isOpen && (
                    <>
                      <p className="v2-body" style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
                        {h.bio}
                      </p>
                      {h.traits && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.85rem' }}>
                          {h.traits.map((trait) => (
                            <span
                              key={trait}
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '0.25rem 0.7rem',
                                borderRadius: 'var(--v2-radius-full)',
                                background: 'var(--v2-accent-orange-soft)',
                                color: 'var(--v2-accent-orange)',
                              }}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroesV2;
