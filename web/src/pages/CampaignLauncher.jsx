import React, { useState, useEffect } from 'react';
import './CampaignLauncher.css';

const API_BASE = 'http://localhost:8000';

const ENGINES = [
  {
    id: 'ENGINE_A_VALUE_GATE',
    name: 'Engine A: /listen Free Album Gate',
    desc: '3-4% CTR list builder. Delivers 19 tracks free + $7 card-vaulting bump.',
    badge: '70% Budget',
  },
  {
    id: 'ENGINE_B_DIRECT_OFFER',
    name: 'Engine B: /shop Direct Tactile Showcase',
    desc: 'Instant front-end cash flow. $35 Workbook + $55 Picture Dictionary.',
    badge: '20% Budget',
  },
  {
    id: 'ENGINE_C_RETARGETING',
    name: 'Engine C: Advantage+ Retargeting Bridge',
    desc: 'Sweeps listeners across the 14-to-90-day multi-touch trust horizon.',
    badge: '10% Budget',
  },
];

const DELTAS = [
  { id: 'SCREEN_VS_SENSORY', name: 'Screen vs. Sensory' },
  { id: 'ALGORITHM_VS_HANDCRAFTED', name: 'Algorithm vs. Handcrafted' },
  { id: 'TESTING_VS_ARTS', name: 'Testing vs. Arts' },
  { id: 'INSTITUTION_VS_SANCTUARY', name: 'Institution vs. Sanctuary' },
  { id: 'CONSUMPTION_VS_QUEST', name: 'Consumption vs. Quest' },
];

const CAMPAIGNS = [
  { id: 'THE_ENEMY', name: 'The Enemy (Cartoons & Brain Rot)' },
  { id: 'VICTORY_GARDEN', name: 'Victory Garden (Sanctuary Home)' },
  { id: 'WHAT_THEY_TOOK', name: 'What They Took (Acoustic Roots)' },
  { id: 'THE_ORIGIN_STORY', name: 'The Origin Story (Dad & Mom Craft)' },
  { id: 'THE_NAME_TELLS_YOU', name: 'The Name Tells You Everything' },
  { id: 'THE_OTHER_SIDE', name: 'The Other Side (Calm Living Room)' },
];

const ARCHETYPE_PREVIEWS = {
  SCREEN_VS_SENSORY: {
    layer_1: "You can see it in their eyes after 20 minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your home.",
    layer_2: "Built with a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 handcrafted songs, 4,232 illustrated words, and 400 tactile daily quests for ages 2–7.",
    layer_3: "Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no apps, no algorithms.",
    headline: "Stream the Free 19-Track Rhythm Quest Album",
  },
  ALGORITHM_VS_HANDCRAFTED: {
    layer_1: "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
    layer_2: "Give them something real to hold, sing, and master: an 8-week musical quest packed with rhythm blocks, sensory movement, and timeless vocabulary.",
    layer_3: "Start with the music. Claim the complete 19-song Rhythm Quest album free right now.",
    headline: "Handcrafted Music for Ages 2–7 (Free Album)",
  },
  TESTING_VS_ARTS: {
    layer_1: "Standardized testing is draining the joy and musical wonder out of preschool classrooms.",
    layer_2: "Restore natural acoustic rhythm: 19 tracks across 7 musical lands that wire phonics naturally.",
    layer_3: "Experience early childhood learning as an adventure. Stream the 19-track album free.",
    headline: "Restore Music to Early Learning (Free 19-Track Album)",
  },
};

