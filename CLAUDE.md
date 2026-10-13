# CLAUDE.md — The Sound of Essentials: Rhythm Quest

> Project context for AI assistants working on this codebase.

## Project Identity

**The Sound of Essentials: Rhythm Quest** is an **artist collective** and sensory-first, music-driven early childhood learning ecosystem. The companion website introduces 7 themed Lands, 15 hero characters (guided and marketed by Seriphia), and a scientifically grounded curriculum for ages 2–7.

**Organizational Structure & Personas:**
- **Artist Collective:** SOE is an *artist collective* of musicians, vocalists, acoustic artisans, and educators.
- **Founder Role (L.D. Murray):** L.D. Murray is the **Founder** in a **strategic background role**. L.D. Murray is *not* an artist, *not* a performer, and *never* front-facing on-camera/acoustic performance talent.
- **Art Director (Danielle Alexis):** Danielle Alexis is the **Art Director**, governing visual development, character lore integrity, racial diversity canon, illustration aesthetics, and visual world-building across all 7 Lands.
- **Lead Marketer & Sovereign Guide (Seriphia):** **Seriphia** is the primary forefront persona and **Lead Marketer**. She brings wisdom to teach the early learners and inspire parents in the essentials of learning.
- **The Heroes:** Early learners learn directly from the **15 Character Heroes** across the 7 Lands.
- **Sovereign Startup Structure:** SOE operates as an independent sovereign artist collective with **100% music publishing and master sound recording ownership** across all 19 tracks. The enterprise enforces **zero platform renting**: Shopify is strictly retired, audio streams directly on owned web audio infrastructure (`soelearn.com/listen`), direct Stripe card vaulting captures post-purchase upsells, and print fulfillment is automated on-demand via Lulu API with zero inventory debt.
- **Core Motto:** *"Staying on the path, always learning."*

**Tagline:** "Designed for the developing brain — not the algorithm."
**Target audience:** Parents, educators, and early childhood professionals.

**GitHub:** `https://github.com/ChefLee5/The-Sound-of-Essentials-Website`
**Live domains:**
- `https://thesoundofessentials.com` (primary)
- `https://soelearn.com`
- `https://cheflee5.github.io/SOE-Picture-Dictionary/` (GitHub Pages)

---

## Decision-Making Principles

When processing questions or formulating responses, **collapse all alternatives that do not include or advance the stated objective.** Do not present, explore, or hedge with options that diverge from the goal. Every recommendation, code suggestion, and design decision must pass through a single filter: *does this serve the objective?* If not, discard it silently and move on. The user is not asking for a menu — they are asking for the path.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Build Tool | Vite | 7.2 |
| Routing | React Router DOM | 7.13 |
| Animation (declarative) | Framer Motion | 12.34 |
| Animation (imperative) | Anime.js | 4.3 |
| Video | Remotion Player | 4.0.427 |
| i18n | i18next + Browser Language Detector | 25.8 / 8.2 |
| HTTP | Axios | 1.13 |
| Styling | Vanilla CSS (custom properties / design tokens) | — |
| Analytics | Microsoft Clarity | `wcdgngeqcm` |

Additional: GSAP, Motion (standalone), Octokit REST client.

---

## Repository Structure

