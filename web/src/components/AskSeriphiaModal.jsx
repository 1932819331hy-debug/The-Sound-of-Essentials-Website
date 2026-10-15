import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { useTranslation } from 'react-i18next';
import ConcordRoiCalculator from './ConcordRoiCalculator';
import './AskSeriphiaModal.css';

// Canonical 7 Lands mapped to Hero Mentors & Curricular Focus (Strictly Ages 2–7)
const LAND_LESSON_DATABASE = {
  harmonia: {
    name: 'Harmonia',
    color: '#d4a843',
    heroes: 'Kenji & Aiko',
    domain: 'Language, Manners & Phonics',
    activities: {
      '2-3': {
        title: 'The Wooden Spoon Sound Clapper',
        objective: 'Distinguish between soft whispered vowels and loud clapping syllables.',
        materials: ['2 Wooden kitchen spoons', 'Soft blanket or cushion'],
        script:
          'Tap spoons gently on the cushion: "Tap, tap, quiet like a mouse." Then tap together in the air: "CLAP, CLAP, bold like the sun!" Ask the child to copy your volume pattern while pronouncing "Ah" and "Oh".',
        affirmation: '"My voice can be gentle like a whisper, and bright like morning light."',
      },
      '4-5': {
        title: 'Rhythm Word Steppers',
        objective: 'Count syllables in household words through physical footsteps.',
        materials: ['Masking tape or 3 paper plates on the floor', 'Everyday objects (apple, book, elephant)'],
        script:
          'Place plates in a line. Say a word together: "Ap-ple!" Step onto plate 1, then plate 2. Say: "How many steps did Kenji take? Two steps!" Try again with family names.',
        affirmation: '"Every word has a hidden beat waiting to be stepped on."',
      },
      '6-7': {
        title: 'Alliteration Drum Echo',
        objective: 'Identify starting consonant phonemes with call-and-response rhythm.',
        materials: ['Table surface or small drum', 'Rhyme cards'],
        script:
          'Caregiver taps: "Ta-ta-tum!" and says: "Kenji catches kind koalas!" Child echoes the rhythm on the table and names the starting sound: /k/! Repeat with letters M, S, and B.',
        affirmation: '"Sounds fit together like puzzle pieces when I listen to their music."',
      },
    },
  },
  numeria: {
    name: 'Numeria',
    color: '#7fb685',
    heroes: 'Kwame & Octavia',
    domain: 'Numbers, Counting & Geometric Patterns',
    activities: {
      '2-3': {
        title: 'The Three-Beat Bean Bag Toss',
        objective: 'Connect tactile counting (1, 2, 3) to motor rhythm.',
        materials: ['3 socks rolled into balls', '1 laundry basket'],
        script:
          'Hold socks together. Sing slowly: "One goes in... TWO goes in... THREE lands softly!" Celebrate with three finger snaps. Empty and repeat with rhythm.',
        affirmation: '"Numbers are friendly counters in my hands."',
      },
      '4-5': {
        title: 'Geometric Shape Walker',
        objective: 'Trace circle, triangle, and square shapes while stomping the sides.',
        materials: ['Chalk or yarn shaped into a triangle and square on the rug'],
        script:
          'Walk the triangle together. Stomp at each corner: "Side one, CORNER! Side two, CORNER! Side three, CORNER!" Count: "Three sides, three stomps, it is a triangle!"',
        affirmation: '"Shapes are paths where my feet make rhythm."',
      },
      '6-7': {
        title: 'Octavia’s Doubling Beat Hop',
        objective: 'Introduce skip counting and doubling through partner clapping.',
        materials: ['Hands and feet only'],
        script:
          'Clap hands: "Two!" (clap-clap). Double it: "Four!" (clap-clap-clap-clap). Hop forward four times. Next double: "Eight!" Hop eight times. Feel how doubling grows exponentially.',
        affirmation: '"Math is rhythm multiplied across the room."',
      },
    },
  },
  vitalis: {
    name: 'Vitalis',
    color: '#c4785a',
    heroes: 'Felix & Amara',
    domain: 'Gross Motor, Bilateral Balance & Breath Regulation',
    activities: {
      '2-3': {
        title: 'Blowing the Autumn Leaf',
        objective: 'Regulate deep lung capacity and diaphragmatic breath.',
        materials: ['1 small feather or scrap of tissue paper'],
        script:
          'Sit on the floor. Take a slow breath through the nose like smelling soup. On exhale, gently blow the tissue across the table to Felix: "Slow, calm breeze... see how far it glides!"',
        affirmation: '"My breath gives me calm energy whenever I need it."',
      },
      '4-5': {
        title: 'The 4-Beat Freeze Statue',
        objective: 'Develop executive function, impulse control, and motor freezing.',
        materials: ['Gentle shaker or wooden block'],
        script:
          'Shake 4 steady pulses: "Move, move, move... FREEZE on four!" Hold like a statue of Amara balancing on one foot for 3 full seconds. Release and laugh together.',
        affirmation: '"I am the master of my own balance."',
      },
      '6-7': {
        title: 'Cross-Crawl Rhythm March',
        objective: 'Reinforce bilateral brain hemisphere integration through cross-body touches.',
        materials: ['Floor space'],
        script:
          'March in place to 90 BPM. Bring left hand across to touch right knee on beat 1. Bring right hand across to touch left knee on beat 2. Count smoothly up to 20 cross-touches.',
        affirmation: '"When my arms and legs cross, my whole mind wakes up."',
      },
    },
  },
  luminosity: {
    name: 'Luminosity',
    color: '#d4897a',
    heroes: 'Athena & Ezra',
    domain: 'Advanced Language, Civics & Community Roles',
    activities: {
      '2-3': {
        title: 'The Helper’s Rhythm Song',
        objective: 'Associate community helpers with distinct tools and gestures.',
        materials: ['Picture of a doctor, builder, and teacher'],
        script:
          'Sing to the tune of heartbeat: "The builder goes tap-tap-tap (hammer fist). The baker goes stir-stir-stir (stir bowl). The friend says: How are you today?"',
        affirmation: '"I am a bright helper in my home."',
      },
      '4-5': {
        title: 'Athena’s Story Lantern',
        objective: 'Order narrative events: Beginning, Middle, and End.',
        materials: ['3 small toys or index cards'],
        script:
          'Place 3 items in a row. "First, the puppy woke up (beat 1). Next, the puppy found the ball (beat 2). At last, the puppy fell asleep (beat 3)." Have the child retell using the 3 rhythm taps.',
        affirmation: '"Every story has a path from start to finish."',
      },
      '6-7': {
        title: 'Civic Harmony Debate Game',
        objective: 'Practice taking turns speaking and listening without interrupting.',
        materials: ['A talking stone or wooden stick'],
        script:
          'Pass the stick. When holding the stick: 60 seconds to explain a favorite solution for cleaning up the classroom or park. When not holding the stick: silence and active listening.',
        affirmation: '"Listening with my ears is how I show respect with my heart."',
      },
    },
  },
  aquaria: {
    name: 'Aquaria',
    color: '#5ba4c9',
    heroes: 'Nerissa & Ronan',
    domain: 'Emotional Regulation, Water & Ocean Calm',
    activities: {
      '2-3': {
        title: 'Ocean Wave Hands',
        objective: 'Somatic grounding during big emotional overwhelm.',
        materials: ['A blue scarf or light cloth'],
        script:
          'Hold the cloth together. Breathe in: raise arms up like a swelling ocean crest. Breathe out: drop hands down softly: "Whoosh, the wave rests upon the sand." Repeat 4 times.',
        affirmation: '"My feelings are like waves. They rise, and then they settle calmly."',
      },
      '4-5': {
        title: 'Ronan’s Water Droplet Counting',
        objective: 'Focus attention through repetitive tactile sound observation.',
        materials: ['Bowl of water, eyedropper or wet finger'],
        script:
          'Drop single drops of water into the bowl: "Plink... plink... plink." Child counts each quiet splash with eyes closed. Helps reset overstimulated sensory channels.',
        affirmation: '"Still water shows a clear reflection."',
      },
      '6-7': {
        title: 'The Emotional Weather Compass',
        objective: 'Name internal somatic states using aquatic metaphors.',
        materials: ['Paper and 4 colored markers (Sunny, Rain, Storm, Tide)'],
        script:
          'Ask: "Is your internal water stormy or calm right now?" If stormy, Nerissa teaches us to rock side to side like a anchored boat until the tide smooths out.',
        affirmation: '"I can anchor my thoughts even when the winds are strong."',
      },
    },
  },
  terrasol: {
    name: 'Terrasol',
    color: '#5fb685',
    heroes: 'Vesta & Silas',
    domain: 'Nature, Sensory Botany & Earth Observation',
    activities: {
      '2-3': {
        title: 'Seed Pod Shaker Exploration',
        objective: 'Compare organic acoustic textures.',
        materials: ['2 dry plastic bottles: one with dry rice, one with dry beans'],
        script:
          'Shake rice: "Shhh, light summer rain." Shake beans: "Thump-thump, heavy acorn fall." Child guesses which is heavy and which is light with eyes covered.',
        affirmation: '"Nature makes the sweetest acoustic songs."',
      },
      '4-5': {
        title: 'Silas’s Root-to-Leaf Stretch',
        objective: 'Learn plant anatomy through whole-body vertical growth.',
        materials: ['Living plant or window view of a tree'],
        script:
          'Crouch small like a seed in soil: "Roots go deep down (tap floor)." Slowly stand: "Stem rises up to the sun." Spread fingers: "Leaves catch the light!" Take a big breath.',
        affirmation: '"I grow strong from my roots to the sky."',
      },
      '6-7': {
        title: 'The Backyard Soil Detective',
        objective: 'Observe soil textures and categorize living vs. non-living items.',
        materials: ['Small magnifying glass or spoon, paper egg carton'],
        script:
          'Collect 6 different natural items outside (leaf, pebble, twig, flower petal). Tap each onto a wooden surface. Sort by which makes the crispest sound.',
        affirmation: '"The earth is full of secrets waiting for gentle hands."',
      },
    },
  },
  celestia: {
    name: 'Celestia',
    color: '#9678c4',
    heroes: 'Elias & Selene',
    domain: 'Sky, Time, Cycles & Nighttime Calm',
    activities: {
      '2-3': {
        title: 'Nightfall Starlight Lullaby',
        objective: 'Bedtime transition using decreasing tempo.',
        materials: ['Dimmed lights or bedtime blanket'],
        script:
          'Sing or hum at 100 BPM: "Twinkle, shine, stars align." Gradually slow down tempo to 60 BPM over 2 minutes while stroking the child’s back in long, slow downward motions.',
        affirmation: '"The night is quiet, and I am safe and warm."',
      },
      '4-5': {
        title: 'The 4-Seasons Sun Clock',
        objective: 'Understand cyclical time and natural seasons.',
        materials: ['4 circular mats or colored papers (Green, Yellow, Orange, Blue)'],
        script:
          'Walk the circle of the year: "Spring awakens (stretch), Summer warms (skip), Autumn sheds (flutter), Winter rests (snuggle)." Connect each season to its rhythm.',
        affirmation: '"Time moves in beautiful circles that bring each gift back around."',
      },
      '6-7': {
        title: 'Constellation Dot Rhythm Map',
        objective: 'Count stars and draw geometric constellation lines to tempo.',
        materials: ['Black paper, white chalk or silver sticker dots'],
        script:
          'Place 7 star stickers randomly. Tap a steady pulse: on each beat, draw a straight line connecting star to star until a constellation bridge appears.',
        affirmation: '"I can see patterns in the night sky when I connect the dots."',
      },
    },
  },
};

