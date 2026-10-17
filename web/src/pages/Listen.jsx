import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';
import tracksData from '../data/tracks.json';
import { audioUrl } from '../utils/audioUrl';
import JsonLd from '../components/JsonLd';
import { mediaRoomSchema } from '../utils/schema';
import BrevoSubscribeForm from '../components/BrevoSubscribeForm';
import {
  GalleryGrid,
  galleryShots,
} from './MediaRoom';
import { triggerQuestCelebration, TiltCard, MagneticPill } from '../components/ui/DesignSpells';
import ProofInThePause from '../components/ui/ProofInThePause';
import StickyThumbCta from '../components/ui/StickyThumbCta';
import EmailDownloadGateModal from '../components/EmailDownloadGateModal';
import { GiftALandModal } from '../components/GiftALandModal';
import { trackLead, trackInitiateCheckout } from '../utils/analytics';
import { submitSoeInterest } from '../services/soeSubmissions';
import { isGateUnlocked, setGateUnlocked, getCapturedEmail, isValidEmail } from '../utils/gateAuth';
import DmOptInBridge from '../components/DmOptInBridge';
import KineticMusicalAccent from '../components/ui/KineticMusicalAccent';
import KineticHeadline from '../components/KineticHeadline';
import PDPQuestionChips from '../components/PDPQuestionChips';
import './MediaRoom.css';
import './Listen.css';

const STRIPE_STARTER_PACK_URL = 'https://buy.stripe.com/test_8x2aEXbJW0BLcwS0oi6Vq01';

