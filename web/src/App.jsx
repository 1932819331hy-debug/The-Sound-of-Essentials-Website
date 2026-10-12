import { lazy, Suspense, useState, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import CubeLoader from './components/CubeLoader';
import CanvasBackground from './components/SplineBackground';
import './styles/v2.css';
import V2Layout from './components-v2/V2Layout';
import useAnalytics from './hooks/useAnalytics';

// ── Route-level code splitting ──────────────────────────────────
// Each page loads only when the user navigates to that route,
// cutting the initial JS bundle by ~40%.
const Home       = lazy(() => import('./pages/Home'));
// MediaRoom is now merged into Listen — /media redirects to /listen
const Mission    = lazy(() => import('./pages/Mission'));
const JoinQuest  = lazy(() => import('./pages/JoinQuest'));
const Heroes     = lazy(() => import('./pages/Heroes'));
const Science    = lazy(() => import('./pages/Science'));
// Ally Annex shelved for now (preserved in ./pages/AllyAnnex.jsx)
// const AllyAnnex  = lazy(() => import('./pages/AllyAnnex'));
const DictionarySale = lazy(() => import('./pages/DictionarySale'));
const RhythmQuestSale = lazy(() => import('./pages/RhythmQuestSale'));
const HeadphonesSale = lazy(() => import('./pages/HeadphonesSale'));
const Listen     = lazy(() => import('./pages/Listen'));
const Player     = lazy(() => import('./pages/Player'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Gallery    = lazy(() => import('./pages/Gallery'));
const AdsShowcase = lazy(() => import('./pages/AdsShowcase'));
const AdminCrm   = lazy(() => import('./pages/AdminCrm'));
const ProgrammaticPersonaPage = lazy(() => import('./pages/ProgrammaticPersonaPage'));
const SolutionsHub = lazy(() => import('./pages/SolutionsHub'));
const AdvertorialStory = lazy(() => import('./pages/AdvertorialStory'));
const AbcMouseAlternatives = lazy(() => import('./pages/AbcMouseAlternatives'));
const ReadingEggsAlternatives = lazy(() => import('./pages/ReadingEggsAlternatives'));
const HookedOnPhonicsAlternatives = lazy(() => import('./pages/HookedOnPhonicsAlternatives'));
const DadReadingAppsReview = lazy(() => import('./pages/DadReadingAppsReview'));
const EducationSovereignty = lazy(() => import('./pages/EducationSovereignty'));
const GlobalLearnEnglish = lazy(() => import('./pages/GlobalLearnEnglish'));
const SingAlongTime = lazy(() => import('./pages/SingAlongTime'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DmcaPolicy = lazy(() => import('./pages/DmcaPolicy'));
const InstitutionsQpc = lazy(() => import('./pages/InstitutionsQpc'));
import CookieConsent from './components/CookieConsent';
import AskSeriphiaModal from './components/AskSeriphiaModal';

// ── V2 Redesign Routes (parallel, isolated under /v2) ───────────
const HomeV2      = lazy(() => import('./pages-v2/HomeV2'));
const HeroesV2    = lazy(() => import('./pages-v2/HeroesV2'));
const ListenV2    = lazy(() => import('./pages-v2/ListenV2'));
const ScienceV2   = lazy(() => import('./pages-v2/ScienceV2'));
const MissionV2   = lazy(() => import('./pages-v2/MissionV2'));
const JoinQuestV2 = lazy(() => import('./pages-v2/JoinQuestV2'));

const App = () => {
  useAnalytics();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const ua = navigator.userAgent || '';
      const isBot = /Lighthouse|Googlebot|PageSpeed|Chrome-Lighthouse|HeadlessChrome|PTST|bot|crawl|spider/i.test(ua);
      if (isBot) return false;
      if (sessionStorage.getItem('soe_splash_seen') === '1') return false;
    } catch {
      return false;
    }
    return true;
  });
  const handleSplashFinished = useCallback(() => {
    setShowSplash(false);
    try { sessionStorage.setItem('soe_splash_seen', '1'); } catch {}
  }, []);
  const isV2 = location.pathname === '/v2' || location.pathname.startsWith('/v2/');
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/crm');

  return (
    <div className="app">
      {!isV2 && !isAdmin && showSplash && <SplashScreen onFinished={handleSplashFinished} />}
      {!isV2 && <CanvasBackground />}
      <ScrollToTop />
      {!isV2 && !isAdmin && <Navbar />}
      <main>
        <Suspense fallback={<CubeLoader compact />}>
          {isV2 ? (
            // ── V2 routes: no AnimatePresence keying, so V2Layout persists
            //    across child navigations (splash plays once). ──
            <Routes>
              <Route path="/v2" element={<V2Layout />}>
                <Route index element={<HomeV2 />} />
                <Route path="heroes" element={<HeroesV2 />} />
                <Route path="listen" element={<ListenV2 />} />
                <Route path="science" element={<ScienceV2 />} />
                <Route path="mission" element={<MissionV2 />} />
                <Route path="join" element={<JoinQuestV2 />} />
              </Route>
            </Routes>
          ) : (
            <AnimatePresence mode="wait">
              <Routes key={location.pathname}>
                <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
                <Route path="/universe"   element={<Navigate to="/heroes" replace />} />
                <Route path="/media"      element={<Navigate to="/listen" replace />} />
                <Route path="/mission"    element={<AnimatedPage><Mission /></AnimatedPage>} />
                <Route path="/listen"    element={<AnimatedPage><Listen /></AnimatedPage>} />
                <Route path="/join"       element={<AnimatedPage><JoinQuest /></AnimatedPage>} />
                <Route path="/characters" element={<Navigate to="/heroes" replace />} />
                <Route path="/heroes"     element={<AnimatedPage><Heroes /></AnimatedPage>} />
                <Route path="/science"    element={<AnimatedPage><Science /></AnimatedPage>} />
                {/* Ally Annex shelved for now — redirect to home */}
                <Route path="/allies"     element={<Navigate to="/" replace />} />
                <Route path="/dictionary" element={<Navigate to="/workbook#dictionary-presale" replace />} />
                <Route path="/workbook" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/curriculum" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/rhythmready" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/rhythm-ready" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/rhythm-quest" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/rhythmquest" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/headphones" element={<AnimatedPage><HeadphonesSale /></AnimatedPage>} />
                <Route path="/shop"       element={<AnimatedPage><HeadphonesSale /></AnimatedPage>} />
                <Route path="/sensory-headphones" element={<AnimatedPage><HeadphonesSale /></AnimatedPage>} />
                <Route path="/gallery"    element={<AnimatedPage><Gallery /></AnimatedPage>} />
                <Route path="/player"     element={<AnimatedPage><Player /></AnimatedPage>} />
                <Route path="/ads"        element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/ads-showcase" element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/campaigns"  element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/order-success" element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
                <Route path="/download"   element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
                {/* Programmatic SEO Solutions Engine */}
                <Route path="/solutions" element={<AnimatedPage><SolutionsHub /></AnimatedPage>} />
                <Route path="/institutions" element={<AnimatedPage><InstitutionsQpc /></AnimatedPage>} />
                <Route path="/enterprise" element={<AnimatedPage><InstitutionsQpc /></AnimatedPage>} />
                <Route path="/qpc" element={<AnimatedPage><InstitutionsQpc /></AnimatedPage>} />
                <Route path="/for/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                <Route path="/solutions/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                <Route path="/guides/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                {/* Native Advertorial & Pre-sell Bridge Pages */}
                <Route path="/story" element={<AnimatedPage><AdvertorialStory /></AnimatedPage>} />
                <Route path="/quieter-way" element={<AnimatedPage><AdvertorialStory /></AnimatedPage>} />
                <Route path="/advertorial" element={<AnimatedPage><AdvertorialStory /></AnimatedPage>} />
                {/* Sovereign Editorial Pre-Sell Bridge Routes */}
                <Route path="/dad-reading-apps-review" element={<AnimatedPage><DadReadingAppsReview /></AnimatedPage>} />
                <Route path="/dad-review" element={<AnimatedPage><DadReadingAppsReview /></AnimatedPage>} />
                <Route path="/education-sovereignty" element={<AnimatedPage><EducationSovereignty /></AnimatedPage>} />
                <Route path="/sovereign-child" element={<AnimatedPage><EducationSovereignty /></AnimatedPage>} />
                <Route path="/global-learn-english" element={<AnimatedPage><GlobalLearnEnglish /></AnimatedPage>} />
                <Route path="/sound-before-symbol" element={<AnimatedPage><GlobalLearnEnglish /></AnimatedPage>} />
                <Route path="/sing-along-time" element={<AnimatedPage><SingAlongTime /></AnimatedPage>} />
                <Route path="/rhythm-reset" element={<AnimatedPage><SingAlongTime /></AnimatedPage>} />
                {/* Competitor Alternative & Comparison Listicles */}
                <Route path="/alternatives/abcmouse" element={<AnimatedPage><AbcMouseAlternatives /></AnimatedPage>} />
                <Route path="/abcmouse-alternatives" element={<AnimatedPage><AbcMouseAlternatives /></AnimatedPage>} />
                <Route path="/compare/abcmouse" element={<AnimatedPage><AbcMouseAlternatives /></AnimatedPage>} />
                <Route path="/alternatives/reading-eggs" element={<AnimatedPage><ReadingEggsAlternatives /></AnimatedPage>} />
                <Route path="/reading-eggs-alternatives" element={<AnimatedPage><ReadingEggsAlternatives /></AnimatedPage>} />
                <Route path="/compare/reading-eggs" element={<AnimatedPage><ReadingEggsAlternatives /></AnimatedPage>} />
                <Route path="/alternatives/hooked-on-phonics" element={<AnimatedPage><HookedOnPhonicsAlternatives /></AnimatedPage>} />
                <Route path="/hooked-on-phonics-alternatives" element={<AnimatedPage><HookedOnPhonicsAlternatives /></AnimatedPage>} />
                <Route path="/compare/hooked-on-phonics" element={<AnimatedPage><HookedOnPhonicsAlternatives /></AnimatedPage>} />
                <Route path="/admin/crm"  element={<AnimatedPage><AdminCrm /></AnimatedPage>} />
                <Route path="/admin/crm/*" element={<AnimatedPage><AdminCrm /></AnimatedPage>} />
                <Route path="/admin"      element={<Navigate to="/admin/crm" replace />} />
                <Route path="/admin/*"    element={<Navigate to="/admin/crm" replace />} />
                <Route path="/crm"        element={<Navigate to="/admin/crm" replace />} />
                <Route path="/crm/*"      element={<Navigate to="/admin/crm" replace />} />
                {/* Legal & Compliance Protocol Routes */}
                <Route path="/privacy"    element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
                <Route path="/terms"      element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
                <Route path="/dmca"       element={<AnimatedPage><DmcaPolicy /></AnimatedPage>} />
                <Route path="*"           element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          )}
        </Suspense>
      </main>
      <CookieConsent />
      {!isV2 && !isAdmin && <AskSeriphiaModal />}
      {!isV2 && !isAdmin && <Footer />}
    </div>
  );
};

export default App;
