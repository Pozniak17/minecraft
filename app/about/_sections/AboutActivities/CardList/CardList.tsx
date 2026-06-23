import { TOP_RATED_PLAYERS } from '@/lib/data/topRatedPlayers';
import Card from './Card/Card';
import styles from './CardList.module.css';

export interface CardProps {
  number?: number;
  title: string;
  value: string;
}

const LEADERBOARD_PREVIEW_COUNT = 5;

export default function CardList() {
  return (
    <ul className={styles.list}>
      {TOP_RATED_PLAYERS.slice(0, LEADERBOARD_PREVIEW_COUNT).map(({ rank, player, active_score }) => (
        <Card key={player} number={rank} title={player} value={active_score} />
      ))}
    </ul>
  );
}
