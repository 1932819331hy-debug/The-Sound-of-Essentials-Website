import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import { trackInitiateCheckout } from '../utils/analytics';
import './HeadphonesSale.css';

const STRIPE_HEADPHONES_URL = 'https://buy.stripe.com/test_cNi6oH01eacl8gC5IC6Vq07';
const STRIPE_BUNDLE_URL = 'https://buy.stripe.com/test_28E00j9BOacldAWc706Vq08';
const TIKTOK_SHOP_URL = 'https://www.tiktok.com/@soe.learn';
const USER_MANUAL_PDF_URL = 'https://ae-pic-a1.aliexpress-media.com/kf/Sdfedac9d9a044afba00bc28557b25b3cR.pdf';

const COLOR_VARIANTS = [
  {
    id: 'white-orange',
    name: 'White & Orange',
    land: 'Ventura',
    color: '#FF6F00',
    image: '/assets/marketing/headphones/variant-white-orange.jpg',
  },
  {
    id: 'pink-purple',
    name: 'Pink & Purple',
    land: 'Celestia',
    color: '#EC4899',
    image: '/assets/marketing/headphones/variant-pink-purple.jpg',
  },
  {
    id: 'blue-red',
    name: 'Ocean Blue & Red',
    land: 'Aquaria',
    color: '#2563EB',
    image: '/assets/marketing/headphones/variant-blue-red.jpg',
  },
  {
    id: 'green-yellow',
    name: 'Sage Green & Yellow',
    land: 'Terrasol',
    color: '#16A34A',
    image: '/assets/marketing/headphones/variant-green-yellow.jpg',
  },
  {
    id: 'yellow-blue',
    name: 'Sun Yellow & Blue',
    land: 'Solara',
    color: '#EAB308',
    image: '/assets/marketing/headphones/variant-yellow-blue.jpg',
  },
  {
    id: 'ocean-blue',
    name: 'Deep Sea Cobalt',
    land: 'Harmonia',
    color: '#1D4ED8',
    image: '/assets/marketing/headphones/variant-ocean-blue.png',
  },
];

const GALLERY_THUMBNAILS = [
  { id: 'hero', label: 'Overview', image: '/assets/marketing/headphones/hero.jpg' },
  { id: 'angle', label: 'Ergonomic Fit', image: '/assets/marketing/headphones/angle.jpg' },
  { id: 'cushion', label: 'Protein Cushions', image: '/assets/marketing/headphones/cushion.jpg' },
  { id: 'headband', label: 'Kids-Safe Volume Limiter (74/85dB)', image: '/assets/marketing/headphones/headband.jpg' },
  { id: 'detail', label: 'Multiple Scenario Adaptation', image: '/assets/marketing/headphones/detail.jpg' },
  { id: 'lineup', label: 'All 6 Editions', image: '/assets/marketing/headphones/lineup.jpg' },
];

const FEATURES = [
  {
    icon: '🛡️',
    title: '74dB / 85dB Dual Safe Volume Limit',
    desc: 'Equipped with a dual-level safety switch: 74dB for delicate toddler ears and quiet study, and 85dB WHO/AAP certified safe listening for classrooms, travel, and noisy car rides.',
  },
  {
    icon: '🔊',
    title: '2 x 40mm Dynamic Stereo Drivers',
    desc: 'High-definition acoustic neodymium drivers delivering crystal-clear vocal phonics, rich bass tones, and immersive stereo reproduction across the full 20Hz – 20,000Hz frequency spectrum.',
  },
  {
    icon: '🔌',
    title: 'Zero-Radiation Wired 3.5mm Jack',
    desc: '100% EMF-free analog listening with a gold-plated 3.5mm plug. No Bluetooth microwave radiation, no lithium battery degradation, and zero dead-battery mid-trip interruptions.',
  },
  {
    icon: '🪢',
    title: '1.5m Tangle-Free Braided Cable',
    desc: '4.9-foot heavy-duty nylon braided audio cable engineered to resist chewing, tangles, knots, and aggressive stretching during active play.',
  },
  {
    icon: '☁️',
    title: 'Hypoallergenic Breathable Pillows',
    desc: 'Ultra-soft protein leather ear cushions engineered for sensory-sensitive and neurodivergent kids. Evenly distributes clamping force with zero pressure on delicate ear cartilage.',
  },
  {
    icon: '🌀',
    title: 'Padded Adjustable Flex-Band',
    desc: 'Lightweight, ergonomic sliding headband constructed from non-toxic, BPA-free food-grade materials that flexibly adjusts to fit toddlers (ages 2+) up to pre-teens.',
  },
];

