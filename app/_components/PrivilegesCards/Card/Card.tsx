import Image from 'next/image';
import { PrivilegesCardProps } from '../PrivilegesCards';
import styles from './Card.module.css';

type CardProps = PrivilegesCardProps & {
  compact?: boolean;
  onAdd?: () => void;
  pending?: boolean;
  done?: boolean;
};

export default function Card({
  title,
  text,
  icon,
  compact = false,
  onAdd,
  pending = false,
  done = false,
}: CardProps) {
  const label = done ? 'Added ✓' : pending ? 'Adding…' : 'Add to cart';

  return (
    <li className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <Image className={styles.icon} src={icon} alt={title} />
      <button
        type="button"
        className={styles.button}
        onClick={onAdd}
        disabled={pending}
      >
        <Image
          src="/icons/icons/arrow-up.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
        />
        {label}
      </button>
    </li>
  );
}
