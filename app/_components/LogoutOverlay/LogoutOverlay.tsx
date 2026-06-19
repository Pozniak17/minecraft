'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Blocks } from '../Blocks/Blocks';
import styles from './LogoutOverlay.module.css';

type LogoutOverlayProps = {
  show: boolean;
};

export function LogoutOverlay({ show }: LogoutOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !show) return null;

  return createPortal(
    <div className={styles.root} role="status" aria-live="polite">
      <Blocks height={80} width={80} color="#bde153" ariaLabel="logging-out" />
      <p className={styles.text}>Logging out…</p>
    </div>,
    document.body,
  );
}
