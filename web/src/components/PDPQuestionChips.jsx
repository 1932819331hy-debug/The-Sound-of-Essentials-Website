import React, { useState } from 'react';
import './PDPQuestionChips.css';

/**
 * Pre-configured canonical question sets addressing the top 3 pre-purchase
 * objections on key SOE offer pages (Kinect AI Native Adaptation).
 */
export const PRESET_CHIPS = {
  workbook: [
    {
      id: 'age',
      icon: '🌱',
      question: 'Is this suitable for a 3-year-old?',
      answer:
        'Yes! The Rhythm Ready Workbook is engineered specifically for Ages 2–7 (Toddler to Grade 2). Lessons are structured in ten 3-minute gentle daily subject blocks (~30 minutes total), allowing 2- and 3-year-olds to thrive at their own developmental pace.',
      badge: 'Ages 2–7 Verified',
    },
    {
      id: 'screens',
      icon: '📵',
      question: 'Is this 100% screen-free?',
      answer:
        'Completely screen-free. The entire curriculum uses physical tactile activities, acoustic listening, coloring, tracing, and somatic rhythm games. Zero blue light, zero app subscriptions, and zero dopamine loops.',
      badge: '100% Tactile & Screen-Free',
    },
    {
      id: 'format',
      icon: '📦',
      question: 'Digital Download vs. Print Book?',
      answer:
        'Digital ($21) gives instant printable PDF and EPUB access to all 40 days immediately. Print ($45 with Free US Shipping) delivers the premium 454-page physical spiral-bound workbook printed on durable 60# paper directly to your doorstep.',
      badge: 'Dual Format Flexibility',
    },
  ],
  listen: [
    {
      id: 'offline',
      icon: '📻',
      question: 'How do I play music without screens?',
      answer:
        'Once unlocked, all 19 tracks can be downloaded as MP3s directly to your phone, Bluetooth speaker, Yoto player, Toniebox, or home sound system so your child listens with zero screen exposure.',
      badge: 'Screen-Free Audio',
    },
    {
      id: 'free',
      icon: '🎵',
      question: 'Are all 19 tracks really free?',
      answer:
        'Yes! All 19 tracks spanning all 7 Lands are 100% free with instant access. The optional $7 Quest Starter Pack adds physical printable Land Maps, daily rhythm dials, and Seriphia’s 432Hz sleep track.',
      badge: 'No Subscription Required',
    },
    {
      id: 'calm',
      icon: '🤍',
      question: 'Will this overstimulate my child?',
      answer:
        'Never. Unlike high-BPM cartoon soundtracks, every track is composed with gentle 90–110 BPM resting tempos and organic acoustic warmth to promote calm nervous system regulation.',
      badge: 'Low-Stimulation Certified',
    },
  ],
  dictionary: [
    {
      id: 'words',
      icon: '📖',
      question: 'How many words are included?',
      answer:
        'The Essential Picture Dictionary includes 4,232 essential vocabulary words organized across 157 vibrant illustrated scenes and all 7 developmental Lands.',
      badge: '4,232 Words · 157 Scenes',
    },
    {
      id: 'rhythm',
      icon: '✨',
      question: 'Is it phonics & rhythm synchronized?',
      answer:
        'Every scene and vocabulary category is rhythmically synchronized with the 19-track album, turning vocabulary acquisition into natural melodic recall.',
      badge: 'Acoustic Sound-Before-Symbol',
    },
    {
      id: 'format-dict',
      icon: '📦',
      question: 'When and how will this be delivered?',
      answer:
        'This is an exclusive Pre-Sale reservation ($55 vs $79 retail). Your digital EPUB 3 edition and companion printable materials will be delivered to your email upon official publication release.',
      badge: 'Pre-Sale Reservation · Delivered Upon Release',
    },
  ],
};

const PDPQuestionChips = ({ preset = 'workbook', customItems = null, label = 'Have questions before ordering?' }) => {
  const items = customItems || PRESET_CHIPS[preset] || PRESET_CHIPS.workbook;
  const [activeId, setActiveId] = useState(null);

  const handleChipClick = (item) => {
    setActiveId((prev) => (prev === item.id ? null : item.id));
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'pdp_question_chip_click', { question_id: item.id, preset });
    }
  };

  const activeItem = items.find((it) => it.id === activeId);

  return (
    <div className="pdp-chips-container" aria-label="Pre-Purchase Questions">
      {label && <span className="pdp-chips-label">{label}</span>}

      <div className="pdp-chips-row" role="tablist">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`pdp-chip-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleChipClick(item)}
            >
              <span className="pdp-chip-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.question}</span>
            </button>
          );
        })}
      </div>

      {activeItem && (
        <div className="pdp-chip-answer-card" role="tabpanel">
          <div className="pdp-chip-answer-header">
            <h4 className="pdp-chip-answer-question">
              {activeItem.icon} {activeItem.question}
            </h4>
            <button
              type="button"
              className="pdp-chip-close-btn"
              onClick={() => setActiveId(null)}
              aria-label="Close answer"
            >
              ✕
            </button>
          </div>
          <p className="pdp-chip-answer-body">{activeItem.answer}</p>
          {activeItem.badge && <span className="pdp-chip-badge">✓ {activeItem.badge}</span>}
        </div>
      )}
    </div>
  );
};

export default PDPQuestionChips;
