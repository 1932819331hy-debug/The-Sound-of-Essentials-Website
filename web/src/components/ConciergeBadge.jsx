import { useTranslation } from 'react-i18next';
import './ConciergeBadge.css';

export default function ConciergeBadge({ variant = 'card' }) {
  const { t } = useTranslation();

  return (
    <aside className={`concierge-badge concierge-badge--${variant}`} aria-label="Curriculum Concierge Support">
      <div className="concierge-badge__avatar" role="img" aria-label="Educator">
        👩🏾‍🏫
      </div>
      <div className="concierge-badge__content">
        <div className="concierge-badge__status">
          <span className="pulse-dot" />
          <span className="status-text">{t('concierge.online', 'Educator Concierge Active')}</span>
        </div>
        <p className="concierge-badge__body">
          {t('concierge.text', 'Have questions about ages 2–7 readiness? Email our curriculum team directly: ')}
          <a href="mailto:info@soelearn.com" className="concierge-badge__link">
            {t('concierge.email', 'info@soelearn.com')}
          </a>
        </p>
        <span className="concierge-badge__callout">
          {t('concierge.callout', 'Real educators, zero chatbots. Available Mon-Fri 8am-6pm EST.')}
        </span>
      </div>
    </aside>
  );
}
