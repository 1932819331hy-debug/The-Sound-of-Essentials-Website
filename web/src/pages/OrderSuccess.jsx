import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { assetPath } from '../utils/assetPath';
import { triggerQuestCelebration, TiltCard, MagneticPill } from '../components/ui/DesignSpells';
import { FULFILLMENT_FILES, getDeliveryUrl, triggerBrowserDownload } from '../utils/deliveryUrl';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import KineticHeadline from '../components/KineticHeadline';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const rawSessionId = searchParams.get('session_id');
  const [orderId] = useState(() => (
    searchParams.get('order_id') || searchParams.get('id') || (rawSessionId ? `STRIPE-${rawSessionId.slice(-8).toUpperCase()}` : `SOE-${Math.floor(100000 + Math.random() * 900000)}`)
  ));
  const customerEmail = searchParams.get('email') || '';
  const productKey = searchParams.get('product') || 'rhythm-quest-storybook';

  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('apple'); // 'apple' | 'kindle' | 'print'

  const product = FULFILLMENT_FILES[productKey] || FULFILLMENT_FILES['rhythm-quest-storybook'];
  const downloadUrl = getDeliveryUrl(productKey);

  useEffect(() => {
    document.title = 'Your Quest Has Begun! — Sound of Essentials';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerQuestCelebration();
    if (customerEmail && isValidEmail(customerEmail)) {
      setGateUnlocked(customerEmail);
    }
  }, [customerEmail]);

  const handleDownload = () => {
    setDownloading(true);
    triggerBrowserDownload(downloadUrl, product.filename);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleCopyPortalLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="order-success-page">
      {/* ── Background Elements ── */}
      <div className="order-success__glow" aria-hidden="true" />

      <div className="container">
        {/* ── Header Celebration ── */}
        <header className="order-success__header text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="order-success__badge-icon"
          >
            🌟
          </motion.div>
          <span className="order-success__eyebrow">Order Confirmed • {orderId}</span>
          <KineticHeadline
            tag="h1"
            className="order-success__title"
            variant="musical-bounce"
            delay={0.1}
            scrollTrigger={false}
          >
            Your Quest Has <span className="text-gold">Begun!</span>
          </KineticHeadline>
          <p className="order-success__subtitle">
            Thank you for investing in mindful, music-powered education.
            {customerEmail ? (
              <> A confirmation receipt has been sent to <strong>{customerEmail}</strong>.</>
            ) : (
              <> Your digital product is ready for instant download below.</>
            )}
          </p>
        </header>

        {/* ── Main Fulfillment Card ── */}
        <section className="order-success__main">
          <TiltCard className="order-success__card-tilt">
            <div className="order-success__card glass-card">
              <div className="order-success__card-grid">
                {/* Book Cover Preview */}
                <div className="order-success__cover-wrap">
                  <img
                    src={assetPath(product.cover)}
                    alt={product.title}
                    className="order-success__cover-img"
                  />
                  <span className="order-success__format-tag">Format: {product.format}</span>
                </div>

                {/* Download Details & Action */}
                <div className="order-success__details">
                  <div className="order-success__meta-row">
                    <span className="order-success__pages-badge">📄 {product.pages} Illustrated Pages</span>
                    <span className="order-success__size-badge">💾 {product.size}</span>
                    <span className="order-success__age-badge">🎯 Ages 2–7</span>
                  </div>

                  <h2 className="order-success__product-title">{product.title}</h2>
                  <p className="order-success__product-desc">
                    Seriphia guides Kenji, Aiko, and the heroes through all Seven Lands. Paired track-by-track
                    to the free 19-track album with the complete <em>My Word Quest</em> visual glossary in the backmatter.
                  </p>

                  <div className="order-success__actions">
                    <MagneticPill intensity={0.2}>
                      <button
                        onClick={handleDownload}
                        className="btn btn-gold btn-shimmer order-success__dl-btn"
                        disabled={downloading}
                        aria-label="Download your PDF"
                      >
                        {downloading ? '⏳ Downloading...' : `⬇️ Download PDF (${product.size})`}
                      </button>
                    </MagneticPill>

                    <Link to="/listen" className="btn btn-outline">
                      🎧 Open 19-Track Audio Player →
                    </Link>
                  </div>

                  <div className="order-success__bookmark-tip">
                    <span>💡 <strong>Tip:</strong> Bookmark this page or <button onClick={handleCopyPortalLink} className="order-success__copy-link-btn">{copiedLink ? 'Copied!' : 'copy your access link'}</button> to re-download anytime on any device.</span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </section>

        {/* ── Device Quick-Guide ── */}
        <section className="order-success__guide section">
          <div className="text-center">
            <span className="section-label">Device Guide</span>
            <h2 className="section-title">How to Read on Your Devices</h2>
            <p className="section-subtitle" style={{ maxWidth: '520px', margin: '0 auto 2rem' }}>
              Your download is a universal high-resolution PDF designed for tablets, phones, computers, or home printing.
            </p>
          </div>

          <div className="order-success__tabs">
            <button
              className={`order-success__tab ${activeTab === 'apple' ? 'order-success__tab--active' : ''}`}
              onClick={() => setActiveTab('apple')}
            >
              🍎 iPad &amp; iPhone (Apple Books)
            </button>
            <button
              className={`order-success__tab ${activeTab === 'kindle' ? 'order-success__tab--active' : ''}`}
              onClick={() => setActiveTab('kindle')}
            >
              📚 Kindle &amp; Android
            </button>
            <button
              className={`order-success__tab ${activeTab === 'print' ? 'order-success__tab--active' : ''}`}
              onClick={() => setActiveTab('print')}
            >
              🖨️ Home Printing &amp; Binders
            </button>
          </div>

          <div className="order-success__tab-content glass-card">
            {activeTab === 'apple' && (
              <div className="order-success__guide-item">
                <h3>Reading in Apple Books (Recommended for iPad)</h3>
                <ol>
                  <li>Tap the <strong>Download PDF</strong> button above on your Safari browser.</li>
                  <li>Tap the <strong>Share icon</strong> (square with up arrow) at the bottom or top of your screen.</li>
                  <li>Select <strong>Books</strong> from your apps list.</li>
                  <li>The book will save permanently to your library with two-page spread support and full pinch-to-zoom!</li>
                </ol>
              </div>
            )}
            {activeTab === 'kindle' && (
              <div className="order-success__guide-item">
                <h3>Reading on Kindle, Android, or Adobe Reader</h3>
                <ol>
                  <li>Download the PDF to your device or computer.</li>
                  <li><strong>Kindle App:</strong> Use Amazon's <em>Send to Kindle</em> feature or email the PDF to your Send-to-Kindle address.</li>
                  <li><strong>Android Tablets:</strong> Open using Google Play Books, Adobe Acrobat Reader, or any standard PDF viewer.</li>
                </ol>
              </div>
            )}
            {activeTab === 'print' && (
              <div className="order-success__guide-item">
                <h3>Printing at Home or Local Print Shop</h3>
                <ol>
                  <li>Open the downloaded PDF in Adobe Acrobat or your browser's PDF viewer.</li>
                  <li>Choose <strong>Fit to Printable Area</strong> or <strong>100% Scale</strong> in printer settings.</li>
                  <li>Select specific page ranges if you want to print weekly Land sections (e.g. Harmonia = pages 3–8).</li>
                  <li>Place in a 3-ring binder for daily hands-on learning!</li>
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* ── Audio Companion Quick-Launch ── */}
        <section className="order-success__audio-launch section">
          <div className="order-success__launch-card glass-card">
            <div className="order-success__launch-icon">🎵</div>
            <div className="order-success__launch-content">
              <h3>Start Track 1: Harmonia</h3>
              <p>
                Pair Chapter 1 of the storybook with <em>The Sound of Essentials</em> title track and <em>Colors</em>.
                Experience the multi-sensory rhythm method in action.
              </p>
            </div>
            <Link to="/listen" className="btn btn-gold btn-shimmer">
              🎧 Launch Player →
            </Link>
          </div>
        </section>

        {/* ── Ascension Offers ── */}
        <section className="order-success__ascension section">
          <div className="text-center">
            <span className="section-label">Next Level Learning</span>
            <h2 className="section-title">Complete Your Rhythm Quest Ecosystem</h2>
          </div>

          <div className="order-success__ascension-grid">
            <div className="order-success__ascension-card glass-card">
              <span className="order-success__ascension-badge">Core 8-Week Readiness Curriculum</span>
              <h3>Rhythm Ready Workbook</h3>
              <p>
                400 structured activity blocks across 40 days. Progressive phonics, math, science, and movement.
              </p>
              <div className="order-success__ascension-price">
                <strong>$21</strong> <span>Digital PDF</span>
              </div>
              <Link to="/rhythm-ready" className="btn btn-outline">
                Explore Rhythm Ready →
              </Link>
            </div>

            <div className="order-success__ascension-card glass-card">
              <span className="order-success__ascension-badge">Oxford-Adjacent Reference</span>
              <h3>Essential Picture Dictionary</h3>
              <p>
                4,000+ words across 125 illustrated scenes. Bilingual EN/ES support and phonetic guides.
              </p>
              <div className="order-success__ascension-price">
                <strong>$55</strong> <span>Pre-Sale (Compare at $79)</span>
              </div>
              <Link to="/workbook#dictionary-presale" className="btn btn-gold">
                Pre-Order Dictionary ($55) →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderSuccess;
