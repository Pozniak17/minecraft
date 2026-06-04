import Image from 'next/image';
import styles from './Card.module.css';

export interface ArticleCardProps {
  image: string;
  genre: 'Guides' | 'Engineering' | 'PvP' | 'Community' | 'Updates' | 'Tutorials';
  time: number;
  title: string;
  description: string;
  author: string;
  date: Date | string;
}

export default function Card({
  image,
  genre,
  time,
  title,
  description,
  author,
  date,
}: ArticleCardProps) {
  return (
    <>
      <li className={styles.card}>
        <Image src={image} className={styles.image} alt={title} width={335} height={200} />
        <div className={styles.card_content}>
          <div className={styles.content_header}>
            <span className={styles.genre}>{genre}</span>
            <span className={styles.time}>⏱️ {time} min</span>
          </div>

          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.meta}>
            <span className={styles.avatar}>S</span>
            <span className={styles.author_name}>{author}</span>
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.author_date}>{date.toString()}</span>
          </div>
        </div>
      </li>
    </>
  );
}
