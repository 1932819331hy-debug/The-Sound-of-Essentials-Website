import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import FullSection from '../components-v2/FullSection';
import CharSplitText from '../components-v2/CharSplitText';
import { RevealV2 } from '../hooks/useScrollReveal';

/**
 * HomeV2 — Flagship cinematic homepage.
 * Seven full-viewport sections following kaikaku's editorial rhythm,
 * rendered in SOE's warm light palette.
 */
const HomeV2 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.title = 'The Sound of Essentials | Screen-Free Early Learning, Preschool Music & Sensory Readiness for Ages 2–7';
  }, []);

  const goListen = (e) => {
    e.preventDefault();
    // Carry the email into the Listen funnel; gate handles capture there.
    navigate('/v2/listen', { state: { email } });
  };

  return (
    <div className="home-v2">
      {/* ════════════════════════════════════════════════════════
          §1 — HERO
          ════════════════════════════════════════════════════════ */}
      <FullSection
        bg={assetPath('/assets/lands/harmonia-panorama.webp')}
        overlay="light"
        kenBurns
        className="home-v2__hero"
      >
        <div className="v2-container" style={{ alignSelf: 'flex-start', marginTop: '4vh' }}>
          <RevealV2>
            {/* Official Brand Logo Seal */}
            <div className="v2-hero-crest-badge">
              <img
                src={assetPath('/assets/soe-official-logo.webp')}
                alt="The Sound of Essentials Official Crest"
                className="v2-hero-crest-img"
              />
              <div className="v2-hero-crest-text">
                <span className="v2-hero-crest-title">THE SOUND OF ESSENTIALS</span>
                <span className="v2-hero-crest-sub">Staying on the Path, Always Learning!</span>
              </div>
            </div>

            <p className="v2-serif-italic" style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)', maxWidth: '620px', lineHeight: 1.4 }}>
              A scientifically grounded, music-driven ecosystem for early childhood development.
            </p>
          </RevealV2>
        </div>

        <CharSplitText tag="span" className="v2-hero-brand" stagger={30}>
          RHYTHM QUEST
        </CharSplitText>
        <div className="v2-scroll-hint">↓</div>
      </FullSection>

      {/* ════════════════════════════════════════════════════════
          §2 — CHARACTER PARADE
          ════════════════════════════════════════════════════════ */}
      <FullSection
        bg={assetPath('/assets/marketing/quest-collage.webp')}
        overlay="light"
        kenBurns
      >
        <div className="v2-container v2-text-center">
          <CharSplitText
            tag="h2"
            className="v2-display v2-display--section"
            stagger={28}
          >
            15 Heroes. 7 Lands. One Quest.
          </CharSplitText>
          <RevealV2 className="v2-reveal--delay-2">
            <p className="v2-body v2-body--lg" style={{ maxWidth: '560px', margin: '1.5rem auto 0' }}>
              Fifteen musical heroes guide children through seven distinct lands,
              turning key early childhood milestones into songs they love to sing.
            </p>
            <Link to="/v2/heroes" className="v2-btn v2-btn--outline" style={{ marginTop: '2rem' }}>
              Meet the Heroes →
            </Link>
          </RevealV2>
        </div>
      </FullSection>

      {/* ════════════════════════════════════════════════════════
          §3 — STATS + CAPTURE
          ════════════════════════════════════════════════════════ */}
      <section className="v2-section v2-section--alt">
        <div className="v2-container">
          <RevealV2>
            <div className="v2-stat-row">
              <div className="v2-stat">
                <span className="v2-stat__number">19</span>
                <span className="v2-stat__label">original tracks</span>
              </div>
              <div className="v2-stat">
                <span className="v2-stat__number">7</span>
                <span className="v2-stat__label">learning lands</span>
              </div>
              <div className="v2-stat">
                <span className="v2-stat__number">15</span>
                <span className="v2-stat__label">hero guides</span>
              </div>
            </div>
          </RevealV2>

          <RevealV2 className="v2-reveal--delay-2">
            <form className="v2-email-capture" onSubmit={goListen} style={{ marginTop: '3.5rem' }}>
              <input
                type="email"
                className="v2-email-capture__input"
                placeholder="Your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="v2-btn v2-btn--gold">
                Listen Free
              </button>
            </form>
            <p className="v2-email-meta">Streaming now · Ages 2–7 · No app required</p>
          </RevealV2>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          §4 — THE SCIENCE
          ════════════════════════════════════════════════════════ */}
      <FullSection
        bg={assetPath('/assets/lands/celestia-panorama.webp')}
        overlay="heavy"
      >
        <div className="v2-container v2-text-center">
          <RevealV2>
            <span className="v2-label">Grounded in research</span>
            <h2 className="v2-display v2-display--section" style={{ marginTop: '1rem' }}>
              Grounded in Neuroscience
            </h2>
            <p className="v2-body v2-body--lg" style={{ maxWidth: '620px', margin: '1.5rem auto 0' }}>
              Every melody is engineered around how young brains actually learn — using
              rhythm, repetition, and multi-sensory cues to build durable neural pathways.
            </p>
          </RevealV2>

          <RevealV2 className="v2-reveal--delay-2">
            <div className="v2-domain-strip">
              {[
                { icon: '🗣️', name: 'Language' },
                { icon: '🔢', name: 'Numeracy' },
                { icon: '🤸', name: 'Motor Skills' },
                { icon: '🔬', name: 'Science' },
                { icon: '💛', name: 'Social-Emotional' },
              ].map((d) => (
                <div className="v2-domain-item" key={d.name}>
                  <span className="v2-domain-icon">{d.icon}</span>
                  <span className="v2-domain-name">{d.name}</span>
                </div>
              ))}
            </div>
            <Link to="/v2/science" className="v2-btn v2-btn--outline" style={{ marginTop: '2.5rem' }}>
              The Science →
            </Link>
          </RevealV2>
        </div>
      </FullSection>

      {/* ════════════════════════════════════════════════════════
          §5 — PULL QUOTE
          ════════════════════════════════════════════════════════ */}
      <section className="v2-quote-section">
        <CharSplitText tag="p" className="v2-quote-text" stagger={22}>
          Designed for the developing brain, not the algorithm.
        </CharSplitText>
      </section>

      {/* ════════════════════════════════════════════════════════
          §6 — MISSION PREVIEW (split layout)
          ════════════════════════════════════════════════════════ */}
      <section className="v2-section v2-section--sage">
        <div className="v2-container">
          <RevealV2>
            <div className="v2-split">
              <div className="v2-split__left">
                <h2 className="v2-display v2-display--section">Building a Sanctuary</h2>
              </div>
              <div className="v2-split__right">
                <p className="v2-body v2-body--lg">
                  In a world of dopamine-driven feeds and disposable content, we are building
                  something slower and sturdier — a calm, neuro-affirming place where every
                  child can learn at their own pace.
                </p>
                <p className="v2-body">
                  The Sound of Essentials began as lullabies and grew into an entire universe:
                  heroes, lands, songs, and stories, all stitched together by a single
                  belief — that early learning should feel like play, and sound like music.
                </p>
                <Link to="/v2/mission" className="v2-split__link">Our Mission →</Link>
              </div>
            </div>
          </RevealV2>
        </div>
      </section>

      <div className="v2-image-break">
        <img
          src={assetPath('/assets/marketing/quest-complete.webp')}
          alt="The heroes of the Rhythm Quest gathered together"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default HomeV2;