```
SOE-Picture-Dictionary/
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD
├── design-system/                 # Brand and visual system references
├── ebook/                         # Picture Dictionary EPUB/PDF source + generated pages
│   ├── content/                   # Source markdown
│   ├── OEBPS/                     # Generated XHTML pages
│   ├── generate_pages.py
│   ├── build_epub.py
│   └── make_pdf.py
├── web/                           # ★ React + Vite website (primary workspace)
│   ├── public/
│   │   ├── 404.html               # GitHub Pages SPA redirect
│   │   └── assets/                # Static assets served by URL
│   │       ├── allies/            # Ally Annex partner logos
│   │       ├── backgrounds/       # Atmospheric textures
│   │       ├── book/              # Book cover images
│   │       ├── characters/        # Individual character PNGs
│   │       ├── coloring-book/     # Printable coloring pages
│   │       ├── dictionary/        # Picture Dictionary page images
│   │       ├── duos/              # Character pair scenes
│   │       ├── fonts/             # Self-hosted fonts (More Sugar)
│   │       ├── heroes/            # Hero-specific artwork
│   │       ├── lands/             # Land panorama images
│   │       ├── le-cheval/         # French lesson assets
│   │       ├── marketing/         # Marketing collateral
│   │       ├── media/             # Media room assets
│   │       ├── pages/             # Page-specific imagery
│   │       ├── scenes/            # In-story scene art
│   │       ├── shapes/            # Shape learning assets
│   │       └── track-art/         # Music track cover art
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ui/                # Primitive UI components
│   │   │   ├── Navbar.jsx         # Fixed glassmorphism navbar with language picker
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── SplashScreen.jsx   # Cinematic entry animation
│   │   │   ├── SplineBackground.jsx # Canvas 2D animated background (orbs, notes, sparkles)
│   │   │   ├── MusicPlayerWidget.jsx # Persistent music player
│   │   │   ├── DictionaryCarousel.jsx # Interactive dictionary carousel
│   │   │   ├── TrackStack.jsx     # Track listing component
│   │   │   ├── StoryScroll.jsx    # Scroll-based story component
│   │   │   ├── ParallaxHero.jsx   # Parallax scroll hero sections
│   │   │   ├── AnimatedPage.jsx   # Framer Motion page transition wrapper
│   │   │   ├── ScrollToTop.jsx    # Floating scroll-to-top button
│   │   │   ├── CubeLoader.jsx     # Loading state component
│   │   │   ├── GooeyMarquee.jsx   # Gooey text marquee effect
│   │   │   └── JsonLd.jsx         # Structured data component
│   │   ├── data/                  # Static JSON data files
│   │   │   ├── heroes.json        # 15 characters
│   │   │   ├── lands.json         # 7 lands
│   │   │   ├── tracks.json        # 19 music tracks
│   │   │   ├── products.json      # 4 products
│   │   │   └── gallery.json       # Gallery data
│   │   ├── hooks/
│   │   │   ├── useReveal.jsx      # CSS IntersectionObserver scroll reveal
│   │   │   └── useAnimeReveal.js  # Anime.js staggered reveal
│   │   ├── i18n/
│   │   │   ├── config.js          # i18next initialization
│   │   │   └── locales/
│   │   │       ├── en.json        # English (~28KB)
│   │   │       ├── es.json        # Spanish (~25KB)
│   │   │       └── fr.json        # French (~28KB)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page (hero, stats, features, domains, book, CTA)
│   │   │   ├── Universe.jsx       # 7 Lands explorer
│   │   │   ├── Heroes.jsx         # Character gallery with filter + expand
│   │   │   ├── Listen.jsx         # Music listening experience + funnel gate
│   │   │   ├── Player.jsx         # Full music player page
│   │   │   ├── DictionarySale.jsx # Picture Dictionary product page
│   │   │   ├── Science.jsx        # Science behind the curriculum
│   │   │   ├── Mission.jsx        # Mission & philosophy
│   │   │   ├── JoinQuest.jsx      # Newsletter + partnership contact
│   │   │   ├── AllyAnnex.jsx      # Affiliate partnerships page
│   │   │   └── MediaRoom.jsx      # Media gallery (legacy, redirects to /listen)
│   │   ├── remotion/              # Remotion video compositions
│   │   ├── utils/
│   │   │   └── assetPath.js       # Resolves BASE_URL asset paths
│   │   ├── App.jsx                # Root: routes, lazy loading, AnimatePresence
│   │   ├── App.css                # Minimal app-level overrides
│   │   ├── main.jsx               # Entry: StrictMode, BrowserRouter
│   │   └── index.css              # Global design system (1041 lines)
│   ├── scripts/                   # Build/utility scripts
│   ├── convert-assets.mjs         # Image optimization pipeline (→ WebP)
│   ├── vite.config.js             # Vite config with ebook serving plugin
│   └── package.json
├── workbook/                      # Rhythm Ready Workbook source + generated pages
│   ├── workbook_content.json      # 664 lines of activity data
│   └── generate_workbook.py
├── web/wrangler.toml              # Cloudflare Pages & edge functions config
└── README.md
```

