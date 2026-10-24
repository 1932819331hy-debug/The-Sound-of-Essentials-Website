import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';
import { assetPath } from '../utils/assetPath';
import BrevoSubscribeForm from '../components/BrevoSubscribeForm';
import { submitSoeInterest } from '../services/soeSubmissions';
import KineticHeadline from '../components/KineticHeadline';
import JsonLd from '../components/JsonLd';
import { universeSchema } from '../utils/schema';

const JoinQuest = () => {
    const { t } = useTranslation();
    useEffect(() => { document.title = 'Join the Quest — SOE Rhythm Quest'; }, []);

    // Contact State
    const [contact, setContact] = useState({ name: '', org: '', email: '', message: '', submitted: false });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactError, setContactError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleContact = async (e) => {
        e.preventDefault();
        setContactError('');

        if (!contact.email.includes('@')) {
            setContactError(t('join.org_email_error'));
            return;
        }

        setContactLoading(true);
        try {
            await submitSoeInterest({
                kind: 'partnership',
                name: contact.name,
                organizationName: contact.org,
                email: contact.email,
                message: contact.message,
                sourcePath: window.location.pathname,
            });
            setContact({ ...contact, submitted: true });
        } catch {
            setContactError(t('join.org_submit_error'));
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="join-page">
            <JsonLd data={universeSchema()} />
            {/* ── Hero ── */}
            <header className="join-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="scene-backdrop" aria-hidden="true">
                    <img src={assetPath('/assets/marketing/quest-collage.webp')} alt="" className="scene-backdrop__img" />
                    <div className="scene-backdrop__scrim" />
                </div>
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="animate-fade-up">
                        <div className="section-label">{t('join.hero_label')}</div>
                        <KineticHeadline
                            tag="h1"
                            variant="musical-bounce"
                            delay={0.1}
                            scrollTrigger={false}
                        >
                            {t('join.hero_title_1')}{' '}
                            <span className="text-gold">{t('join.hero_title_2')}</span>
                        </KineticHeadline>
                        <p className="section-subtitle" style={{ margin: '1rem auto' }}>
                            {t('join.hero_subtitle')}
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Newsletter ── */}
            <section className="section glow-sage">
                <div className="container">
                    <RevealSection>
                        <div className="newsletter-block glass-card">
                            <div className="newsletter-block__content">
                                <span className="newsletter-block__icon">📬</span>
                                <KineticHeadline
                                    tag="h2"
                                    variant="musical-bounce"
                                >
                                    {t('join.stay_connected')}
                                </KineticHeadline>
                                <p>{t('join.newsletter_desc')}</p>
                            </div>

                            <BrevoSubscribeForm
                                className="newsletter-form"
                                buttonText="✨ Join the Movement →"
                                placeholder="Enter your email..."
                                sourcePath="/join-quest"
                                kind="newsletter"
                            />
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── Audiences ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('join.who_we_serve')}</div>
                        <KineticHeadline
                            tag="h2"
                            className="section-title"
                            variant="musical-bounce"
                        >
                            {t('join.find_your_role_1')}<span className="text-sage">{t('join.find_your_role_2')}</span>{t('join.find_your_role_3')}
                        </KineticHeadline>
                    </RevealSection>

                    <div className="audience-grid">
                        <RevealSection delay={0}>
                            <div className="glass-card audience-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={assetPath('/assets/scenes/excited-to-learn.webp')}
                                    alt=""
                                    className="audience-card__scene"
                                    loading="lazy"
                                />
                                <span className="audience-card__icon">👪</span>
                                <h3>{t('join.audience_1_title')}</h3>
                                <p>
                                    {t('join.audience_1_desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.15}>
                            <div className="glass-card audience-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={assetPath('/assets/scenes/counting-claps.webp')}
                                    alt=""
                                    className="audience-card__scene"
                                    loading="lazy"
                                />
                                <span className="audience-card__icon">🏫</span>
                                <h3>{t('join.audience_2_title')}</h3>
                                <p>
                                    {t('join.audience_2_desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.3}>
                            <div className="glass-card audience-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={assetPath('/assets/scenes/march-luminosity.webp')}
                                    alt=""
                                    className="audience-card__scene"
                                    loading="lazy"
                                />
                                <span className="audience-card__icon">💼</span>
                                <h3>{t('join.audience_3_title')}</h3>
                                <p>
                                    {t('join.audience_3_desc')}
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* ── Direct Contact & Partnership Form ── */}
            <section className="section glow-plum" id="contact">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('join.partnerships_label')}</div>
                        <KineticHeadline
                            tag="h2"
                            className="section-title"
                            variant="musical-bounce"
                        >
                            {t('join.build_together_1')}<span className="text-plum">{t('join.build_together_2')}</span>
                        </KineticHeadline>
                        <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                            {t('join.partnerships_subtitle')}
                        </p>
                    </RevealSection>

                    {/* Direct Contact Action Card */}
                    <RevealSection>
                        <div className="direct-contact-card glass-card">
                            <div className="direct-contact-header">
                                <span className="direct-contact-icon" aria-hidden="true">✉️</span>
                                <div>
                                    <h3 className="direct-contact-title">{t('join.direct_contact_title')}</h3>
                                    <p className="direct-contact-desc">
                                        {t('join.direct_contact_desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="direct-contact-actions">
                                <a
                                    href="mailto:info@soelearn.com"
                                    className="btn btn-gold direct-email-btn"
                                    title="Open email to info@soelearn.com"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <span>info@soelearn.com</span>
                                </a>

                                <button
                                    type="button"
                                    className="btn btn-outline direct-copy-btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText('info@soelearn.com');
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2500);
                                    }}
                                    aria-label="Copy email address to clipboard"
                                >
                                    {copied ? t('join.direct_email_copied') : t('join.direct_email_copy')}
                                </button>
                            </div>

                            <div className="direct-contact-meta">
                                <span>{t('join.direct_response_time')}</span>
                            </div>
                        </div>
                    </RevealSection>

                    <RevealSection delay={0.15}>
                        <div className="contact-form-card glass-card">
                            <div className="contact-form-header text-center" style={{ marginBottom: '1.75rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Or Send an Instant Inquiry</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Fill out the form below or email us directly at{' '}
                                    <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange)', fontWeight: 600 }}>
                                        info@soelearn.com
                                    </a>
                                </p>
                            </div>

                            {contact.submitted ? (
                                <div className="contact-success text-center">
                                    <span style={{ fontSize: '3rem' }}>🤝</span>
                                    <h3 className="text-sage" style={{ marginTop: '1rem' }}>{t('join.message_received')}</h3>
                                    <p style={{ margin: '1rem auto', maxWidth: '400px' }}>
                                        {t('join.partnership_thank_you')}
                                    </p>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleContact} data-clarity-mask="true">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="contact-name" className="form-label">{t('join.label_name')}</label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                disabled={contactLoading}
                                                className="form-input"
                                                placeholder={t('join.placeholder_name')}
                                                value={contact.name}
                                                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contact-org" className="form-label">{t('join.label_org')}</label>
                                            <input
                                                id="contact-org"
                                                type="text"
                                                disabled={contactLoading}
                                                className="form-input"
                                                placeholder={t('join.placeholder_org')}
                                                value={contact.org}
                                                onChange={(e) => setContact({ ...contact, org: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-email" className="form-label">{t('join.label_email')}</label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            disabled={contactLoading}
                                            className="form-input"
                                            placeholder={t('join.placeholder_email')}
                                            value={contact.email}
                                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-message" className="form-label">{t('join.label_partner')}</label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            disabled={contactLoading}
                                            className="form-input form-textarea"
                                            placeholder={t('join.placeholder_message')}
                                            rows="5"
                                            value={contact.message}
                                            onChange={(e) => setContact({ ...contact, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.5rem' }}>
                                        <input
                                            id="join-adult-check"
                                            type="checkbox"
                                            required
                                            style={{ marginTop: '0.2rem', accentColor: 'var(--color-orange)', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="join-adult-check" style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
                                            I confirm I am an adult (18 years or older) representing a family, school, or organization under COPPA guidelines.
                                        </label>
                                    </div>

                                    {contactError && <p className="form-error-msg animate-fade-in" style={{ marginBottom: '1rem' }}>{contactError}</p>}

                                    <button type="submit" className="btn btn-gold" disabled={contactLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                                        {contactLoading ? (
                                            <>
                                                <span className="btn-loader"></span>
                                                <span style={{ marginLeft: '0.8rem' }}>{t('join.sending')}</span>
                                            </>
                                        ) : t('join.send_btn')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="section text-center" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="scene-backdrop" aria-hidden="true">
                    <img src={assetPath('/assets/marketing/quest-complete.webp')} alt="" className="scene-backdrop__img" />
                    <div className="scene-backdrop__scrim" />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <RevealSection>
                        <h2>{t('join.mission_title_1')}<span className="text-gold">{t('join.mission_title_2')}</span></h2>
                        <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                            {t('join.mission_subtitle')}
                        </p>
                        <div style={{ marginTop: '3rem' }}>
                            <Link to="/listen" className="page-bottom-link">
                                {t('join.explore_media')}
                            </Link>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <style>{`
        .join-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .join-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .join-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Newsletter ── */
        .newsletter-block {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem;
          text-align: center;
        }

        .newsletter-block__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .newsletter-block h2 {
          margin-bottom: 0.5rem;
        }

        .newsletter-block p {
          color: var(--color-text-secondary);
          margin: 0 auto;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .newsletter-form__row {
          display: flex;
          gap: 0.8rem;
          max-width: 480px;
          margin: 0 auto;
        }

        .newsletter-form__row .form-input {
          flex: 1;
        }

        .newsletter-success {
          padding: 2rem;
        }

        .newsletter-success h3 {
          margin: 0.5rem 0;
        }

        .newsletter-success p {
          color: var(--color-text-secondary);
          margin: 0 auto;
        }

        .form-note {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.8rem;
          text-align: center;
        }

        /* ── Audience Cards ── */
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .audience-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .audience-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .audience-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .audience-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        .audience-card__scene {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.06;
          pointer-events: none;
          transition: opacity 0.5s var(--ease-gentle);
          z-index: 0;
          border-radius: inherit;
        }

        .audience-card:hover .audience-card__scene {
          opacity: 0.14;
        }

        .audience-card__icon,
        .audience-card h3,
        .audience-card p {
          position: relative;
          z-index: 1;
        }

        /* ── Direct Contact Card ── */
        .direct-contact-card {
          max-width: 650px;
          margin: 0 auto 2rem auto;
          padding: 2.25rem 2.5rem;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 111, 0, 0.25);
          border-radius: var(--radius-lg, 16px);
          box-shadow: 0 12px 36px rgba(255, 111, 0, 0.1);
        }

        .direct-contact-header {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .direct-contact-icon {
          font-size: 2.5rem;
          line-height: 1;
          flex-shrink: 0;
          background: var(--color-orange-soft, rgba(255, 111, 0, 0.12));
          padding: 0.75rem;
          border-radius: 14px;
        }

        .direct-contact-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-text-dark, #2B2016);
          margin-bottom: 0.35rem;
        }

        .direct-contact-desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary, #555);
          line-height: 1.55;
          margin: 0;
        }

        .direct-contact-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .direct-email-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.6rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          border-radius: var(--radius-xl, 99px);
          text-decoration: none;
        }

        .direct-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-xl, 99px);
          cursor: pointer;
        }

        .direct-contact-meta {
          font-size: 0.8rem;
          color: var(--color-text-muted, #777);
          font-style: italic;
        }

        /* ── Contact Form ── */
        .contact-form-card {
          max-width: 650px;
          margin: 0 auto;
          padding: 3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid var(--color-border-light, var(--color-border, #d0d5dd));
          border-radius: var(--radius-sm, 8px);
          background: #ffffff;
          color: var(--color-text-primary, #1a1a2e);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color var(--transition-med, 0.3s ease);
          -webkit-appearance: none;
          appearance: none;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-sage, #4CAF50);
          box-shadow: 0 0 0 3px var(--color-sage-glow, rgba(76, 175, 80, 0.15));
        }

        .form-input::placeholder {
          color: var(--color-text-muted, #9ca3af);
          opacity: 1;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-success {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .join-hero {
            padding: 7rem 0 2.5rem;
          }
          .audience-grid {
            grid-template-columns: 1fr;
          }
          .newsletter-form__row {
            flex-direction: column;
          }
          .newsletter-form__row .btn {
            width: 100%;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .newsletter-block {
            padding: 2rem 1.5rem;
          }
          .contact-form-card {
            padding: 2rem 1.5rem;
          }
          .audience-card {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .newsletter-block h2 {
            font-size: 1.3rem;
          }
          .form-input {
            font-size: 16px; /* Prevents iOS zoom on focus */
          }
        }

        /* ── Loading & Errors ── */
        .btn-loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-error-msg {
          color: #e53935;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default JoinQuest;
