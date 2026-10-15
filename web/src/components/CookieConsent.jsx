import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('soe_privacy_consent');
      if (!consent) {
        setIsVisible(true);
        document.body.classList.add('has-cookie-consent');
      } else if (consent === 'granted' && typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', true);
      }
    } catch {
      // Fallback if localStorage is inaccessible
      setIsVisible(false);
    }

    return () => {
      document.body.classList.remove('has-cookie-consent');
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'granted');
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', true);
      }
    } catch {
      // ignore
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'declined');
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', false);
      }
    } catch {
      // ignore
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Privacy and Cookie Consent"
      className="cookie-consent-bar"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '720px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 'var(--radius-md, 20px)',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }} aria-hidden="true">🛡️</span>
        <div style={{ flex: 1, fontSize: '0.88rem', color: '#2B2016', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--color-orange, #FF6F00)' }}>Privacy &amp; Data Safeguards:</strong>{' '}
          {t('legal.cookie_banner_text')}{' '}
          <Link to="/privacy" style={{ color: 'var(--color-orange, #FF6F00)', textDecoration: 'underline', fontWeight: 600 }}>
            {t('legal.cookie_learn_more')}
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleDecline}
          style={{
            background: 'transparent',
            border: '1.5px solid #d0d5dd',
            color: '#475467',
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--radius-pill, 50px)',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {t('legal.cookie_decline')}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          style={{
            background: 'linear-gradient(135deg, var(--color-green, #4CAF50), var(--color-blue, #1E88E5))',
            border: 'none',
            color: '#ffffff',
            padding: '0.5rem 1.3rem',
            borderRadius: 'var(--radius-pill, 50px)',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)',
            transition: 'all 0.2s ease',
          }}
        >
          {t('legal.cookie_accept')}
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;
