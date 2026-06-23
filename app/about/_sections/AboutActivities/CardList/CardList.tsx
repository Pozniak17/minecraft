import Card from './Card/Card';
import styles from './CardList.module.css';

export interface CardProps {
  number?: number;
  title: string;
  value: string;
}

const CARDS: CardProps[] = [
  {
    title: 'RedstoneKing',
    value: '12,840',
  },
  {
    title: 'PixelHunter',
    value: '11,205',
  },
  {
    title: 'EnderQueen',
    value: '9,870',
  },

  {
    title: 'BlockNinja',
    value: '8,440',
  },
  {
    title: 'LavaWalker',
    value: '7,520',
  },
];

export default function CardList() {
  return (
    <ul className={styles.list}>
      {CARDS.map(({ title, value }, index) => (
        <Card key={index} number={index + 1} title={title} value={value} />
      ))}
    </ul>
  );
}
