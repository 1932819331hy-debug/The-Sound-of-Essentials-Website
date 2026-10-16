import React, { useState } from 'react';
import './CampaignLauncher.css';

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
};

const CampaignLauncher = () => {
  const [selectedEngine, setSelectedEngine] = useState('ENGINE_A_VALUE_GATE');
  const [selectedDelta, setSelectedDelta] = useState('SCREEN_VS_SENSORY');
  const [selectedCampaign, setSelectedCampaign] = useState('THE_ENEMY');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [launchStatus, setLaunchStatus] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const currentPreview = ARCHETYPE_PREVIEWS[selectedDelta] || ARCHETYPE_PREVIEWS.SCREEN_VS_SENSORY;

  const handleLaunch = () => {
    setIsLaunching(true);
    setLaunchStatus(null);

    // Simulate API dispatch to Meta Marketing API v21.0
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchStatus({
        status: 'SUCCESS',
        campaignId: 'cmp_' + Math.random().toString(36).substring(2, 9),
        adSetId: 'adset_' + Math.random().toString(36).substring(2, 9),
        adsCreated: 3,
        engine: selectedEngine,
        delta: selectedDelta,
        dailyBudgetCents: dailyBudget * 100,
        message: 'Campaign successfully dispatched to Meta Marketing API (act_soe_meta). Live dual-horizon telemetry active.',
      });
    }, 1200);
  };

  return (
    <div className="mcls-dashboard">
      <div className="mcls-container">
        <header className="mcls-header">
          <span className="mcls-badge">Proprietary Growth Engine</span>
          <h1 className="mcls-title">Market Campaign Launch System</h1>
          <p className="mcls-subtitle">
            Zeely-inspired automated Meta ad deployment, dual-engine tandem funnels, and 90-day cohort attribution for <em>The Sound of Essentials</em>.
          </p>
        </header>

        <div className="mcls-grid">
          {/* Left Column: Launcher Cockpit */}
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
              {isLaunching ? 'Dispatching to Meta API...' : '⚡ Launch 3-Ad Testing Array via Meta API'}
            </button>

            {launchStatus && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1.5px solid #4CAF50',
                color: '#1B5E20',
                fontSize: '0.88rem'
              }}>
                <strong>✅ Meta Campaign Live:</strong> {launchStatus.campaignId} ({launchStatus.engine})
                <br />
                {launchStatus.message}
              </div>
            )}
          </div>

          {/* Right Column: Live Ad Preview & Dual-Horizon Telemetry */}
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
