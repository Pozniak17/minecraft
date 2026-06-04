import { HTMLAttributes } from 'react';
import styles from './Container.module.css';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'blog';
};

export function Container({ className, variant = 'default', ...props }: ContainerProps) {
  const classes = [
    styles.container,
    variant === 'blog' && styles.containerBlog,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}
