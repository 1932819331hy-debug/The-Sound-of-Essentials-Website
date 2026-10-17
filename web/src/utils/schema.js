/**
 * schema.js — Schema.org JSON-LD generators for SOE Rhythm Quest
 *
 * Each function returns a plain object (or array) ready to be passed
 * to the <JsonLd data={...} /> component.
 */
import heroesData from '../data/heroes.json';
import tracksData from '../data/tracks.json';
import landsData  from '../data/lands.json';
import productsData from '../data/products.json';

const SITE_URL  = 'https://thesoundofessentials.com';
const SITE_NAME = 'The Sound of Essentials: Rhythm Quest';
const ORG_LOGO  = `${SITE_URL}/assets/marketing/quest-collage.webp`;

/* ─────────────────────────────────────────────
 * Home — EducationalOrganization + WebSite
 * ───────────────────────────────────────────── */
export function homeSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
      email: 'info@soelearn.com',
      logo: ORG_LOGO,
      description: 'A music-powered educational experience designed for the developing brain. 19 original tracks, 15 heroes, and 7 thematic lands guide children Ages 2–7 (Pre-K through Grade 2) through language, math, movement, science, and more.',
      foundingDate: '2024',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@soelearn.com',
        contactType: 'Customer Support',
        availableLanguage: ['English', 'French'],
      },
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        suggestedMinAge: 2,
        suggestedMaxAge: 7,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

/* ─────────────────────────────────────────────
 * Heroes — ItemList of Person entities
 * ───────────────────────────────────────────── */
export function heroesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SOE Rhythm Quest Heroes',
    description: '15 heroes who guide children through music-powered learning across 7 thematic lands.',
    numberOfItems: heroesData.length,
    itemListElement: heroesData.map((hero, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: hero.name,
        jobTitle: hero.title,
        description: hero.bio,
        image: `${SITE_URL}${hero.selfie}`,
        knowsAbout: hero.traits,
        memberOf: {
          '@type': 'Organization',
          name: `Land of ${hero.land}`,
        },
      },
    })),
  };
}

/* ─────────────────────────────────────────────
 * Media Room — MusicAlbum + MusicRecording[]
 * ───────────────────────────────────────────── */
export function mediaRoomSchema(trackTitles) {
  // trackTitles is an array of { id, title, domain } from the translated component
  const titleMap = {};
  if (trackTitles) {
    trackTitles.forEach(t => { titleMap[t.id] = t; });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: 'The Sound of Essentials: A Musical Learning Experience',
    description: '19 original educational tracks designed for the developing brain, covering language, math, movement, time, nature, and more.',
    numTracks: tracksData.length,
    gtin12: '885000556098',
    genre: ['Children\'s Music', 'Educational'],
    byArtist: {
      '@type': 'MusicGroup',
      name: 'The Sound of Essentials',
    },
    image: `${SITE_URL}/assets/marketing/quest-collage.webp`,
    track: tracksData.map((track, i) => ({
      '@type': 'MusicRecording',
      position: i + 1,
      name: titleMap[track.id]?.title || track.slug.replace(/-/g, ' '),
      description: titleMap[track.id]?.domain || track.domainIcon,
      image: `${SITE_URL}/assets/track-art/${track.cover}`,
      genre: 'Educational',
      inAlbum: {
        '@type': 'MusicAlbum',
        name: 'The Sound of Essentials: A Musical Learning Experience',
        gtin12: '885000556098',
      },
    })),
  };
}

/* ─────────────────────────────────────────────
 * Universe — Course with CoursePart for each land
 * ───────────────────────────────────────────── */
export function universeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'The SOE Rhythm Quest Universe',
    description: 'A music-powered curriculum spanning 7 thematic lands, each focusing on a developmental domain from language and math to movement and science.',
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    educationalLevel: 'Pre-K through Grade 2 (Ages 2–7)',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: 2,
      suggestedMaxAge: 7,
    },
    hasPart: landsData.map((land, i) => ({
      '@type': 'Course',
      position: i + 1,
      name: land.name,
      description: `${land.focus} — guided by ${land.duoLabel}`,
      image: `${SITE_URL}/assets/lands/${land.panorama}`,
      educationalLevel: 'Pre-K through Grade 2 (Ages 2–7)',
      teaches: land.focus,
    })),
  };
}