---

## Routes

All routes use `React.lazy()` code-splitting. Page transitions use Framer Motion `AnimatePresence`.

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with hero, stats, features, domains, book feature, CTAs |
| `/universe` | Universe | 7 Lands explorer |
| `/heroes` | Heroes | Character gallery with land-based filtering and expandable cards |
| `/listen` | Listen | Music listening experience and funnel gate (email opt-in for free tracks) |
| `/player` | Player | Full music player page |
| `/dictionary` | DictionarySale | Picture Dictionary product/sales page |
| `/workbook` | RhythmQuestSale | Rhythm Ready Workbook & Curriculum sales page |
| `/rhythm-ready` | RhythmQuestSale | Rhythm Ready Workbook direct sales route |
| `/science` | Science | Science behind the curriculum |
| `/mission` | Mission | Mission statement and philosophy |
| `/join` | JoinQuest | Newsletter signup + partnership contact form |
| `/allies` | AllyAnnex | Affiliate partnerships page |

**Redirects & Aliases:**
- `/characters` → `/heroes`
- `/media` → `/listen`
- `/rhythmready`, `/summer-stretch`, `/curriculum` → `/workbook`

---

## The 7 Lands & 15 Characters

| Land | Theme | Characters | Color |
|------|-------|------------|-------|
| 🎵 Harmonia | Language & Culture | Kenji, Aiko | `#d4a843` |
| 🔢 Numeria | Math & Numbers | Kwame, Octavia | `#7fb685` |
| 🌿 Vitalis | Physical & Motor Skills | Felix, Amara | `#c4785a` |
| 🔭 Celestia | Time & Seasons | Elias, Selene | `#9678c4` |
| 📖 Luminosity | Advanced Language | Ronan, Nerissa | `#d4a843` |
| 📐 Geometria | Shapes & Spatial Reasoning | Silas, Vesta | `#7fb685` |
| 🌊 Terrasol | Science & Nature | Ezra, Athena | `#5ba4c9` |

**Seriphia** is the guardian character who oversees all 7 Lands (`featured: true`, purple `#9C27B0`).

**Character data model** (`heroes.json`):
```json
{
  "name": "string",
  "title": "string",
  "land": "string",
  "landColor": "#hex",
  "focus": "string",
  "img": "/assets/characters/NAME.png",
  "bio": "string",
  "traits": ["string", "string", "string"],
  "featured": false
}
```

---

## Product Catalog

| Product | Price | Format | Data Key |
|---------|-------|--------|----------|
| Rhythm Quest Album (19 tracks) | Free stream / $19 download | Digital Audio | `rhythm-quest-album` |
| Essential Picture Dictionary | **$55** | EPUB | `picture-dictionary` |
| Rhythm Ready Workbook | $21 / $35 | PDF | `rhythmready-workbook` |
| The Full Quest Bundle | $89 | Digital Bundle | `full-quest-bundle` |

Data source: `web/src/data/products.json`

---

## Design System

The design system lives in `web/src/index.css` (1041 lines). Philosophy: "Bright & Playful — Warm. Vibrant. Joyful." Calm, neuro-affirming aesthetic — not overstimulating neon.

### Color Tokens (CSS Custom Properties)

```css
/* Backgrounds */
--color-bg-cream: #faf9f7;     /* Body background */
--color-bg-light: #f3f1ee;     /* Light sections */
--color-bg-card: #ffffff;      /* Card backgrounds */

/* Primary Accents */
--color-orange: #FF6F00;       /* Primary CTA / gold */
--color-green: #4CAF50;        /* Nature / success / sage */
--color-purple: #7B1FA2;       /* Magic / wisdom / plum */
--color-blue: #1E88E5;         /* Science / links */
--color-yellow: #FFB300;       /* Warmth / highlights */
--color-red: #E53935;          /* Errors */

/* Text */
--color-text-primary: #E65100;
--color-text-secondary: #F57C00;
--color-text-dark: #1a1a2e;
--color-text-dark-secondary: #555568;
```

