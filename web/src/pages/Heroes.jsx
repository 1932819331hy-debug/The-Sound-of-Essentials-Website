import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JsonLd from '../components/JsonLd';
import { heroesSchema } from '../utils/schema';
import { ShaderBackground } from '../components/ui/AnimatedShaderHero';
import { assetPath } from '../utils/assetPath';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);


/* ── Reveal on scroll ── */
const RevealSection = ({ children, className = '', delay = 0 }) => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal-block ${revealed ? 'revealed' : ''} ${className}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

import heroesData from '../data/heroes.json';

/* ── Character Data ── */
const characters = heroesData;

/* ── Trait Pill with Tooltip ── */
const TraitPill = ({ traitId, color }) => {
    const { t } = useTranslation();
    const [showTip, setShowTip] = React.useState(false);
    const ref = React.useRef(null);

    const traitName = t(`heroes.traits.${traitId}.name`);
    const traitDesc = t(`heroes.traits.${traitId}.desc`);

    React.useEffect(() => {
        if (!showTip) return;
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowTip(false); };
        document.addEventListener('click', close, true);
        return () => document.removeEventListener('click', close, true);
    }, [showTip]);

    return (
        <span
            ref={ref}
            className={`char-card__trait ${showTip ? 'char-card__trait--active' : ''}`}
            style={{ borderColor: color, color: color }}
            onClick={(e) => { e.stopPropagation(); setShowTip(!showTip); }}
            role="button"
            tabIndex={0}
            aria-label={`${traitName}: ${traitDesc}`}
        >
            {traitName}
            {showTip && traitDesc && (
                <span className="trait-tooltip" style={{ borderColor: color }}>
                    <strong style={{ color }}>{traitName}</strong>
                    <span className="trait-tooltip__text">{traitDesc}</span>
                </span>
            )}
        </span>
    );
};

/* ── Character Card ── */
const CharacterCard = ({ char, index, isExpanded, onToggle }) => {
    const { t } = useTranslation();
    return (
        <RevealSection delay={index * 0.08}>
            <div
                data-flip-id={`hero-card-${char.name}`}
                className={`char-card glass-card ${char.featured ? 'char-card--featured' : ''} ${isExpanded ? 'char-card--expanded' : ''}`}
                onClick={onToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggle()}
                aria-expanded={isExpanded}
            >
                <div className="char-card__image-wrap">
                        <div className="char-card__img-bg char-card__img-bg--selfie">
                            <img
                                src={assetPath(`/assets/heroes/${char.name.toLowerCase()}-selfie.webp`)}
                                alt={char.name}
                                className="char-card__image char-card__image--selfie"
                            />
                        </div>
                    <div className="char-card__land-badge" style={{ background: char.landColor }}>
                        {t(`heroes.lands.${char.land}`)}
                    </div>
                </div>

                <div className="char-card__info">
                    <h3 className="char-card__name" style={{ color: char.landColor }}>{char.name}</h3>
                    <p className="char-card__title">{t(`heroes.data.${char.name}.title`)}</p>
                    <p className="char-card__focus">{t(`heroes.data.${char.name}.focus`)}</p>

                    {isExpanded && (
                        <div className="char-card__details animate-fade-in">
                            <p className="char-card__bio">{t(`heroes.data.${char.name}.bio`)}</p>
                            <div className="char-card__traits">
                                {char.traits.map((tId) => (
                                    <TraitPill key={tId} traitId={tId} color={char.landColor} />
                                ))}
                            </div>
                        </div>
                    )}

                    <span className="char-card__toggle">{isExpanded ? t('heroes.show_less') : t('heroes.read_more')}</span>
                </div>
            </div>
        </RevealSection>
    );
};

/* ══════════════════════════════════════════════════════════
   Characters Page
   Text copy uses the design-system classes from index.css:
   • .section-label  → solid pill badge (green→blue gradient)
   • .section-title   → large bold orange heading
   • .accent-text     → green Fredoka accent
   • .divider-center  → blue/green gradient bar separator
   • .section-subtitle → Dancing Script cursive in orange
   ══════════════════════════════════════════════════════════ */
