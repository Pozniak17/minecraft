import { CardProps } from '../CardList';
import styles from './Card.module.css';

export default function Card({ number, title, value, status }: CardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.card_wrapper}>
        <span className={styles.number}>{number}</span>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.status}>{status}</p>
        </div>
      </div>
      <p className={styles.value}>{value} pts</p>
    </li>
  );
}
