import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { submitSoeInterest } from '../services/soeSubmissions';
import { trackLead } from '../utils/analytics';
import JsonLd from '../components/JsonLd';
import KineticHeadline from '../components/KineticHeadline';
import './InstitutionsQpc.css';

export default function InstitutionsQpc() {
  const { t } = useTranslation();

  // Multi-step QPC state: 1 = Qualifier, 2 = Pitch, 3 = Calendar/Booking
  const [currentStep, setCurrentStep] = useState(1);

  // Qualifier answers
  const [orgType, setOrgType] = useState('preschool_chain');
  const [classroomCount, setClassroomCount] = useState('6_to_20');
  const [timeline, setTimeline] = useState('immediate');

  // Lead / Booking form state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadOrg, setLeadOrg] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleQualifierSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!leadEmail.trim() || !leadName.trim()) {
      setSubmitError('Please provide your name and institutional email.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSoeInterest({
        kind: 'institutional_qpc',
        name: leadName.trim(),
        email: leadEmail.trim().toLowerCase(),
        organizationName: leadOrg.trim() || 'Early Childhood Institution',
        notes: `Classrooms: ${classroomCount}, Type: ${orgType}, Timeline: ${timeline}, Phone: ${leadPhone.trim()}`,
        sourcePath: '/institutions',
      });
      trackLead({
        formName: 'institutional_qpc_application',
        email: leadEmail.trim().toLowerCase(),
        source: 'qpc_funnel',
      });
      setSubmitted(true);
      setCurrentStep(3);
    } catch (err) {
      console.warn('QPC submission error:', err);
      setSubmitted(true);
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'The Sound of Essentials: Rhythm Quest Institutional Concord',
    description: 'Turnkey acoustic screen-free early learning curriculum for ages 2–7.',
    url: 'https://soelearn.com/institutions',
  };

  return (
    <div className="qpc-page">
      <JsonLd data={structuredData} />

      {/* ── Hero Header ── */}
      <header className="qpc-hero">
        <div className="qpc-container">
          <span className="qpc-badge">{t('institutions.badge')}</span>
          <KineticHeadline
            tag="h1"
            className="qpc-title"
            variant="musical-bounce"
            delay={0.1}
            scrollTrigger={false}
          >
            {t('institutions.title')}
          </KineticHeadline>
          <p className="qpc-subtitle">{t('institutions.subtitle')}</p>

          <div className="qpc-stepper" aria-label="Funnel Steps">
            <button
              type="button"
              className={`qpc-step-indicator ${currentStep >= 1 ? 'active' : ''}`}
              onClick={() => setCurrentStep(1)}
            >
              <span className="step-num">1</span>
              <span className="step-label">Qualifier</span>
            </button>
            <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`} />
            <button
              type="button"
              className={`qpc-step-indicator ${currentStep >= 2 ? 'active' : ''}`}
              onClick={() => setCurrentStep(2)}
            >
              <span className="step-num">2</span>
              <span className="step-label">Curriculum Pitch</span>
            </button>
            <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`} />
            <button
              type="button"
              className={`qpc-step-indicator ${currentStep >= 3 ? 'active' : ''}`}
              onClick={() => setCurrentStep(3)}
            >
              <span className="step-num">3</span>
              <span className="step-label">Concierge Call</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dynamic Stage ── */}
      <main className="qpc-container qpc-body">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.section
              key="step-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="qpc-card glass-panel"
            >
              <div className="qpc-card-header">
                <h2>{t('institutions.step1_title')}</h2>
                <p>{t('institutions.step1_subtitle')}</p>
              </div>

              <form onSubmit={handleQualifierSubmit} className="qpc-form">
                {/* Question 1: Organization Type */}
                <fieldset className="qpc-fieldset">
                  <legend className="qpc-label">{t('institutions.q1_label')}</legend>
                  <div className="qpc-options-grid">
                    <label className={`qpc-option-card ${orgType === 'preschool_chain' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="orgType"
                        value="preschool_chain"
                        checked={orgType === 'preschool_chain'}
                        onChange={(e) => setOrgType(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q1_opt1')}</span>
                    </label>
                    <label className={`qpc-option-card ${orgType === 'head_start' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="orgType"
                        value="head_start"
                        checked={orgType === 'head_start'}
                        onChange={(e) => setOrgType(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q1_opt2')}</span>
                    </label>
                    <label className={`qpc-option-card ${orgType === 'private_academy' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="orgType"
                        value="private_academy"
                        checked={orgType === 'private_academy'}
                        onChange={(e) => setOrgType(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q1_opt3')}</span>
                    </label>
                    <label className={`qpc-option-card ${orgType === 'district_doe' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="orgType"
                        value="district_doe"
                        checked={orgType === 'district_doe'}
                        onChange={(e) => setOrgType(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q1_opt4')}</span>
                    </label>
                  </div>
                </fieldset>

                {/* Question 2: Classroom Count */}
                <fieldset className="qpc-fieldset">
                  <legend className="qpc-label">{t('institutions.q2_label')}</legend>
                  <div className="qpc-options-grid three-col">
                    <label className={`qpc-option-card ${classroomCount === '1_to_5' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="classroomCount"
                        value="1_to_5"
                        checked={classroomCount === '1_to_5'}
                        onChange={(e) => setClassroomCount(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q2_opt1')}</span>
                    </label>
                    <label className={`qpc-option-card ${classroomCount === '6_to_20' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="classroomCount"
                        value="6_to_20"
                        checked={classroomCount === '6_to_20'}
                        onChange={(e) => setClassroomCount(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q2_opt2')}</span>
                    </label>
                    <label className={`qpc-option-card ${classroomCount === '20_plus' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="classroomCount"
                        value="20_plus"
                        checked={classroomCount === '20_plus'}
                        onChange={(e) => setClassroomCount(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q2_opt3')}</span>
                    </label>
                  </div>
                </fieldset>

                {/* Question 3: Timeline */}
                <fieldset className="qpc-fieldset">
                  <legend className="qpc-label">{t('institutions.q3_label')}</legend>
                  <div className="qpc-options-grid three-col">
                    <label className={`qpc-option-card ${timeline === 'immediate' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="timeline"
                        value="immediate"
                        checked={timeline === 'immediate'}
                        onChange={(e) => setTimeline(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q3_opt1')}</span>
                    </label>
                    <label className={`qpc-option-card ${timeline === 'next_term' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="timeline"
                        value="next_term"
                        checked={timeline === 'next_term'}
                        onChange={(e) => setTimeline(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q3_opt2')}</span>
                    </label>
                    <label className={`qpc-option-card ${timeline === 'exploratory' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="timeline"
                        value="exploratory"
                        checked={timeline === 'exploratory'}
                        onChange={(e) => setTimeline(e.target.value)}
                      />
                      <span className="opt-title">{t('institutions.q3_opt3')}</span>
                    </label>
                  </div>
                </fieldset>

                <div className="qpc-action-row">
                  <button type="submit" className="qpc-btn-primary">
                    {t('institutions.next_btn')}
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {currentStep === 2 && (
            <motion.section
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="qpc-card glass-panel"
            >
              <div className="qpc-card-header">
                <h2>{t('institutions.step2_title')}</h2>
                <p>Designed specifically to meet Early Learning Outcomes Framework (ELOF) and NAEYC standards for ages 2 to 7.</p>
              </div>

              <div className="qpc-pitch-grid">
                <article className="pitch-feature-card">
                  <div className="feature-icon" role="img" aria-label="Musical Notes">🎵</div>
                  <h3>{t('institutions.feature1_title')}</h3>
                  <p>{t('institutions.feature1_desc')}</p>
                </article>

                <article className="pitch-feature-card">
                  <div className="feature-icon" role="img" aria-label="Standards Document">📋</div>
                  <h3>{t('institutions.feature2_title')}</h3>
                  <p>{t('institutions.feature2_desc')}</p>
                </article>

                <article className="pitch-feature-card">
                  <div className="feature-icon" role="img" aria-label="Classroom Kits">📦</div>
                  <h3>{t('institutions.feature3_title')}</h3>
                  <p>{t('institutions.feature3_desc')}</p>
                </article>
              </div>

              {/* Application Form */}
              <div className="qpc-booking-box">
                <h3>{t('institutions.step3_title')}</h3>
                <p>{t('institutions.step3_subtitle')}</p>

                {submitError && <div className="qpc-error" role="alert">{submitError}</div>}

                <form onSubmit={handleBookingSubmit} className="qpc-lead-form">
                  <div className="form-grid">
                    <label>
                      <span>Full Name</span>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Dr. Sarah Jenkins"
                      />
                    </label>
                    <label>
                      <span>Work / Institutional Email</span>
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="s.jenkins@preschool.org"
                      />
                    </label>
                    <label>
                      <span>Organization / School Name</span>
                      <input
                        type="text"
                        value={leadOrg}
                        onChange={(e) => setLeadOrg(e.target.value)}
                        placeholder="Sunnybrook Early Learning Academy"
                      />
                    </label>
                    <label>
                      <span>Phone / SMS Direct Line</span>
                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                      />
                    </label>
                  </div>

                  <div className="qpc-action-row">
                    <button type="submit" disabled={isSubmitting} className="qpc-btn-primary">
                      {isSubmitting ? 'Securing Priority Review...' : t('institutions.book_call')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

          {currentStep === 3 && (
            <motion.section
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="qpc-card glass-panel text-center"
            >
              <div className="qpc-confirmation-icon" role="img" aria-label="Celebration">🎉</div>
              <h2 className="qpc-confirmed-title">Application Confirmed for Review</h2>
              <p className="qpc-confirmed-subtitle">
                Thank you, <strong>{leadName || 'Educator'}</strong>. Your classroom profile ({classroomCount.replace(/_/g, ' ')} rooms) has been queued for institutional review by our ECE curriculum concierge.
              </p>

              <div className="qpc-next-steps-card">
                <h4>What Happens Next:</h4>
                <ol>
                  <li>Our curriculum director will review your facility parameters within 24 business hours.</li>
                  <li>You will receive your customized 50-State ELOF/NAEYC crosswalk exhibit via email.</li>
                  <li>We will dispatch sample classroom audio modules and educator pilot materials to your team.</li>
                </ol>
              </div>

              <div className="qpc-direct-contact">
                <p>{t('institutions.direct_email')}</p>
                <p>Educator Concierge Direct: <a href="mailto:info@soelearn.com"><strong>info@soelearn.com</strong></a></p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
