/**
 * SOE Unified Attribution & Analytics Engine
 * Tracks Meta Pixel (fbq), Google Analytics 4 (gtag), and Microsoft Clarity.
 * Persists UTM parameters and handles standard ecommerce & funnel events safely.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'aff'];
const UTM_STORAGE_KEY = 'soe_attribution_data';

/**
 * Captures UTM parameters from current URL and stores in sessionStorage + localStorage.
 */
export const captureUtms = () => {
  if (typeof window === 'undefined') return {};
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const captured = {};
    let hasUtm = false;

    UTM_KEYS.forEach(key => {
      const val = urlParams.get(key);
      if (val) {
        captured[key] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      captured.timestamp = new Date().toISOString();
      captured.landing_path = window.location.pathname;
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      return captured;
    }

    // Fallback to stored UTMs
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn('[Analytics] Failed to capture UTMs:', e);
    return {};
  }
};

/**
 * Returns currently persisted UTM and referral parameters.
 */
export const getStoredUtms = () => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Appends persisted UTM parameters to an outgoing URL (e.g. Stripe checkout or referral link).
 */
export const appendUtmsToUrl = (urlStr) => {
  if (!urlStr || typeof window === 'undefined') return urlStr;
  try {
    const utms = getStoredUtms();
    if (!utms || Object.keys(utms).length === 0) return urlStr;

    const url = new URL(urlStr, window.location.origin);
    Object.entries(utms).forEach(([k, v]) => {
      if (k !== 'timestamp' && k !== 'landing_path' && !url.searchParams.has(k)) {
        url.searchParams.set(k, v);
      }
    });
    return url.toString();
  } catch {
    return urlStr;
  }
};

/**
 * Safely pushes an event and its parameters to Google Tag Manager's dataLayer
 * and forwards to window.gtag if present.
 */
export const pushDataLayer = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if missing
  window.dataLayer = window.dataLayer || [];

  // 1. Google Tag Manager push
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  // 2. Google Analytics 4 (gtag.js) direct forwarder
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch {
      // Non-blocking
    }
  }

  // 3. Dev mode console visibility
  if (import.meta.env?.DEV) {
    console.log(`📊 [GTM dataLayer] event: "${eventName}"`, params);
  }
};

/**
 * Dispatches PageView to all configured platforms (GTM dataLayer, GA4, Meta, Clarity).
 */
export const trackPageView = (path, title = '') => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();
  const pagePath = path || (window.location.pathname + window.location.search);
  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  const pageData = {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
    ...utms,
  };

  // Google Tag Manager / GA4: Push virtual_pageview for SPA triggers and page_view
  pushDataLayer('virtual_pageview', pageData);
  pushDataLayer('page_view', pageData);

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  // Pinterest Tag
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', 'pagevisit');
  }

  // Microsoft Clarity Tagging
  if (window.clarity && pagePath) {
    window.clarity('set', 'page_path', pagePath);
  }
};

/**
 * Dispatches Lead event (e.g. email capture on /listen or newsletter).
 */
export const trackLead = ({ email: _email = '', formName = 'gate1_listen', source = 'listen_page', ...rest } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  pushDataLayer('generate_lead', {
    event_category: 'funnel',
    event_label: formName,
    form_name: formName,
    form_source: source,
    lead_type: 'email_optin',
    value: 1,
    currency: 'USD',
    ...utms,
    ...rest,
  });

  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
      content_category: 'email_funnel',
      value: 0.00,
      currency: 'USD',
      ...utms,
    });
  }

  // Pinterest Tag
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', 'lead', {
      lead_type: 'email_optin',
      content_name: formName,
    });
  }

  if (window.clarity) {
    window.clarity('event', 'lead_captured');
  }
};

/**
 * Dispatches ViewContent (e.g. browsing a Land, Hero, or Track).
 */
export const trackViewContent = ({ contentName, category = 'curriculum', id = '', value = 0 } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  pushDataLayer('view_item', {
    event_category: category,
    item_name: contentName,
    item_category: category,
    item_id: id,
    value,
    ecommerce: {
      items: [{
        item_id: id || contentName,
        item_name: contentName,
        item_category: category,
        price: value,
        quantity: 1,
      }],
    },
    ...utms,
  });

  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: category,
      content_ids: id ? [id] : [],
      value,
      currency: 'USD',
    });
  }

  // Pinterest Tag
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', 'viewcategory', {
      category,
      product_name: contentName,
      product_id: id,
      value,
      currency: 'USD',
    });
  }
};

/**
 * Dispatches InitiateCheckout (e.g. clicking buy link for Workbook or Dictionary).
 */