### Typography

| Token | Fonts | Usage |
|-------|-------|-------|
| `--font-display` | Bricolage Grotesque, Outfit | Navbar, display text |
| `--font-heading` | Fredoka, Outfit | Headings, buttons |
| `--font-body` | Inter | Body text |
| `--font-accent` | Fredoka | Accent text |
| `--font-cursive` | Dancing Script | Section subtitles |
| `--font-sugar` | More Sugar (self-hosted) | Special display |

### Spacing & Radii

```css
--radius-sm: 12px;   /* Inputs, small elements */
--radius-md: 20px;   /* Cards, images */
--radius-lg: 28px;   /* Glass cards */
--radius-xl: 50px;   /* Buttons, badges, pills */
```

### Core UI Classes

| Class | Purpose |
|-------|---------|
| `.btn` | Base button (pill shape, font-heading, 600 weight) |
| `.btn-gold` | Orange gradient CTA |
| `.btn-sage` | Green gradient secondary |
| `.btn-plum` | Purple gradient tertiary |
| `.btn-outline` | Ghost style with border |
| `.glass-card` | White card with 2px border, 28px radius, hover lift |
| `.section-label` | Gradient pill badge (green→blue), uppercase |
| `.section-subtitle` | Dancing Script cursive, orange |
| `.divider` | 60×4px gradient bar (green→blue) |
| `.glow-sage` | Green gradient background section |
| `.glow-plum` | Purple gradient background section |
| `.scene-strip` | Full-bleed panoramic with Ken Burns animation |
| `.scene-backdrop` | Subtle background imagery for hero/CTA sections |
| `.page-hero` | Standardized page hero padding (clears fixed navbar) |

---

## Animation System

### CSS Keyframes
- `fadeInUp` — Translate up 30px + fade in
- `fadeIn` — Simple opacity fade
- `gentleFloat` — 12px vertical float loop
- `softPulse` — Opacity pulse (0.6–1.0)
- `shimmer` — Horizontal background shimmer
- `kenBurns` — Slow cinematic zoom + drift (16s alternate)

### Hooks
- `useReveal` — CSS IntersectionObserver, adds `.revealed` class, threshold 0.15
- `useAnimeReveal` — Anime.js staggered reveal animations

### Canvas Background (`SplineBackground.jsx`)
Pure Canvas 2D replaces the original Spline 3D:
- 8 Orbs (large soft gradient circles)
- 22 Notes (musical glyphs: ♩ ♪ ♫ ♬ 𝅗𝅥 ♭ ♮)
- 40 Sparkles (tiny pulsing dots)
- Fixed position, z-index: 0, pointer-events: none

### Splash Screen
3-phase lifecycle: enter (0–800ms) → show (800–3000ms) → exit (3000–3700ms). Features animated color orbs, concentric rings, floating notes, letter-by-letter title reveal, and gradient loading bar.

---

## Coding Patterns

### CSS Architecture
- **Global design system:** `web/src/index.css` — all tokens, utilities, and shared classes
- **Page-specific CSS:** Some pages use `<style>` JSX tags at end of component; others use separate `.css` files (`Listen.css`, `AllyAnnex.css`, `DictionarySale.css`)
- **Naming:** BEM-like — `.component__element--modifier` (e.g., `.char-card__image-wrap`, `.navbar__link--active`)

### i18n Pattern
All user-facing text uses the `useTranslation()` hook:
```jsx
const { t } = useTranslation();
<h1>{t('page.hero_title_1')} <span>{t('page.hero_title_2')}</span></h1>
```
Active locales: English 🇺🇸, Spanish 🇪🇸, French 🇫🇷

### Asset Path Pattern
Two approaches coexist:
1. **Template literal:** `` `${import.meta.env.BASE_URL}assets/...` ``
2. **Utility function:** `assetPath('/assets/...')` (from `src/utils/assetPath.js`)

