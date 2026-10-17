import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ParallaxHero from '../components/ParallaxHero';
import { RevealSection } from '../hooks/useReveal';

import heroesData from '../data/heroes.json';
import JsonLd from '../components/JsonLd';
import { homeSchema, faqSchema } from '../utils/schema';
import ExpandableGallery from '../components/ExpandableGallery';
import { assetCssUrl, assetPath } from '../utils/assetPath';
import Floating3DBook from '../components/ui/Floating3DBook';
import StickyThumbCta from '../components/ui/StickyThumbCta';
import KineticHeadline from '../components/KineticHeadline';

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'The Sound of Essentials | Music-Driven Early Learning';
  }, []);

  /* ── Interactive State: FAQ Accordion ── */
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  /* ── All characters (ordered for color contrast & no pairs) ── */
  const carouselOrder = [
    'Kenji', 'Elias', 'Ezra', 'Ronan', 'Kwame', 'Silas', 'Aiko', 
    'Felix', 'Selene', 'Nerissa', 'Octavia', 'Amara', 'Vesta', 'Athena'
  ];

  const allChars = carouselOrder.map(name => {
    const h = heroesData.find(char => char.name === name);
    return {
      name: h?.name || name,
      file: `${(h?.name || name).toUpperCase()}.webp`,
      color: h?.carouselColor || '#FF6F00',
      note: h?.carouselNote || '♪',
    };
  });

  const numChars = allChars.length;
  const theta = 360 / numChars;
  const radius = Math.round(80 / Math.tan(Math.PI / numChars)) + 60;
  const [rotation, setRotation] = useState(0);

  const rotateLeft = () => setRotation(r => r + theta);
  const rotateRight = () => setRotation(r => r - theta);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const interval = setInterval(() => {
      setRotation(r => r - theta);
    }, 3200);
    return () => clearInterval(interval);
  }, [theta]);

  /* ── 5 Developmental Domains ── */
  const domains = [
    { icon: '🗣️', title: t('home.domains.language.title'), desc: t('home.domains.language.desc'), color: '#4CAF50', accent: 'rgba(76,175,80,0.12)' },
    { icon: '🧠', title: t('home.domains.cognitive.title'), desc: t('home.domains.cognitive.desc'), color: '#1E88E5', accent: 'rgba(30,136,229,0.12)' },
    { icon: '🤸', title: t('home.domains.physical.title'), desc: t('home.domains.physical.desc'), color: '#FF6F00', accent: 'rgba(255,111,0,0.12)' },
    { icon: '🔬', title: t('home.domains.science.title'), desc: t('home.domains.science.desc'), color: '#7B1FA2', accent: 'rgba(123,31,162,0.12)' },
    { icon: '💛', title: t('home.domains.social_emotional.title'), desc: t('home.domains.social_emotional.desc'), color: '#FFB300', accent: 'rgba(255,179,0,0.12)' },
  ];

  /* ── 7 Musical Lands Mini-Previews ── */
  const lands = [
    { name: 'Harmonia', focus: 'Language & Manners', heroes: 'Kenji & Aiko', color: '#5fb685', icon: '🎵' },
    { name: 'Numeria', focus: 'Numbers & Math', heroes: 'Kwame & Octavia', color: '#5ba4c9', icon: '🔢' },
    { name: 'Vitalis', focus: 'Physical & Movement', heroes: 'Felix & Amara', color: '#FF8A65', icon: '🏃' },
    { name: 'Celestia', focus: 'Time & Seasons', heroes: 'Elias & Selene', color: '#9678c4', icon: '⏳' },
    { name: 'Luminosity', focus: 'Advanced Language', heroes: 'Athena & Ezra', color: '#f5c43a', icon: '💡' },
    { name: 'Aquaria', focus: 'Water & Emotion', heroes: 'Nerissa & Ronan', color: '#4dd0e1', icon: '🌊' },
    { name: 'Terrasol', focus: 'Science & Nature', heroes: 'Vesta & Silas', color: '#8d6e63', icon: '🌱' },
  ];

  /* ── FAQ items ── */
  const faqItems = [
    {
      q: t('home.faq.q1'),
      a: t('home.faq.a1'),
      icon: '🎵'
    },
    {
      q: t('home.faq.q2'),
      a: t('home.faq.a2'),
      icon: '📩'
    },
    {
      q: t('home.faq.q3'),
      a: t('home.faq.a3'),
      icon: '👨‍👩‍👧'
    },
    {
      q: t('home.faq.q4'),
      a: t('home.faq.a4'),
      icon: '🧠'
    },
    {
      q: t('home.faq.q5'),
      a: t('home.faq.a5'),
      icon: '🗺️'
    }
  ];

  const structuredSchemas = [
    ...homeSchema(),
    faqSchema(faqItems),
  ].filter(Boolean);

  return (
    <div className="home-page">
      <JsonLd data={structuredSchemas} />


      {/* ═══════════════════════════════════════════════════════
          SECTION 2: HERO DELUXE CONVERSION OFFER ($0 LEAD MAGNET)
      ═══════════════════════════════════════════════════════ */}
      <header className="hero">
        <ParallaxHero variant="home" />

        <div className="hero__copy-wrap">
          <div className="container">
            <div className="hero__grid">
              <div className="hero__content animate-fade-up">
                {/* Official Brand Logo Seal */}
                <div className="hero__brand-crest">
                  <img
                    src={assetPath('/assets/soe-official-logo.webp')}
                    alt="The Sound of Essentials Official Crest"
                    className="hero__brand-crest-img"
                  />
                  <div className="hero__brand-crest-text">
                    <span className="hero__brand-crest-title">THE SOUND OF ESSENTIALS</span>
                    <span className="hero__brand-crest-tagline">Staying on the Path, Always Learning!</span>
                  </div>
                </div>

                <div className="hero__eyebrow">
                  <span className="hero__badge">✨ {t('home.hero_offer.eyebrow')}</span>
                </div>
                <h1 className="hero__title">
                  <KineticHeadline
                    tag="span"
                    variant="musical-bounce"
                    className="hero__title-text"
                    delay={0.15}
                    scrollTrigger={false}
                  >
                    {t('home.hero_offer.title_main')}
                  </KineticHeadline>
                  <span className="hero__sticker-wrap" title="Free Today!">
                    <img
                      src={assetPath('/assets/stickers/free-today-sticker.webp')}
                      alt={t('home.hero_offer.title_highlight') ? t('home.hero_offer.title_highlight').replace(/[()]/g, '') : 'Free Today!'}
                      className="hero__sticker-img"
                      width="180"
                      height="145"
                      loading="eager"
                    />
                  </span>
                </h1>
                <p className="section-subtitle hero__subtitle">{t('home.hero_offer.subtitle')}</p>

                {/* Offer Pricing & Value Box */}
                <div className="hero__offer-box glass-card">
                  <div className="hero__price-line">
                    <span className="hero__price-strike">{t('home.hero_offer.price_strike')}</span>
                    <span className="hero__price-arrow" aria-hidden="true">→</span>
                    <span className="hero__price-val">{t('home.hero_offer.price_tag')}</span>
                    <span className="hero__price-note">· {t('home.hero_offer.price_note')}</span>
                  </div>
                  
                  <ul className="hero__checkmarks">
                    <li>
                      <span className="check-icon">✓</span>
                      <span>{t('home.hero_offer.check_1')}</span>
                    </li>
                    <li>
                      <span className="check-icon">✓</span>
                      <span>{t('home.hero_offer.check_2')}</span>
                    </li>
                    <li>
                      <span className="check-icon">✓</span>
                      <span>{t('home.hero_offer.check_3')}</span>
                    </li>
                    <li>
                      <span className="check-icon">✓</span>
                      <span>{t('home.hero_offer.check_4')}</span>
                    </li>
                  </ul>

                  <div className="hero__actions">
                    <Link to="/listen" className="btn btn-gold btn-shimmer hero__btn-primary">
                      {t('home.hero_offer.cta_primary')}
                    </Link>
                  </div>

                  <div className="hero__guarantee">
                    <span className="guarantee-icon">🔒</span>
                    <span>{t('home.hero_offer.guarantee_badge')}</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual: 3D Interactive Floating Album Cover Showcase */}
              <div className="hero__visual animate-fade-up">
                <Floating3DBook
                  imageSrc="/assets/marketing/soe-deluxe-cover.webp"
                  altText="The Sound of Essentials Deluxe 19-Track Album Cover"
                  badgeText="🎵 Free 19-Track Album • Stream Now"
                  to="/listen"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Character Cylinder Carousel */}
        <div className="hero__carousel-scene">
          <div className="hero__carousel-desktop-only">
            <button className="carousel-btn prev-btn" onClick={rotateLeft} aria-label="Previous heroes">
              &#10094;
            </button>
            <div 
              className="hero__carousel-spinner" 
              style={{ transform: `rotateY(${rotation}deg)` }}
            >
              {allChars.map((char, i) => (
                <div
                  key={`${char.name}-${i}`}
                  className="hero__char"
                  style={{ 
                    '--char-color': char.color,
                    transform: `rotateY(${i * theta}deg) translateZ(${radius}px)`
                  }}
                >
                  <div className="hero__char-note">{char.note}</div>
                  <img
                    src={assetPath(`/assets/characters/${char.file}`)}
                    alt={char.name}
                    className="hero__char-img"
                    loading={i < 7 ? 'eager' : 'lazy'}
                    draggable="false"
                  />
                  <div className="hero__char-label">{char.name}</div>
                </div>
              ))}
            </div>
            <button className="carousel-btn next-btn" onClick={rotateRight} aria-label="Next heroes">
              &#10095;
            </button>
          </div>

          {/* Mobile Swipeable Card Deck */}
          <div className="hero__carousel-mobile-only">
            <div className="hero__mobile-scroll">
              {allChars.map((char, i) => (
                <div 
                  key={`${char.name}-mobile-${i}`} 
                  className="hero__mobile-card"
                  style={{ '--char-color': char.color }}
                >
                  <div className="hero__mobile-card-note">{char.note}</div>
                  <img
                    src={assetPath(`/assets/characters/${char.file}`)}
                    alt={char.name}
                    className="hero__mobile-card-img"
                  />
                  <div className="hero__mobile-card-label">{char.name}</div>
                </div>
              ))}
            </div>
            <div className="hero__mobile-swipe-hint">
              <span>👆 Swipe to explore mentors →</span>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="hero__info-strip">
          <span>🎵 19 Original Songs</span>
          <span className="hero__info-sep">·</span>
          <span>🗺️ 7 Musical Lands</span>
          <span className="hero__info-sep">·</span>
          <span>🦸 15 Hero Mentors</span>
          <span className="hero__info-sep">·</span>
          <span>📚 Ages 2–7</span>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: THE STATE OF EMERGENCY IN EARLY EDUCATION
      ═══════════════════════════════════════════════════════ */}
      <section className="section emergency-section glow-orange" id="crisis">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label section-label--emergency">
              ⚠️ The State of Emergency in Early Education
            </div>
            <h2 className="section-title">
              We Are Turning a <span className="text-orange">State of Emergency</span>
              <br />
              Back Into Joyful Mastery
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0.75rem auto 2.75rem' }}>
              Across the nation and the globe, early literacy is in crisis. While addictive screen algorithms capture
              developing attention spans, classrooms face historic shortages during the developing brain's most critical auditory wiring window.
            </p>
          </RevealSection>

          {/* Stats Grid */}
          <div className="emergency-stats-grid">
            <RevealSection delay={0.1}>
              <div className="emergency-stat-card glass-card">
                <div className="emergency-stat-icon" aria-hidden="true">📉</div>
                <div className="emergency-stat-val text-orange">69%</div>
                <div className="emergency-stat-title">Below Proficient Reading</div>
                <p className="emergency-stat-desc">
                  Nearly 7 in 10 U.S. 4th graders cannot read proficiently on national assessments. Reading struggles begin years earlier when auditory foundation is skipped.
                </p>
                <span className="emergency-stat-source">Source: NAEP Nation's Report Card (2024)</span>
              </div>
            </RevealSection>

            <RevealSection delay={0.18}>
              <div className="emergency-stat-card glass-card">
                <div className="emergency-stat-icon" aria-hidden="true">🌍</div>
                <div className="emergency-stat-val text-purple">300M</div>
                <div className="emergency-stat-title">Global Learning Poverty</div>
                <p className="emergency-stat-desc">
                  300 million children worldwide cannot read or comprehend a basic sentence. Each one is a brilliant mind at risk of being permanently left behind.
                </p>
                <span className="emergency-stat-source">Source: UNESCO &amp; World Bank (2024)</span>
              </div>
            </RevealSection>

            <RevealSection delay={0.26}>
              <div className="emergency-stat-card glass-card">
                <div className="emergency-stat-icon" aria-hidden="true">🏫</div>
                <div className="emergency-stat-val text-blue">44M</div>
                <div className="emergency-stat-title">Teacher Shortage Deficit</div>
                <p className="emergency-stat-desc">
                  Classrooms face an unprecedented 44 million teacher deficit, shifting an unsustainable educational burden directly onto parents and caregivers.
                </p>
                <span className="emergency-stat-source">Source: UNESCO Global Teacher Report</span>
              </div>
            </RevealSection>

            <RevealSection delay={0.34}>
              <div className="emergency-stat-card glass-card emergency-stat-card--highlight">
                <div className="emergency-stat-icon" aria-hidden="true">⚡️</div>
                <div className="emergency-stat-val text-green">1M/sec</div>
                <div className="emergency-stat-title">The Biological Imperative</div>
                <p className="emergency-stat-desc">
                  In the first 1,000 days, the young brain forms over 1 million neural connections every second. Miss this auditory window, and remediation becomes exponentially harder.
                </p>
                <span className="emergency-stat-source">Source: Harvard Center on the Developing Child</span>
              </div>
            </RevealSection>
          </div>

          {/* Contrast / Intervention Callout */}
          <RevealSection delay={0.4}>
            <div className="emergency-callout glass-card">
              <div className="emergency-callout__content">
                <div className="emergency-callout__badge">The SOE Intervention</div>
                <h3 className="emergency-callout__headline">
                  Not More Screen Distraction. Active Rhythm Wiring.
                </h3>
                <p className="emergency-callout__text">
                  Children don’t build literacy through passive dopamine loops. They wire durable neural pathways through{' '}
                  <strong>sound-before-symbol pedagogy, active rhythm, singing, whole-body movement, and joyful storytelling</strong>.
                  The Sound of Essentials provides homes and classrooms with an open-and-go sanctuary routine.
                </p>
              </div>
              <div className="emergency-callout__actions">
                <Link to="/science" className="btn btn-outline">
                  See the Neuroscience &amp; Research →
                </Link>
                <Link to="/workbook" className="btn btn-gold btn-shimmer">
                  Explore the 8-Week Solution ($21) →
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: THE RHYTHM QUEST STORYBOOK ($19 LEAD PRODUCT)
      ═══════════════════════════════════════════════════════ */}
      <section className="section quest-feature-section glow-gold">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.quest_offer.label')}</div>
            <h2 className="section-title">
              {t('home.quest_offer.title_1')}{' '}
              <span className="text-gold">{t('home.quest_offer.title_2')}</span>
            </h2>
            <p className="section-subtitle">{t('home.quest_offer.subtitle')}</p>
            <div className="divider divider-center" />
          </RevealSection>

          {/* Quest Storybook Visual & Pillars Showcase */}
          <div className="quest-showcase-grid">
            <RevealSection delay={0.1} className="quest-showcase__book-col">
              <Floating3DBook
                imageSrc="/assets/marketing/soe-album-storybook-cover.webp"
                altText="The Sound of Essentials Rhythm Quest Storybook"
                badgeText="📖 Storybook Gallery • Click to Explore"
                to="/gallery"
              />
            </RevealSection>

            <div className="quest-showcase__pillars-col">
              <div className="quest-pillars-grid">
                <RevealSection delay={0.15}>
                  <div className="glass-card quest-pillar-card">
                    <div className="quest-pillar__icon">🗺️</div>
                    <h3 className="quest-pillar__title">{t('home.quest_offer.feat_1_title')}</h3>
                    <p className="quest-pillar__desc">{t('home.quest_offer.feat_1_desc')}</p>
                  </div>
                </RevealSection>

                <RevealSection delay={0.2}>
                  <div className="glass-card quest-pillar-card quest-pillar-card--highlight">
                    <div className="quest-pillar__icon">🎯</div>
                    <h3 className="quest-pillar__title">{t('home.quest_offer.feat_2_title')}</h3>
                    <p className="quest-pillar__desc">{t('home.quest_offer.feat_2_desc')}</p>
                  </div>
                </RevealSection>

                <RevealSection delay={0.25}>
                  <div className="glass-card quest-pillar-card">
                    <div className="quest-pillar__icon">🏅</div>
                    <h3 className="quest-pillar__title">{t('home.quest_offer.feat_3_title')}</h3>
                    <p className="quest-pillar__desc">{t('home.quest_offer.feat_3_desc')}</p>
                  </div>
                </RevealSection>
              </div>
            </div>
          </div>

          {/* 7 Lands Mini Carousel/Grid */}
          <RevealSection delay={0.35}>
            <div className="lands-preview-swipe-hint-wrap">
              <span className="lands-preview-swipe-hint">👆 Swipe across the 7 Lands →</span>
            </div>
            <div className="lands-preview-grid">
              {lands.map((land) => (
                <div 
                  key={land.name} 
                  className="land-mini-card"
                  style={{ '--land-color': land.color }}
                >
                  <span className="land-mini-card__icon">{land.icon}</span>
                  <strong className="land-mini-card__name">{land.name}</strong>
                  <span className="land-mini-card__focus">{land.focus}</span>
                  <span className="land-mini-card__heroes">{land.heroes}</span>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={0.4} className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/rhythm-ready" className="btn btn-gold btn-shimmer btn-lg">
              {t('home.quest_offer.cta')}
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: 5 DOMAINS OF ESSENTIAL LEARNING
      ═══════════════════════════════════════════════════════ */}
      <section className="section domains-section glow-sage">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.curriculum_label')}</div>
            <h2 className="section-title">
              {t('home.curriculum_title_1')}{' '}
              <span className="text-sage">{t('home.curriculum_title_2')}</span>
            </h2>
            <p className="section-subtitle">{t('home.curriculum_subtitle')}</p>
            <div className="divider divider-center" />
          </RevealSection>

          <div className="domains-grid">
            {domains.map((d, i) => (
              <RevealSection key={d.title} delay={i * 0.1}>
                <div className="glass-card domain-card" style={{ '--domain-color': d.color, '--domain-accent': d.accent }}>
                  <div className="domain-card__icon-wrap">
                    <span className="domain-card__icon">{d.icon}</span>
                  </div>
                  <h4 className="domain-card__title">{d.title}</h4>
                  <p className="domain-card__desc">{d.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 6: FOUNDER CREDIBILITY & BRAND STANCE
      ═══════════════════════════════════════════════════════ */}
      <section className="section credibility-section">
        <div className="container">
          <RevealSection>
            <div className="credibility-banner glass-card">
              <div className="credibility-badge">🌿 OUR STANCE & PROMISE</div>
              <KineticHeadline
                tag="h2"
                variant="fade-up"
                className="credibility-quote"
                type="words"
                stagger={0.04}
              >
                “{t('home.credibility.quote')}”
              </KineticHeadline>
              <p className="credibility-sub">{t('home.credibility.sub')}</p>
              
              <div className="credibility-pillars">
                <div className="credibility-pillar">
                  <span className="cred-icon">🛡️</span>
                  <div>
                    <strong>Zero Algorithmic Traps</strong>
                    <span>No autoplay loops, flashing visuals, or dopamine farming</span>
                  </div>
                </div>
                <div className="credibility-pillar">
                  <span className="cred-icon">🎨</span>
                  <div>
                    <strong>Scratch-Made Fine Arts</strong>
                    <span>Masterfully produced by seasoned musicians with rich acoustic warmth and authentic vocals recorded live in studio sessions</span>
                  </div>
                </div>
                <div className="credibility-pillar">
                  <span className="cred-icon">🏡</span>
                  <div>
                    <strong>Sanctuary Learning</strong>
                    <span>Crafted for calm homes, focused classrooms & deep nervous system safety</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8: COMPANION ECOSYSTEM PREVIEW (DICTIONARY & WORKBOOK)
      ═══════════════════════════════════════════════════════ */}
      <section className="section book-feature-section text-center">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">📚 The Companion Ecosystem</div>
            <KineticHeadline tag="h2" className="section-title" variant="musical-bounce">
              Every Word Has a World Behind It
            </KineticHeadline>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto', maxWidth: '680px' }}>
              4,000+ words. 125 illustrated scenes. 7 Lands. The SOE Rhythm Quest Picture Dictionary and Rhythm Ready
              Workbook expand auditory learning into rich visual and tactile mastery.
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <ExpandableGallery />
            <div className="ecosystem-actions" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/workbook#dictionary-presale" className="btn btn-gold btn-shimmer">
                📚 Explore the Picture Dictionary ($55 Pre-Sale) →
              </Link>
              <Link to="/workbook" className="btn btn-outline">
                📚 View Workbook &amp; Curriculum ($21) →
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9: WHY SOE VS THE ATTENTION ALGORITHM (COMPARISON MATRIX)
      ═══════════════════════════════════════════════════════ */}
      <section className="section comparison-section glow-sage">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.comparison.label')}</div>
            <h2 className="section-title">
              {t('home.comparison.title_1')}<br />
              <span className="text-orange">{t('home.comparison.title_2')}</span>
            </h2>
            <p className="section-subtitle">{t('home.comparison.subtitle')}</p>
            <div className="divider divider-center" />
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="comparison-table-wrap glass-card">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="th-feature">{t('home.comparison.col_feature')}</th>
                    <th className="th-soe">
                      <span className="th-badge">✨ Grounded in Science</span>
                      {t('home.comparison.col_soe')}
                    </th>
                    <th className="th-algo">
                      <span className="th-badge-algo">⚠️ Screen Distraction</span>
                      {t('home.comparison.col_algo')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-feature"><strong>{t('home.comparison.row_1_title')}</strong></td>
                    <td className="td-soe">
                      <span className="check-pill">✓</span>
                      <span>{t('home.comparison.row_1_soe')}</span>
                    </td>
                    <td className="td-algo">
                      <span className="cross-pill">✕</span>
                      <span>{t('home.comparison.row_1_algo')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-feature"><strong>{t('home.comparison.row_2_title')}</strong></td>
                    <td className="td-soe">
                      <span className="check-pill">✓</span>
                      <span>{t('home.comparison.row_2_soe')}</span>
                    </td>
                    <td className="td-algo">
                      <span className="cross-pill">✕</span>
                      <span>{t('home.comparison.row_2_algo')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-feature"><strong>{t('home.comparison.row_3_title')}</strong></td>
                    <td className="td-soe">
                      <span className="check-pill">✓</span>
                      <span>{t('home.comparison.row_3_soe')}</span>
                    </td>
                    <td className="td-algo">
                      <span className="cross-pill">✕</span>
                      <span>{t('home.comparison.row_3_algo')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-feature"><strong>{t('home.comparison.row_4_title')}</strong></td>
                    <td className="td-soe">
                      <span className="check-pill">✓</span>
                      <span>{t('home.comparison.row_4_soe')}</span>
                    </td>
                    <td className="td-algo">
                      <span className="cross-pill">✕</span>
                      <span>{t('home.comparison.row_4_algo')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-feature"><strong>{t('home.comparison.row_5_title')}</strong></td>
                    <td className="td-soe">
                      <span className="check-pill">✓</span>
                      <span>{t('home.comparison.row_5_soe')}</span>
                    </td>
                    <td className="td-algo">
                      <span className="cross-pill">✕</span>
                      <span>{t('home.comparison.row_5_algo')}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 10: "STILL CURIOUS?" FAQ ACCORDION
      ═══════════════════════════════════════════════════════ */}
      <section className="section faq-section glow-purple">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.faq.label')}</div>
            <h2 className="section-title">{t('home.faq.title')}</h2>
            <p className="section-subtitle">{t('home.faq.subtitle')}</p>
            <div className="divider divider-center" />
          </RevealSection>

          <div className="faq-accordion-list">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <RevealSection key={idx} delay={idx * 0.08}>
                  <div className={`faq-accordion-card glass-card ${isOpen ? 'is-open' : ''}`}>
                    <button 
                      className="faq-question-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-icon">{item.icon}</span>
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-toggle-arrow">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-pane animate-fade-in">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                </RevealSection>
              );
            })}
          </div>

          {/* FAQ Direct Contact Card */}
          <RevealSection delay={0.4} className="text-center">
            <div className="faq-contact-card glass-card" style={{ maxWidth: '680px', margin: '2.5rem auto 0', padding: '2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💬</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark, #2B2016)', marginBottom: '0.4rem' }}>
                Still Have Questions?
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary, #555)', maxWidth: '480px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
                We're always happy to help parents, educators, and schools. Reach out directly anytime.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <a href="mailto:info@soelearn.com" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  ✉️ Email Us: info@soelearn.com
                </a>
                <Link to="/join" className="btn btn-outline">
                  Contact &amp; Partnerships →
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 11: FINAL CONVERSION CALL TO ACTION
      ═══════════════════════════════════════════════════════ */}
      <section className="section final-cta-section text-center">
        <div className="container">
          <RevealSection>
            <div className="final-cta-card glass-card">
              <div className="scene-backdrop" aria-hidden="true">
                <img src={assetPath('/assets/marketing/quest-collage.webp')} alt="" className="scene-backdrop__img" />
                <div className="scene-backdrop__scrim" />
              </div>
              
              <div className="final-cta-content">
                <div className="cta-icon" aria-hidden="true">🌟</div>
                <h2 className="final-cta-title">{t('home.final_cta.title')}</h2>
                <p className="final-cta-subtitle">{t('home.final_cta.subtitle')}</p>

                <div className="final-cta-actions">
                  <Link to="/listen" className="btn btn-gold btn-shimmer btn-lg">
                    {t('home.final_cta.btn_free')}
                  </Link>
                  <Link to="/rhythm-ready" className="btn btn-sage btn-lg">
                    {t('home.final_cta.btn_quest')}
                  </Link>
                </div>

                <div className="final-cta-badge">
                  <span>🔒 {t('home.final_cta.badge')}</span>
                </div>

                <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                  Questions or custom school inquiries? Email us directly at{' '}
                  <a href="mailto:info@soelearn.com" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 700 }}>
                    info@soelearn.com
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Mobile Sticky Thumb Zone CTA ── */}
      <StickyThumbCta
        targetUrl="/listen"
        label="🎧 Unlock 19 Tracks Free →"
        subtext="100% Free • Instant Access"
        badge="⚡️ Free Instant Access"
        showThreshold={450}
      />

      {/* ═══════════════════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ══════════════════════════════════════════
           Home Page — 11-Section Conversion Styles
        ══════════════════════════════════════════ */

        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0, 0); }
          25%  { transform: scale(1.08) translate(-1.5%, -1%); }
          50%  { transform: scale(1.12) translate(-0.5%, -2%); }
          75%  { transform: scale(1.06) translate(1%, -0.5%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        @keyframes noteFloat {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }

        .home-page {
          position: relative;
          overflow: hidden;
          color: var(--color-text-primary);
        }

        .home-page::before {
          content: '';
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: ${assetCssUrl('/assets/soe-music-orbit-wide.webp')} center top / cover no-repeat;
          will-change: transform;
        }

        @media (max-aspect-ratio: 1/1) {
          .home-page::before {
            background-image: ${assetCssUrl('/assets/soe-music-orbit-portrait.webp')};
            background-position: center top;
            background-size: cover;
          }
        }

        .home-page::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(
            180deg,
            rgba(255, 248, 240, 0.22) 0%,
            rgba(255, 252, 245, 0.18) 25%,
            rgba(255, 250, 240, 0.38) 55%,
            rgba(250, 245, 235, 0.65) 80%,
            rgba(245, 240, 225, 0.85) 100%
          );
          pointer-events: none;
        }

        /* ── SECTION 2: Hero Layout ── */
        .hero {
          min-height: calc(100vh - 44px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 40px;
          position: relative;
          overflow: hidden;
        }

        .hero__copy-wrap {
          position: relative;
          z-index: 2;
          padding: 2.5rem 0 1.5rem;
        }

        .hero__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .hero__grid {
            grid-template-columns: 1.12fr 0.88fr;
            gap: 3rem;
          }
        }

        @media (max-width: 991px) {
          .hero__copy-wrap {
            padding: 1.25rem 0 1.5rem;
          }
          .hero__grid {
            gap: 1.75rem;
          }
          .hero__visual {
            order: -1;
            margin-top: 0;
            margin-bottom: 0.5rem;
          }
          .hero__3d-book-container {
            padding: 0.5rem 0.5rem 0.75rem;
          }
          .hero__3d-book-img {
            max-width: min(290px, 78vw);
          }
          .hero__3d-book-badge {
            padding: 0.45rem 1.1rem;
          }
          .hero__3d-badge-text {
            font-size: 0.86rem;
          }
        }

        .hero__content {
          max-width: 680px;
        }

        /* ── Hero 3D Interactive Floating Book Visual ── */
        .hero__visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-top: 1rem;
        }

        @media (min-width: 992px) {
          .hero__visual {
            margin-top: 0;
            padding-right: 1rem;
          }
        }

        .hero__3d-book-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          padding: 1.5rem;
        }

        .hero__3d-book-glow {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 130%;
          height: 130%;
          background: radial-gradient(circle, rgba(255, 179, 0, 0.45) 0%, rgba(255, 111, 0, 0.25) 38%, rgba(255, 179, 0, 0.05) 65%, transparent 80%);
          filter: blur(36px);
          z-index: 1;
          pointer-events: none;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .hero__3d-book-card {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero__3d-book-frame {
          position: relative;
          border-radius: 20px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 28px 56px -10px rgba(255, 111, 0, 0.28),
            0 16px 32px -6px rgba(0, 0, 0, 0.12),
            0 0 0 1.5px rgba(255, 179, 0, 0.35);
          transition: box-shadow 0.3s ease;
        }

        .hero__3d-book-container:hover .hero__3d-book-frame {
          box-shadow: 
            0 36px 72px -12px rgba(255, 111, 0, 0.38),
            0 20px 40px -6px rgba(0, 0, 0, 0.18),
            0 0 0 2px rgba(255, 179, 0, 0.6);
        }

        .hero__3d-book-img-wrap {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
        }

        .hero__3d-book-img {
          display: block;
          width: 100%;
          max-width: 400px;
          height: auto;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 14px;
        }

        .hero__3d-book-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          mix-blend-mode: overlay;
          border-radius: 14px;
        }

        .hero__3d-book-badge-wrap {
          margin-top: 1.25rem;
          display: flex;
          justify-content: center;
        }

        .hero__3d-book-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF8EE 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.55rem 1.35rem;
          border-radius: 50px;
          border: 2px solid #FF8F00;
          box-shadow: 
            0 10px 28px rgba(255, 111, 0, 0.28),
            0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 1px 2px rgba(255, 255, 255, 0.95);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .hero__3d-book-container:hover .hero__3d-book-badge {
          transform: translateY(-2px) scale(1.04);
          border-color: #FF5500;
          box-shadow: 
            0 16px 36px rgba(255, 111, 0, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .hero__3d-badge-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.96rem;
          letter-spacing: 0.015em;
          background: linear-gradient(135deg, #FF6F00 0%, #FF3D00 50%, #D84315 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 2px rgba(255, 111, 0, 0.25));
        }

        .hero__3d-badge-pulse {
          width: 9px;
          height: 9px;
          background: #FF5500;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(255, 85, 0, 0.8);
          animation: badgePulse 2s infinite;
          flex-shrink: 0;
        }

        @keyframes badgePulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 85, 0, 0.8);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(255, 85, 0, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 85, 0, 0);
          }
        }

        /* ── Official Brand Crest ── */
        .hero__brand-crest {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 0.45rem 1.15rem 0.45rem 0.6rem;
          border-radius: 50px;
          border: 1.5px solid rgba(255, 179, 0, 0.45);
          box-shadow: 0 6px 24px rgba(255, 111, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
          margin-bottom: 1.25rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .hero__brand-crest:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(255, 111, 0, 0.18);
        }

        .hero__brand-crest-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        }

        .hero__brand-crest-text {
          display: flex;
          flex-direction: column;
          text-align: left;
          line-height: 1.2;
        }

        .hero__brand-crest-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.85rem;
          color: #B25E00;
          letter-spacing: 0.04em;
        }

        .hero__brand-crest-tagline {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.72rem;
          color: #4A5568;
        }

        .hero__eyebrow {
          margin-bottom: 1.25rem;
        }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--color-green-soft);
          color: var(--color-green);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(76,175,80,0.2);
        }

        .hero__title {
          font-size: clamp(2.3rem, 4.2vw, 3.4rem);
          line-height: 1.18;
          margin-bottom: 1.25rem;
          font-weight: 700;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.6rem 1rem;
        }

        .hero__title-text {
          display: inline;
        }

        .hero__sticker-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          vertical-align: middle;
          flex-shrink: 0;
        }

        .hero__sticker-img {
          width: clamp(140px, 16vw, 195px);
          height: auto;
          display: block;
          transform: rotate(-3.5deg);
          filter: drop-shadow(0 10px 22px rgba(255, 111, 0, 0.32)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
          transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.38s ease;
          user-select: none;
          cursor: pointer;
          will-change: transform;
          animation: sticker-pop-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
        }

        .hero__sticker-img:hover {
          transform: rotate(2deg) scale(1.08) translateY(-4px);
          filter: drop-shadow(0 16px 30px rgba(255, 111, 0, 0.45)) drop-shadow(0 5px 12px rgba(0, 0, 0, 0.16));
        }

        .hero__sticker-img:active {
          transform: rotate(-1deg) scale(0.96);
          transition: transform 0.08s ease-out;
        }

        @keyframes sticker-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.6) rotate(-14deg);
          }
          70% {
            transform: scale(1.06) rotate(1.5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-3.5deg);
          }
        }

        .hero__title-accent {
          color: var(--color-orange);
        }

        .hero__subtitle {
          margin: 0 0 1.75rem 0;
          text-align: left;
          max-width: 620px;
          font-size: clamp(1.2rem, 2vw, 1.4rem);
          line-height: 1.55;
          letter-spacing: 0.015em;
        }

        /* Hero Offer Card */
        .hero__offer-box {
          padding: 1.75rem 2rem;
          background: rgba(255, 255, 255, 0.85);
          border: 2px solid rgba(255, 111, 0, 0.25);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }

        .hero__price-line {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-heading);
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .hero__price-strike {
          text-decoration: line-through;
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        .hero__price-arrow {
          color: var(--color-text-muted);
        }

        .hero__price-val {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-green);
        }

        .hero__price-note {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .hero__checkmarks {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem 1.25rem;
        }

        .hero__checkmarks li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.92rem;
          line-height: 1.4;
          color: var(--color-text-primary);
        }

        .check-icon {
          color: var(--color-green);
          font-weight: 700;
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        .hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .hero__btn-primary {
          box-shadow: 0 6px 24px rgba(255,111,0,0.3);
          font-size: 1rem;
          padding: 0.85rem 1.75rem;
        }

        .hero__guarantee {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        /* 3D Character Cylinder Carousel */
        .hero__carousel-scene {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 440px;
          perspective: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin-top: 1rem;
          mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }

        .hero__carousel-spinner {
          width: 160px;
          height: 340px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .carousel-btn {
          background: rgba(0,0,0,0.6);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 1.4rem;
          cursor: pointer;
          position: absolute;
          z-index: 100;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .carousel-btn:hover {
          background: rgba(0,0,0,0.9);
          transform: scale(1.1);
          border-color: rgba(255,255,255,0.5);
        }

        .prev-btn { left: 5%; }
        .next-btn { right: 5%; }

        .hero__char {
          position: absolute;
          top: 0;
          left: 0;
          width: 160px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          backface-visibility: hidden;
          cursor: pointer;
        }

        .hero__char-note {
          font-size: 1.2rem;
          color: var(--char-color);
          height: 1.5rem;
          line-height: 1;
          animation: noteFloat 3s ease-in-out infinite;
        }

        .hero__char-img {
          width: 160px;
          height: 250px;
          object-fit: contain;
          object-position: center bottom;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.12));
          transition: filter 0.3s ease, transform 0.3s ease;
          display: block;
        }

        .hero__char:hover .hero__char-img {
          filter: drop-shadow(0 14px 32px rgba(0,0,0,0.20));
          transform: scale(1.1) translateY(-8px);
        }

        .hero__char-label {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.78rem;
          color: var(--char-color);
          letter-spacing: 0.04em;
          padding: 0.2rem 0.7rem;
          background: color-mix(in srgb, var(--char-color) 10%, transparent);
          border-radius: var(--radius-xl);
          border: 1px solid color-mix(in srgb, var(--char-color) 25%, transparent);
        }

        .hero__info-strip {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.25rem 0 2rem;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .hero__info-sep {
          opacity: 0.35;
        }

        /* ── SECTION 3: In-World Voices ── */
        .voices-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .voice-card {
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.80));
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 28px -4px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
        }

        .voice-card--featured {
          border: 2px solid rgba(150, 120, 196, 0.35);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(150, 120, 196, 0.12));
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 12px 32px -4px rgba(150, 120, 196, 0.15);
        }

        .voice-card__quote-mark {
          font-size: 3rem;
          line-height: 1;
          color: var(--color-orange);
          opacity: 0.35;
          font-family: serif;
          margin-bottom: -1rem;
        }

        .voice-card__quote {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-primary);
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .voice-card__author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .voice-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          border: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .voice-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          transform: scale(1.35);
          transform-origin: center 18%;
        }

        .voice-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-text-primary);
        }

        .voice-role {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* ── SECTION 4: Quest Offer ── */
        .quest-showcase-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3rem;
          align-items: center;
          margin-top: 2.5rem;
        }

        .quest-showcase__book-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .quest-showcase__pillars-col .quest-pillars-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 0;
        }

        .quest-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .quest-pillar-card {
          padding: 2rem 1.5rem;
          text-align: center;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.80));
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 28px -4px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
        }

        .quest-pillar-card--highlight {
          border: 2px solid rgba(255, 179, 0, 0.4);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 179, 0, 0.10));
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 12px 32px -4px rgba(255, 179, 0, 0.15);
        }

        .quest-pillar__icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .quest-pillar__title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .quest-pillar__desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .lands-preview-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .land-mini-card {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-top: 3px solid var(--land-color);
          border-radius: var(--radius-lg);
          padding: 1rem 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .land-mini-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px -2px rgba(0, 0, 0, 0.08);
        }

        .land-mini-card__icon { font-size: 1.25rem; }
        .land-mini-card__name { font-family: var(--font-heading); font-size: 0.85rem; color: var(--color-text-primary); }
        .land-mini-card__focus { font-size: 0.72rem; color: var(--color-text-secondary); }
        .land-mini-card__heroes { font-size: 0.68rem; color: var(--color-text-muted); }

        /* ── SECTION 5: 5 Domains ── */
        .domains-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }

        .domain-card {
          text-align: center;
          padding: 2rem 1.25rem;
          border-radius: var(--radius-xl);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-top: 4px solid var(--domain-color);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.80));
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 28px -4px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .domain-card:hover {
          transform: translateY(-6px);
        }

        .domain-card__icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--domain-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .domain-card__icon { font-size: 1.7rem; }
        .domain-card__title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-primary); }
        .domain-card__desc { font-size: 0.84rem; color: var(--color-text-secondary); line-height: 1.5; }


        /* ── SECTION 6: Credibility & Stance ── */
        .credibility-banner {
          padding: 3.5rem 3rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(95, 182, 133, 0.08));
          border: 2px solid rgba(95, 182, 133, 0.3);
          border-radius: var(--radius-xl);
        }

        .credibility-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--color-green);
          background: var(--color-green-soft);
          padding: 0.3rem 0.9rem;
          border-radius: var(--radius-xl);
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .credibility-quote {
          font-size: clamp(1.5rem, 2.8vw, 2.2rem);
          line-height: 1.3;
          margin-bottom: 1rem;
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
          color: var(--color-text-primary);
        }

        .credibility-sub {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          max-width: 680px;
          margin: 0 auto 2.5rem;
        }

        .credibility-pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }

        .credibility-pillar {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.6);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }

        .cred-icon { font-size: 1.6rem; flex-shrink: 0; }
        .credibility-pillar strong { display: block; font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--color-text-primary); }
        .credibility-pillar span { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; }

        /* ── SECTION 7: Science Trust Block ── */
        .science-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .science-card {
          padding: 2rem;
          border-left: 4px solid var(--color-blue);
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.80));
          border-right: 1.5px solid rgba(255, 255, 255, 0.85);
          border-top: 1.5px solid rgba(255, 255, 255, 0.85);
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 28px -4px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
        }

        .science-card__tag {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--color-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.6rem;
        }

        .science-card__title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .science-card__desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* ── Emergency in Education Section ── */
        .emergency-section {
          padding: 5.5rem 0 5rem;
          background: radial-gradient(ellipse at 50% 15%, rgba(255, 111, 0, 0.07), transparent 75%);
          border-bottom: 1px solid var(--color-border);
          position: relative;
        }

        .section-label--emergency {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.95rem;
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
          border: 1px solid rgba(220, 38, 38, 0.22);
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 1rem;
        }

        .emergency-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.75rem;
        }

        .emergency-stat-card {
          padding: 2.25rem 1.6rem;
          border-radius: var(--radius-2xl);
          text-align: left;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82));
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 30px -6px rgba(0, 0, 0, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .emergency-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px -8px rgba(255, 111, 0, 0.12);
        }

        .emergency-stat-card--highlight {
          border-color: rgba(34, 197, 94, 0.35);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(240, 253, 244, 0.75));
        }

        .emergency-stat-icon {
          font-size: 1.85rem;
          margin-bottom: 0.85rem;
        }

        .emergency-stat-val {
          font-family: var(--font-heading);
          font-size: 2.85rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.55rem;
          letter-spacing: -0.02em;
        }

        .emergency-stat-title {
          font-family: var(--font-heading);
          font-size: 1.08rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.55rem;
        }

        .emergency-stat-desc {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          flex-grow: 1;
          margin-bottom: 1.15rem;
        }

        .emergency-stat-source {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
          opacity: 0.75;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 0.75rem;
        }

        .emergency-callout {
          padding: 2.5rem 2.75rem;
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 240, 0.92));
          border: 1.5px solid rgba(255, 111, 0, 0.22);
          box-shadow: 0 16px 40px -8px rgba(255, 111, 0, 0.08);
        }

        .emergency-callout__content {
          max-width: 680px;
          text-align: left;
        }

        .emergency-callout__badge {
          display: inline-block;
          padding: 0.25rem 0.8rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(255, 111, 0, 0.12);
          color: #c45000;
          margin-bottom: 0.85rem;
        }

        .emergency-callout__headline {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.65rem;
          line-height: 1.3;
        }

        .emergency-callout__text {
          font-size: 0.96rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin: 0;
        }

        .emergency-callout__actions {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
          align-items: center;
        }

        /* ── SECTION 9: Comparison Table ── */
        .comparison-table-wrap {
          margin-top: 2.5rem;
          overflow-x: auto;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82));
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 28px -4px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .comparison-table th, 
        .comparison-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .th-feature { width: 28%; font-size: 0.95rem; color: var(--color-text-muted); }
        .th-soe { 
          width: 36%; 
          background: rgba(95, 182, 133, 0.08); 
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }
        .th-algo { width: 36%; font-size: 1.1rem; color: var(--color-text-muted); }

        .th-badge {
          display: block;
          font-size: 0.72rem;
          color: var(--color-green);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .th-badge-algo {
          display: block;
          font-size: 0.72rem;
          color: var(--color-orange);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .td-soe {
          background: rgba(95, 182, 133, 0.05);
          font-weight: 500;
        }

        .check-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: var(--color-green-soft);
          color: var(--color-green);
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.85rem;
          margin-right: 0.6rem;
        }

        .cross-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.85rem;
          margin-right: 0.6rem;
        }

        /* ── SECTION 10: FAQ Accordion ── */
        .faq-accordion-list {
          max-width: 800px;
          margin: 2.5rem auto 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-accordion-card {
          padding: 0;
          overflow: hidden;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.80));
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.9), 0 6px 20px -4px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-accordion-card.is-open {
          border-color: var(--color-purple);
        }

        .faq-question-btn {
          width: 100%;
          padding: 1.5rem 1.75rem;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .faq-question-icon { font-size: 1.3rem; flex-shrink: 0; }
        .faq-question-text { flex: 1; }
        .faq-toggle-arrow { font-size: 1.5rem; color: var(--color-purple); font-weight: 400; }

        .faq-answer-pane {
          padding: 0 1.75rem 1.5rem 3.75rem;
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* ── SECTION 11: Final CTA ── */
        .final-cta-section {
          padding-bottom: 4rem;
        }

        .final-cta-card {
          position: relative;
          overflow: hidden;
          padding: 5.5rem 3rem;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 240, 0.92));
          border: 2px solid rgba(255, 111, 0, 0.25);
          box-shadow: 0 20px 40px -15px rgba(255, 111, 0, 0.12);
        }

        .scene-backdrop {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          z-index: 1;
          pointer-events: none;
        }

        .scene-backdrop__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.18;
          filter: saturate(1.2);
        }

        .scene-backdrop__scrim {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255, 248, 240, 0.7) 0%, rgba(255, 248, 240, 0.96) 100%);
        }

        .final-cta-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          margin: 0 auto;
        }

        .cta-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .final-cta-title {
          font-size: clamp(2rem, 3.8vw, 3rem);
          line-height: 1.2;
          margin-bottom: 1.25rem;
          color: var(--color-text-primary);
          font-weight: 800;
        }

        .final-cta-subtitle {
          font-size: 1.15rem;
          color: var(--color-text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .final-cta-actions {
          display: flex;
          gap: 1.25rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .final-cta-badge {
          font-size: 0.9rem;
          color: var(--color-green);
          font-weight: 600;
        }

        /* ── Responsive Rules ── */
        .hero__carousel-mobile-only {
          display: none;
        }
        .lands-preview-swipe-hint-wrap {
          display: none;
        }

        @media (max-width: 992px) {
          .voices-grid { grid-template-columns: 1fr; }
          .quest-showcase-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .quest-showcase__pillars-col .quest-pillars-grid { display: grid; grid-template-columns: 1fr; }
          .quest-pillars-grid { grid-template-columns: 1fr; }
          .lands-preview-grid { grid-template-columns: repeat(4, 1fr); }
          .domains-grid { grid-template-columns: repeat(3, 1fr); }
          .credibility-pillars { grid-template-columns: 1fr; }
          .science-cards-grid { grid-template-columns: 1fr; }
          .macro-stats__grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 768px) and (max-width: 992px) {
          .quest-showcase__pillars-col .quest-pillars-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .hero__carousel-desktop-only { display: none; }
          .hero__carousel-mobile-only { display: block; width: 100%; }
          .hero__carousel-scene {
            height: auto;
            padding: 1rem 0;
            perspective: none;
            margin-top: 1.5rem;
            background: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          }
          .hero__mobile-scroll {
            display: flex;
            gap: 1.25rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 1rem;
            padding: 1rem 2rem;
            scrollbar-width: none;
          }
          .hero__mobile-scroll::-webkit-scrollbar { display: none; }
          .hero__mobile-card {
            flex: 0 0 135px;
            scroll-snap-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 255, 255, 0.65);
            border-radius: var(--radius-md);
            padding: 1.25rem 0.5rem;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .hero__mobile-card-note {
            font-size: 1rem;
            color: var(--char-color);
            height: 1.25rem;
            animation: noteFloat 3s ease-in-out infinite;
          }
          .hero__mobile-card-img {
            width: 110px;
            height: 155px;
            object-fit: contain;
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.1));
            mix-blend-mode: multiply;
          }
          .hero__mobile-card-label {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 0.72rem;
            color: var(--char-color);
            letter-spacing: 0.04em;
            padding: 0.2rem 0.6rem;
            background: color-mix(in srgb, var(--char-color) 10%, transparent);
            border-radius: var(--radius-xl);
            border: 1px solid color-mix(in srgb, var(--char-color) 25%, transparent);
            margin-top: 0.5rem;
          }
          .hero__mobile-swipe-hint {
            display: flex;
            justify-content: center;
            margin-top: 0.5rem;
          }
          .hero__mobile-swipe-hint span {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--color-orange);
            background: rgba(255, 111, 0, 0.08);
            border: 1px solid rgba(255, 111, 0, 0.2);
            padding: 0.25rem 0.8rem;
            border-radius: var(--radius-xl);
            letter-spacing: 0.02em;
          }
          .hero__checkmarks { grid-template-columns: 1fr; }
          .emergency-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .emergency-callout { flex-direction: column; align-items: flex-start; padding: 2rem 1.75rem; }
          .emergency-callout__actions { width: 100%; }
          .emergency-callout__actions .btn { width: 100%; min-height: 48px; justify-content: center; }
          .lands-preview-grid { grid-template-columns: repeat(2, 1fr); }
          .domains-grid { grid-template-columns: repeat(2, 1fr); }
          .faq-question-btn { min-height: 52px; padding: 1rem; }
          .faq-answer-pane { padding-left: 1.75rem; }
        }

        @media (max-width: 640px) {
          .emergency-stats-grid { grid-template-columns: 1fr; }
          .emergency-stat-card { padding: 1.75rem 1.25rem; }
          .hero__content { text-align: center; }
          .hero__title { justify-content: center; }
          .hero__subtitle { margin: 0 auto 1.5rem; text-align: center; }
          .hero__price-line { justify-content: center; }
          .hero__actions { justify-content: center; }
          .hero__guarantee { justify-content: center; }
          .domains-grid { grid-template-columns: 1fr; }
          .lands-preview-swipe-hint-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 0.75rem;
          }
          .lands-preview-swipe-hint {
            font-size: 0.76rem;
            font-weight: 600;
            color: var(--color-orange);
            background: rgba(255, 111, 0, 0.08);
            border: 1px solid rgba(255, 111, 0, 0.2);
            padding: 0.25rem 0.8rem;
            border-radius: var(--radius-xl);
          }
          .lands-preview-grid {
            display: flex;
            gap: 0.85rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 1rem;
            padding: 0.5rem 1rem 1rem 1rem;
            margin: 0.5rem -1.25rem 0 -1.25rem;
            scrollbar-width: none;
            mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          }
          .lands-preview-grid::-webkit-scrollbar {
            display: none;
          }
          .land-mini-card {
            flex: 0 0 148px;
            scroll-snap-align: center;
            padding: 1.15rem 0.75rem;
            border-radius: var(--radius-md);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          }
          .final-cta-card { padding: 3.5rem 1.5rem; }
        }

        @media (max-width: 480px) {
          .hero__title {
            gap: 0.4rem 0.6rem;
          }
          .hero__sticker-img {
            width: clamp(130px, 42vw, 165px);
          }
          .hero__actions {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
          }
          .hero__actions .btn {
            width: 100%;
            min-height: 50px;
            justify-content: center;
          }
          .final-cta-actions {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
          }
          .final-cta-actions .btn {
            width: 100%;
            min-height: 50px;
            justify-content: center;
          }
          .hero__mobile-scroll {
            padding: 0.75rem 1rem;
            gap: 0.85rem;
          }
          .hero__mobile-card {
            flex: 0 0 120px;
            padding: 1rem 0.35rem;
          }
          .hero__mobile-card-img {
            width: 95px;
            height: 135px;
          }
        }

        @media (max-width: 375px) {
          .hero__mobile-card {
            flex: 0 0 110px;
          }
          .hero__mobile-card-img {
            width: 85px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