export const trackInitiateCheckout = ({ sku = 'SOE-RQ-WORKBOOK', name = 'Rhythm Ready Workbook', price = 21.00, currency = 'USD' } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  const checkoutItems = [{
    item_id: sku,
    item_name: name,
    price,
    quantity: 1,
  }];

  pushDataLayer('begin_checkout', {
    event_category: 'ecommerce',
    currency,
    value: price,
    items: checkoutItems,
    ecommerce: {
      currency,
      value: price,
      items: checkoutItems,
    },
    ...utms,
  });

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: name,
      content_ids: [sku],
      value: price,
      currency,
      num_items: 1,
      ...utms,
    });
  }

  // Pinterest Tag
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', 'addtocart', {
      value: price,
      order_quantity: 1,
      currency,
      product_name: name,
      product_id: sku,
    });
  }

  if (window.clarity) {
    window.clarity('event', 'checkout_initiated');
  }
};

/**
 * Dispatches Purchase event (e.g. Stripe checkout completion on /order-success).
 */
export const trackPurchase = ({ orderId = '', value = 0, currency = 'USD', items = [] } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  pushDataLayer('purchase', {
    transaction_id: orderId,
    value,
    currency,
    items,
    ecommerce: {
      transaction_id: orderId,
      value,
      currency,
      items,
    },
    ...utms,
  });

  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value,
      currency,
      content_type: 'product',
      contents: items.map(i => ({ id: i.item_id || i.sku, quantity: i.quantity || 1 })),
      ...utms,
    });
  }

  // Pinterest Tag Checkout Tracking
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', 'checkout', {
      value,
      order_quantity: items.length || 1,
      currency,
      order_id: orderId,
    });
  }

  if (window.clarity) {
    window.clarity('event', 'purchase_completed');
  }
};

/**
 * Dispatches TrackPlay event in Audio Player.
 */
export const trackAudioPlay = ({ trackId, trackTitle, domain = '' } = {}) => {
  if (typeof window === 'undefined') return;

  pushDataLayer('audio_play', {
    event_category: 'audio',
    event_label: trackTitle,
    track_id: trackId,
    track_title: trackTitle,
    domain,
  });

  if (window.clarity) {
    window.clarity('event', `play_${trackId}`);
  }
};

/**
 * Dispatches Referral / Share event.
 */
export const trackReferralShare = ({ channel = 'link_copy', target = 'gift_a_land' } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  pushDataLayer('share', {
    event_category: 'engagement',
    method: channel,
    content_type: target,
    share_channel: channel,
    share_target: target,
    ...utms,
  });

  if (window.fbq) {
    window.fbq('trackCustom', 'ReferralShare', {
      share_channel: channel,
      share_target: target,
    });
  }

  if (window.clarity) {
    window.clarity('event', 'referral_shared');
  }
};

/**
 * Dispatches CTA button or interaction click.
 */
export const trackCtaClick = ({ ctaText = '', ctaLocation = '', ctaUrl = '', ctaType = 'button' } = {}) => {
  if (typeof window === 'undefined') return;
  const utms = getStoredUtms();

  pushDataLayer('cta_click', {
    event_category: 'engagement',
    cta_text: ctaText,
    cta_location: ctaLocation,
    cta_url: ctaUrl,
    cta_type: ctaType,
    page_path: window.location.pathname,
    ...utms,
  });
};

/**
 * Automatically captures interactive CTAs and outbound links to ensure GTM triggers fire
 * even without manual onClick handlers on every button.
 */
export const initAutoTracking = () => {
  if (typeof window === 'undefined' || window._soeTrackingInitialized) return;
  window._soeTrackingInitialized = true;

  document.addEventListener('click', (e) => {
    try {
      const target = e.target.closest('button, a, [data-cta], [data-track]');
      if (!target) return;

      const isCtaButton = target.tagName === 'BUTTON' || target.classList.contains('btn') || target.hasAttribute('data-cta');
      const href = target.getAttribute('href') || '';
      const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
      const text = (target.innerText || target.getAttribute('aria-label') || target.getAttribute('title') || '').trim().slice(0, 80);

      if (isExternal) {
        pushDataLayer('outbound_click', {
          link_url: href,
          link_text: text,
          page_path: window.location.pathname,
        });
      } else if (isCtaButton && text) {
        pushDataLayer('cta_click', {
          cta_text: text,
          cta_url: href,
          cta_classes: target.className || '',
          page_path: window.location.pathname,
        });
      }
    } catch {
      // Non-blocking
    }
  }, { passive: true });
};

export default {
  captureUtms,
  getStoredUtms,
  appendUtmsToUrl,
  pushDataLayer,
  trackPageView,
  trackLead,
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
  trackAudioPlay,
  trackReferralShare,
  trackCtaClick,
  initAutoTracking,
};