/* ─────────────────────────────────────────────
 * Products — Product + Offer for each item
 * ───────────────────────────────────────────── */
export function productsSchema() {
  return productsData.map(product => ({
    '@context': 'https://schema.org',
    '@type': product.type === 'music-album' ? 'MusicAlbum' : 'Product',
    name: product.name,
    description: product.description,
    // Omit rather than emit an unreachable URL — Google drops the whole Product result
    // for a broken image. Products with no cover art yet carry `cover: null`.
    ...(product.cover ? { image: `${SITE_URL}${product.cover}` } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Sound of Essentials',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: 2,
      suggestedMaxAge: 7,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: product.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'The Sound of Essentials',
      },
    },
    ...(product.isbn ? { isbn: product.isbn } : {}),
    ...(product.gtin12 ? { gtin12: product.gtin12 } : {}),
    ...(product.features ? {
      additionalProperty: product.features.map(f => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: f,
      })),
    } : {}),
  }));
}

/* ─────────────────────────────────────────────
 * FAQ Page — Structured FAQ schema for rich snippets & AI answers
 * ───────────────────────────────────────────── */
export function faqSchema(faqItems) {
  if (!faqItems || faqItems.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/* ─────────────────────────────────────────────
 * Institutional FAQ — Head Start, State DOE, and Pre-K Procurement Schema
 * ───────────────────────────────────────────── */
export function institutionalFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does The Sound of Essentials align with Head Start ELOF and State Early Learning Standards?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Sound of Essentials: Rhythm Quest delivers turnkey 10–15 minute screen-free classroom lesson extensions across all 5 Core Domains (Language & Literacy, Cognition & Math, Physical & Perceptual Motor, Scientific Inquiry, and Social-Emotional Development). All modules are crosswalked to Head Start ELOF, NAEYC standards, and 28 State-Approved Early Learning Guidelines.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the Rhythm Quest curriculum require screens, tablets, or internet access in classrooms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The curriculum is 100% screen-free. Instruction is delivered via acoustic high-fidelity audio tracks, physical educator lesson cards, hands-on rhythm instruments, and tactile readiness workbooks to protect young nervous systems from overstimulation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What age groups and grade levels are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The curriculum is specifically engineered for children Ages 2–7, spanning Toddler, Early Head Start, Pre-K, Kindergarten, Grade 1, and Grade 2.',
        },
      },
      {
        '@type': 'Question',
        name: 'What materials are included in an institutional or preschool classroom license?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Institutional Concord packages include multi-room acoustic audio site licenses, educator card sets with 10 daily structured blocks (A–J), 400 hands-on readiness activities, the 4,232-word Essential Picture Dictionary, and teacher professional development crosswalk matrices.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does school district and institutional procurement work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept school district Purchase Orders (POs), institutional credit cards, and state early childhood grant disbursements (Title I, ESSER, and Head Start quality improvement funds). Inquiries receive custom proposal exhibits within 24 business hours.',
        },
      },
    ],
  };
}

/* ─────────────────────────────────────────────
 * Competitor Comparison FAQ — Structured AEO Schema for Alternatives Pages
 * ───────────────────────────────────────────── */
export function comparisonFaqSchema(competitorName = 'ABCmouse') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Why are parents and educators seeking screen-free alternatives to ${competitorName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Many families and early educators experience behavioral overstimulation, screen fatigue, and passive tap-and-guess mechanics with tablet-based apps. Screen-free alternatives like The Sound of Essentials: Rhythm Quest ground learning in acoustic musical rhythm, fine-motor pencil grip, and sensory tactile exploration for ages 2–7.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How does auditory and music-powered learning compare to visual tablet apps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Peer-reviewed research in Nature Scientific Reports demonstrates that rhythm discrimination directly trains the temporal processing networks in the brain responsible for phonemic segmentation—the root foundation of reading proficiency—without inducing dopamine-spiking screen addiction.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much time does each daily Sound of Essentials lesson take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lessons are designed as focused 10 to 15 minute screen-free daily blocks, making them sustainable for busy parents and seamless for preschool circle time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the starting price to begin The Sound of Essentials?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The full 19-track Deluxe album is gifted 100% free ($0). Families and schools can pair the music with the $19 Rhythm Quest companion book and physical print workbooks with zero recurring subscription lock-in.',
        },
      },
    ],
  };
}

