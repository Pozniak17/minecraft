import Image from 'next/image';
import styles from './Card.module.css';
import type { CardProps } from '../CardList/CardList';

export default function Card({ image, ganre, title, description }: CardProps) {
  return (
    <li className={styles.card}>
      <Image className={styles.image} src={image} alt={title} width={335} height={200} />
      <div className={styles.card_content}>
        <span className={styles.ganre}>{ganre}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </li>
  );
}
