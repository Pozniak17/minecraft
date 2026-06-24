import Link from 'next/link';
import cardStyles from '../FaqAccentCard/FaqAccentCard.module.css';

export default function FaqSupportCard() {
  return (
    <div className={`${cardStyles.card} ${cardStyles.cardFill}`}>
      <p className={cardStyles.label}>Live support online</p>
      <h3 className={cardStyles.title}>Still need help?</h3>
      <p className={cardStyles.description}>
        Chat with us 24/7 or send a ticket — we usually reply within 4 hours.
      </p>
      <Link href="/contacts" className={cardStyles.primaryButton}>
        Send a ticket
      </Link>
    </div>
  );
}
