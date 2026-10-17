import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';
import { comparisonFaqSchema } from '../utils/schema';

const HookedOnPhonicsAlternatives = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('3600px');

  useEffect(() => {
    document.title = 'The 5 Best Hooked on Phonics Screen-Free Alternatives in 2026 | The Sound of Essentials.com';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Looking for screen-free Hooked on Phonics alternatives? Discover the top 5 auditory and tactile reading programs for ages 2–7, ranked by phonemic decoding retention, hands-on handwriting, and zero tablet dependency.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/alternatives/hooked-on-phonics';

    window.scrollTo(0, 0);

    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'ADV_RESIZE' || event.data.type === 'RESIZE') && event.data.height > 0) {
        setIframeHeight(`${event.data.height + 40}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'The 5 Best Hooked on Phonics Screen-Free Alternatives in 2026',
      'description': 'An objective parent and educator review evaluating the 5 best screen-free Hooked on Phonics alternatives for early literacy (ages 2–7), ranked by phonemic decoding retention, motor handwriting integration, and zero tablet dependency.',
      'url': 'https://thesoundofessentials.com/alternatives/hooked-on-phonics',
      'author': {
        '@type': 'Person',
        'name': 'Sarah Jenkins',
        'jobTitle': 'Early Childhood Curriculum Specialist'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'datePublished': '2026-10-06',
      'dateModified': '2026-10-06'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top 5 Hooked on Phonics Screen-Free Alternatives',
      'numberOfItems': 5,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'The Sound of Essentials: Rhythm Quest',
          'description': 'Premier screen-free auditory phonics ecosystem featuring 19 master acoustic tracks across 7 learning lands, teaching sound-before-symbol decoding with zero tablet screens.'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'The Rhythm Ready Tactile Workbook',
          'description': 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities building genuine handwriting muscle memory on paper.'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'The Screen-Free Audio Sanctuary',
          'description': 'Safe-volume sensory headphone system and offline acoustic player engineered to replace evening app battles with calming nervous-system regulation.'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'The Essential Picture Dictionary',
          'description': '4,232-word illustrated heirloom volume across 157 semantic scenes, connecting sounds to rich visual storytelling without cartoon minigames.'
        },
        {
          '@type': 'ListItem',
          'position': 5,
          'name': 'SOE Educator & Classroom Concord',
          'description': 'Turnkey 10-15 minute screen-free classroom lesson extensions aligned with Head Start ELOF and NAEYC early childhood standards.'
        }
      ]
    },
    comparisonFaqSchema('Hooked on Phonics')
  ];

  return (
    <div className="hooked-on-phonics-alternatives-page" style={{ width: '100%', minHeight: '100vh', background: '#FFF8F0' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/hooked-on-phonics-alternatives.html"
        title="The 5 Best Hooked on Phonics Screen-Free Alternatives in 2026"
        scrolling="no"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          display: 'block',
          overflow: 'hidden',
          background: '#FFF8F0'
        }}
      />
    </div>
  );
};

export default HookedOnPhonicsAlternatives;