export default function AskSeriphiaModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'metronome' | 'concord'

  // Tool 1 State: Lesson Extender
  const [selectedLand, setSelectedLand] = useState('harmonia');
  const [selectedAge, setSelectedAge] = useState('4-5');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Tool 2 State: Metronome
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const landSelectId = useId();
  const ageSelectId = useId();
  const bpmSliderId = useId();

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Play native Web Audio synthetic woodblock chime
  const playClick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);

      // Visual pulse trigger
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 90);
    } catch {
      // Audio playback failsafe
    }
  }, []);

  // Metronome loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      playClick();
      timerRef.current = setInterval(playClick, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, playClick]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentLandData = LAND_LESSON_DATABASE[selectedLand] || LAND_LESSON_DATABASE.harmonia;
  const currentActivity = currentLandData.activities[selectedAge] || currentLandData.activities['4-5'];

  const handleCopyLesson = () => {
    const textToCopy = `The Sound of Essentials — 10-Minute Tactile Lesson Card
Land: ${currentLandData.name} (${currentLandData.domain})
Hero Mentors: ${currentLandData.heroes}
Age Group: Ages ${selectedAge}
Title: ${currentActivity.title}
Objective: ${currentActivity.objective}
Everyday Materials: ${currentActivity.materials.join(', ')}
Caregiver Script: ${currentActivity.script}
Affirmation: ${currentActivity.affirmation}
https://thesoundofessentials.com`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <>
      {/* Persistent Floating Quick-Access Launcher */}
      <button
        type="button"
        className="seriphia-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open Seriphia Intelligent Curriculum Guide"
      >
        <img
          src="/assets/heroes/seriphia-selfie.webp"
          alt="Seriphia Guardian"
          className="seriphia-launcher__avatar"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{t('seriphia.launcher_text', 'Ask Seriphia')}</span>
        <span className="seriphia-launcher__sparkle" aria-hidden="true">
          ✨
        </span>
      </button>

      {/* Intelligent UI Modal */}
      {isOpen && (
        <div
          className="seriphia-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seriphia-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setIsPlaying(false);
            }
          }}
        >
          <div className="seriphia-modal-window" data-lenis-prevent>
            {/* Modal Header */}
            <div className="seriphia-modal-header">
              <div className="seriphia-header-left">
                <img
                  src="/assets/heroes/seriphia-selfie.webp"
                  alt="Seriphia"
                  className="seriphia-header-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="seriphia-header-titles">
                  <h3 id="seriphia-modal-title">{t('seriphia.title', 'Seriphia • Learning Concierge')}</h3>
                  <p>
                    <span className="status-dot" />
                    <span>{t('seriphia.subtitle', 'Ages 2–7 Tactile & Acoustic Learning Suite')}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="seriphia-close-btn"
                onClick={() => {
                  setIsOpen(false);
                  setIsPlaying(false);
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Generative Tool Navigation Tabs */}
            <div className="seriphia-tool-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'lesson'}
                className={`seriphia-tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
                onClick={() => setActiveTab('lesson')}
              >
                📝 {t('seriphia.tab_lesson', '10-Min Lesson Card')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'metronome'}
                className={`seriphia-tab-btn ${activeTab === 'metronome' ? 'active' : ''}`}
                onClick={() => setActiveTab('metronome')}
              >
                ⏱️ {t('seriphia.tab_metronome', 'Acoustic Metronome (90-110 BPM)')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'concord'}
                className={`seriphia-tab-btn ${activeTab === 'concord' ? 'active' : ''}`}
                onClick={() => setActiveTab('concord')}
              >
                💡 {t('seriphia.tab_concord', 'Concord ROI Calculator')}
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="seriphia-modal-body">
              {/* TAB 1: 10-Minute Tactile Lesson Card Generator */}
              {activeTab === 'lesson' && (
                <div className="seriphia-lesson-view">
                  <div className="lesson-extender-controls">
                    <div className="lesson-select-group">
                      <label htmlFor={landSelectId}>{t('seriphia.select_land', 'Select 7 Lands & Domain')}</label>
                      <select
                        id={landSelectId}
                        value={selectedLand}
                        onChange={(e) => setSelectedLand(e.target.value)}
                      >
                        <option value="harmonia">Harmonia (Language, Manners & Phonics)</option>
                        <option value="numeria">Numeria (Numbers, Counting & Shapes)</option>
                        <option value="vitalis">Vitalis (Physical Skills, Movement & Breath)</option>
                        <option value="luminosity">Luminosity (Advanced Language, Civics & Careers)</option>
                        <option value="aquaria">Aquaria (Water, Emotions & Regulation)</option>
                        <option value="terrasol">Terrasol (Earth, Nature & Science)</option>
                        <option value="celestia">Celestia (Sky, Time & Night Cycles)</option>
                      </select>
                    </div>

                    <div className="lesson-select-group">
                      <label htmlFor={ageSelectId}>{t('seriphia.select_age', 'Child Age Group')}</label>
                      <select
                        id={ageSelectId}
                        value={selectedAge}
                        onChange={(e) => setSelectedAge(e.target.value)}
                      >
                        <option value="2-3">Ages 2–3 (Toddler Sensory)</option>
                        <option value="4-5">Ages 4–5 (Pre-K Readiness)</option>
                        <option value="6-7">Ages 6–7 (Kindergarten / Grade 1–2)</option>
                      </select>
                    </div>
                  </div>

                  {/* Output Card */}
                  <div className="lesson-card-output">
                    <span
                      className="lesson-card-badge"
                      style={{ background: currentLandData.color }}
                    >
                      {currentLandData.name} • Mentors: {currentLandData.heroes}
                    </span>
                    <h4>{currentActivity.title}</h4>
                    <p className="lesson-card-focus">
                      <strong>Focus:</strong> {currentLandData.domain}
                    </p>

                    <div className="lesson-section">
                      <div className="lesson-section-title">🎯 10-Minute Learning Objective</div>
                      <p>{currentActivity.objective}</p>
                    </div>

                    <div className="lesson-section">
                      <div className="lesson-section-title">🥄 Everyday Household Materials</div>
                      <div className="lesson-materials-pills">
                        {currentActivity.materials.map((item, idx) => (
                          <span key={idx} className="lesson-material-pill">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lesson-section">
                      <div className="lesson-section-title">🗣️ Step-by-Step Caregiver Cadence</div>
                      <div className="lesson-script-box">{currentActivity.script}</div>
                    </div>

                    <div className="lesson-section">
                      <div className="lesson-section-title">🌟 Closing Affirmation</div>
                      <p style={{ fontStyle: 'italic', color: '#4A5568' }}>{currentActivity.affirmation}</p>
                    </div>

                    <div className="lesson-actions">
                      <button type="button" className="lesson-btn primary" onClick={handleCopyLesson}>
                        {copiedNotification ? '✔ Copied to Clipboard!' : '📋 Copy Lesson Card'}
                      </button>
                      <button
                        type="button"
                        className="lesson-btn secondary"
                        onClick={() => window.print()}
                      >
                        🖨️ Print Card
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Sensory Metronome & Rhythm Tapper */}
              {activeTab === 'metronome' && (
                <div className="metronome-container">
                  <div className={`metronome-pulse-display ${isPulsing ? 'pulsing' : ''}`}>
                    {bpm}
                  </div>

                  <div className="metronome-slider-box">
                    <div className="metronome-tempo-label">
                      <label htmlFor={bpmSliderId}>
                        {t('seriphia.tempo_label', 'Acoustic Calming Cadence')}
                      </label>
                      {bpm >= 90 && bpm <= 110 && (
                        <span className="metronome-tag">✨ Resting Calming Zone</span>
                      )}
                    </div>
                    <input
                      id={bpmSliderId}
                      type="range"
                      min={70}
                      max={130}
                      value={bpm}
                      onChange={(e) => setBpm(Number(e.target.value))}
                      className="roi-slider"
                      style={{ maxWidth: '400px', margin: '0.5rem auto' }}
                    />
                    <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '0.5rem' }}>
                      Range: 70 - 130 BPM
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`metronome-toggle-btn ${isPlaying ? 'running' : ''}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? '⏹ Pause Metronome' : '▶ Start Acoustic Rhythm Pulse'}
                  </button>

                  <div className="metronome-science-callout">
                    <strong>🧠 The Neuroscience of 90–110 BPM:</strong>
                    <br />
                    Research in Dalcroze Eurhythmics and neurological development confirms that steady
                    auditory tempos between 90 and 110 BPM align with the developing child’s resting
                    parasympathetic window. Tapping or swaying to this pulse lowers cortisol, facilitates
                    bilateral motor balance, and anchors phonological speech processing.
                  </div>
                </div>
              )}

              {/* TAB 3: Concord ROI & Financial Leverage */}
              {activeTab === 'concord' && (
                <div className="seriphia-concord-view">
                  <ConcordRoiCalculator />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="seriphia-modal-footer">
              <div className="seriphia-footer-concierge">
                Need customized support for your classroom or homeschool pod?{' '}
                <a href="mailto:info@soelearn.com">Email info@soelearn.com</a>
              </div>
              <a
                href="/workbook"
                className="lesson-btn primary"
                style={{ textDecoration: 'none' }}
              >
                Explore Rhythm Ready Workbook →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