const Characters = () => {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('All');
    const gridRef = React.useRef(null);

    const rawLands = [...new Set(characters.map(c => c.land))];
    const lands = [{ id: 'All', label: t('heroes.filter_all') }, ...rawLands.map(l => ({ id: l, label: t(`heroes.lands.${l}`) }))];
    const filtered = filter === 'All' ? characters : characters.filter(c => c.land === filter);

    const handleFilterChange = (newFilter) => {
        if (newFilter === filter) return;
        const cards = gridRef.current ? gridRef.current.querySelectorAll('.char-card') : null;
        const state = cards ? Flip.getState(cards) : null;
        setFilter(newFilter);
        if (state) {
            requestAnimationFrame(() => {
                Flip.from(state, {
                    duration: 0.5,
                    ease: 'power2.inOut',
                    stagger: 0.03,
                    scale: true,
                    absolute: false,
                    onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35 }),
                    onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.25 }),
                });
            });
        }
    };

    const handleToggleCard = (charName) => {
        const cards = gridRef.current ? gridRef.current.querySelectorAll('.char-card') : null;
        const state = cards ? Flip.getState(cards) : null;
        setExpandedId(prev => (prev === charName ? null : charName));
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
        <ShaderBackground>
        <div className="characters-page">
            <JsonLd data={heroesSchema()} />

            {/* ── Hero — uses design-system text pattern ── */}
            <header className="char-hero">
                <div className="container text-center">
                    <div className="animate-fade-up">
                        <div className="section-label">{t('heroes.hero_label')}</div>
                        <h1 className="section-title">
                            {t('heroes.hero_title_1')}{' '}
                            <span className="accent-text">{t('heroes.hero_title_2')}</span>
                        </h1>
                        <div className="divider divider-center" />
                        <p className="section-subtitle">
                            {t('heroes.hero_subtitle')}
                        </p>
                        <div className="char-hero__actions">
                            <Link to="/join" className="btn btn-gold">{t('hero.join_button')}</Link>
                            <Link to="/gallery" className="btn btn-outline">Storybook Gallery →</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Filter Bar ── */}
            <section className="section" style={{ paddingTop: '2rem', paddingBottom: 0 }}>
                <div className="container">
                    <RevealSection>
                        <div className="char-filters">
                            {lands.map((land) => (
                                <button
                                    key={land.id}
                                    className={`char-filter-btn ${filter === land.id ? 'char-filter-btn--active' : ''}`}
                                    onClick={() => handleFilterChange(land.id)}
                                >
                                    {land.label}
                                </button>
                            ))}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── Character Grid ── */}
            <section className="section">
                <div className="container">
                    <div ref={gridRef} className="char-grid">
                        {filtered.map((char, i) => (
                            <CharacterCard
                                key={char.name}
                                char={char}
                                index={i}
                                isExpanded={expandedId === char.name}
                                onToggle={() => handleToggleCard(char.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA — design-system text pattern ── */}
            <section className="section text-center">
                <div className="container">
                    <RevealSection>
                        <div className="section-label">Join the Movement</div>
                        <h2 className="section-title">
                            {t('heroes.cta_title_1')}{' '}
                            <span className="accent-text">{t('heroes.cta_title_2')}</span>?
                        </h2>
                        <div className="divider divider-center" />
                        <p className="section-subtitle">
                            {t('heroes.cta_subtitle')}
                        </p>
                        <div className="char-hero__actions" style={{ marginTop: '2rem' }}>
                            <Link to="/listen" className="btn btn-gold">{t('home.explore_media')}</Link>
                            <Link to="/join" className="btn btn-sage">{t('hero.join_button')}</Link>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <style>{`
                /* ── Hero section ── */
                .char-hero {
                    padding: 10rem 0 4rem;
                    text-align: center;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .char-hero__actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2.5rem;
                }

                /* ── Filters ── */
                .char-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                }

                .char-filter-btn {
                    background: rgba(255, 255, 255, 0.55);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 2px solid rgba(255, 255, 255, 0.6);
                    border-radius: var(--radius-xl);
                    padding: 0.5rem 1.25rem;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--color-text-primary);
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .char-filter-btn:hover {
                    border-color: var(--color-green);
                    color: var(--color-green);
                    background: rgba(255, 255, 255, 0.75);
                }

                .char-filter-btn--active {
                    background: linear-gradient(135deg, var(--color-green), var(--color-blue));
                    border-color: transparent;
                    color: #fff;
                }

                /* ── Grid ── */
                .char-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }

                /* ── Card — glass over shader ── */
                .char-card {
                    padding: 0;
                    cursor: pointer;
                    transition: transform 0.35s var(--ease-gentle), box-shadow 0.35s var(--ease-gentle);
                    background: rgba(255, 255, 255, 0.75) !important;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.6) !important;
                }

                .char-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                }

                .char-card--featured {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                }

                .char-card--featured .char-card__image-wrap {
                    height: 100%;
                }

                .char-card--featured .char-card__image {
                    height: 100%;
                    min-height: 500px;
                    object-fit: cover;
                    object-position: center top;
                    image-rendering: -webkit-optimize-contrast;
                }

                /* ── Image ── */
                .char-card__image-wrap {
                    position: relative;
                    overflow: hidden;
                }

                .char-card__image-wrap::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 55%;
                    height: 30%;
                    background: linear-gradient(to top left, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0) 70%);
                    pointer-events: none;
                    z-index: 1;
                }

                .char-card__img-bg {
                    width: 100%;
                    min-height: 220px;
                    background: #fff;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    overflow: hidden;
                    border-bottom: 3px solid rgba(255,255,255,0.5);
                    position: relative;
                }

                .char-card__img-bg::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    opacity: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%);
                    background-size: 200% 100%;
                    transition: opacity 0.4s ease;
                    z-index: 2;
                    pointer-events: none;
                }

                .char-card:hover .char-card__img-bg::before {
                    opacity: 1;
                    animation: cardShimmer 1.2s ease forwards;
                }

                @keyframes cardShimmer {
                    from { background-position: 200% 0; }
                    to { background-position: -200% 0; }
                }

                .char-card__img-bg--selfie {
                    background: linear-gradient(135deg, #f0f4f8 0%, #e8ecf0 100%);
                }

                .char-card__image--selfie {
                    width: 100%;
                    height: 360px;
                    object-fit: cover;
                    object-position: center 35%;
                    display: block;
                    transition: transform 0.5s var(--ease-gentle);
                }

                .char-card--featured .char-card__image--selfie {
                    height: 480px;
                    object-position: center 30%;
                }

                .char-card:hover .char-card__image--selfie {
                    transform: scale(1.04);
                }

                .char-card__land-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #fff;
                    padding: 0.3rem 0.8rem;
                    border-radius: var(--radius-xl);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                /* ── Info ── */
                .char-card__info {
                    padding: 1.25rem;
                }

                .char-card__name {
                    font-family: var(--font-heading);
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin: 0 0 0.15rem;
                }

                .char-card__title {
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--color-text-secondary);
                    margin: 0 0 0.25rem;
                }

                .char-card__focus {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0 0 0.75rem;
                }

                .char-card__bio {
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    margin: 0 0 1rem;
                }

                .char-card__traits {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }

                .char-card__trait {
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 0.2rem 0.65rem;
                    border: 1.5px solid;
                    border-radius: var(--radius-xl);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.2s ease, color 0.2s ease;
                }

                .char-card__trait:hover {
                    background: rgba(255, 255, 255, 0.6);
                }

                .char-card__trait--active {
                    background: rgba(255, 255, 255, 0.6);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                }

                /* ── Trait Tooltip ── */
                .trait-tooltip {
                    position: absolute;
                    bottom: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: clamp(200px, 80vw, 240px);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1.5px solid;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    z-index: 100;
                    text-transform: none;
                    letter-spacing: 0;
                    font-weight: 400;
                    animation: traitTipIn 0.25s ease both;
                    cursor: default;
                    pointer-events: none;
                }

                @media (max-width: 480px) {
                    .trait-tooltip {
                        left: auto;
                        right: 0;
                        transform: none;
                        width: 200px;
                    }
                    .trait-tooltip::after {
                        left: 85%;
                    }
                }

                .trait-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 6px solid transparent;
                    border-top-color: rgba(255, 255, 255, 0.95);
                }

                .trait-tooltip strong {
                    display: block;
                    font-size: 0.85rem;
                    margin-bottom: 0.3rem;
                }

                .trait-tooltip__text {
                    display: block;
                    font-size: 0.8rem;
                    line-height: 1.5;
                    color: var(--color-text-secondary);
                }

                @keyframes traitTipIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .char-card__toggle {
                    display: inline-block;
                    margin-top: 0.75rem;
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    font-weight: 500;
                }

                .char-card__details.animate-fade-in {
                    animation: charFadeIn 0.4s ease both;
                }

                @keyframes charFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .char-hero {
                        padding: 7rem 0 2.5rem;
                        min-height: auto;
                    }
                    .char-card--featured {
                        grid-template-columns: 1fr;
                    }
                    .char-card--featured .char-card__image {
                        min-height: 250px;
                    }
                    .char-card--featured .char-card__image--selfie {
                        height: 340px;
                        object-position: center 35%;
                    }
                    .char-grid {
                        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                        gap: 1.25rem;
                    }
                    .char-card__image--selfie {
                        height: 320px;
                        object-position: center 35%;
                    }
                    .char-card__img-bg {
                        min-height: 200px;
                    }
                    .char-filters {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        overscroll-behavior-x: contain;
                        scrollbar-width: none;
                        padding: 0.5rem 1rem;
                        margin: 0 -1rem;
                        gap: 0.45rem;
                        justify-content: flex-start;
                    }
                    .char-filters::-webkit-scrollbar {
                        display: none;
                    }
                    .char-filter-btn {
                        white-space: nowrap;
                        flex-shrink: 0;
                        padding: 0.45rem 1rem;
                        min-height: 40px;
                        font-size: 0.82rem;
                    }
                }

                @media (max-width: 480px) {
                    .char-grid {
                        grid-template-columns: 1fr;
                        gap: 1.25rem;
                    }
                    .char-card__image--selfie {
                        height: 280px;
                        object-position: center 35%;
                    }
                    .char-card__name {
                        font-size: 1.25rem;
                    }
                    .char-card__info {
                        padding: 1.15rem;
                    }
                    .char-hero__actions {
                        flex-direction: column;
                        align-items: stretch;
                        width: 100%;
                        gap: 0.75rem;
                    }
                    .char-hero__actions .btn {
                        width: 100%;
                        min-height: 48px;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
        </ShaderBackground>
    );
};

export default Characters;
