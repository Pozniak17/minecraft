import { CardProps } from '../CardList';
import styles from './Card.module.css';

export default function Card({ number, title, value }: CardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.card_wrapper}>
        <span className={styles.number}>{number}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.value}>{value} pts</p>
    </li>
  );
}
