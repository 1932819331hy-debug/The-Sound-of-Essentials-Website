import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetPath } from '../utils/assetPath';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img
                src={assetPath('/assets/soe-official-logo.webp')}
                alt="SOE Logo"
                className="footer__logo-img"
              />
              <span>Sound of Essentials: <span className="logo-accent-cursive">Rhythm Quest</span></span>
            </div>
            <p className="footer__tagline">{t('footer.tagline')}</p>
            <div className="footer__social">
              <a href="https://youtube.com/@soundofessentials" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@soe.learn" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a href="https://instagram.com/soundofessentials" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Direct Email Badge */}
            <div className="footer__email-badge">
              <a href="mailto:info@soelearn.com" className="footer__email-pill" title="Email us directly">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>info@soelearn.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.explore')}</h4>
            <Link to="/" className="footer__link">{t('navbar.home')}</Link>
            <Link to="/heroes" className="footer__link">{t('navbar.heroes')}</Link>
            <Link to="/gallery" className="footer__link">📖 Storybook Gallery</Link>
            <Link to="/science" className="footer__link">{t('footer.sci_sound')}</Link>
            <Link to="/mission" className="footer__link">{t('navbar.mission')}</Link>
            <Link to="/join" className="footer__link">✉️ {t('navbar.contact', 'Contact Us')}</Link>
          </div>

          {/* Shop & Quest Products */}
          <div className="footer__col">
            <h4 className="footer__heading">Shop &amp; Quest</h4>
            <Link to="/listen" className="footer__link">🎧 Free 19-Track Album</Link>
            <Link to="/workbook" className="footer__link">📚 Workbook &amp; Curriculum ($21)</Link>
            <Link to="/workbook#dictionary-presale" className="footer__link">📖 Picture Dictionary ($55 Pre-Sale)</Link>
            <Link to="/join" className="footer__link">{t('hero.join_button')}</Link>
          </div>

          {/* Stay Connected */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.stay_connected')}</h4>
            <p className="footer__newsletter-text">{t('footer.weekly_activities')}</p>
            <div className="footer__btn-group">
              <Link
                to="/join"
                className="footer__subscribe-btn"
              >
                {t('footer.subscribe')}
              </Link>
              <a
                href="mailto:info@soelearn.com"
                className="footer__contact-us-btn"
                title="Send an email to info@soelearn.com"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-info">
            <p>© {new Date().getFullYear()} The Sound of Essentials: <span className="logo-accent-cursive">Rhythm Quest</span>. {t('footer.all_rights_reserved')}</p>
            <p className="footer__compliance-notice" style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.35rem' }}>
              The Sound of Essentials · P.O. Box 724 · New York, NY 10027 · info@soelearn.com
            </p>
          </div>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link to="/dmca" className="footer__bottom-link">DMCA Notice</Link>
            <a href="mailto:info@soelearn.com" className="footer__bottom-link footer__bottom-email">
              ✉️ info@soelearn.com
            </a>
            <Link to="/join" className="footer__bottom-link">{t('navbar.contact', 'Contact Us')}</Link>
            <Link to="/mission" className="footer__bottom-link">{t('navbar.mission')}</Link>
            <Link to="/admin/crm" className="footer__bottom-link" style={{ opacity: 0.8, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              🔐 Admin CRM
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ──────────────────────────────────────────────
           Footer — Bright & Playful redesign
           Replaces the old dark purple→blue gradient
           with a clean warm white, perfectly on-brand.
        ────────────────────────────────────────────── */

        .site-footer {
          background-color: #FF6F00;
          background-image: linear-gradient(135deg, #FFA726 0%, #FF5722 100%);
          border-top: none;
          padding: 4rem 0 2rem 0;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        /* Decorative light blob top-right */
        .site-footer::after {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Rainbow accent strip */
        .site-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg,
            #4CAF50,
            #29B6F6,
            #7B1FA2,
            #FF6F00
          );
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 3rem;
          margin-bottom: 3.5rem;
        }

        .footer__brand {
          max-width: 320px;
        }

        .footer__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer__logo span {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.15rem;
          color: #ffffff;
        }

        .footer__logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
        }

        .footer__tagline {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.7);
          font-style: italic;
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }

        .footer__social {
          display: flex;
          gap: 0.6rem;
        }

        .footer__social a {
          color: rgba(255,255,255,0.85);
          transition: all var(--transition-med);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
        }

        .footer__social a:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .footer__email-badge {
          margin-top: 1.1rem;
        }

        .footer__email-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.16);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-xl, 99px);
          font-family: var(--font-display, inherit);
          font-weight: 700;
          font-size: 0.82rem;
          text-decoration: none;
          transition: all var(--transition-med, 0.25s ease);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .footer__email-pill:hover {
          background: #ffffff;
          color: #FF6F00;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .footer__col {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .footer__heading {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.6rem;
        }

        .footer__link {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
          transition: color var(--transition-med);
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .footer__link:hover {
          color: #ffffff;
        }

        .footer__newsletter-text {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 0.25rem;
        }

        .footer__btn-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: 0.4rem;
        }

        .footer__subscribe-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.4rem;
          background: linear-gradient(135deg, var(--color-green), var(--color-blue));
          color: #fff;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: var(--radius-xl);
          text-decoration: none;
          transition: all var(--transition-med);
          width: fit-content;
          box-shadow: 0 4px 12px var(--color-green-soft);
        }

        .footer__subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(76,175,80,0.25);
        }

        .footer__contact-us-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem 1.2rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          border-radius: var(--radius-xl);
          text-decoration: none;
          transition: all var(--transition-med);
          width: fit-content;
        }

        .footer__contact-us-btn:hover {
          background: #ffffff;
          color: var(--color-orange, #FF6F00);
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .footer__bottom-email {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.15);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .footer__bottom > p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          max-width: none;
        }

        .footer__bottom-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer__bottom-link {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          transition: color var(--transition-med);
        }

        .footer__bottom-link:hover {
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 600px) {
          .footer__grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .footer__brand {
            max-width: 100%;
          }
          .footer__bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .footer__bottom-links {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          body.has-sticky-cta .site-footer {
            padding-bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
