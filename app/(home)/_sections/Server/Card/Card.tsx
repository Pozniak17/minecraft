'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Card.module.css';

const COPY_NOTICE = 'IP copied! Launch Minecraft and connect now';

export type CardProps = {
  title: string;
  text: string;
  description: string;
  icon: string;
  version: string;
  connectAddress: string;
};

export function Card({
  title,
  text,
  description,
  icon,
  version,
  connectAddress,
}: CardProps) {
  const [copied, setCopied] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(connectAddress).then(() => {
      setCopied(true);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setCopied(false), 3000);
    });
  }, [connectAddress]);

  return (
    <div className={styles.card}>
      <span className={styles.versionBadge}>
        <Image
          className={styles.versionIcon}
          src="/how-to-start/icons/game.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden
        />
        <span className={styles.versionLabel}>{version}</span>
      </span>
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
        <li className={`${styles.item} ${styles.itemIp}`}>
          Server IP:
          <div className={styles.status}>{connectAddress}</div>
        </li>
      </ul>

      <button
        type="button"
        className={`${styles.linkButton} ${copied ? styles.linkButtonCopied : ''}`}
        onClick={handleCopy}
        aria-live={copied ? 'polite' : undefined}
      >
        {!copied && (
          <Image src="/icons/icons/arrow-up.svg" alt="" width={24} height={24} />
        )}
        <span className={styles.linkButtonText}>
          {copied ? COPY_NOTICE : `Join ${title}`}
        </span>
      </button>
    </div>
  );
}