const SPECS = [
  { label: 'Model', value: 'AWATRUE HK05 Safe Kids Edition' },
  { label: 'Driver Diameter', value: '2 × 40mm Dynamic Neodymium' },
  { label: 'Safe Volume Cap', value: '74dB (Toddler/Study) / 85dB (WHO Safe Standard)' },
  { label: 'Frequency Response', value: '20Hz – 20,000Hz' },
  { label: 'Sensitivity / Impedance', value: '103dB ± 3dB / 32Ω ± 15%' },
  { label: 'Cable Length', value: '1.5 meters / 4.9 ft (Braided Tangle-Free)' },
  { label: 'Audio Connector', value: '3.5mm Gold-Plated Stereo Audio Jack' },
  { label: 'Weight', value: '145g (Ultra-Lightweight Ergonomic Build)' },
  { label: 'Materials', value: 'Non-Toxic Food-Grade ABS/PVC, Protein Leather' },
  { label: 'Compliance & Safety', value: 'WHO Safe Hearing, CPC, CPSIA, CE, RoHS' },
  { label: 'Compatibility', value: 'iPad, Chromebook, Kindle Fire, Android, PC, Mac, Switch' },
];

const HeadphonesSale = () => {
  const [selectedVariant, setSelectedVariant] = useState(COLOR_VARIANTS[0]);
  const [activeImage, setActiveImage] = useState(COLOR_VARIANTS[0].image);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setActiveImage(variant.image);
  };

  const handleThumbnailClick = (thumb) => {
    setActiveImage(thumb.image);
  };

  const handleCheckoutClick = (sku, name, price) => {
    trackInitiateCheckout({ sku, name, price });
  };

  return (
    <div className="hp-page">
      <div className="hp-container">
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#786454' }}>
          <Link to="/" style={{ color: '#FF6F00', textDecoration: 'none', fontWeight: 600 }}>Home</Link> &gt; 
          <span style={{ marginLeft: '0.5rem' }}>AWATRUE HK05 Sensory Kids Headphones</span>
        </div>

        {/* ── Main Product Hero ── */}
        <section className="hp-hero">
          {/* Left: Interactive Visual Gallery & Color Selector */}
          <div className="hp-visual-card">
            <div className="hp-visual-glow" />
            
            <div className="hp-art-wrap">
              <img
                src={assetPath(activeImage)}
                alt={`AWATRUE HK05 Kids Headphones - ${selectedVariant.name}`}
                className="hp-art-img"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="hp-gallery-thumbs">
              {GALLERY_THUMBNAILS.map((thumb) => (
                <button
                  key={thumb.id}
                  className={`hp-thumb-btn ${activeImage === thumb.image ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(thumb)}
                  title={thumb.label}
                  aria-label={thumb.label}
                >
                  <img src={assetPath(thumb.image)} alt={thumb.label} />
                </button>
              ))}
            </div>

            {/* Color Variant Pills */}
            <div className="hp-variants-wrap">
              <span className="hp-variants-label">Choose Land Colorway (6 Editions):</span>
              <div className="hp-variants">
                {COLOR_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    className={`hp-color-pill ${selectedVariant.id === v.id ? 'active' : ''}`}
                    onClick={() => handleVariantSelect(v)}
                  >
                    <span className="hp-dot" style={{ backgroundColor: v.color }} />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#786454', fontStyle: 'italic', margin: 0 }}>
              Active Edition: <strong>{selectedVariant.name}</strong> ({selectedVariant.land} Land Collection)
            </p>
          </div>

          {/* Right: Product Details & Buying Controls */}
          <div>
            <div className="hp-details-topbar">
              <div className="hp-badge-row">
                <span className="hp-badge hp-badge--safety">🛡️ 74/85dB Safe Dual Limit</span>
                <span className="hp-badge hp-badge--tiktok">🎵 TikTok Shop Official</span>
                <span className="hp-badge hp-badge--certified">★ 4.8 / 5.0 (Pediatric Certified)</span>
              </div>
              <div className="hp-corner-logo-wrap">
                <img
                  src={assetPath('/assets/soe-official-logo.webp')}
                  alt="The Sound of Essentials Logo"
                  className="hp-corner-logo"
                />
              </div>
            </div>

            <h1 className="hp-title">
              <span className="hp-title-highlight">"Just Add Headphones"</span>
              <span className="hp-title-lead"> to The Sound of Essentials musical learning experience to elevate the adventure for our young learners.</span>
            </h1>

            <p className="hp-subtitle">
              The <strong>AWATRUE HK05 Kids Headphones</strong> with <strong>"Safe Sound, Pure Discovery."</strong> are engineered specifically for young ears. Features dual <strong>74dB / 85dB safe volume limiting</strong>, powerful <strong>40mm dynamic stereo drivers</strong>, zero-radiation 3.5mm wired acoustics, breathable protein-leather ear pillows, and a 1.5m tangle-free braided cord. Tested and certified for school, travel, and sensory-friendly learning.
            </p>

            <div className="hp-pricing-box">
              <div className="hp-price-row">
                <span className="hp-price-current">$24.99</span>
                <span className="hp-price-compare">$34.99</span>
                <span className="hp-price-savings">SAVE 30%</span>
              </div>

              <div className="hp-shipping-note">
                <span>📦</span> Free Fast Standard Shipping (US &amp; Canada) &bull; 90-Day Free Returns
              </div>

              <div className="hp-cta-group">
                <a
                  href={`${STRIPE_HEADPHONES_URL}${STRIPE_HEADPHONES_URL.includes('?') ? '&' : '?'}client_reference_id=${encodeURIComponent(`AWATRUE-HK05-${selectedVariant.id}`)}`}
                  className="btn-stripe-pay"
                  onClick={() => handleCheckoutClick(`AWATRUE-HK05-${selectedVariant.id}`, `AWATRUE HK05 Kids Headphones (${selectedVariant.name})`, 24.99)}
                >
                  <span>⚡ Order with Stripe Checkout</span>
                  <span style={{ opacity: 0.9, fontSize: '0.95rem' }}>($24.99)</span>
                </a>

                <a
                  href={TIKTOK_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tiktok-shop"
                >
                  <span className="tiktok-icon">🎵</span>
                  <span>Buy on TikTok Shop</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.75, marginLeft: 'auto' }}>@soe.learn ↗</span>
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#5C4A3A', fontSize: '0.9rem' }}>
              <div>✔ 74/85dB Dual Safe Limiter</div>
              <div>✔ Universal 3.5mm Gold-Plated Jack</div>
              <div>✔ 100% EMF-Free (Zero Batteries)</div>
              <div>✔ 1.5m Tangle-Free Braided Cord</div>
            </div>

            {/* Quality & Pediatric Standards Box */}
            <div className="hp-sourcing-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary, #E65100)' }}>Certified SafeAudio Standards</strong>
                <span className="hp-rating-tag">4.8★ Verified</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                Authentic model: <strong>AWATRUE HK05</strong>. Tested and certified with CE, RoHS, and CPC pediatric standards for safe daily listening.
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                <a
                  href={USER_MANUAL_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
                >
                  Download User Manual &amp; Safety Spec (PDF) 📄
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 Core Sensory Highlights ── */}
        <section className="hp-grid-section">
          <h2 className="hp-section-title">Built for Early Learners, Not Screen Overload</h2>
          <p className="hp-section-subtitle">
            Why pediatric audiologists, educators, and conscious caregivers choose the AWATRUE HK05 
            volume-limited wired headphones for daily phonics immersion and music discovery.
          </p>

          <div className="hp-features-grid">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="hp-feature-card">
                <div className="hp-feature-icon">{feat.icon}</div>
                <h3 className="hp-feature-title">{feat.title}</h3>
                <p className="hp-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Technical Specifications Table ── */}
        <section className="hp-specs-section">
          <h2 className="hp-section-title">Technical Specifications</h2>
          <p className="hp-section-subtitle">
            Engineered to meet the World Health Organization (WHO) and American Academy of Pediatrics safety standards.
          </p>

          <div className="hp-specs-table-wrap">
            <table className="hp-specs-table">
              <tbody>
                {SPECS.map((spec, i) => (
                  <tr key={i}>
                    <td className="hp-spec-key">{spec.label}</td>
                    <td className="hp-spec-val">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Complete Curriculum Bundle Callout ── */}
        <section className="hp-bundle-banner">
          <div>
            <span className="hp-bundle-badge">🌟 Best Value Starter Pack</span>
            <h2 className="hp-bundle-title">Sensory Listening &amp; 8-Week Readiness Bundle</h2>
            <p className="hp-bundle-desc">
              Everything your child needs for a complete screen-free learning revolution:
              Get the <strong>AWATRUE HK05 Safe Kids Headphones</strong> shipped to your door, 
              paired with the full-color physical <strong>Rhythm Ready 8-Week Workbook</strong> 
              (~400 activities across all 7 Lands) and instant album access.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: '#5C4A3A', lineHeight: 1.8 }}>
              <li>✔ AWATRUE HK05 74/85dB Safe Sensory Headphones ($34.99 value)</li>
              <li>✔ Physical 8-Week Rhythm Ready Workbook ($45.00 value)</li>
              <li>✔ 1.5m Tangle-Free Braided Audio Cable</li>
              <li>✔ Free 19-Track Album Streaming &amp; Printable Activities</li>
            </ul>
          </div>

          <div className="hp-bundle-card">
            <span style={{ fontSize: '0.9rem', color: '#786454', textTransform: 'uppercase', fontWeight: 700 }}>Bundle Deal</span>
            <div style={{ margin: '0.75rem 0' }}>
              <span className="hp-bundle-price">$39</span>
              <span className="hp-bundle-retail">$79.99</span>
            </div>
            <p style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Save $30.99 + Free Shipping
            </p>
            <a
              href={`${STRIPE_BUNDLE_URL}${STRIPE_BUNDLE_URL.includes('?') ? '&' : '?'}client_reference_id=${encodeURIComponent(`SOE-BUNDLE-${selectedVariant.id}`)}`}
              className="btn-stripe-pay"
              style={{ width: '100%' }}
              onClick={() => handleCheckoutClick(`SOE-HP-WB-BUNDLE-${selectedVariant.id}`, `Headphones + Workbook Bundle (${selectedVariant.name})`, 39.00)}
            >
              Get The Bundle · $39 →
            </a>
          </div>
        </section>

        {/* ── Creator Sample Program for TikTok Shop Affiliates ── */}
        <section className="hp-creator-box">
          <div className="hp-creator-text">
            <h3>Are you a TikTok Creator or Homeschool Parent?</h3>
            <p>
              Join the Sound of Essentials TikTok Shop Affiliate program! We ship complimentary 
              AWATRUE HK05 headphone sample kits to parenting, homeschool, and early childhood creators. 
              Earn up to 20% commission on every verified sale.
            </p>
          </div>
          <div>
            <Link to="/join#contact" className="btn-creator-sample">
              <span>Request Free Creator Sample</span>
              <span>↗</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeadphonesSale;
