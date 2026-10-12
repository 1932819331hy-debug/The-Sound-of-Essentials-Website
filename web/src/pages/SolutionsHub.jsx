import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pseoPages } from '../data/pseoData';
import JsonLd from '../components/JsonLd';
import KineticHeadline from '../components/KineticHeadline';
import './SolutionsHub.css';

const getPageUrl = (p) => {
  const prefix = p.type === 'for' ? '/for/' : p.type === 'solution' ? '/solutions/' : '/guides/';
  return `${prefix}${p.slug}`;
};

const SolutionsHub = () => {
  useEffect(() => {
    document.title = 'Educational Solutions & Curriculum Frameworks | The Sound of Essentials';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = 'Explore The Sound of Essentials sensory-rich, music-driven curriculum solutions for preschools, speech therapy clinics, and conscious home sanctuaries.';
    }
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'The Sound of Essentials Solutions Hub',
    'description': 'Complete directory of sensory-rich, music-driven early learning solutions and frameworks.',
    'url': 'https://thesoundofessentials.com/solutions',
    'hasPart': pseoPages.map((p) => ({
      '@type': 'WebPage',
      'name': p.h1,
      'url': `https://thesoundofessentials.com${getPageUrl(p)}`
    }))
  };

  const institutionalPages = pseoPages.filter(p => [
    'early-years-directors', 'new-educators', 'child-led-classrooms',
    'bilingual-early-learners', 'preparatory-lower-schools',
    'tactile-learning-spaces', 'after-school-networks'
  ].includes(p.slug));

  const clinicalPages = pseoPages.filter(p => [
    'speech-language-pathologists', 'inclusive-classrooms',
    'pediatric-child-life', 'curriculum-licensing'
  ].includes(p.slug));

  const parentPages = pseoPages.filter(p => [
    'screen-free-sensory-learning', 'sensory-meltdown-calming',
    'speech-delay-music-activities', 'acoustic-phonics-vs-rote-worksheets',
    'calm-circle-time-transitions', 'music-enrichment-centers'
  ].includes(p.slug));

  return (
    <div className="solutions-hub">
      <JsonLd data={structuredData} />

      <header className="hub-hero">
        <div className="hub-container">
          <div className="hub-eyebrow">The Living Ecosystem</div>
          <KineticHeadline
            tag="h1"
            className="hub-title"
            variant="musical-bounce"
            delay={0.1}
            scrollTrigger={false}
          >
            Early Learning Solutions &amp; Frameworks
          </KineticHeadline>
          <p className="hub-subtitle">
            Grounding early childhood in intentional acoustic rhythm, 4,000+ words of vocabulary, and sensory sanctuary across ages 2 to 7.
          </p>
        </div>
      </header>

      <div className="hub-container">
        {/* ── Section 1: For Schools & Educators ───────────── */}
        <section className="hub-section">
          <div className="hub-section-header">
            <span className="hub-section-badge">Institutional &amp; Early Years</span>
            <h2>For Preschools, Nurseries &amp; Educators</h2>
            <p>Turnkey classroom delivery that elevates cognitive development without requiring music specialists.</p>
          </div>
          <div className="hub-cards-grid">
            {institutionalPages.map((p) => (
              <Link key={p.slug} to={getPageUrl(p)} className="hub-card">
                <span className="hub-card-badge">{p.badge}</span>
                <h3 className="hub-card-title">{p.h1}</h3>
                <p className="hub-card-desc">{p.metaDescription}</p>
                <span className="hub-card-link">Explore Solution →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 2: Clinical & Specialized ───────────── */}
        <section className="hub-section">
          <div className="hub-section-header">
            <span className="hub-section-badge">Clinical &amp; Neurodiversity</span>
            <h2>For Therapists, Clinicians &amp; Specialists</h2>
            <p>Low-stimulation acoustic tools for speech-language development, emotional regulation, and hospital care.</p>
          </div>
          <div className="hub-cards-grid">
            {clinicalPages.map((p) => (
              <Link key={p.slug} to={getPageUrl(p)} className="hub-card">
                <span className="hub-card-badge">{p.badge}</span>
                <h3 className="hub-card-title">{p.h1}</h3>
                <p className="hub-card-desc">{p.metaDescription}</p>
                <span className="hub-card-link">Explore Solution →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 3: Parents & Home Sanctuary ─────────── */}
        <section className="hub-section">
          <div className="hub-section-header">
            <span className="hub-section-badge">Home Sanctuary</span>
            <h2>For Parents &amp; Home Learning</h2>
            <p>Protecting the developing brain from hyper-stimulating screens through music, touch, and calm routines.</p>
          </div>
          <div className="hub-cards-grid">
            {parentPages.map((p) => (
              <Link key={p.slug} to={getPageUrl(p)} className="hub-card">
                <span className="hub-card-badge">{p.badge}</span>
                <h3 className="hub-card-title">{p.h1}</h3>
                <p className="hub-card-desc">{p.metaDescription}</p>
                <span className="hub-card-link">Explore Solution →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── Bottom Hub CTA ───────────────────────────────── */}
      <div className="hub-bottom-cta">
        <div className="hub-container">
          <h2>Looking to Bring Rhythm Quest to Your Community?</h2>
          <p>Stream our complete 19-track acoustic album free today or contact our team for institutional sample kits.</p>
          <div className="hub-cta-buttons">
            <Link to="/listen?unlocked=true" className="pseo-btn pseo-btn-primary pseo-btn-lg">
              Stream Album Free
            </Link>
            <Link to="/rhythm-ready" className="pseo-btn pseo-btn-secondary pseo-btn-lg">
              Explore 40-Day Workbook ($19)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsHub;
