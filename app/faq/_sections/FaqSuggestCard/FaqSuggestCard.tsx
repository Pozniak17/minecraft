import cardStyles from '../FaqAccentCard/FaqAccentCard.module.css';
import styles from './FaqSuggestCard.module.css';

export default function FaqSuggestCard() {
  return (
    <div className={`${cardStyles.card} ${cardStyles.cardFill}`}>
      <p className={cardStyles.label}>Help improve this page</p>

      <h2 className={cardStyles.title}>Suggest a question</h2>
      <p className={cardStyles.description}>
        Missing something? Tell us what you searched for and we will add it to the FAQ within a
        week.
      </p>

      <div className={styles.form}>
        <label className={styles.fieldLabel} htmlFor="faq-suggest-question">
          Your question
        </label>
        <input
          id="faq-suggest-question"
          className={styles.input}
          type="text"
          placeholder='Your question (e.g. "How do I host a private world?")'
        />

        <label className={styles.fieldLabel} htmlFor="faq-suggest-category">
          Category
        </label>
        <button id="faq-suggest-category" type="button" className={styles.select}>
          <span className={styles.selectPlaceholder}>Category — pick one</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        <button type="button" className={styles.submit}>
          Submit suggestion
        </button>
      </div>
    </div>
  );
}
