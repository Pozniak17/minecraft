import Card from './Card/Card';
import styles from './CardList.module.css';

export interface CardProps {
  number?: number;
  title: string;
  value: string;
  status: 'ONLINE' | 'OFFLINE';
}

const CARDS: CardProps[] = [
  {
    title: 'RedstoneKing',
    value: '12,840',
    status: 'ONLINE',
  },
  {
    title: 'PixelHunter',
    value: '11,205',
    status: 'ONLINE',
  },
  {
    title: 'EnderQueen',
    value: '9,870',
    status: 'ONLINE',
  },

  {
    title: 'BlockNinja',
    value: '8,440',
    status: 'ONLINE',
  },
  {
    title: 'LavaWalker',
    value: '7,520',
    status: 'ONLINE',
  },
];

export default function CardList() {
  return (
    <ul className={styles.list}>
      {CARDS.map(({ title, value, status }, index) => (
        <Card key={index} number={index + 1} title={title} value={value} status={status} />
      ))}
    </ul>
  );
}
