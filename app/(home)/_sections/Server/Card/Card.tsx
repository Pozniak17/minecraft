'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import styles from './Card.module.css';

export type CardProps = {
  title: string;
  text: string;
  description: string;
  icon: string;
  connectAddress: string;
  onCopied?: () => void;
};

export function Card({ title, text, description, icon, connectAddress, onCopied }: CardProps) {
  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(connectAddress).then(() => {
      onCopied?.();
    });
  }, [connectAddress, onCopied]);

  return (
    <div className={styles.card}>
      <Image className={styles.icon} src={icon} alt={title} width={203} height={191} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <p className={styles.description}>{description}</p>

      <ul className={styles.list}>
        <li className={styles.item}>
          Status
          <div className={styles.status}>
            <Image
              className={styles.statusDot}
              src="/icons/icons/ellipse.svg"
              alt="Online"
              width={7}
              height={7}
            />
            Online
          </div>
        </li>
        <li className={styles.item}>
          Players online:
          <div className={styles.status}>
            <Image
              className={styles.statusIcon}
              src="/icons/icons/user.svg"
              alt="Players"
              width={13}
              height={13}
            />
            32
          </div>
        </li>
        <li className={styles.item}>
          Server IP: <div className={styles.status}>{connectAddress}</div>
        </li>
      </ul>

      <button type="button" className={styles.linkButton} onClick={handleCopy}>
        <Image src="/icons/icons/arrow-up.svg" alt="" width={24} height={24} />
        <p>Join {title}</p>
      </button>
    </div>
  );
}