const Listen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ── Gate State (strictly verified against stored email) ─────
  const [isUnlocked, setIsUnlocked] = useState(() => isGateUnlocked());

  const [searchParams, setSearchParams] = useSearchParams();
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftLand, setGiftLand] = useState('Harmonia');
  const [copied, setCopied] = useState(false);

  // Direct email capture state
  const [directEmail, setDirectEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optinError, setOptinError] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);

  // Universal Gate Modal State
  const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
  const [gateDownloadItem, setGateDownloadItem] = useState({
    title: 'SOE Rhythm Quest: Full 19-Track Album Experience',
    filename: 'SOE_Rhythm_Quest_19_Tracks.pdf',
    url: null,
    kind: 'interest',
  });

  const openAlbumUnlockGate = (customTitle) => {
    setGateDownloadItem({
      title: customTitle || 'SOE Rhythm Quest: Full 19-Track Album Experience',
      filename: 'SOE_Rhythm_Quest_19_Tracks.pdf',
      url: null,
      kind: 'interest',
    });
    setIsDownloadGateOpen(true);
  };

  const handleLaunchPlayerClick = (e) => {
    if (e) e.preventDefault();
    if (isGateUnlocked()) {
      navigate('/player');
    } else {
      setIsUnlocked(false);
      openAlbumUnlockGate();
    }
  };

  const handleTrackCardClick = (track, i) => {
    if (isGateUnlocked()) {
      navigate('/player');
    } else {
      openAlbumUnlockGate(`Unlock Track #${i + 1}: ${track.title} & 19 Full Songs`);
    }
  };

  const handleDirectOptin = async (e) => {
    e.preventDefault();
    setOptinError('');
    const cleanEmail = directEmail.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setOptinError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSoeInterest({
        kind: 'interest',
        email: cleanEmail,
        name: 'Rhythm Explorer',
        sourcePath: window.location.pathname,
      });
      trackLead({ formName: 'listen_direct_optin', email: cleanEmail, source: 'listen_page' });
      setGateUnlocked(cleanEmail);
      unlock(cleanEmail);
      navigate('/player');
    } catch (err) {
      console.warn('Direct optin notice:', err);
      trackLead({ formName: 'listen_direct_optin', email: cleanEmail, source: 'listen_page' });
      setGateUnlocked(cleanEmail);
      unlock(cleanEmail);
      navigate('/player');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarterPackClick = () => {
    trackInitiateCheckout({
      sku: 'SOE-STARTER-PACK',
      name: 'The Quest Starter & Coloring Pack: 40-Page Coloring Book, 432Hz Reset Track & Transition Kit',
      price: 7.00,
    });
  };

  const handleCopyShareLink = () => {
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/listen` : 'https://thesoundofessentials.com/listen';
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setIsGiftModalOpen(true);
    }
  };

  // ── Track data (for AudioPlayer + JSON-LD) ──────────────────
  const tracks = tracksData.map(track => ({
    id: track.id,
    title: t(`media.tracks.${track.id}.title`),
    domain: t(`media.tracks.${track.id}.domain`),
    domainIcon: track.domainIcon,
    desc: t(`media.tracks.${track.id}.desc`),
    src: audioUrl(track.audioFile),
    color: track.color,
    lyrics: track.lyrics,
    cover: assetPath(`/assets/track-art/${track.cover}`),
  }));

  useEffect(() => {
    document.title = "Rhythm Quest 19-Track Album | Screen-Free Sensory Children's Music & Movement Songs for Toddlers & Pre-K";

    const onMilestone = (e) => {
      if (e?.detail?.land) {
        setGiftLand(e.detail.land);
      }
      setIsGiftModalOpen(true);
      triggerQuestCelebration();
    };

    window.addEventListener('soe:milestone:3tracks', onMilestone);
    return () => window.removeEventListener('soe:milestone:3tracks', onMilestone);
  }, []);

  // ── Unlock handler ──────────────────────────────────────────
  const unlock = (email = '') => {
    const validEmail = email || getCapturedEmail();
    if (validEmail) {
      setGateUnlocked(validEmail);
    }
    setIsUnlocked(true);
    setJustUnlocked(true);
    triggerQuestCelebration();
  };

  // ── Email Query Parameter Verification ──────────────────────
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam && isValidEmail(emailParam)) {
      setGateUnlocked(emailParam);
      trackLead({ formName: 'listen_optin_url', email: emailParam, source: 'listen_page' });
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
  }, [searchParams, setSearchParams]);

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="listen-page">
      <JsonLd data={mediaRoomSchema(tracks)} />

      {/* ── Hero ── */}
      <section className="listen-hero">
        <div className="container">
          <span className="listen-hero__eyebrow">🎵 {isUnlocked ? 'Full Quest Unlocked • 19 Tracks' : 'Free Preview • 19 Tracks'}</span>
          <KineticHeadline
            tag="h1"
            className="listen-hero__title"
            variant="musical-bounce"
            delay={0.1}
            scrollTrigger={false}
          >
            Hear What <em>Learning</em> Sounds Like
          </KineticHeadline>
          <KineticMusicalAccent
            color="#FF6F00"
            secondaryColor="#5ba4c9"
            isPlaying={isUnlocked}
          />
          <p className="section-subtitle listen-hero__subtitle">
            19 acoustic songs gifted freely ($0) to founding families. Experience the music first, then pair it with our 66-page companion storybook, <em>The Sound of Essentials: Rhythm Quest</em> ($19), to bring all 15 heroes into your child's hands.
          </p>

          {isUnlocked ? (
            <div style={{ margin: '1.5rem auto 1rem auto', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <MagneticPill intensity={0.25}>
                <button
                  type="button"
                  onClick={handleLaunchPlayerClick}
                  className="btn btn-gold btn-shimmer"
                  style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem', cursor: 'pointer', border: 'none' }}
                >
                  🎧 Launch 19-Track Player →
                </button>
              </MagneticPill>
              <a
                href={STRIPE_STARTER_PACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleStarterPackClick}
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer', textDecoration: 'none' }}
              >
                🎨 {t('listen.starterPackCta', 'Quest Starter & Coloring Pack ($7) →')}
              </a>

              <Link to="/gallery" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                📖 Companion Storybook ($19) →
              </Link>

              <Link to="/rhythm-ready" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                📚 Rhythm Ready Workbook ($21) →
              </Link>
            </div>
          ) : (
            <>
              <div className="ethical-heist-callout">
                <span className="badge-tag">{t('listen.ethicalHeistBadge')}</span>
                <KineticHeadline
                  tag="h2"
                  className="heist-title"
                  variant="musical-bounce"
                >
                  {t('listen.ethicalHeistTitle')}
                </KineticHeadline>
                <p className="heist-subtitle">{t('listen.ethicalHeistSubtitle')}</p>

                {/* Primary Direct D2C Email Capture Form */}
                <form onSubmit={handleDirectOptin} className="ethical-heist-form" id="heist-email-form">
                  <div className="heist-input-group">
                    <input
                      type="email"
                      required
                      value={directEmail}
                      onChange={(e) => setDirectEmail(e.target.value)}
                      placeholder="Enter your email to unlock all 19 tracks..."
                      className="heist-email-input"
                      aria-label="Parent email address"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-gold btn-shimmer heist-submit-btn"
                    >
                      {isSubmitting ? 'Unlocking...' : `🎧 ${t('listen.ethicalHeistCta')} →`}
                    </button>
                  </div>
                  {optinError && <p className="heist-error" role="alert">{optinError}</p>}
                  <p className="heist-guarantee">
                    🔒 100% Free · Instant streaming player access to all 19 tracks · No spam
                  </p>
                </form>
              </div>

              <div style={{ margin: '1.25rem auto 1rem auto', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={STRIPE_STARTER_PACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleStarterPackClick}
                  className="btn btn-outline"
                  style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer', textDecoration: 'none' }}
                >
                  🎨 {t('listen.starterPackCta', 'Quest Starter & Coloring Pack ($7) →')}
                </a>
                <Link to="/gallery" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                  📖 Companion Storybook ($19) →
                </Link>
                <Link to="/rhythm-ready" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                  📚 Rhythm Ready Workbook ($21) →
                </Link>
              </div>

              <DmOptInBridge />

              <ProofInThePause variant="compact" />
            </>
          )}

          <div className="listen-cover">
            <TiltCard style={{ display: 'inline-block' }}>
              <div className="listen-cover__img-wrap">
                <img
                  className="listen-cover__img"
                  src={assetPath('/assets/marketing/soe-deluxe-cover.webp')}
                  srcSet={`${assetPath('/assets/marketing/soe-deluxe-cover-600.webp')} 600w, ${assetPath('/assets/marketing/soe-deluxe-cover.webp')} 1200w`}
                  sizes="(max-width: 600px) 100vw, 600px"
                  width="1200"
                  height="1200"
                  alt="The Sound of Essentials: A Musical Learning Experience album cover. Seriphia holds a glowing open book, ringed by a golden staff of musical notes, with seven children gathered around her and a lit path winding into the hills behind."
                  loading="eager"
                  fetchPriority="high"
                />
                <span className="listen-cover__badge">19 Tracks • Ages 2–7</span>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="listen-proof">
        <div className="container">
          <div className="listen-proof__grid">
            <div className="listen-proof__stat">
              <div className="listen-proof__number">19</div>
              <div className="listen-proof__label">Original Tracks</div>
            </div>
            <div className="listen-proof__stat">
              <div className="listen-proof__number">7</div>
              <div className="listen-proof__label">Learning Domains</div>
            </div>
            <div className="listen-proof__stat">
              <div className="listen-proof__number">4,000+</div>
              <div className="listen-proof__label">Words in the Dictionary</div>
            </div>
          </div>
        </div>
      </section>
      {/* ── Track Preview Grid ── */}
      <section className="listen-preview">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">🎶 The Full Tracklist</div>
            <KineticHeadline
              tag="h2"
              className="section-title"
              variant="musical-bounce"
            >
              19 Tracks. 7 Lands. <span className="text-gold">One Quest.</span>
            </KineticHeadline>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto', maxWidth: '560px' }}>
              Every track is a structured lesson in disguise, spanning language, math, science,
              movement, and social-emotional growth.
            </p>
          </RevealSection>

          <div className="listen-preview__grid">
            {tracks.map((track, i) => (
              <TiltCard
                key={track.id}
                className="listen-preview__card-tilt"
                accentColor={track.color}
              >
                <div
                  className="listen-preview__card"
                  style={{ '--card-accent': track.color, cursor: 'pointer' }}
                  onClick={() => handleTrackCardClick(track, i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrackCardClick(track, i); }}
                  aria-label={`${track.title} - ${isUnlocked ? 'Play Track' : 'Locked, enter email to unlock'}`}
                >
                  <div className="listen-preview__art-wrap">
                    <img
                      className="listen-preview__art"
                      src={track.cover}
                      alt={track.title}
                      loading="lazy"
                    />
                    <span className="listen-preview__number">{String(i + 1).padStart(2, '0')}</span>
                    {!isUnlocked && (
                      <span className="listen-preview__lock" title="Enter email to unlock full audio">🔒</span>
                    )}
                  </div>
                  <div className="listen-preview__info">
                    <h3 className="listen-preview__title">{track.title}</h3>
                    <span
                      className="listen-preview__domain"
                      style={{ color: track.color }}
                    >
                      {track.domainIcon} {track.domain}
                    </span>
                    <p className="listen-preview__desc">{track.desc}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {!isUnlocked ? (
            <div className="listen-preview__cta text-center" style={{ marginTop: '2.5rem' }}>
              <MagneticPill intensity={0.25}>
                <button
                  type="button"
                  onClick={() => openAlbumUnlockGate()}
                  className="btn btn-gold btn-shimmer"
                  style={{ fontSize: '1rem', padding: '0.85rem 2.5rem', cursor: 'pointer', border: 'none' }}
                >
                  🎧 Unlock All 19 Tracks Free →
                </button>
              </MagneticPill>
            </div>
          ) : (
            <div className="listen-preview__cta text-center" style={{ marginTop: '2.5rem' }}>
              <MagneticPill intensity={0.25}>
                <button
                  type="button"
                  onClick={handleLaunchPlayerClick}
                  className="btn btn-gold btn-shimmer"
                  style={{ fontSize: '1rem', padding: '0.85rem 2.5rem', cursor: 'pointer', border: 'none' }}
                >
                  🎧 Launch 19-Track Player →
                </button>
              </MagneticPill>
            </div>
          )}
        </div>
      </section>

      {/* ── EMAIL GATE ── */}
      {!isUnlocked && (
        <section className="listen-optin" id="optin">
          <div className="container">
            <div className="listen-optin__card">
              <span className="listen-optin__icon">🎧</span>
              <KineticHeadline
                tag="h2"
                className="listen-optin__heading"
                variant="musical-bounce"
              >
                Unlock the Full Quest
              </KineticHeadline>
              <p className="listen-optin__subtext">
                Enter your email to unlock all 19 tracks, access the full private player,
                and start a free 5-day sensory learning journey.
              </p>

              {/* COPPA Parental Affirmation Gate */}
              <div 
                className="coppa-parental-gate" 
                data-clarity-mask="true"
                style={{
                  background: isAdultConfirmed ? 'rgba(76, 175, 80, 0.08)' : 'rgba(255, 111, 0, 0.08)',
                  border: `1.5px solid ${isAdultConfirmed ? 'var(--color-green, #4CAF50)' : 'var(--color-orange, #FF6F00)'}`,
                  borderRadius: 'var(--radius-sm, 12px)',
                  padding: '0.85rem 1rem',
                  margin: '1.25rem auto 1.5rem',
                  maxWidth: '520px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  id="coppa-adult-check"
                  type="checkbox"
                  checked={isAdultConfirmed}
                  onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '0.2rem',
                    accentColor: 'var(--color-orange, #FF6F00)',
                    cursor: 'pointer'
                  }}
                />
                <label 
                  htmlFor="coppa-adult-check" 
                  style={{ fontSize: '0.84rem', color: '#2B2016', cursor: 'pointer', lineHeight: 1.45 }}
                >
                  <strong style={{ display: 'block', color: 'var(--color-orange, #FF6F00)', marginBottom: '0.15rem' }}>
                    Parent / Educator Affirmation (COPPA Compliance):
                  </strong>
                  I confirm I am a parent, legal guardian, or educator 18 years of age or older consenting to receive educational resources.
                </label>
              </div>

              {isAdultConfirmed ? (
                <div data-clarity-mask="true">
                  <BrevoSubscribeForm
                    className="listen-optin__form"
                    buttonText="🎧 Unlock 19 tracks free"
                    placeholder="Enter your best email..."
                    sourcePath="/listen"
                    onSuccess={({ email }) => {
                      trackLead({ formName: 'listen_brevo_optin', email, source: 'listen_page' });
                      unlock();
                    }}
                  />
                </div>
              ) : (
                <div 
                  style={{
                    padding: '1.25rem',
                    background: '#f8f9fa',
                    borderRadius: 'var(--radius-sm, 12px)',
                    maxWidth: '480px',
                    margin: '0 auto',
                    fontSize: '0.88rem',
                    color: '#665c54'
                  }}
                >
                  🔒 <em>Please check the parental confirmation box above to reveal the free album unlock form.</em>
                </div>
              )}

              <PDPQuestionChips preset="listen" label="Questions about the music & listening?" />
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          GATED CONTENT — everything below requires email
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={justUnlocked ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Tripwire Companion Upsell Bridge ── */}
            <section className="listen-tripwire-bridge">
              <div className="container">
                <div className="listen-tripwire-card glass-card">
                  <div className="listen-tripwire-card__content">
                    <span className="listen-tripwire-card__badge">📚 Daily Learning Quest</span>
                    <h3 className="listen-tripwire-card__title">
                      Bring The Music To Life With The 8-Week Rhythm Ready Workbook
                    </h3>
                    <p className="listen-tripwire-card__text">
                      40 structured day-by-day lessons across all 7 Lands, with 240+ daily activities in phonics, math, science, movement, civics, and reflection.
                    </p>
                  </div>
                  <div className="listen-tripwire-card__action">
                    <div className="listen-tripwire-card__price">
                      <span className="listen-tripwire-card__price-tag">$21</span>
                      <span className="listen-tripwire-card__price-sub">Digital Workbook</span>
                    </div>
                    <Link to="/rhythm-ready" className="btn btn-gold btn-shimmer" style={{ fontSize: '1.02rem', padding: '0.85rem 1.8rem' }}>
                      Get Rhythm Ready Workbook ($21) →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ── World Art Gallery ── */}
            <section className="section">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">🎨 World Art Gallery</div>
                  <KineticHeadline
                    tag="h2"
                    className="section-title"
                    variant="musical-bounce"
                  >
                    Scenes from <span className="text-gold">the Seven Lands</span>
                  </KineticHeadline>
                  <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
                    Explore the hand-drawn storybook scenes that bring the Rhythm Quest universe to life.
                  </p>
                </RevealSection>
                <div className="masonry-gallery">
                  {[
                    { src: 'pond-aiko-kenji.webp', caption: 'Aiko & Kenji at the Pond', land: 'Harmonia' },
                    { src: 'honeycomb-kwame-selene.webp', caption: "Kwame & Selene's Honeycomb", land: 'Numeria' },
                    { src: 'creek-felix-elias.webp', caption: 'Felix & Elias at the Creek', land: 'Vitalis' },
                    { src: 'tent-ezra-athena.webp', caption: "Ezra & Athena's Camp", land: 'Terrasol' },
                    { src: 'blanket-amara-octavia.webp', caption: 'Amara & Octavia Resting', land: 'Vitalis' },
                    { src: 'cubes-ronan-nerissa.webp', caption: 'Ronan & Nerissa Build', land: 'Luminosity' },
                    { src: 'dance-harmonia-vitalis.webp', caption: 'Dance of Two Lands', land: 'Harmonia' },
                    { src: 'tulip-river-path.webp', caption: 'The Tulip River Path', land: 'Terrasol' },
                    { src: 'seriphia-valley.webp', caption: "Seriphia's Valley", land: 'Celestia' },
                    { src: 'aquaria-shore.webp', caption: 'Shores of Aquaria', land: 'Aquaria' },
                    { src: 'path-to-terrasol.webp', caption: 'Path to Terrasol', land: 'Terrasol' },
                    { src: 'sundial-weather.webp', caption: 'Reading the Sundial', land: 'Celestia' },
                  ].map((s) => (
                    <div key={s.src} className="masonry-gallery__item">
                      <img src={assetPath(`/assets/scenes/${s.src}`)} alt={s.caption} loading="lazy" />
                      <div className="masonry-gallery__label">
                        <span className="masonry-gallery__land">{s.land}</span>
                        <span className="masonry-gallery__caption">{s.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Behind the Quest Gallery ── */}
            <section className="section glow-sage">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">📸 Behind the Quest</div>
                  <KineticHeadline
                    tag="h2"
                    className="section-title"
                    variant="musical-bounce"
                  >
                    A World <span className="text-sage">Brought to Life</span>
                  </KineticHeadline>
                  <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
                    Glimpses from the world of SOE: heroes, scenes, and moments from the Seven Lands.
                  </p>
                </RevealSection>
                <GalleryGrid shots={galleryShots} />
              </div>
            </section>

            {/* ── Workbook & Curriculum Cross-Promotion Banner ── */}
            <section className="section glow-gold">
              <div className="container">
                <RevealSection>
                  <div className="listen-tripwire-card glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.95), rgba(255, 255, 255, 0.92))', border: '2px solid rgba(255, 111, 0, 0.25)' }}>
                    <div className="listen-tripwire-card__content">
                      <span className="listen-tripwire-card__badge" style={{ background: 'rgba(255, 111, 0, 0.15)', color: 'var(--color-orange)' }}>
                        📚 Complete 8-Week Curriculum · Pre-K to Grade 2 (Ages 2–7)
                      </span>
                      <h3 className="listen-tripwire-card__title" style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>
                        Pair This Album With The Daily Rhythm Ready Workbook
                      </h3>
                      <p className="listen-tripwire-card__text" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                        Turn every song into a daily lesson! 40 day-by-day guided lessons across all 7 Lands, featuring 240+ activities in phonics, math, science, somatic movement, civics, and reflection.
                      </p>
                    </div>
                    <div className="listen-tripwire-card__action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="listen-tripwire-card__price">
                        <span className="listen-tripwire-card__price-tag">$21</span>
                        <span className="listen-tripwire-card__price-sub">Digital Workbook</span>
                      </div>
                      <Link to="/rhythm-ready" className="btn btn-gold btn-shimmer" style={{ fontSize: '1.08rem', padding: '0.9rem 2.2rem', whiteSpace: 'nowrap' }}>
                        Explore Rhythm Ready Workbook →
                      </Link>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── Viral Referral Loop ("Gift a Free Track") ── */}
            <section className="listen-referral-section section">
              <div className="container">
                <div className="listen-referral-card glass-card text-center">
                  <div className="listen-referral-card__icon" aria-hidden="true">🎁</div>
                  <h3 className="listen-referral-card__title">Gift Free Music to a Friend</h3>
                  <p className="listen-referral-card__desc">
                    Know a family, homeschool pod, or teacher who would love screen-free, music-powered learning?
                    Share this free 19-track experience with them.
                  </p>
                  <div className="listen-referral-card__actions">
                    <button
                      onClick={handleCopyShareLink}
                      className="btn btn-gold btn-shimmer"
                      aria-label="Copy free invite link"
                    >
                      {copied ? '✅ Link Copied to Clipboard!' : '🔗 Copy Free Invite Link'}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent("Hey! Check out this free 19-track musical learning experience for kids: " + (typeof window !== 'undefined' ? window.location.origin + '/listen' : 'https://thesoundofessentials.com/listen'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      💬 Share on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Sticky Thumb Zone CTA ── */}
      <StickyThumbCta
        targetUrl={isUnlocked ? '/rhythm-ready' : '#optin'}
        label={isUnlocked ? '📚 Get Rhythm Ready Workbook ($21) →' : '🎧 Unlock 19 Tracks Free →'}
        subtext={isUnlocked ? '40 guided daily lessons across all 7 Lands' : '100% Free • Instant Access'}
        badge={isUnlocked ? '📚 Next Step in Quest' : '⚡️ Free Instant Access'}
      />

      {/* ── Universal Email Download Gate Modal ── */}
      <EmailDownloadGateModal
        isOpen={isDownloadGateOpen}
        onClose={() => setIsDownloadGateOpen(false)}
        downloadItem={gateDownloadItem}
        onSuccess={(capturedEmail) => {
          unlock(capturedEmail);
          if (gateDownloadItem.title?.includes('Track') || gateDownloadItem.title?.includes('Album') || gateDownloadItem.title?.includes('Player')) {
            navigate('/player');
          }
        }}
      />

      {/* ── Viral Milestone Gift A Land Modal ── */}
      <GiftALandModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        triggerLand={giftLand}
      />
    </div>
  );

};

export default Listen;
