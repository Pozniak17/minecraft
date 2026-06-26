'use client';

import { useTranslations } from 'next-intl';
import cardStyles from '../FaqAccentCard/FaqAccentCard.module.css';
import styles from './FaqSuggestCard.module.css';

export default function FaqSuggestCard() {
  const t = useTranslations('faq');

  return (
    <div className={`${cardStyles.card} ${cardStyles.cardFill}`}>
      <p className={cardStyles.label}>{t('suggest.improvePage')}</p>

      <h2 className={cardStyles.title}>{t('suggest.title')}</h2>
      <p className={cardStyles.description}>{t('suggest.descSidebar')}</p>

      <div className={styles.form}>
        <label className={styles.fieldLabel} htmlFor="faq-suggest-question">
          {t('suggest.yourQuestion')}
        </label>
        <input
          id="faq-suggest-question"
          className={styles.input}
          type="text"
          placeholder={t('suggest.placeholderSidebar')}
        />

        <label className={styles.fieldLabel} htmlFor="faq-suggest-category">
          {t('suggest.category')}
        </label>
        <button id="faq-suggest-category" type="button" className={styles.select}>
          <span className={styles.selectPlaceholder}>{t('suggest.pickOne')}</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        <button type="button" className={styles.submit}>
          {t('suggest.submit')}
        </button>
      </div>
    </div>
  );
}