### Page Structure Pattern
Every page follows:
1. Hero header (often with `scene-backdrop`)
2. Multiple `.section` blocks with `.container` wrappers
3. `RevealSection` wraps for scroll animations
4. Bottom CTA linking to next logical page
5. `useEffect` sets `document.title`

### Scene Backdrop Pattern
Used for atmospheric hero/CTA backgrounds:
```jsx
<div style={{ position: 'relative', overflow: 'hidden' }}>
  <div className="scene-backdrop" aria-hidden="true">
    <img src={assetPath('/assets/marketing/quest-collage.webp')}
         className="scene-backdrop__img" />
    <div className="scene-backdrop__scrim" />
  </div>
  <div className="container" style={{ position: 'relative', zIndex: 1 }}>
    {/* Content */}
  </div>
</div>
```

### Route-Level Code Splitting
All pages are lazy-loaded via `React.lazy()`, wrapped in `<Suspense>` with `<CubeLoader>` fallback.

---

## Data Sources

| File | Location | Records | Description |
|------|----------|---------|-------------|
| `products.json` | `web/src/data/` | 4 products | Product catalog with pricing |
| `tracks.json` | `web/src/data/` | 19 tracks | Album track listing with land assignments |
| `heroes.json` | `web/src/data/` | 15 characters | Character bios, traits, land mapping |
| `lands.json` | `web/src/data/` | 7 lands | Land descriptions and metadata |
| `gallery.json` | `web/src/data/` | — | Gallery data (currently empty) |
| Locale files | `web/src/i18n/locales/` | 3 languages | EN (~28KB), ES (~25KB), FR (~28KB) |

---

## Development

### Quick Start
```bash
cd web
npm install
npm run dev
```
Dev server: `http://localhost:5173/`

### Commands (run from `web/`)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `web/dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Ebook Scripts (run from `ebook/`)
| Script | Purpose |
|--------|---------|
| `python generate_pages.py` | Generate XHTML pages from markdown |
| `python build_epub.py` | Build EPUB from generated pages |
| `python make_pdf.py` | Generate PDF from EPUB |

### Workbook Scripts (run from `workbook/`)
| Script | Purpose |
|--------|---------|
| `python generate_workbook.py` | Generate workbook pages from JSON |

### Image Optimization
```bash
cd web
node convert-assets.mjs
```
Converts source images to optimized WebP for production use.

---

## Deployment

### GitHub Pages (Primary)
- **Workflow:** `.github/workflows/deploy.yml` — deploys on push to `main`
- **Base path:** `/SOE-Picture-Dictionary/`
- **Config locations:** `vite.config.js` (`base`) and `main.jsx` (`BrowserRouter basename`)
- **SPA handling:** `public/404.html` redirects via sessionStorage

### Cloudflare Pages (Free Full-Stack / Edge API)
- **Config:** `web/wrangler.toml`
- **Edge Functions:** `web/functions/api/` (Handles `/api/submit` with Neon DB + Brevo CRM)
- **Deploy:** `npm run deploy:cf` (runs `vite build` then `wrangler pages deploy dist`)
- **Output:** `web/dist`
- **Live Endpoint:** `https://soe-website-b7j.pages.dev`

> ⚠️ If the repo name or Pages path changes, update both `web/vite.config.js` (`base`) and `web/src/main.jsx` (`BrowserRouter basename`).

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|-----------|-------------|
| `1024px` | Navbar link font size reduction |
| `968px` | Grid columns collapse, section padding reduces |
| `840px` | Mobile navbar drawer activates |
| `768px` | Most grids → 1-2 columns, page hero padding reduces |
| `640px` | Font base → 15px, centered hero text |
| `480px` | Container padding → 1.25rem |

---

## Accessibility

- `:focus-visible` outline: 3px solid blue with 3px offset
- `.sr-only` utility for screen-reader-only text
- ARIA attributes throughout: `aria-label`, `aria-expanded`, `aria-current`, `role`
- Semantic HTML5 elements

---

## Key Conventions

