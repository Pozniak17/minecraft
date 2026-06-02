import { HTMLAttributes } from 'react';
import styles from './Badge.module.css';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, children, ...props }: BadgeProps) {
  const classes = className ? `${styles.badge} ${className}` : styles.badge;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
