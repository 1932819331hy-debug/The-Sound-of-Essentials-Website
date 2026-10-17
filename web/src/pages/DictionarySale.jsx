import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';
import heroesData from '../data/heroes.json';
import landsData from '../data/lands.json';
import { assetPath } from '../utils/assetPath';
import ProofInThePause from '../components/ui/ProofInThePause';
import StickyThumbCta from '../components/ui/StickyThumbCta';
import { trackInitiateCheckout } from '../utils/analytics';
import KineticHeadline from '../components/KineticHeadline';
import PDPQuestionChips from '../components/PDPQuestionChips';
import './DictionarySale.css';

/* ── Land-specific stats from the pipeline knowledge base ── */
const landStats = {
  harmonia:  { words: 620, scenes: 20 },
  numeria:   { words: 510, scenes: 19 },
  vitalis:   { words: 395, scenes: 12 },
  celestia:   { words: 265, scenes: 13 },
  luminosity: { words: 360, scenes: 14 },
  aquaria:    { words: 460, scenes: 15 },
  terrasol:    { words: 300, scenes: 14 },
};

/* ── OPD-aligned land names for the dictionary ── */
const dictLandNames = {
  harmonia:  'Harmonia',
  numeria:   'Numeria',
  vitalis:   'Vitalis',
  celestia:   'Celestia',
  luminosity: 'Luminosity',
  aquaria:    'Aquaria',
  terrasol:    'Terrasol',
};

const features = [
  { icon: '📖', title: '4,000+ Words', desc: 'Organized across 125 illustrated scenes spanning the full Oxford Picture Dictionary scope.', color: '#FF6F00' },
  { icon: '🔤', title: 'Phonetic Guides', desc: 'Every word includes pronunciation support — Sound Before Symbol, always.', color: '#4CAF50' },
  { icon: '🌍', title: 'Bilingual EN/ES', desc: 'Built-in bilingual framework with space for home language equity.', color: '#1E88E5' },
  { icon: '🗺️', title: '7 Lands', desc: 'From Harmonia to Celestia — vocabulary embedded in a living, character-driven world.', color: '#7B1FA2' },
  { icon: '👨‍👩‍👧', title: 'Parent/Teacher Guide', desc: 'Includes pedagogical tips, activity ideas, and a complete A-Z visual glossary.', color: '#c4785a' },
  { icon: '🧠', title: 'Neuro-Affirming', desc: 'Designed for developing brains — not algorithms. Calm, rich, no overstimulation.', color: '#FFB300' },
];

const testimonials = [
  {
    stars: 5,
    quote: "My daughter carries this book everywhere. She points at things and says 'That's from Harmonia!' — the worlds feel real to her.",
    name: 'Mariana S.',
    role: 'Homeschool Mom, Texas',
    initials: 'MS',
  },
  {
    stars: 5,
    quote: "As an ESL teacher, I've never seen a picture dictionary this culturally rich. The bilingual support is genuine, not an afterthought.",
    name: 'David K.',
    role: 'ESL Educator, Toronto',
    initials: 'DK',
  },
  {
    stars: 5,
    quote: "The art quality rivals anything from Pixar. My kids actually WANT to read this. That alone is worth 10x the price.",
    name: 'Jasmine R.',
    role: 'Parent of 3, Atlanta',
    initials: 'JR',
  },
];

/* ── Dictionary scene preview data (2 per land, from EPUB source) ── */
const dictPreviews = [
  { file: 'land1_the-classroom.jpg',              label: 'Harmonia — The Classroom' },
  { file: 'land1_family-relationships.jpg',        label: 'Harmonia — Family & Relationships' },
  { file: 'land2_numbers-counting.jpg',            label: 'Numeria — Numbers & Counting' },
  { file: 'land2_money-currency.jpg',              label: 'Numeria — Money & Currency' },
  { file: 'land3_the-garden.jpg',                  label: 'Terrasol — The Garden' },
  { file: 'land3_wild-animals.jpg',                label: 'Terrasol — Wild Animals' },
  { file: 'land4_transportation.jpg',              label: 'Aquaria — Transportation' },
  { file: 'land4_the-airport-travel.jpg',          label: 'Aquaria — The Airport & Travel' },
  { file: 'land5_the-human-body.jpg',              label: 'Vitalis — The Human Body' },
  { file: 'land5_sports-fitness.jpg',              label: 'Vitalis — Sports & Fitness' },
  { file: 'land6_occupations-careers.jpg',         label: 'Luminosity — Occupations & Careers' },
  { file: 'land6_community-helpers-services.jpg',  label: 'Luminosity — Community Helpers' },
  { file: 'land7_the-solar-system.jpg',            label: 'Celestia — The Solar System' },
  { file: 'land7_planet-earth.jpg',                label: 'Celestia — Planet Earth' },
];

