import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';
import { comparisonFaqSchema } from '../utils/schema';

const ReadingEggsAlternatives = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('3600px');

  useEffect(() => {
    document.title = 'The 5 Best Reading Eggs Alternatives for Screen-Free Phonics & Reading (2026 Parent Guide) | The Sound of Essentials.com';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Looking for Reading Eggs alternatives? Discover the 5 best screen-free phonics and reading programs for ages 2–7, ranked by phonemic decoding retention, sensory calm, and real paper reading mastery.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/alternatives/reading-eggs';

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
      'headline': 'The 5 Best Reading Eggs Alternatives for Screen-Free Phonics & Reading in 2026',
      'description': 'An objective parent and educator review evaluating the 5 best screen-free Reading Eggs alternatives for children ages 2–7, ranked by phonics decoding retention, calm sensory nervous-system regulation, and genuine paper book reading skills.',
      'url': 'https://thesoundofessentials.com/alternatives/reading-eggs',
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
      'name': 'Top 5 Reading Eggs Alternatives for Screen-Free Phonics',
      'numberOfItems': 5,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'The Sound of Essentials: Rhythm Quest',
          'description': 'Premier auditory early literacy ecosystem featuring 19 master acoustic tracks across 7 learning lands, teaching sound-before-symbol phonemic awareness with zero screens.'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'The Rhythm Ready Tactile Workbook',
          'description': 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities that build physical handwriting muscle memory.'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'The Screen-Free Audio Sanctuary',
          'description': 'Safe-volume sensory headphone listening player and acoustic storytelling system designed to replace evening tablet drill fatigue.'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'The Essential Picture Dictionary',
          'description': '4,232-word illustrated storybook volume across 157 scenes, anchoring phonics to rich semantic context without gamified cartoon distractions.'
        },
        {
          '@type': 'ListItem',
          'position': 5,
          'name': 'SOE Educator & Classroom Concord',
          'description': 'Turnkey 10-15 minute screen-free classroom lesson extensions aligned with Head Start ELOF and NAEYC early childhood standards.'
        }
      ]
    },
    comparisonFaqSchema('Reading Eggs')
  ];

  return (
    <div className="reading-eggs-alternatives-page" style={{ width: '100%', minHeight: '100vh', background: '#FFF8F0' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/reading-eggs-alternatives.html"
        title="The 5 Best Reading Eggs Alternatives for Screen-Free Phonics & Reading in 2026"
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

export default ReadingEggsAlternatives;
