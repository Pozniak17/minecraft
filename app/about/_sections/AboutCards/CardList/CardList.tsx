import { Container } from '@/app/_components/Container/Container';
import Card from '../Card/Card';
import styles from './CardList.module.css';
import AboutServers from '../../AboutServers/AboutServers';

export interface CardProps {
  image: string;
  ganre: string;
  title: string;
  description: string;
}

const CARDS: CardProps[] = [
  {
    image: '/about/images/1.webp',
    ganre: 'Classic',
    title: 'Classic / Survival',
    description:
      'A beloved classic with hardcore touches and a thriving economy. Perfect for cozy survival and large-scale building.',
  },
  {
    image: '/about/images/2.webp',
    ganre: 'Skyblock',
    title: 'Skyblock / Tech',
    description:
      'Sharpen your automation and survival skills on floating islands. Custom crafts, machines, and endless possibilities for engineers.',
  },
  {
    image: '/about/images/3.webp',
    ganre: 'Anarchy',
    title: 'Anarchy / PvP',
    description:
      'A world with no rules but ruthless competition. Prove your dominance in PvP, capture territories, and crush your enemies.',
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