const DictionarySale = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    document.title = 'Essential Picture Dictionary | 4,200+ Words & 157 Visual Scenes for Speech, Vocabulary & Early Literacy';
  }, []);

  /* Build the character parade — double the array for seamless loop */
  const carouselOrder = [
    'Seriphia', 'Kenji', 'Elias', 'Ezra', 'Ronan', 'Kwame', 'Silas', 'Aiko', 
    'Felix', 'Selene', 'Nerissa', 'Octavia', 'Amara', 'Vesta', 'Athena'
  ];

  const allChars = carouselOrder.map(name => {
    const h = heroesData.find(char => char.name === name);
    return {
      id: h.id,
      name: h.name,
      img: h.img,
      color: h.carouselColor,
    };
  });
  const paradeChars = [...allChars, ...allChars];

  return (
    <div className="dict-sale" style={{ '--dict-hero-bg': `url('${assetPath('/assets/scenes/tulip-river-path.webp')}')` }}>

      {/* ═══ HERO ═══ */}
      <header className="dict-hero">
        <div className="dict-hero__bg" aria-hidden="true" />
        <div className="dict-hero__overlay" aria-hidden="true" />

        <div className="dict-hero__inner">
          <div className="dict-hero__copy">
            <span className="dict-hero__badge">📖 Available Now — Digital EPUB</span>
            <KineticHeadline
              tag="h1"
              className="dict-hero__title"
              variant="musical-bounce"
              delay={0.1}
              scrollTrigger={false}
            >
              Every Word Has a
              <span className="dict-hero__title-accent">World Behind It</span>
            </KineticHeadline>
            <p className="section-subtitle dict-hero__subtitle">
              The most immersive picture dictionary ever designed for young learners.
              4,000+ words. 125 illustrated scenes. 7 magical lands.
              Powered by music, guided by 15 hero characters.
            </p>
            <div className="dict-hero__price-tag">
              <span className="dict-hero__price-retail">$79</span>
              <span className="dict-hero__price-listed">$55</span>
              <span className="dict-hero__price-note">Pre-Sale Special · Honest Compare-At $79</span>
            </div>
            <div className="dict-hero__actions">
              <a href="#pricing" className="btn btn-gold btn-shimmer">Pre-Order Now — $55 →</a>
              <a href="#preview" className="btn btn-outline">Preview Pages ↓</a>
            </div>
          </div>

          <div className="dict-hero__book">
            <div className="dict-book-3d">
              <div className="dict-book-3d__inner">
                <img
                  src={assetPath('/assets/book/SOE_RQ_COVER.webp')}
                  alt="SOE Rhythm Quest: Essential Picture Dictionary — Front Cover"
                  className="dict-book-3d__cover"
                />
              </div>
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <div className="dict-proof-strip">
        <div className="dict-proof-strip__inner">
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">4,000+</span>
            <span className="dict-proof-item__label">Vocabulary Words</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">125</span>
            <span className="dict-proof-item__label">Illustrated Scenes</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">7</span>
            <span className="dict-proof-item__label">Magical Lands</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">15</span>
            <span className="dict-proof-item__label">Hero Characters</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">EN / ES</span>
            <span className="dict-proof-item__label">Bilingual Support</span>
          </div>
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section className="dict-features section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">What's Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Not Just a Dictionary. <span className="text-gold">A Learning Universe.</span>
            </h2>
            <p className="section-subtitle">
              Designed for the developing brain — not the algorithm.
            </p>
          </RevealSection>

          <div className="dict-features__grid">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.1}>
                <div className="dict-feature-card" style={{ '--feat-color': f.color }}>
                  <div className="dict-feature-card__icon">{f.icon}</div>
                  <h3 className="dict-feature-card__title">{f.title}</h3>
                  <p className="dict-feature-card__desc">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAGE PREVIEW CAROUSEL ═══ */}
      <section className="dict-preview section" id="preview">
        <div className="container text-center">
          <RevealSection>
            <div className="section-label">Look Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Preview <span className="text-sage">Sample Pages</span>
            </h2>
            <p className="section-subtitle">
              Swipe through actual pages from the dictionary
            </p>
          </RevealSection>
        </div>

        <div className="dict-preview__scroll" ref={scrollRef}>
          {dictPreviews.map((pg) => (
            <div key={pg.file} className="dict-preview__card">
              <img
                src={assetPath(`/assets/dictionary/${pg.file}`)}
                alt={pg.label}
                loading="lazy"
              />
              <div className="dict-preview__card-label">{pg.label}</div>
            </div>
          ))}
        </div>
        <p className="dict-preview__hint">← Scroll to explore more pages →</p>
      </section>

      {/* ═══ 7 LANDS EXPLORER ═══ */}
      <section className="dict-lands section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">7 Lands of Learning</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Vocabulary Organized by <span className="text-plum">World</span>
            </h2>
            <p className="section-subtitle">
              Each land covers a distinct developmental domain
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="dict-lands__grid">
              {landsData.map(land => {
                const stats = landStats[land.id] || { words: '—', scenes: '—' };
                const displayName = dictLandNames[land.id] || land.name;
                const heroes = heroesData.filter(h => land.heroes.includes(h.id));
                return (
                  <div
                    key={land.id}
                    className="dict-land-card"
                    style={{ '--land-color': land.color }}
                  >
                    <span className="dict-land-card__icon">{land.icon}</span>
                    <h4 className="dict-land-card__name">{displayName}</h4>
                    <p className="dict-land-card__focus">{land.focus}</p>
                    <span className="dict-land-card__stats">
                      {stats.words} words · {stats.scenes} scenes
                    </span>
                    <div className="dict-land-card__heroes">
                      {heroes.map(h => (
                        <img
                          key={h.id}
                          src={assetPath(`/assets/characters/${h.name.toUpperCase()}.webp`)}
                          alt={h.name}
                          className="dict-land-card__hero-img"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ CHARACTER PARADE ═══ */}
      <section className="dict-characters">
        <div className="dict-char-parade" aria-label="Character parade">
          {paradeChars.map((c, i) => (
            <div key={`${c.id}-${i}`} className="dict-char-item">
              <img
                src={assetPath(`/assets/characters/${c.name.toUpperCase()}.webp`)}
                alt={c.name}
                className="dict-char-item__img"
                loading="lazy"
              />
              <span className="dict-char-item__name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="dict-testimonials section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">What Families Say</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Loved by <span className="text-gold">Real Families</span>
            </h2>
          </RevealSection>

          <div className="dict-testimonials__grid">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.12}>
                <div className="dict-testimonial-card">
                  <div className="dict-testimonial-card__stars">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="dict-testimonial-card__quote">"{t.quote}"</p>
                  <div className="dict-testimonial-card__author">
                    <div className="dict-testimonial-card__avatar">{t.initials}</div>
                    <div>
                      <div className="dict-testimonial-card__name">{t.name}</div>
                      <div className="dict-testimonial-card__role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CANONICAL PRICING & BUNDLE ═══ */}
      <section className="dict-pricing section" id="pricing">
        <div className="container text-center">
          <RevealSection>
            <div className="section-label">Pre-Sale Offers</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Choose Your <span className="text-gold">Learning Journey</span>
            </h2>
            <p className="section-subtitle">
              Transparent, honest pricing crafted with love for growing minds (Ages 2–7).
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <ProofInThePause variant="compact" />
            <div className="dict-pricing__grid dict-pricing__grid--two">
              {/* Tier 1: Essential Picture Dictionary */}
              <div className="dict-price-card">
                <span className="dict-price-card__emoji">📖</span>
                <div className="dict-price-card__label">Essential Picture Dictionary</div>
                <div className="dict-price-card__price-wrap">
                  <span className="dict-price-card__retail">$79</span>
                  <span className="dict-price-card__price">$55</span>
                  <span className="dict-price-card__discount-badge">SAVE 30%</span>
                </div>
                <p className="dict-price-card__hook">
                  The complete 4,000+ word visual vocabulary journey across 125 illustrated scenes. Pre-sale reservation · Digital delivery upon release.
                </p>
                <ul className="dict-price-card__features">
                  <li>✓ 4,000+ verified vocabulary words</li>
                  <li>✓ 125 thematic illustrated scenes</li>
                  <li>✓ All 7 Lands &amp; 15 heroes included</li>
                  <li>✓ Phonetic pronunciation guides</li>
                  <li>✓ Bilingual EN/ES support</li>
                  <li>✓ Pre-sale reservation · Delivered upon release</li>
                </ul>
                <a
                  href="https://buy.stripe.com/test_14AfZhcO02JT40m9YS6Vq06"
                  rel="noopener"
                  className="btn btn-gold"
                  onClick={() => trackInitiateCheckout({ sku: 'SOE-DICTIONARY', name: 'Essential Picture Dictionary', price: 55.00 })}
                >
                  Pre-Order Dictionary ($55) →
                </a>
              </div>

              {/* Tier 2: The Full Quest Bundle — Featured */}
              <div className="dict-price-card dict-price-card--featured">
                <span className="dict-price-card__badge">Best Value • Complete Suite</span>
                <span className="dict-price-card__emoji">🌟</span>
                <div className="dict-price-card__label">The Full Quest Bundle</div>
                <div className="dict-price-card__price-wrap">
                  <span className="dict-price-card__retail">$148</span>
                  <span className="dict-price-card__price">$49</span>
                  <span className="dict-price-card__discount-badge">SAVE 65%</span>
                </div>
                <p className="dict-price-card__hook">
                  Everything for a full year of music-powered learning. Complete digital access across all core and premium products.
                </p>
                <ul className="dict-price-card__features">
                  <li>✓ Essential Picture Dictionary ($55 value · Pre-sale release)</li>
                  <li>✓ 19-Track Rhythm Quest Album ($0 free)</li>
                  <li>✓ 66-Page Rhythm Quest Storybook ($19 value)</li>
                  <li>✓ Rhythm Ready Workbook Digital ($21 value)</li>
                  <li>✓ Bonus printable activity sheets &amp; parent guide</li>
                </ul>
                <a
                  href="https://buy.stripe.com/test_5kQ9AT4hubgp0Oafjc6Vq04"
                  rel="noopener"
                  className="btn btn-gold btn-shimmer"
                  onClick={() => trackInitiateCheckout({ sku: 'SOE-QUEST-PACK', name: 'The Full Quest Bundle', price: 49.00 })}
                >
                  Get Full Bundle ($49) →
                </a>
              </div>
            </div>

            <PDPQuestionChips preset="dictionary" label="Pre-Sale Questions?" />
          </RevealSection>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="dict-final-cta section">
        <div className="container">
          <RevealSection>
            <div className="dict-cta-card">
              <div className="scene-backdrop" aria-hidden="true">
                <img
                  src={assetPath('/assets/marketing/quest-collage.webp')}
                  alt=""
                  className="scene-backdrop__img"
                />
                <div className="scene-backdrop__scrim" />
              </div>
              <div className="dict-cta-card__icon" aria-hidden="true">📚</div>
              <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
                Start the Quest Today
              </h2>
              <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                4,000+ words. 7 Lands. 15 heroes. One incredible journey.
                <br />
                <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>
                  Crafted by a father's heart and a mother's love.
                </span>
              </p>
              <div className="dict-cta-actions">
                <a href="#pricing" className="btn btn-gold">Get the Dictionary — $55</a>
                <a href="#pricing" className="btn btn-sage">Full Quest Bundle — $89</a>
                <Link to="/workbook" className="btn btn-outline">Explore $21 Workbook &amp; Curriculum →</Link>
              </div>

              {/* California ARL & Consumer Subscription Disclosure */}
              <div 
                className="arl-renewal-notice"
                style={{
                  margin: '1.25rem auto',
                  padding: '0.85rem 1.25rem',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 'var(--radius-sm, 12px)',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-dark-secondary, #665c54)',
                  lineHeight: 1.5,
                  maxWidth: '560px',
                  textAlign: 'center'
                }}
              >
                🔒 <strong>Subscription &amp; Continuity Disclosure:</strong> Optional memberships (such as the Rhythm Pass at $14.99/month) automatically renew each billing cycle until cancelled. You may easily cancel anytime online with 1-click in your account settings or by emailing billing@soelearn.com with zero cancellation penalties.{' '}
                <Link to="/terms" style={{ color: 'var(--color-orange, #FF6F00)', textDecoration: 'underline' }}>
                  Terms &amp; Cancellation Policy
                </Link>
              </div>

              <div className="dict-guarantee">
                <span>🔒</span> Instant digital delivery · EPUB format · Read on any device
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Mobile Sticky Thumb Zone CTA ── */}
      <StickyThumbCta
        targetUrl="#pricing"
        label="📖 Pre-Order Dictionary ($55) →"
        subtext="4,000+ Words • 125 Illustrated Scenes"
        badge="🌟 Ages 2–7"
        onClick={() => trackInitiateCheckout({ sku: 'SOE-DICTIONARY', name: 'Essential Picture Dictionary', price: 55.00 })}
      />
    </div>
  );
};

export default DictionarySale;
