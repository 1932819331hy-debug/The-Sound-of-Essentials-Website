import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import './ConcordRoiCalculator.css';

export default function ConcordRoiCalculator({ initialMode = 'school' }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode); // 'school' | 'family'
  const [units, setUnits] = useState(mode === 'school' ? 4 : 2); // classrooms or children
  const [referrals, setReferrals] = useState(3); // fellow schools or families referred

  const unitsSliderId = useId();
  const referralsSliderId = useId();

  // Mode calculations
  const isSchool = mode === 'school';

  // Benchmark metrics
  // Commercial app average: $4,500 / classroom / yr or $240 / child / yr
  // SOE tactile & music curriculum: $1,200 / classroom / yr or $75 / child one-time prep
  const commercialAnnualCost = isSchool ? units * 4500 : units * 240;
  const soeAnnualCost = isSchool ? units * 1200 : units * 75;
  const netSavings = Math.max(0, commercialAnnualCost - soeAnnualCost);

  // "Share the Sound" Ambassador Referral Bounty (30% - 35%)
  // Average referral cart size: $1,200 (school) or $120 (family bundle)
  const avgReferralVolume = isSchool ? referrals * 1200 : referrals * 120;
  const referralBountyRate = 0.35; // 35% bounty
  const annualBountyEarnings = Math.round(avgReferralVolume * referralBountyRate);

  // Concord 25% Master Catalog Royalty Pool contribution / value
  // Illustrates community reinvestment back to educators & acoustic storytellers
  const catalogPoolShare = Math.round(soeAnnualCost * 0.25);

  return (
    <div className="concord-roi-calculator" aria-label="Concord Curriculum ROI Calculator">
      <div className="roi-header">
        <div className="roi-pill-tag">
          <span className="pulse-disc" />
          <span>{t('roi.pill', 'The Concord Financial Model • 4-Pillar Efficiency')}</span>
        </div>
        <h3>{t('roi.heading', 'Early Learning Impact & ROI Calculator')}</h3>
        <p>
          {t(
            'roi.subheading',
            'Compare the cost of screen-heavy digital subscriptions against our turnkey, acoustic-powered physical curriculum for ages 2–7.'
          )}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="roi-mode-switcher" role="tablist" aria-label="Select institution type">
        <button
          type="button"
          role="tab"
          aria-selected={isSchool}
          className={`roi-mode-btn ${isSchool ? 'active' : ''}`}
          onClick={() => {
            setMode('school');
            setUnits(4);
          }}
        >
          🏫 {t('roi.mode_school', 'Preschool / Daycare Center')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isSchool}
          className={`roi-mode-btn ${!isSchool ? 'active' : ''}`}
          onClick={() => {
            setMode('family');
            setUnits(2);
          }}
        >
          🏡 {t('roi.mode_family', 'Homeschool Pod / Family')}
        </button>
      </div>

      {/* Interactive Controls */}
      <div className="roi-controls">
        <div className="roi-control-group">
          <div className="roi-control-label">
            <label htmlFor={unitsSliderId}>
              {isSchool ? t('roi.classrooms_label', 'Active Classrooms (Ages 2–7)') : t('roi.children_label', 'Children (Ages 2–7)')}
            </label>
            <span className="roi-badge-val">
              {units} {isSchool ? (units === 1 ? 'Room' : 'Rooms') : (units === 1 ? 'Child' : 'Children')}
            </span>
          </div>
          <input
            id={unitsSliderId}
            type="range"
            min={1}
            max={isSchool ? 30 : 8}
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            className="roi-slider"
          />
          <span className="roi-slider-hint">
            {isSchool
              ? t('roi.classrooms_hint', 'Typical center: 3–8 classrooms')
              : t('roi.children_hint', 'Average homeschool pod: 2–5 children')}
          </span>
        </div>

        <div className="roi-control-group">
          <div className="roi-control-label">
            <label htmlFor={referralsSliderId}>
              {t('roi.referrals_label', 'Community Referrals ("Share the Sound")')}
            </label>
            <span className="roi-badge-val">{referrals} {t('roi.partners', 'Partners')}</span>
          </div>
          <input
            id={referralsSliderId}
            type="range"
            min={0}
            max={isSchool ? 20 : 15}
            value={referrals}
            onChange={(e) => setReferrals(Number(e.target.value))}
            className="roi-slider"
          />
          <span className="roi-slider-hint">
            {t('roi.referrals_hint', 'Fellow educators or families invited to the curriculum')}
          </span>
        </div>
      </div>

      {/* Three Core Metric Cards */}
      <div className="roi-metrics-grid">
        <div className="roi-metric-card savings">
          <div className="roi-metric-icon">💰</div>
          <div className="roi-metric-label">{t('roi.metric_savings_label', 'Direct Annual Savings')}</div>
          <div className="roi-metric-value">${netSavings.toLocaleString()}</div>
          <div className="roi-metric-subtext">
            {t('roi.metric_savings_sub', 'vs. recurring commercial digital app subscriptions')}
          </div>
        </div>

        <div className="roi-metric-card bounty">
          <div className="roi-metric-icon">🤝</div>
          <div className="roi-metric-label">{t('roi.metric_bounty_label', 'Share the Sound Bounty')}</div>
          <div className="roi-metric-value">${annualBountyEarnings.toLocaleString()}</div>
          <div className="roi-metric-subtext">
            {t('roi.metric_bounty_sub', '35% automated partner distribution directly to your program')}
          </div>
        </div>

        <div className="roi-metric-card pool">
          <div className="roi-metric-icon">🏛️</div>
          <div className="roi-metric-label">{t('roi.metric_pool_label', 'Concord Community Pool')}</div>
          <div className="roi-metric-value">${catalogPoolShare.toLocaleString()}</div>
          <div className="roi-metric-subtext">
            {t('roi.metric_pool_sub', '25% of catalog revenue reinvested into acoustic artist & educator grants')}
          </div>
        </div>
      </div>

      {/* Financial Leverage Formula Explainer */}
      <div className="roi-formula-banner">
        <div className="roi-formula-icon">💡</div>
        <div className="roi-formula-text">
          <h4>{t('roi.formula_title', 'Sovereign Capital Efficiency (The 4-Pillar Formula)')}</h4>
          <p>
            {t(
              'roi.formula_body',
              'Instead of renting digital screen-time that depletes attention, SOE empowers you to invest once into tangible acoustic workbooks, picture dictionaries, and 432Hz calming music. With automated 35% "Share the Sound" bounties and 100% eligibility for Title I, Head Start ELOF, and State ESA funding, your program becomes a self-funding learning sanctuary.'
            )}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="roi-footer-actions">
        <div className="roi-disclaimer">
          {t('roi.disclaimer', '*Estimates based on national early learning benchmarks. 100% compliant with NAEYC and ELOF standards for ages 2–7.')}
        </div>
        <a href="/solutions" className="roi-cta-btn">
          {t('roi.cta_btn', 'Explore Institutional Solutions →')}
        </a>
      </div>
    </div>
  );
}
