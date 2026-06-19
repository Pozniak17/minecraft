import styles from './CardList.module.css';
import Card from './Card/Card';

export interface CardProps {
  image: string;
  ganre: string;
  title: string;
  description: string;
}

const CARDS: CardProps[] = [
  {
    image: '/about/images/1.webp',
    ganre: 'Survival',
    title: 'LuckySurvival',
    description:
      'Vanilla survival with PvP and TNT disabled. Fair fights, balanced economy, and long-term gameplay.',
  },
  {
    image: '/about/images/2.webp',
    ganre: 'PvP',
    title: 'MineWars',
    description:
      'Vanilla survival with PvP and TNT enabled. Ranked matches, tournaments, and team warfare.',
  },
  {
    image: '/about/images/3.webp',
    ganre: 'Peaceful',
    title: 'CalmSky',
    description:
      'Peaceful vanilla server without PvP or TNT. Focus on creativity, social play, and beautiful builds.',
  },
];

export default function CardList() {
  return (
    <ul className={styles.list}>
      {CARDS.map(({ image, ganre, title, description }) => (
        <Card key={title} image={image} ganre={ganre} title={title} description={description} />
      ))}
    </ul>
  );
}