1. **No Tailwind** — This project uses vanilla CSS with custom properties. Do not introduce Tailwind.
2. **Use design tokens** — Always reference `--color-*`, `--font-*`, `--radius-*` variables from `index.css`. Never hardcode colors or font stacks.
3. **i18n all text** — Every user-facing string must use `t()` from `useTranslation()`. Add keys to all three locale files (en, es, fr).
4. **Lazy-load pages** — New pages must use `React.lazy()` in `App.jsx`.
5. **BEM naming** — CSS classes follow `.block__element--modifier` convention.
6. **Assets in `public/`** — Static media goes in `web/public/assets/`. Only React-imported assets go in `web/src/assets/`.
7. **Keep generated files in sync** — When editing ebook or workbook source data, regenerate the corresponding output files.
8. **Scene images are WebP** — All scene/background images should be optimized WebP format.
9. **Page titles** — Every page sets `document.title` via `useEffect`.
10. **Preserve the calm aesthetic** — "Bright & Playful" means warm and vibrant, not loud or overstimulating. Respect the neuro-affirming design philosophy.
11. **Canonical Age Range (Ages 2–7)** — Always use **Ages 2–7** across all copy, UI badges, ad creatives, metadata, and multilingual translation strings (EN: "Ages 2–7", ES: "2 a 7 años", FR: "2 à 7 ans"). Never use "Ages 2–8", "Pre-K to Grade 3", or other variants.
12. **Streamlined Funnel Unlock** — Upon lead capture / unlock on `/listen`, keep the transition seamless without redundant full-width success banners. Flow directly into the interactive player launch CTA and the $21 Rhythm Ready Workbook tripwire bridge.
13. **Asset & PDF Compression Pipeline** — Illustrated book PDFs and high-res print deliverables must be optimized using PyMuPDF (`garbage=4`, `deflate=True`, `clean=True`) with raster downsampling (150 DPI for web digital downloads, 300 DPI for print PDFs) to keep digital deliverables under 15MB.
14. **Digital Product Policy (Zero Return Policy / No Money-Back Guarantees)** — All products sold across the platform (Rhythm Ready Workbook PDF, Essential Picture Dictionary EPUB, Album downloads, and Digital Bundles) are instant downloadable digital goods. In accordance with standard market digital goods policy, do NOT offer, mention, or promise money-back guarantees, 30-day refund policies, or returns anywhere on the site, sales pages, checkout funnels, email sequences, or ad blueprints. Customer assurance must be anchored in product quality, instant digital delivery, printable/tablet-ready compatibility, and lifetime family access.
15. **Multilingual Learning Architecture (English · Español · Français):** SOE features a triple-language acoustic immersion curriculum designed for ages 2–7 without digital screens. It integrates English, Spanish, and French phonemic pathways into the core music catalog and tactile print materials:
   - **Interactive Language Switcher:** `web/src/components/Navbar.jsx` provides an interactive language selector with flags (`🇺🇸 EN`, `🇪🇸 ES`, `🇫🇷 FR`) for desktop and mobile navigation.
   - **Strict Localization Parity:** All user-facing strings across all three languages are maintained in `web/src/i18n/locales/en.json`, `es.json`, and `fr.json`.
   - **Institutional Alignment:** Built to support Head Start Dual Language Learners (over 32% of enrollment) and ESSA Title III compliance for public school and district procurement.
16. **Music Canon & Audio Production (Absolute):** The Sound of Essentials is **originally published music**, **recorded live in studio sessions** (19 master tracks across 7 Lands).
    - **No Live Instrumentation / No Live Music:** SOE was recorded live, but does **NOT** feature live instrumentation or live music. Never claim "live instruments", "live instrumentation", "live orchestra", or "live music".
    - **Zero Invented Instruments:** Never hallucinate or claim specific instruments (e.g., violins, cellos, upright bass, kalimbas, nylon guitars, harps, djembes).
17. **Canon Copy Fidelity & Zero Hallucinated Claims:** Stick strictly to documented canon copy and compound what has been established. Never deviate, invent new marketing claims, or hallucinate features for emails, listicles, advertorials, or web pages.