const CampaignLauncher = () => {
  // Campaign Selection State
  const [selectedEngine, setSelectedEngine] = useState('ENGINE_A_VALUE_GATE');
  const [selectedDelta, setSelectedDelta] = useState('SCREEN_VS_SENSORY');
  const [selectedCampaign, setSelectedCampaign] = useState('THE_ENEMY');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [dailyBudget, setDailyBudget] = useState(20);

  // Meta Wiring & Connection State
  const [metaStatus, setMetaStatus] = useState({
    mode: 'SANDBOX_DRY_RUN',
    is_configured: false,
    ad_account_id: 'Not Connected (Sandbox Default)',
    page_id: 'Not Configured',
    pixel_id: 'Not Configured',
    token_preview: null,
  });
  const [showWiringDrawer, setShowWiringDrawer] = useState(false);
  const [wiringForm, setWiringForm] = useState({
    ad_account_id: '',
    access_token: '',
    page_id: '',
    pixel_id: '',
  });
  const [verifying, setVerifying] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState(null);

  // Execution & Live Output State
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchResponse, setLaunchResponse] = useState(null);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);

  // Fetch live Meta status on load
  useEffect(() => {
    fetchMetaStatus();
  }, []);

  const fetchMetaStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/meta/status`);
      if (res.ok) {
        const data = await res.json();
        setMetaStatus(data);
      }
    } catch (err) {
      console.warn('Backend not reachable:', err);
    }
  };

  const handleVerifyCredentials = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/meta/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wiringForm),
      });
      const data = await res.json();
      setVerifyFeedback(data);
      await fetchMetaStatus();
    } catch (err) {
      console.warn('Verify credentials error:', err);
      setVerifyFeedback({ verified: false, error: 'Could not reach FastAPI backend on port 8000.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchResponse(null);

    const payload = {
      campaign_key: selectedCampaign,
      delta_key: selectedDelta,
      daily_budget_cents: dailyBudget * 100,
      buyer_track: 'D2C',
      language: selectedLanguage,
      archetype_ids: ['ARC-01', 'ARC-02', 'ARC-03'],
      engine_type: selectedEngine,
    };

    try {
      const res = await fetch(`${API_BASE}/api/v1/campaigns/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setLaunchResponse(data);
      } else {
        setLaunchResponse({
          status: 'ERROR',
          message: `Backend returned HTTP ${res.status}`,
        });
      }
    } catch (err) {
      console.warn('Launch campaign error:', err);
      setLaunchResponse({
        status: 'CONNECTION_ERROR',
        message: 'Could not connect to FastAPI server at http://localhost:8000.',
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const currentPreview = ARCHETYPE_PREVIEWS[selectedDelta] || ARCHETYPE_PREVIEWS.SCREEN_VS_SENSORY;

  return (
    <div className="mcls-dashboard">
      <div className="mcls-container">
        <header className="mcls-header">
          <span className="mcls-badge">Proprietary Growth Engine</span>
          <h1 className="mcls-title">Market Campaign Launch System</h1>
          <p className="mcls-subtitle">
            Autonomous Meta ad deployment, dual-engine tandem funnels, and 90-day cohort attribution for <em>The Sound of Essentials</em>.
          </p>
        </header>

        {/* --- META CONNECTION & WIRING DECK --- */}
        <section className="mcls-connection-bar">
          <div className="mcls-conn-info">
            <span className={`mcls-conn-tag ${metaStatus.is_configured ? 'live' : 'sandbox'}`}>
              {metaStatus.is_configured ? '● LIVE META API CONNECTED' : '○ SANDBOX / SIMULATION MODE'}
            </span>
            <div className="mcls-conn-details">
              <strong>Ad Account:</strong> {metaStatus.ad_account_id} | <strong>Pixel:</strong> {metaStatus.pixel_id} | <strong>Graph API:</strong> v21.0
            </div>
          </div>
          <button
            type="button"
            className="mcls-btn-wire"
            onClick={() => setShowWiringDrawer(!showWiringDrawer)}
          >
            {showWiringDrawer ? '▲ Close Wiring Deck' : '⚙️ Connect Meta Account & Credentials'}
          </button>

          {/* Wiring Configuration Drawer */}
          {showWiringDrawer && (
            <div className="mcls-wiring-drawer">
              <h3 style={{ margin: '0 0 0.75rem', fontFamily: 'Fredoka, cursive', fontSize: '1.15rem' }}>
                🔗 Meta Marketing API Credentials & Handshake
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#6B5E51', margin: '0 0 1.25rem' }}>
                Enter your credentials below to wire this cockpit directly to your Meta Ads Manager.
                If left empty or in mock mode, the system runs safely in <strong>Sandbox Simulation Mode</strong>, generating real Graph API payloads with $0 ad spend.
              </p>

              <form onSubmit={handleVerifyCredentials}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="mcls-label">Meta Ad Account ID</label>
                    <input
                      type="text"
                      className="mcls-input"
                      placeholder="e.g. act_123456789012345"
                      value={wiringForm.ad_account_id}
                      onChange={(e) => setWiringForm({ ...wiringForm, ad_account_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mcls-label">Meta Pixel / Dataset ID</label>
                    <input
                      type="text"
                      className="mcls-input"
                      placeholder="e.g. 987654321098765"
                      value={wiringForm.pixel_id}
                      onChange={(e) => setWiringForm({ ...wiringForm, pixel_id: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="mcls-label">System User Access Token</label>
                    <input
                      type="password"
                      className="mcls-input"
                      placeholder="EAAB..."
                      value={wiringForm.access_token}
                      onChange={(e) => setWiringForm({ ...wiringForm, access_token: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mcls-label">Facebook Page ID</label>
                    <input
                      type="text"
                      className="mcls-input"
                      placeholder="e.g. 1122334455"
                      value={wiringForm.page_id}
                      onChange={(e) => setWiringForm({ ...wiringForm, page_id: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    type="submit"
                    className="mcls-btn-wire"
                    style={{ background: '#FF6F00', color: '#FFF', borderColor: '#FF6F00' }}
                    disabled={verifying}
                  >
                    {verifying ? 'Pinging Meta Graph API...' : '⚡ Test & Save Handshake'}
                  </button>
                  <span style={{ fontSize: '0.82rem', color: '#7A6D60' }}>
                    Validates token against <code>graph.facebook.com/v21.0</code>
                  </span>
                </div>
              </form>

              {verifyFeedback && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: verifyFeedback.verified ? 'rgba(76, 175, 80, 0.12)' : 'rgba(255, 152, 0, 0.12)',
                  border: `1.5px solid ${verifyFeedback.verified ? '#4CAF50' : '#FFA726'}`,
                  fontSize: '0.86rem',
                  color: verifyFeedback.verified ? '#1B5E20' : '#8C3D00'
                }}>
                  <strong>{verifyFeedback.verified ? '✅ Verified Live:' : 'ℹ️ Status Notice:'}</strong> {verifyFeedback.message || verifyFeedback.error}
                </div>
              )}
            </div>
          )}
        </section>

        {/* --- MAIN DISPATCHER GRID --- */}
        <div className="mcls-grid">
          {/* Left Column: Launcher Controls */}
          <div className="mcls-card">
            <h2 className="mcls-card-title">🚀 1-Click Meta Campaign Dispatcher</h2>

            {/* Engine Selector */}
            <div className="mcls-field-group">
              <label className="mcls-label">Select Tandem Funnel Engine</label>
              <div className="mcls-mode-selector">
                {ENGINES.map((engine) => (
                  <div
                    key={engine.id}
                    className={`mcls-mode-pill ${selectedEngine === engine.id ? 'active' : ''}`}
                    onClick={() => setSelectedEngine(engine.id)}
                  >
                    <div>
                      <div className="mcls-mode-pill-name">{engine.name}</div>
                      <div className="mcls-mode-pill-desc">{engine.desc}</div>
                    </div>
                    <span className="mcls-mode-pill-badge">{engine.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delta & Campaign */}
            <div className="mcls-field-group">
              <label className="mcls-label">Cultural Delta Alignment</label>
              <select
                className="mcls-select"
                value={selectedDelta}
                onChange={(e) => setSelectedDelta(e.target.value)}
              >
                {DELTAS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="mcls-field-group">
              <label className="mcls-label">Production Campaign Theme</label>
              <select
                className="mcls-select"
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
              >
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Language & Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="mcls-field-group">
                <label className="mcls-label">Language Pack</label>
                <select
                  className="mcls-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="en">English (US/Global)</option>
                  <option value="es">Spanish (LatAm/ES)</option>
                  <option value="fr">French (FR/CA)</option>
                </select>
              </div>

              <div className="mcls-field-group">
                <label className="mcls-label">Daily Budget ($USD)</label>
                <div className="mcls-range-wrapper">
                  <input
                    type="range"
                    min="15"
                    max="200"
                    step="5"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="mcls-range"
                  />
                  <span className="mcls-range-val">${dailyBudget}/d</span>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <button
              type="button"
              className="mcls-btn-launch"
              onClick={handleLaunch}
              disabled={isLaunching}
            >
              {isLaunching ? 'Communicating with FastAPI Engine...' : '⚡ Launch 3-Ad Testing Array via Meta API'}
            </button>

            {/* Response Display */}
            {launchResponse && (
              <div className={`mcls-result-box ${launchResponse.mode === 'LIVE_CONNECTED' ? '' : 'sandbox'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong>
                    {launchResponse.mode === 'LIVE_CONNECTED' ? '✅ Dispatched to Meta Ads Manager:' : 'ℹ️ Staged in Sandbox Simulation:'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(0,0,0,0.06)' }}>
                    {launchResponse.mode}
                  </span>
                </div>
                <div>{launchResponse.message}</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>
                  Target: <code>{launchResponse.ad_account_id}</code> | Ads Built: <code>3</code>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                  style={{
                    marginTop: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: '#FF6F00',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  {showPayloadInspector ? 'Hide Raw Graph API Payload ▲' : '👁️ Inspect Raw Meta Graph API Payload (v21.0 JSON) ▼'}
                </button>

                {showPayloadInspector && launchResponse.bundle && (
                  <pre className="mcls-json-pre">
                    {JSON.stringify(launchResponse.bundle, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Creative Preview & Telemetry */}
          <div>
            <div className="mcls-card" style={{ marginBottom: '1.5rem' }}>
              <h2 className="mcls-card-title">👁️ 3-Layer Ad Creative Preview</h2>
              <div className="mcls-preview-box">
                <div className="mcls-layer-item">
                  <div className="mcls-layer-tag">Layer 1: Parent Ache (Emotional Identity)</div>
                  <div className="mcls-layer-text">{currentPreview.layer_1}</div>
                </div>
                <div className="mcls-layer-item">
                  <div className="mcls-layer-tag">Layer 2: Musical/Tactile Solution</div>
                  <div className="mcls-layer-text">{currentPreview.layer_2}</div>
                </div>
                <div className="mcls-layer-item" style={{ marginBottom: 0 }}>
                  <div className="mcls-layer-tag">Layer 3: Zero-Risk Invitation</div>
                  <div className="mcls-layer-text">{currentPreview.layer_3}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7A6D60' }}>
                <strong>Headline:</strong> {currentPreview.headline}
                <br />
                <strong>Destination:</strong> {selectedEngine === 'ENGINE_B_DIRECT_OFFER' ? 'soelearn.com/shop/rhythm-quest-bundle' : 'soelearn.com/listen'}
              </div>
            </div>

            <div className="mcls-card">
              <h2 className="mcls-card-title">📊 Dual-Horizon Telemetry Cockpit</h2>
              <div className="mcls-stats-row">
                <div className="mcls-stat-box">
                  <div className="mcls-stat-num">$1.84</div>
                  <div className="mcls-stat-label">Engine A CPL (Target &le; $2.50)</div>
                </div>
                <div className="mcls-stat-box">
                  <div className="mcls-stat-num">38.2%</div>
                  <div className="mcls-stat-label">2-Step Opt-in Rate</div>
                </div>
                <div className="mcls-stat-box">
                  <div className="mcls-stat-num">18.4%</div>
                  <div className="mcls-stat-label">$7 Bump Vault Rate</div>
                </div>
                <div className="mcls-stat-box">
                  <div className="mcls-stat-num">3.4x</div>
                  <div className="mcls-stat-label">60-Day Cohort LTV</div>
                </div>
              </div>

              <div style={{
                background: '#FFF8F0',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #EADBCC',
                fontSize: '0.82rem',
                color: '#5A4E42'
              }}>
                🛡️ <strong>Rhythm Guardian Status:</strong> Active. 90-day cohort attribution ledger protected. Meta CAPI deduplication enabled with SHA-256 PII hashing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignLauncher;
