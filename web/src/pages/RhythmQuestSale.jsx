import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';
import heroesData from '../data/heroes.json';
import { assetPath } from '../utils/assetPath';
import ProofInThePause from '../components/ui/ProofInThePause';
import StickyThumbCta from '../components/ui/StickyThumbCta';
import { trackInitiateCheckout, appendUtmsToUrl } from '../utils/analytics';
import ConciergeBadge from '../components/ConciergeBadge';
import KineticHeadline from '../components/KineticHeadline';
import PDPQuestionChips from '../components/PDPQuestionChips';
import './RhythmQuestSale.css';

/**
 * Stripe Payment Links for The Rhythm Ready Workbook:
 * - $21 Digital Download
 * - $45 Physical Print-on-Demand (POD via Lulu with Free US Shipping)
 */
const CHECKOUT_DIGITAL_URL = 'https://buy.stripe.com/test_eVqbJ18xKcktbsOfjc6Vq02';
const CHECKOUT_PRINT_URL = 'https://buy.stripe.com/test_3cI9ATeW8dox2Wi0oi6Vq03';

/** The page's primary buy control. Supports digital ($21) and physical print ($45). */
const RqBuyLink = ({ className = '', format = 'digital', children, onClick }) => {
  const targetUrl = format === 'print' ? CHECKOUT_PRINT_URL : CHECKOUT_DIGITAL_URL;
  const checkoutUrlWithUtms = useMemo(() => appendUtmsToUrl(targetUrl), [targetUrl]);
  const isAbsolute = /^https?:\/\//i.test(targetUrl);

  const handleClick = (e) => {
    trackInitiateCheckout({
      sku: format === 'print' ? 'SOE-RQ-WORKBOOK-PRT' : 'SOE-RQ-WORKBOOK-DIG',
      name: format === 'print'
        ? 'Rhythm Ready Workbook (Physical Print · $45 Free Shipping)'
        : 'Rhythm Ready Workbook (Digital · $21)',
      price: format === 'print' ? 45.00 : 21.00,
    });
    if (onClick) onClick(e);
  };

  return isAbsolute ? (
    <a href={checkoutUrlWithUtms} rel="noopener" className={className} onClick={handleClick}>
      {children}
    </a>
  ) : (
    <Link to={checkoutUrlWithUtms} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Fires once when the element first enters the viewport. */
const useInView = (threshold = 0.3) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ══════════════════════════════════════════════════════════════════════
   RHYTHMREADY 8-WEEK ROADMAP CANON
   ══════════════════════════════════════════════════════════════════════ */
const RHYTHMREADY_WEEKS = [
  {
    week: 1,
    id: 'harmonia',
    theme: 'Hello, 7 Lands!',
    landName: 'Harmonia',
    color: '#d4a843',
    focus: 'Phonological Awareness, Alphabet & Sound Foundations',
    heroes: ['Amara', 'Kwame'],
    heroIds: ['amara', 'kwame'],
    art: 'pond-aiko-kenji.webp',
    blocksCovered: 'Word Detectives · Number Hunt · Garden Secrets · Wake-Up Move · Map Adventure',
    dailyHighlight: 'Sound-before-symbol greetings, counting beads, and somatic stretches to kick off the quest.',
  },
  {
    week: 2,
    id: 'harmonia-sel',
    theme: 'Feelings & Families',
    landName: 'Harmonia',
    color: '#d4a843',
    focus: 'Social-Emotional Learning, Relationships & Regulation',
    heroes: ['Kenji', 'Aiko'],
    heroIds: ['kenji', 'aiko'],
    art: 'dance-harmonia-vitalis.webp',
    blocksCovered: 'Emotions Vocabulary · Shape Logic · Habitat Science · Full-Body Balance · Community Roles',
    dailyHighlight: 'Connecting emotion words to physical sensations and building relational empathy through song.',
  },
  {
    week: 3,
    id: 'luminosity',
    theme: 'Community & Cooperation',
    landName: 'Luminosity',
    color: '#5ba4c9',
    focus: 'Civics, Community Helpers, Problem-Solving & French Phonics',
    heroes: ['Athena', 'Felix'],
    heroIds: ['athena', 'felix'],
    art: 'march-luminosity.webp',
    blocksCovered: 'Community Helpers · Money & Budgeting · Weather Systems · Somatic Posture · Civic Rights',
    dailyHighlight: "Exploring teamwork, emergency helpers, and bilingual vocabulary through 'Le Cheval'.",
  },
  {
    week: 4,
    id: 'aquaria',
    theme: 'Wonders of the World',
    landName: 'Aquaria',
    color: '#2563EB',
    focus: 'Geography, Ocean Science, Tricky Words & Syllable Flow',
    heroes: ['Ronan', 'Selene'],
    heroIds: ['ronan', 'selene'],
    art: 'cubes-ronan-nerissa.webp',
    blocksCovered: 'Tricky English Words · Estimation & Fractions · Marine Habitats · Water Cycle · Map Navigation',
    dailyHighlight: 'Midpoint Quest milestone! Breaking down multi-syllabic hard words with nautical rhythm.',
  },
  {
    week: 5,
    id: 'vitalis',
    theme: 'Body, Mind & Balance',
    landName: 'Vitalis',
    color: '#c4785a',
    focus: 'Somatic Breathwork, Physical Fitness, Nutrition & Hygiene',
    heroes: ['Nerissa', 'Octavia'],
    heroIds: ['nerissa', 'octavia'],
    art: 'touch-your-toes.webp',
    blocksCovered: 'Body Vocabulary · Measurement at Home · Food Groups & Nutrition · Yoga Stretches · Daily Reflection',
    dailyHighlight: 'Active motor circuits, diaphragmatic breathing routines, and mindful wellness journaling.',
  },
  {
    week: 6,
    id: 'celestia',
    theme: 'Inventions & Discoveries',
    landName: 'Celestia',
    color: '#9678c4',
    focus: 'STEM, Astronomy, Timekeeping, Seasons & Energy',
    heroes: ['Elias', 'Ezra'],
    heroIds: ['elias', 'ezra'],
    art: 'time-celestia.webp',
    blocksCovered: 'Scientific Method · Clocks & Calendar Math · Solar System · Vestibular Balance · Historical Time',
    dailyHighlight: 'Exploring constellations, day/night cycles, sundials, and early engineering logic.',
  },
  {
    week: 7,
    id: 'harmonia-adv',
    theme: 'Sound & Story',
    landName: 'Harmonia & Terrasol',
    color: '#d4a843',
    focus: 'Advanced Phonics, Creative Writing, Storytelling & Nature',
    heroes: ['Silas', 'Vesta'],
    heroIds: ['silas', 'vesta'],
    art: 'path-to-terrasol.webp',
    blocksCovered: 'Story Sentence Writing · Data & Graphing · Plant Life Cycles · Rhythmic Percussion · Reflection',
    dailyHighlight: 'Children author their own mini-tales, decode advanced rhymes, and reflect on living nature.',
  },
  {
    week: 8,
    id: 'celestia-finale',
    theme: 'Grand Celebration & Launch',
    landName: 'Celestia & Terrasol',
    color: '#9678c4',
    focus: 'Cumulative Review, Capstone Portfolio & Champions Badge',
    heroes: ['Seriphia', 'All 15 Heroes'],
    heroIds: ['seriphia', 'kenji'],
    art: 'quest-complete.webp',
    blocksCovered: 'Mastery Phonics · Math Games · Eco-Sustainability · Celebration Dance · Future Me Letter',
    dailyHighlight: 'The final Quest Star! Children complete their portfolio review and receive the Quest Champion award.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   HERO — RHYTHMREADY WORKBOOK
   ═══════════════════════════════════════════════════════════════ */
const RhythmReadyHero = () => {
  const [week, setWeek] = useState(0);
  const [chosen, setChosen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [calm, setCalm] = useState(false);
  const innerRef = useRef(null);
  const tiltOk = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setCalm(mq.matches);
      tiltOk.current = !mq.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (calm || chosen || paused) return undefined;
    const id = setInterval(() => setWeek((w) => (w + 1) % RHYTHMREADY_WEEKS.length), 3400);
    return () => clearInterval(id);
  }, [calm, chosen, paused]);

  const tilt = useCallback((e) => {
    const el = innerRef.current;
    if (!el || !tiltOk.current) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rq-tilt-y', `${(-12 + x * 11).toFixed(2)}deg`);
    el.style.setProperty('--rq-tilt-x', `${(3 - y * 9).toFixed(2)}deg`);
  }, []);

  const untilt = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.removeProperty('--rq-tilt-y');
    el.style.removeProperty('--rq-tilt-x');
  }, []);

  const currentWeek = RHYTHMREADY_WEEKS[week];

  return (
    <header className="rq-hero">
      <div className="rq-hero__bg" aria-hidden="true" />
      <div className="rq-hero__overlay" aria-hidden="true" />

      <div className="rq-hero__inner">
        <div className="rq-hero__grid">
          <div className="rq-hero__copy">
            <span className="rq-hero__badge">📚 Workbook &amp; Curriculum · 8 Weeks · 40 Days · K–3</span>

            <KineticHeadline
              tag="h1"
              className="rq-hero__title"
              variant="musical-bounce"
              delay={0.1}
              scrollTrigger={false}
            >
              Workbook &amp; Curriculum
              <span className="rq-hero__title-accent">8 Weeks. 40 Days. 240+ Activities.</span>
            </KineticHeadline>

            <p className="section-subtitle rq-hero__hook">
              A multi-sensory, cross-curricular daily learning quest across the Seven Lands.
            </p>

            <p className="rq-hero__lede">
              An 8-week cross-curricular learning journey for Pre-K through 2nd Grade (ages 2 to 7). Ten bite-sized
              daily blocks spanning phonics, math, science, somatic movement,
              geography/civics, and reflection. Sound before symbol. Handcrafted for the developing brain.
            </p>

            <div className="rq-hero__offer">
              <div className="rq-hero__price-tag">
                <span className="rq-hero__price">$21 <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-text-dark-secondary)' }}>/ $45</span></span>
                <span className="rq-hero__price-note">Digital PDF ($21) or Physical Print ($45)</span>
              </div>

              <p className="rq-hero__price-math">
                Instant digital download or <strong>454-page physical workbook</strong> shipped to your door with <strong>Free US Shipping</strong> via Lulu POD.
              </p>

              <ProofInThePause variant="compact" />

              <div className="rq-hero__actions">
                <a href="#offer" className="btn btn-gold">Get Workbook · From $21 ↓</a>
                <a href="#whats-inside" className="btn btn-outline">Explore the 8 Weeks ↓</a>
              </div>

              <ul className="rq-hero__assure">
                <li>Instant PDF ($21) or 454-page physical print ($45)</li>
                <li>Free Standard US Shipping on physical print</li>
                <li>Built for Ages 2–7 (Pre-K to Grade 2)</li>
              </ul>

              <p className="rq-hero__free-note">
                Pairs directly with the free 19-track album. Every day features hero coaching tips
                and phonetic pronunciation guides.
              </p>
            </div>
          </div>

          <div className="rq-hero__book">
            <div
              className="rq-hero__stage"
              style={{ '--rq-land': currentWeek.color }}
              onMouseMove={tilt}
              onMouseLeave={untilt}
            >
              <div className="rq-book-3d">
                <div className="rq-book-3d__inner" ref={innerRef}>
                  <img
                    src={assetPath('/assets/workbook/rhythm-ready-workbook-cover.webp')}
                    alt="The Sound of Essentials: Rhythm Ready Workbook Official Cover"
                    className="rq-book-3d__cover"
                  />
                </div>
                <span className="sparkle" aria-hidden="true" />
                <span className="sparkle" aria-hidden="true" />
                <span className="sparkle" aria-hidden="true" />
                <span className="sparkle" aria-hidden="true" />
              </div>

              <div className="rq-hero__week" key={currentWeek.week} aria-hidden="true">
                <span className="rq-hero__week-text">
                  <span className="rq-hero__week-num">Week {currentWeek.week} of 8</span>
                  <strong className="rq-hero__week-name">{currentWeek.theme}</strong>
                  <span className="rq-hero__week-focus">{currentWeek.focus}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 8-Week Interactive Rail ── */}
        <div
          className="rq-hero__path"
          style={{ '--rq-land': currentWeek.color }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="rq-hero__path-head">
            <span className="rq-hero__path-title">The 8-Week Rhythm Ready Journey</span>
            <span className="rq-hero__path-sub">5 days a week, 6 daily blocks (~16 min/day). A clear path from Day 1 to Day 40.</span>
          </div>

          <div className="rq-hero__track" aria-hidden="true">
            <span style={{ width: `${((week + 1) / RHYTHMREADY_WEEKS.length) * 100}%` }} />
          </div>

          <ol className="rq-hero__weeks" aria-label="The eight week Rhythm Ready roadmap">
            {RHYTHMREADY_WEEKS.map((w, i) => (
              <li key={w.week}>
                <button
                  type="button"
                  className="rq-hero__node"
                  style={{ '--rq-node': w.color }}
                  aria-current={i === week ? 'step' : undefined}
                  onClick={() => { setWeek(i); setChosen(true); }}
                >
                  <span className="rq-hero__node-dot" aria-hidden="true" />
                  <span className="rq-hero__node-txt">
                    <span className="rq-hero__node-wk">Week {w.week}</span>
                    <span className="rq-hero__node-name">{w.theme}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </header>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PROOF & EVIDENCE
   ═══════════════════════════════════════════════════════════════ */
const proofEvidence = [
  {
    id: 'learning-loss',
    idx: '01',
    pull: '2.5 mo',
    pullNote: 'learning loss avoided',
    claim: '15 minutes of daily structured practice builds bedrock mastery and momentum.',
    detail: 'Studies indicate that students lose up to 2.5 months of reading and math skills without regular reinforcement. Micro-dosed daily rhythm halts regression completely.',
    soWhat: 'So we designed 6 daily blocks totaling just 16 minutes: bite-sized, engaging, and impossible to burn out on.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3121007/',
    cite: 'Harvard Graduate School of Education & Frontiers in Psychology',
    tint: 'var(--color-orange)',
    soft: 'var(--color-orange-soft)',
  },
  {
    id: 'sound-symbol',
    idx: '02',
    pull: 'Sound',
    pullNote: 'before symbol',
    claim: 'Phonological rhythm accelerates early word decoding.',
    detail: 'Brain imaging reveals that rhythm perception directly activates the neural pathways responsible for syllable segmentation, phonics, and rapid word recognition.',
    soWhat: 'Every single activity includes phonetic pronunciation keys (e.g. heh-LOW | GUD-mor-ning) so children sound it out aloud before writing.',
    href: 'https://www.nature.com/articles/s41598-022-15596-7',
    cite: 'Nature Scientific Reports, 2022',
    tint: 'var(--color-green)',
    soft: 'var(--color-green-soft)',
  },
  {
    id: 'somatic',
    idx: '03',
    pull: 'Somatic',
    pullNote: 'movement breaks',
    claim: 'Physical movement unlocks cognitive memory retention.',
    detail: 'Vestibular balancing and deep diaphragmatic breathing regulate the central nervous system, shifting early learners into optimal memory consolidation state.',
    soWhat: 'Block D in every lesson is a dedicated physical reset: stretching, jumping, breathwork, and motor circuits.',
    href: 'https://neurosciencenews.com/genetics-music-language-28151/',
    cite: 'Neuroscience & Early Childhood Development Research',
    tint: 'var(--color-purple)',
    soft: 'var(--color-purple-soft)',
  },
];

const makerChips = [
  '8 Weeks · 40 Day-by-Day Lessons',
  '240+ Core Activity Blocks',
  'Ages 2–7 (Pre-K to Grade 2)',
  'Sound Before Symbol Phonetics',
  'Full-Color & Printable',
];

const RqCount = ({ value, active, duration = 900 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { setN(value); return undefined; }
    if (!active) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, active, duration]);
  return <>{n}</>;
};

const RhythmReadyProof = () => {
  const [railRef, railInView] = useInView(0.25);

  const proofRail = useMemo(() => ([
    { value: 8,   label: 'Weeks of Curriculum', sub: '40 guided daily lessons', tint: 'var(--color-orange)' },
    { value: 6,   label: 'Daily Subject Blocks', sub: '~16 minutes total per day', tint: 'var(--color-green)' },
    { value: 240, label: 'Activity Blocks',      sub: 'Reading, Math, Science & Movement', tint: 'var(--color-purple)' },
    { value: 15,  label: 'Hero Guides',         sub: 'Coaching tips on every page', tint: 'var(--color-blue)' },
  ]), []);

  return (
    <section className="rq-proof" aria-label="Why you can trust this curriculum">
      <div className="rq-proof__rail" ref={railRef}>
        <RevealSection>
          <div className="rq-proof__rail-inner">
            {proofRail.map((s) => (
              <div key={s.label} className="rq-proof-stat" style={{ '--stat-tint': s.tint }}>
                <span className="rq-proof-stat__value" aria-hidden="true">
                  <RqCount value={s.value} active={railInView} />{s.value === 240 ? '+' : ''}
                </span>
                <span className="sr-only">{`${s.value} ${s.label}. ${s.sub}.`}</span>
                <span className="rq-proof-stat__label" aria-hidden="true">{s.label}</span>
                <span className="rq-proof-stat__sub" aria-hidden="true">{s.sub}</span>
              </div>
            ))}
            <span className="rq-proof__stave" aria-hidden="true" />
          </div>
        </RevealSection>
      </div>

      <div className="rq-proof__body">
        <div className="container">
          <RevealSection className="text-center rq-proof__head">
            <div className="section-label">Pedagogical Framework</div>
            <KineticHeadline
              tag="h2"
              className="section-title"
              variant="musical-bounce"
            >
              Built for Real Retentive Power. <span className="text-gold">Backed by Science.</span>
            </KineticHeadline>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Every activity is structured to foster joy, physical movement, and deep cognitive retention.
            </p>
          </RevealSection>

          <div className="rq-proof__grid">
            {proofEvidence.map((e, i) => (
              <RevealSection key={e.id} delay={i * 0.12}>
                <article className="rq-ev-card" style={{ '--ev-tint': e.tint, '--ev-soft': e.soft }}>
                  <span className="rq-ev-card__idx">{e.idx}</span>

                  <div className="rq-ev-card__pull">
                    <span className="rq-ev-card__pull-value">{e.pull}</span>
                    <span className="rq-ev-card__pull-note">{e.pullNote}</span>
                  </div>

                  <h3 className="rq-ev-card__claim">{e.claim}</h3>
                  <p className="rq-ev-card__detail">{e.detail}</p>
                  <p className="rq-ev-card__so">{e.soWhat}</p>

                  <a
                    className="rq-ev-card__cite"
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {e.cite} <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </RevealSection>
            ))}
          </div>

          <RevealSection delay={0.1}>
            <div className="rq-maker">
              <div className="rq-maker__bg" aria-hidden="true">
                <img src={assetPath('/assets/marketing/harmonia-call.webp')} alt="" loading="lazy" />
                <span className="rq-maker__scrim" />
              </div>

              <div className="rq-maker__copy">
                <span className="rq-maker__eyebrow">The Method</span>
                <h3 className="rq-maker__title">Designed for Homeschools, Classrooms &amp; Sanctuary Learning</h3>
                <p className="rq-maker__text">
                  We built Rhythm Ready to give parents and educators a friction-free, turnkey
                  learning routine. No lesson planning, no special materials, and zero guesswork.
                </p>
                <p className="rq-maker__text">
                  Open the day's page, follow the 6 quick blocks with your child, and celebrate their
                  daily progress with Quest Stars.
                </p>
                <p className="rq-maker__sign">Sound Before Symbol · Multi-Sensory · Complete</p>
              </div>

              <ul className="rq-maker__chips">
                {makerChips.map((c) => (
                  <li key={c} className="rq-maker__chip">
                    <span className="rq-maker__chip-mark" aria-hidden="true">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   WHAT'S INSIDE — THE 6 DAILY BLOCKS
   ═══════════════════════════════════════════════════════════════ */
const DAILY_BLOCKS = [
  {
    block: 'Block A',
    time: '3 min',
    subject: 'Language & Phonics',
    land: 'Harmonia (Language)',
    color: '#d4a843',
    desc: 'Sight words, ASL fingerspelling, sound-before-symbol phonetic keys, and vocabulary decoding.',
  },
  {
    block: 'Block B',
    time: '3 min',
    subject: 'Math & Logic',
    land: 'Numeria (Math)',
    color: '#d4a843',
    desc: 'Counting, geometric shapes, measurement, estimation, fractions, money, and data patterns.',
  },
  {
    block: 'Block C',
    time: '3 min',
    subject: 'Science & Nature',
    land: 'Terrasol & Celestia',
    color: '#4CAF50',
    desc: 'Plant growth, animal habitats, weather systems, solar astronomy, and the scientific method.',
  },
  {
    block: 'Block D',
    time: '2 min',
    subject: 'Movement & Health',
    land: 'Vitalis (Physical)',
    color: '#c4785a',
    desc: 'Diaphragmatic breathing, posture resets, balance drills, fitness circuits, and hygiene.',
  },
  {
    block: 'Block E',
    time: '2 min',
    subject: 'Geography or Civics',
    land: 'Aquaria & Luminosity',
    color: '#2563EB',
    desc: 'Map reading, community helpers, governance, civic responsibility, and world cultures.',
  },
  {
    block: 'Block F',
    time: '3 min',
    subject: 'Daily Reflection',
    land: 'All 7 Lands',
    color: '#9678c4',
    desc: 'Mindful journaling, gratitude prompts, goal tracking, and weekly Friday Quest Star rewards.',
  },
];

const RhythmReadyWhatsInside = () => {
  return (
    <section className="rq-inside section" id="whats-inside">
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">The Daily 6-Block Routine</div>
          <KineticHeadline
            tag="h2"
            className="section-title"
            variant="musical-bounce"
          >
            Six Daily Blocks. <span className="text-gold">16 Minutes a Day.</span>
          </KineticHeadline>
          <p className="section-subtitle">
            Every single day follows a predictable, neuro-affirming sequence that children look forward to.
          </p>
          <ul className="rq-inside__facts">
            <li className="rq-inside__fact rq-inside__fact--price">$21 Digital / $45 Print</li>
            <li className="rq-inside__fact">40 Day-by-Day Lessons</li>
            <li className="rq-inside__fact">400+ Activity Blocks</li>
            <li className="rq-inside__fact">Pre-K to Grade 2 (Ages 2–7)</li>
          </ul>
        </RevealSection>

        {/* ── 6 Daily Blocks Grid ── */}
        <div className="rq-inside__deliver" style={{ marginTop: '2.5rem' }}>
          <div className="rq-inside__grid">
            {DAILY_BLOCKS.map((d, i) => (
              <RevealSection key={d.block} delay={i * 0.07}>
                <div className="rq-inside-card" style={{ '--feat-color': d.color }}>
                  <span className="rq-inside-card__mark" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {d.block} · {d.time}
                  </span>
                  <h3 className="rq-inside-card__title">{d.subject}</h3>
                  <p className="rq-inside-card__desc">{d.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        {/* ── Ledger Summary ── */}
        <RevealSection delay={0.1}>
          <div className="rq-inside__ledger">
            <div className="rq-inside__ledger-rows">
              <div className="rq-ledger-row">
                <span className="rq-ledger-row__k">Curriculum Format</span>
                <span className="rq-ledger-row__v">
                  Available as instant digital PDF ($21) or 454-page physical print workbook ($45 with Free US Shipping via Lulu POD).
                </span>
              </div>
              <div className="rq-ledger-row">
                <span className="rq-ledger-row__k">Grade Range</span>
                <span className="rq-ledger-row__v">
                  Designed for Pre-K through 2nd Grade (Ages 2 to 7). Progressive difficulty that grows with your child.
                </span>
              </div>
              <div className="rq-ledger-row">
                <span className="rq-ledger-row__k">Friday Celebrations</span>
                <span className="rq-ledger-row__v">
                  Every Friday features cumulative weekly reviews, Quest Map milestone coloring, and Quest Star badges.
                </span>
              </div>
            </div>

            <a href="#offer" className="btn btn-gold">Choose Digital ($21) or Physical Print ($45) →</a>
            <p className="rq-inside__cta-note">
              Instant PDF Download · Ready to Print Today · Read on Any Device
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   THE 8-WEEK DETAILED CURRICULUM MAP
   ═══════════════════════════════════════════════════════════════ */
const RhythmReadyRoadmap = () => {
  const [activeWeek, setActiveWeek] = useState(0);
  const weekRefs = useRef([]);

  const goToWeek = (i) => {
    const el = weekRefs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section className="rq-qmap section" id="curriculum-map" aria-labelledby="ss-qmap-title">
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">8-Week Scope &amp; Sequence</div>
          <KineticHeadline
            tag="h2"
            className="section-title"
            variant="musical-bounce"
            id="ss-qmap-title"
          >
            The 8-Week Scope: <span className="text-plum">40 Days of Learning</span>
          </KineticHeadline>
          <p className="section-subtitle">
            Explore what your child will discover across all seven lands during their 8-week journey.
          </p>
        </RevealSection>

        {/* Jump Rail */}
        <nav className="rq-qmap__rail" aria-label="Jump to a week">
          {RHYTHMREADY_WEEKS.map((w, i) => (
            <button
              key={w.week}
              type="button"
              className={`rq-qmap__rail-btn${i === activeWeek ? ' is-on' : ''}`}
              style={{ '--land-color': w.color }}
              aria-label={`Week ${w.week}, ${w.theme}`}
              aria-current={i === activeWeek ? 'true' : undefined}
              onClick={() => { setActiveWeek(i); goToWeek(i); }}
            >
              <span className="rq-qmap__rail-num">{w.week}</span>
              <span className="rq-qmap__rail-name">{w.theme}</span>
            </button>
          ))}
        </nav>

        <div className="rq-qmap__track">
          <ol className="rq-qmap__weeks">
            {RHYTHMREADY_WEEKS.map((w, i) => (
              <li
                key={w.week}
                ref={(el) => { weekRefs.current[i] = el; }}
                className={`rq-qmap__week${i === activeWeek ? ' is-active' : ''}`}
                style={{ '--land-color': w.color }}
              >
                <div className="rq-qmap__node" aria-hidden="true">
                  <span className="rq-qmap__node-dot" />
                </div>

                <RevealSection delay={0.06 * i}>
                  <article className="rq-qmap__card">
                    <div className="rq-qmap__art">
                      <img
                        src={assetPath(`/assets/scenes/${w.art}`)}
                        alt={`Art from ${w.theme}`}
                        loading="lazy"
                      />
                      <span className="rq-qmap__badge">
                        Week {w.week} · {w.landName}
                      </span>
                    </div>

                    <div className="rq-qmap__body">
                      <div className="rq-qmap__head">
                        <span className="rq-qmap__week-num">Week {w.week} of 8</span>
                        <span className="rq-qmap__page">5 Day-by-Day Lessons</span>
                      </div>

                      <h3 className="rq-qmap__land">{w.theme}</h3>
                      <p className="rq-qmap__focus">{w.focus}</p>

                      <div className="rq-qmap__row">
                        <span className="rq-qmap__row-label">Hero Guides</span>
                        <span className="rq-qmap__chips">
                          {w.heroes.map((h) => (
                            <span key={h} className="rq-qmap__chip">{h}</span>
                          ))}
                        </span>
                      </div>

                      <div className="rq-qmap__row">
                        <span className="rq-qmap__row-label">Core Blocks</span>
                        <div className="rq-qmap__do">
                          <p className="rq-qmap__task">{w.blocksCovered}</p>
                          <p className="rq-qmap__note">{w.dailyHighlight}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </RevealSection>
              </li>
            ))}
          </ol>

          <div className="rq-qmap__finish">
            <div className="rq-qmap__node rq-qmap__node--end" aria-hidden="true">
              <span className="rq-qmap__node-dot" />
            </div>

            <RevealSection delay={0.1}>
              <article className="rq-qmap__card rq-qmap__card--finish">
                <div className="rq-qmap__art">
                  <img
                    src={assetPath('/assets/marketing/quest-finish-line.webp')}
                    alt="Artwork marking the finish line celebration of the Workbook and Curriculum"
                    loading="lazy"
                  />
                </div>
                <div className="rq-qmap__body">
                  <span className="rq-qmap__eyebrow">The Finish Line</span>
                  <h3 className="rq-qmap__land">Week 8 Completed. 40 Days of Mastery.</h3>
                  <p className="rq-qmap__focus rq-qmap__focus--wide">
                    Your child finishes the quest ahead of the curve — energized with confidence in reading,
                    math, science, somatic regulation, and creative expression.
                  </p>
                  <div className="rq-qmap__cta">
                    <a href="#offer" className="btn btn-gold">Get the Workbook · From $21 →</a>
                    <span className="rq-qmap__guarantee">
                      Instant digital PDF ($21) or 454-page physical print ($45 with Free US Shipping)
                    </span>
                  </div>
                </div>
              </article>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   THE OFFER
   ═══════════════════════════════════════════════════════════════ */
const RhythmReadyOffer = () => {
  const [format, setFormat] = useState('print');

  return (
    <section className="rq-offer-section section" id="offer">
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">The Complete Curriculum</div>
          <KineticHeadline
            tag="h2"
            className="section-title"
            variant="musical-bounce"
          >
            8 Weeks of Structured Learning.
            <span className="rq-offer__title-accent"> Choose Your Format.</span>
          </KineticHeadline>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Instant digital PDF download or 454-page physical workbook delivered to your door with Free US Shipping.
          </p>
        </RevealSection>

        <RevealSection delay={0.15}>
          <div className="rq-offer">
            <div className="rq-offer__includes">
              <h3 className="rq-offer__includes-title">What the Workbook &amp; Curriculum Includes</h3>
              <ul className="rq-offer__list">
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>8 Full Weeks / 40 Day-by-Day Lessons.</strong> Structured across all 7 lands.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>400+ Daily Activity Blocks.</strong> Ten 3-minute subject blocks per day (~30 mins/day).
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Sound-Before-Symbol Phonetic Guides.</strong> Pronunciation keys on every page.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>15 Hero Guides &amp; Coaching Tips.</strong> Hero mentorship for daily motivation.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Friday Milestone Celebrations &amp; Quest Stars.</strong> Gamified rewards &amp; progress mapping.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Dual-Format Flexibility.</strong> Choose instant printable PDF ($21) or 454-page physical print workbook ($45).
                  </span>
                </li>
              </ul>

              <p className="rq-offer__free">
                Pairs perfectly with the free 19-track album on /listen. No expensive curriculum boxes or
                monthly subscription fees.
              </p>
            </div>

            <aside className="rq-offer__price">
              {/* ── Format Selector ── */}
              <div className="rq-offer__format-selector" role="tablist" aria-label="Curriculum Format">
                <button
                  type="button"
                  role="tab"
                  aria-selected={format === 'print'}
                  className={`rq-format-btn ${format === 'print' ? 'is-active' : ''}`}
                  onClick={() => setFormat('print')}
                >
                  <span className="rq-format-btn__icon">📦</span>
                  <span className="rq-format-btn__text">Physical Print</span>
                  <span className="rq-format-btn__badge">Free US Ship</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={format === 'digital'}
                  className={`rq-format-btn ${format === 'digital' ? 'is-active' : ''}`}
                  onClick={() => setFormat('digital')}
                >
                  <span className="rq-format-btn__icon">📱</span>
                  <span className="rq-format-btn__text">Digital Download</span>
                </button>
              </div>

              <div className="rq-offer__stave" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>

              <span className="rq-offer__amount">{format === 'print' ? '$45' : '$21'}</span>
              <span className="rq-offer__terms">
                {format === 'print'
                  ? '454-page physical book · Free Standard US Shipping'
                  : 'complete digital workbook · no subscription'}
              </span>
              <p className="rq-offer__math">
                {format === 'print' ? (
                  <>Printed on demand via <strong>Lulu Press</strong> on durable 60# paper.</>
                ) : (
                  <>40 days of guided learning = <strong>~52¢ a day</strong>.</>
                )}
              </p>

              <RqBuyLink format={format} className="btn btn-gold rq-offer__buy">
                <span>{format === 'print' ? 'Order Physical Print Workbook' : 'Get Digital Workbook & Curriculum'}</span>
                <span className="rq-offer__buy-price">{format === 'print' ? '$45' : '$21'}</span>
              </RqBuyLink>

              <p className="rq-offer__nudge">
                {format === 'print'
                  ? 'Delivered to your door with tracking · Free US Shipping included.'
                  : 'Instant digital delivery · Ready to start today.'}
              </p>

              <div className="rq-offer__guarantee">
                <span className="rq-offer__seal" aria-hidden="true">
                  {format === 'print' ? '📦' : '⚡'}
                </span>
                <span>
                  <strong className="rq-offer__seal-title">
                    {format === 'print' ? 'Lulu Print-on-Demand & Free Shipping' : 'Instant Digital Delivery'}
                  </strong>
                  {format === 'print'
                    ? '454 full-color pages bound and shipped directly via Lulu POD. Includes delivery tracking and zero shipping fees.'
                    : 'Immediate access to your complete printable workbook & curriculum PDF upon checkout. Tablet-ready with lifetime family access.'}
                </span>
              </div>

              <div className="rq-offer__switcher-nudge">
                Prefer the other format?{' '}
                <button
                  type="button"
                  className="rq-offer__switcher-link"
                  onClick={() => setFormat(format === 'print' ? 'digital' : 'print')}
                >
                  {format === 'print'
                    ? 'Switch to Instant Digital ($21)'
                    : 'Switch to Physical Print ($45 · Free Shipping)'}
                </button>
              </div>

              <PDPQuestionChips preset="workbook" label="Have questions before ordering?" />
            </aside>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DICTIONARY PRE-SALE OFFER COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const DictionaryPreSaleOffer = () => {
  const handleDictCheckout = () => {
    trackInitiateCheckout({
      sku: 'SOE-DICTIONARY',
      name: 'Essential Picture Dictionary ($55 Pre-Sale)',
      price: 55.00,
    });
  };

  return (
    <section className="rq-offer-section rq-dict-section section" id="dictionary-presale">
      <div id="dictionary" style={{ position: 'relative', top: '-90px', visibility: 'hidden' }} />
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">📖 Companion Vocabulary Reference · Pre-Sale</div>
          <h2 className="section-title">
            Essential Picture Dictionary
            <span className="rq-offer__title-accent">4,000+ Words. 125 Scenes. $55 Pre-Sale.</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2.25rem auto', maxWidth: '680px' }}>
            The complete illustrated companion to the Rhythm Quest universe. Built for early learners (Ages 2–7),
            homeschoolers, and ESL families to transform auditory rhythm into rich, lasting vocabulary mastery.
          </p>
        </RevealSection>

        <RevealSection delay={0.15}>
          <div className="rq-offer rq-offer--dict">
            <div className="rq-offer__includes">
              <div className="rq-dict-tag-row">
                <span className="rq-dict-badge">🌟 Pre-Sale Reservation</span>
                <span className="rq-dict-subbadge">Ages 2–7 · All 7 Lands</span>
              </div>
              <h3 className="rq-offer__includes-title" style={{ marginTop: '0.85rem' }}>
                What the Essential Picture Dictionary Includes
              </h3>
              <ul className="rq-offer__list">
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>4,000+ Verified Vocabulary Words.</strong> Organized across 125 thematic illustrated scenes.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>All 7 Lands &amp; 15 Hero Mentors.</strong> Contextualized in a living world with Seriphia’s guidance.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Sound-Before-Symbol Phonetic Guides.</strong> Every single word includes pronunciation keys.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Dual-Language Foundations (English &amp; French).</strong> Culturally rich, phonetic language-affirming design.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Complete Back Matter Reference.</strong> Sight words, action verbs, adjectives, and ASL alphabet.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Parent &amp; Teacher Pedagogical Guide.</strong> Visual glossary and conversation prompts.
                  </span>
                </li>
                <li className="rq-offer__item">
                  <span className="rq-offer__tick" aria-hidden="true">✓</span>
                  <span>
                    <strong>Digital EPUB Delivery Upon Release.</strong> High-fidelity digital format readable on any device.
                  </span>
                </li>
              </ul>

              <p className="rq-offer__free">
                Designed to pair naturally with the <strong>Rhythm Ready Workbook</strong> and <strong>19-Track Free Album</strong>.
              </p>
            </div>

            <aside className="rq-offer__price rq-offer__price--dict">
              <div className="rq-dict-price-badge">SAVE 30% ON PRE-SALE</div>
              
              <div className="rq-dict-price-wrap">
                <span className="rq-dict-retail">$79</span>
                <span className="rq-offer__amount">$55</span>
              </div>
              <span className="rq-offer__terms">limited pre-sale pricing · compare at $79</span>
              <p className="rq-offer__math">
                Over 4,000 words &amp; 125 scenes = <strong>~1.3¢ per illustrated word</strong>.
              </p>

              <a
                href="https://buy.stripe.com/test_14AfZhcO02JT40m9YS6Vq06"
                rel="noopener"
                className="btn btn-gold btn-shimmer rq-offer__buy"
                onClick={handleDictCheckout}
              >
                <span>Reserve Pre-Sale Order</span>
                <span className="rq-offer__buy-price">$55</span>
              </a>

              <p className="rq-offer__nudge">Priority fulfillment queue · Reserved digital edition.</p>

              <div className="rq-offer__guarantee">
                <span className="rq-offer__seal" aria-hidden="true">📖</span>
                <span>
                  <strong className="rq-offer__seal-title">Priority Digital Edition</strong>
                  Direct priority delivery to your inbox upon release, including all 125 illustrated scenes and companion updates.
                </span>
              </div>

              <PDPQuestionChips preset="dictionary" label="Pre-Sale Questions?" />
            </aside>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════ */
const faqs = [
  {
    id: 'dictionary-presale',
    color: 'var(--color-gold, #FF6F00)',
    q: 'How does the Essential Picture Dictionary pre-sale work?',
    a: [
      'The Essential Picture Dictionary is currently in pre-sale at a special price of $55 (compare at $79 retail — save 30%).',
      'By reserving your pre-sale copy today, you secure priority access to the complete 4,000+ word, 125-scene digital EPUB edition as soon as the final release is live, along with all companion bonuses and future updates.',
      'By pre-ordering today, you lock in the exclusive $55 price and receive immediate priority delivery upon official release.',
    ],
    chips: ['$55 Pre-Sale (Save 30%)', '4,000+ Words', 'Priority Access'],
  },
  {
    id: 'grades',
    color: 'var(--color-orange)',
    q: 'What age and grade levels is the Workbook & Curriculum designed for?',
    a: [
      'The Workbook & Curriculum is engineered for Pre-K through 2nd Grade (ages 2 to 7).',
      'For younger learners (ages 2–4), parents guide the 10 short blocks together. For emerging readers and older learners (ages 5–7), children complete the blocks with joyful independence.',
    ],
    chips: ['Pre-K to Grade 2', 'Ages 2 to 7', 'Guided & Independent'],
  },
  {
    id: 'time',
    color: 'var(--color-blue)',
    q: 'How much time does it take each day?',
    a: [
      'About 30 minutes total per day.',
      'The day is divided into ten quick 3-minute blocks (Phonics, Math, Science, Physical Movement, Geography/Civics, French/Bilingual, and Reflection). It is designed to fit smoothly into morning breakfast routines or afternoon quiet time with zero burnout.',
    ],
    chips: ['~30 minutes/day', '10 short blocks', 'Zero burnout'],
  },
  {
    id: 'supplies',
    color: 'var(--color-purple)',
    q: 'Do I need special supplies or materials?',
    a: [
      'No special supplies required!',
      'All you need is a pencil, a few crayons or colored markers, and everyday household items (like a spoon or a leaf for nature observations).',
    ],
    chips: ['No prep needed', 'Household items', 'Open-and-go'],
  },
  {
    id: 'print',
    color: 'var(--color-yellow)',
    q: 'Can I print it at home or use it on a tablet?',
    a: [
      'Yes! The digital download is a high-resolution, print-ready PDF.',
      'You can print the entire 8-week workbook at once, print day-by-day sheets, or load the PDF into tablet annotation apps like GoodNotes or Notability.',
    ],
    chips: ['Printable PDF', 'Tablet compatible', 'Unlimited home prints'],
  },
  {
    id: 'music',
    color: 'var(--color-red)',
    q: 'How does the music integrate with the workbook?',
    a: [
      'Every week corresponds with themes and heroes from the 19-track Sound of Essentials album (available 100% free on /listen).',
      'The songs reinforce the phonics, numbers, and somatic movement exercises children practice on the page.',
    ],
    chips: ['Free companion album', 'Phonics songs', 'Multi-sensory'],
  },
  {
    id: 'digital-delivery',
    color: 'var(--color-green)',
    q: 'How do I access my digital files?',
    a: [
      'Immediately upon checkout, you will receive an instant download link on your confirmation page and via email.',
      'Your files include high-resolution printable PDFs optimized for home printing or loading directly onto tablets for lifetime family use.',
    ],
    chips: ['Instant download', 'Print & tablet-ready', 'Lifetime family access'],
  },
];

const RqFaqRow = ({ item, index, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const btnId = `ss-faq-btn-${item.id}`;
  const panelId = `ss-faq-panel-${item.id}`;

  return (
    <div
      className={`rq-faq-row${open ? ' is-open' : ''}`}
      style={{ '--faq-color': item.color, '--i': index }}
    >
      <h3 className="rq-faq-row__q">
        <button
          type="button"
          id={btnId}
          className="rq-faq-row__btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="rq-faq-row__q-text">{item.q}</span>
          <span className="rq-faq-row__toggle" aria-hidden="true" />
        </button>
      </h3>

      <div className="rq-faq-row__panel" id={panelId} role="region" aria-labelledby={btnId}>
        <div className="rq-faq-row__panel-inner">
          {item.a.map((para) => (
            <p key={para.slice(0, 32)} className="rq-faq-row__a">{para}</p>
          ))}
          <ul className="rq-faq-row__chips">
            {item.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const RhythmReadyFaq = () => (
  <section className="rq-faq section" id="faq">
    <div className="container">
      <div className="rq-faq__grid">
        <RevealSection className="rq-faq__intro">
          <div className="section-label">Straight Answers</div>
          <h2 className="section-title">
            Frequently Asked <span className="text-sage">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about the Workbook &amp; Curriculum.
          </p>
        </RevealSection>

        <RevealSection className="rq-faq__list" threshold={0.08}>
          {faqs.map((item, i) => (
            <RqFaqRow key={item.id} item={item} index={i} defaultOpen={i === 0} />
          ))}
        </RevealSection>

        <RevealSection className="rq-faq__aside" delay={0.15}>
          <div className="rq-faq__cta">
            <span className="rq-faq__cta-eyebrow">Ready to Begin</span>
            <p className="rq-faq__cta-price">
              <strong>$21</strong> Digital · <strong>$45</strong> Print
            </p>
            <a href="#offer" className="btn btn-gold rq-faq__cta-btn">
              Choose Digital ($21) or Print ($45) →
            </a>
            <p className="rq-faq__cta-fine">
              Instant digital PDF or 454-page physical book with Free US Shipping via Lulu POD
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const RhythmQuestSale = () => {
  useEffect(() => {
    document.title = 'Rhythm Ready Workbook | 8-Week Screen-Free Preschool Readiness & Kindergarten Prep Activities (Ages 2–7)';
  }, []);

  const carouselOrder = [
    'Seriphia', 'Kenji', 'Elias', 'Ezra', 'Ronan', 'Kwame', 'Silas', 'Aiko',
    'Felix', 'Selene', 'Nerissa', 'Octavia', 'Amara', 'Vesta', 'Athena'
  ];

  const allChars = carouselOrder.map(name => {
    const h = heroesData.find(char => char.name === name);
    return { id: h.id, name: h.name, img: h.img, color: h.carouselColor };
  });
  const paradeChars = [...allChars, ...allChars];

  return (
    <div className="rq-sale" style={{ '--rq-hero-bg': `url('${assetPath('/assets/backgrounds/rhythm-ready-meadow-bg.webp')}')` }}>
      {/* ═══ HERO ═══ */}
      <RhythmReadyHero />

      {/* ═══ PROOF & RESEARCH ═══ */}
      <RhythmReadyProof />

      {/* ═══ WHAT'S INSIDE (THE 6 DAILY BLOCKS) ═══ */}
      <RhythmReadyWhatsInside />

      {/* ═══ 8-WEEK ROADMAP ═══ */}
      <RhythmReadyRoadmap />

      {/* ═══ 15 HEROES PARADE ═══ */}
      <section className="rq-characters">
        <div className="rq-char-parade" aria-label="Hero parade">
          {paradeChars.map((c, i) => (
            <div key={`${c.id}-${i}`} className="rq-char-item">
              <img
                src={assetPath(`/assets/characters/${c.name.toUpperCase()}.webp`)}
                alt={c.name}
                className="rq-char-item__img"
                loading="lazy"
              />
              <span className="rq-char-item__name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ THE OFFER (WORKBOOK) ═══ */}
      <RhythmReadyOffer />

      {/* ═══ COMPANION DICTIONARY PRE-SALE ═══ */}
      <DictionaryPreSaleOffer />

      {/* ═══ FAQ ═══ */}
      <RhythmReadyFaq />

      {/* ═══ FINAL CTA ═══ */}
      <section className="rq-final-cta section">
        <div className="container">
          <RevealSection>
            <div className="rq-cta-card">
              <div className="scene-backdrop" aria-hidden="true">
                <img
                  src={assetPath('/assets/marketing/quest-collage.webp')}
                  alt=""
                  className="scene-backdrop__img"
                />
                <div className="scene-backdrop__scrim" />
              </div>
              <div className="rq-cta-card__icon" aria-hidden="true">📚</div>
              <h2 className="section-title">
                Get the Workbook &amp; Curriculum Today
              </h2>
              <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                8 Weeks. 40 Days. 400+ Daily Activities. Pre-K to Grade 2 (Ages 2–7).
                <br />
                <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>
                  A multi-sensory, music-powered learning routine.
                </span>
              </p>
              <ConciergeBadge />
              <div className="rq-cta-actions">
                <RqBuyLink format="print" className="btn btn-gold">Order Physical Print Edition — $45 (Free Shipping)</RqBuyLink>
                <RqBuyLink format="digital" className="btn btn-outline">Get Instant Digital PDF — $21</RqBuyLink>
                <a href="#dictionary-presale" className="btn btn-sage">Pre-Order Picture Dictionary — $55 ↓</a>
                <Link to="/listen" className="btn btn-sage">Get the Free Album First</Link>
              </div>
              <div className="rq-guarantee">
                <span>🔒</span> 454-page physical print includes Free US Shipping via Lulu POD · Digital PDF delivers immediately
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Mobile Sticky Thumb Zone CTA ── */}
      <StickyThumbCta
        targetUrl="#offer"
        isExternal={false}
        label="📚 Get the Workbook (Digital $21 / Print $45) →"
        subtext="8-Week Guided Phonics & Readiness Quest"
        badge="⚡️ Digital & Physical Print"
      />
    </div>
  );
};

export default RhythmQuestSale;
