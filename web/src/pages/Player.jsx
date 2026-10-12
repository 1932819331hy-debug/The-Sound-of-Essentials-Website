import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayerWidget from '../components/MusicPlayerWidget';
import TrackStack from '../components/TrackStack';
import BrevoSubscribeForm from '../components/BrevoSubscribeForm';
import { assetPath } from '../utils/assetPath';
import { audioUrl } from '../utils/audioUrl';
import tracksData from '../data/tracks.json';
import { trackLead } from '../utils/analytics';
import { triggerQuestCelebration, TiltCard } from '../components/ui/DesignSpells';
import { isGateUnlocked, setGateUnlocked, getCapturedEmail, isValidEmail } from '../utils/gateAuth';
import KineticHeadline from '../components/KineticHeadline';

const Player = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTrack, setActiveTrack] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);

  // ── Gate State (strictly verified against captured email) ────
  const [isUnlocked, setIsUnlocked] = useState(() => isGateUnlocked());

  // ── 19 Canonical Tracks Data ────────────────────────────────
  const tracks = useMemo(() => {
    return tracksData.map((track) => ({
      id: track.id,
      slug: track.slug || track.id,
      title: t(`media.tracks.${track.id}.title`) || track.title,
      artist: 'The Sound of Essentials',
      cover: assetPath(`/assets/track-art/${track.cover}`),
      src: audioUrl(track.audioFile),
      color: track.color || '#FF6F00',
      domain: t(`media.tracks.${track.id}.domain`) || track.domain,
      domainIcon: track.domainIcon || '🎵',
      lyrics: track.lyrics || null,
    }));
  }, [t]);

  useEffect(() => {
    document.title = isUnlocked
      ? 'Now Playing — SOE Rhythm Quest'
      : 'Unlock 19 Tracks — SOE Rhythm Quest';
  }, [isUnlocked]);

  // ── Unlock Handler ──────────────────────────────────────────
  const unlock = useCallback((email = '') => {
    const validEmail = email || getCapturedEmail();
    if (validEmail) {
      setGateUnlocked(validEmail);
    }
    setIsUnlocked(true);
    triggerQuestCelebration();
  }, []);

  // ── Email Query Parameter Verification ──────────────────────
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam && isValidEmail(emailParam)) {
      setGateUnlocked(emailParam);
      trackLead({ formName: 'player_optin_url', email: emailParam, source: 'player_page' });
      unlock(emailParam);

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('unlocked');
        next.delete('_bhref');
        next.delete('email');
        next.delete('subscriber_id');
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams, unlock]);


  const handleTrackChange = useCallback((index) => {
    setActiveTrack(index);
  }, []);


  const handleStackSelect = useCallback((index) => {
    setSelectedTrack(index);
    setActiveTrack(index);
  }, []);

  return (
    <div className="player-page">
      <div className="player-page__bg" aria-hidden="true">
        <img
          src={assetPath('/assets/luminosity-hall.png')}
          alt=""
          className="player-page__bg-img"
        />
      </div>
      <div className="player-page__overlay" aria-hidden="true" />

      <div className="player-page__inner">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ── LOCKED GATE STATE (Behind Email Capture) ── */
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="player-gate-wrap"
            >
              <div className="player-page__header">
                <span className="player-page__label">🔒 Free Founding Family Pass</span>
                <h1 className="player-page__title">
                  Unlock the <span className="accent-text">Full Player</span>
                </h1>
                <p className="player-page__subtitle">
                  Instant, screen-free access to all 19 remastered tracks, lyrics, and learning guides across the 7 Lands.
                </p>
              </div>

              <div className="player-gate-card">
                <TiltCard maxTilt={8} style={{ margin: '0 auto 1.5rem auto', display: 'inline-block' }}>
                  <img
                    src={assetPath('/assets/marketing/soe-deluxe-cover.webp')}
                    alt="The Sound of Essentials Deluxe Album Cover"
                    className="player-gate-cover-img"
                  />
                </TiltCard>
                <div className="player-gate-badge">🎧 100% Free · Instant Unlock</div>
                <KineticHeadline
                  tag="h2"
                  className="player-gate-title"
                  variant="musical-bounce"
                >
                  Enter your email to start listening
                </KineticHeadline>
                <p className="player-gate-desc">
                  Join thousands of conscious parents and homeschoolers using music-first phonics and somatic rhythm for early learning.
                </p>

                <div style={{ maxWidth: '480px', margin: '1.5rem auto 0 auto' }}>
                  <BrevoSubscribeForm
                    buttonText="🎧 Unlock All 19 Tracks Free →"
                    placeholder="Enter your best email..."
                    sourcePath="/player"
                    showNameInput={true}
                    onSuccess={({ email }) => {
                      trackLead({ formName: 'player_brevo_unlock', email, source: 'player_gate' });
                      unlock(email);
                    }}
                  />
                </div>


                <div className="player-gate-footer">
                  <span>🔒 Instant Access</span>
                  <span>•</span>
                  <span>⚡️ Instant browser streaming</span>
                  <span>•</span>
                  <Link to="/listen" style={{ color: 'var(--color-orange-light)', textDecoration: 'underline' }}>
                    Or preview tracks on Media Room →
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── UNLOCKED PLAYER STATE (Full Music Experience) ── */
            <motion.div
              key="unlocked-player"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              {/* ── HERO ALBUM HEADLINER CENTERPIECE ── */}
              <div className="player-hero-headliner">
                <div className="player-hero-headliner__artwork-wrap">
                  <TiltCard maxTilt={10} className="player-hero-headliner__tilt">
                    <div className="player-hero-headliner__glow" />
                    <img
                      src={assetPath('/assets/marketing/soe-deluxe-cover.webp')}
                      alt="The Sound of Essentials: A Musical Learning Experience Official Album Cover"
                      className="player-hero-headliner__img"
                    />
                  </TiltCard>
                </div>

                <div className="player-hero-headliner__details">
                  <div className="player-hero-headliner__top-row">
                    <span className="player-hero-headliner__badge">🌟 The Official Headliner Album</span>
                    <Link
                      to="/listen"
                      className="player-hero-headliner__back-link"
                    >
                      ← Media Room &amp; Gallery
                    </Link>
                  </div>

                  <KineticHeadline
                    tag="h1"
                    className="player-hero-headliner__title"
                    variant="musical-bounce"
                    delay={0.1}
                    scrollTrigger={false}
                  >
                    The Sound of <span className="accent-text" style={{ color: 'var(--color-orange, #FF6F00)' }}>Essentials</span>
                  </KineticHeadline>
                  <h2 className="player-hero-headliner__subtitle">
                    A Musical Learning Experience · Rhythm Quest
                  </h2>
                  <p className="player-hero-headliner__desc">
                    19 remastered tracks across all 7 Lands, designed for early childhood cognitive development, phonics, and joy.
                  </p>

                  <div className="player-hero-headliner__pills">
                    <span className="player-pill">🎵 19 Tracks</span>
                    <span className="player-pill">🌍 7 Lands</span>
                    <span className="player-pill">🧠 Ages 2–7</span>
                    <span className="player-pill">✨ 100% Screen-Free</span>
                  </div>
                </div>
              </div>

              {/* ── INTERACTIVE CONTROLS ROW (Turntable + 3D Track Stack) ── */}
              <div className="player-page__layout">
                <div className="player-page__player-col">
                  <MusicPlayerWidget
                    tracks={tracks}
                    onTrackChange={handleTrackChange}
                    selectedTrack={selectedTrack}
                  />
                </div>

                <div className="player-page__stack-col">
                  <div className="player-page__stack-label">
                    <span className="player-page__stack-icon">🎵</span>
                    <span>Browse All 19 Tracks</span>
                  </div>
                  <TrackStack
                    tracks={tracks}
                    currentIndex={activeTrack}
                    onSelect={handleStackSelect}
                  />
                </div>
              </div>

              <p className="player-page__hint">
                Space to play/pause · ← → to seek · Shift+← → to skip · S shuffle · L loop
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .player-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6.5rem 1.5rem 3.5rem;
          background: var(--color-bg-cream, #FFF8F0);
          overflow-x: hidden;
        }

        .player-page__bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .player-page__bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.92;
          filter: saturate(115%) contrast(105%);
        }

        .player-page__overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 50% 35%, rgba(255, 248, 240, 0.18) 0%, rgba(255, 248, 240, 0.42) 65%, rgba(250, 244, 235, 0.65) 100%);
          z-index: 1;
        }

        .player-page__inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          width: 100%;
        }

        /* ── Hero Headliner Showcase ── */
        .player-hero-headliner {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          max-width: 1100px;
          margin: 0 auto 2.75rem;
          padding: 2rem 2.5rem;
          background: rgba(255, 255, 255, 0.92);
          border: 2px solid rgba(255, 111, 0, 0.24);
          border-radius: 28px;
          backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 20px 50px -10px rgba(74, 53, 30, 0.14), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
        }

        @media (max-width: 900px) {
          .player-hero-headliner {
            flex-direction: column;
            text-align: center;
            padding: 1.75rem 1.5rem;
            gap: 1.75rem;
          }
        }

        .player-hero-headliner__artwork-wrap {
          flex-shrink: 0;
          position: relative;
        }

        .player-hero-headliner__tilt {
          position: relative;
          cursor: pointer;
        }

        .player-hero-headliner__img {
          width: 220px;
          height: 220px;
          border-radius: 22px;
          object-fit: cover;
          display: block;
          position: relative;
          z-index: 2;
          box-shadow: 0 16px 36px rgba(74, 53, 30, 0.24), 0 0 0 2px rgba(255, 111, 0, 0.35);
        }

        @media (max-width: 600px) {
          .player-hero-headliner__img {
            width: 170px;
            height: 170px;
          }
        }

        .player-hero-headliner__glow {
          position: absolute;
          inset: -10px;
          border-radius: 28px;
          background: radial-gradient(circle, rgba(255, 111, 0, 0.35) 0%, transparent 70%);
          z-index: 1;
          filter: blur(12px);
          pointer-events: none;
        }

        .player-hero-headliner__details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .player-hero-headliner__top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 900px) {
          .player-hero-headliner__top-row {
            justify-content: center;
          }
        }

        .player-hero-headliner__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #FF6F00;
          background: rgba(255, 111, 0, 0.12);
          border: 1px solid rgba(255, 111, 0, 0.25);
          padding: 0.3rem 0.85rem;
          border-radius: 50px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .player-hero-headliner__back-link {
          font-size: 0.85rem;
          color: #FF6F00;
          font-weight: 600;
          text-decoration: none;
          background: rgba(255, 111, 0, 0.08);
          border: 1px solid rgba(255, 111, 0, 0.2);
          padding: 0.3rem 0.85rem;
          border-radius: 50px;
          transition: all 0.2s ease;
        }

        .player-hero-headliner__back-link:hover {
          background: rgba(255, 111, 0, 0.18);
          transform: translateX(-2px);
        }

        .player-hero-headliner__title {
          font-family: var(--font-display, Fredoka, sans-serif);
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: #2D3142;
          margin: 0;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .player-hero-headliner__subtitle {
          font-family: var(--font-heading, Fredoka, sans-serif);
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          font-weight: 600;
          color: #FF6F00;
          margin: 0;
          line-height: 1.3;
        }

        .player-hero-headliner__desc {
          font-size: 0.95rem;
          color: #5C6479;
          margin: 0.2rem 0 0.4rem;
          line-height: 1.5;
        }

        .player-hero-headliner__pills {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.3rem;
        }

        @media (max-width: 900px) {
          .player-hero-headliner__pills {
            justify-content: center;
          }
        }

        .player-pill {
          font-size: 0.78rem;
          font-weight: 700;
          color: #2D3142;
          background: #FFF8F0;
          border: 1px solid rgba(255, 111, 0, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }

        .player-page__layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .player-page__layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .player-page__player-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .player-gate-cover-img {
          width: 200px;
          height: 200px;
          border-radius: 24px;
          object-fit: cover;
          display: block;
          box-shadow: 0 20px 45px rgba(74, 53, 30, 0.25), 0 0 0 3px rgba(255, 111, 0, 0.35);
        }

        .player-page__stack-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .player-page__stack-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.05rem;
          font-family: var(--font-heading, Fredoka, sans-serif);
          font-weight: 700;
          color: var(--color-text, #2D3142);
          margin-bottom: 0.5rem;
        }

        .player-page__stack-icon {
          font-size: 1.25rem;
        }

        .player-page__hint {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-muted, #8E95A5);
          margin: 0;
          margin-top: 2rem;
        }

        /* ── Gate Card ── */
        .player-gate-wrap {
          max-width: 720px;
          margin: 0 auto;
        }

        .player-gate-card {
          background: rgba(255, 255, 255, 0.94);
          border: 2px solid rgba(255, 111, 0, 0.25);
          border-radius: var(--radius-lg, 28px);
          padding: 3rem 2rem;
          text-align: center;
          backdrop-filter: blur(20px) saturate(160%);
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 20px 50px rgba(74, 53, 30, 0.10);
        }

        .player-gate-badge {
          display: inline-block;
          background: rgba(255, 111, 0, 0.12);
          color: var(--color-orange, #FF6F00);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.35rem 1.2rem;
          border-radius: 50px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .player-gate-title {
          color: var(--color-text, #2D3142);
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-family: var(--font-heading, Fredoka, sans-serif);
          margin-bottom: 0.75rem;
        }

        .player-gate-desc {
          color: var(--color-text-light, #5C6479);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 520px;
          margin: 0 auto;
        }

        .player-gate-footer {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: var(--color-text-muted, #8E95A5);
        }
      `}</style>
    </div>
  );
};

export default Player;