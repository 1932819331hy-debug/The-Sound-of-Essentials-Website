import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';
import { comparisonFaqSchema } from '../utils/schema';

const AbcMouseAlternatives = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('3600px');

  useEffect(() => {
    document.title = 'The 5 Best ABCmouse Alternatives for Screen-Free Early Literacy in 2026 | The Sound of Essentials.com';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Tired of tablet battles, guessing games, and monthly app subscriptions? Explore the 5 best screen-free ABCmouse alternatives for ages 2–7, ranked by phonics decoding retention, calm nervous-system regulation, and genuine reading mastery.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/alternatives/abcmouse';

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
      'headline': 'The 5 Best ABCmouse Alternatives for Screen-Free Early Literacy in 2026',
      'description': 'An objective parent and educator guide reviewing the 5 best screen-free ABCmouse alternatives for children ages 2–7, ranked by phonics decoding retention, sensory nervous-system regulation, and sustainable engagement.',
      'url': 'https://thesoundofessentials.com/alternatives/abcmouse',
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
      'name': 'Top 5 ABCmouse Alternatives for Screen-Free Early Literacy',
      'numberOfItems': 5,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'The Sound of Essentials: Rhythm Quest',
          'description': 'Complete auditory learning ecosystem featuring 19 master acoustic tracks across 7 lands, teaching sound-before-symbol phonemic awareness with zero screens.'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'The Screen-Free Audio Sanctuary',
          'description': 'Safe-volume sensory headphone player and dedicated acoustic listening environment designed to replace bedtime tablet struggles.'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'The Rhythm Ready Tactile Workbook',
          'description': 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities building fine-motor muscle memory.'
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
    comparisonFaqSchema('ABCmouse')
  ];

  return (
    <div className="abcmouse-alternatives-page" style={{ width: '100%', minHeight: '100vh', background: '#FFF8F0' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/abcmouse-alternatives.html"
        title="The 5 Best ABCmouse Alternatives for Screen-Free Early Literacy in 2026"
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

export default AbcMouseAlternatives;
