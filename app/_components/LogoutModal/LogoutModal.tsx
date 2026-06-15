'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './LogoutModal.module.css';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  email: string;
  initial: string;
  confirming?: boolean;
};

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  name,
  email,
  initial,
  confirming = false,
}: LogoutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !confirming) onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, confirming]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close logout dialog"
        onClick={onClose}
        disabled={confirming}
      />

      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-desc"
      >
        <div className={styles.iconWrap}>
          <Image
            src="/logout/1.svg"
            alt=""
            width={32}
            height={32}
            className={styles.icon}
            aria-hidden
          />
        </div>

        <h2 id="logout-modal-title" className={styles.title}>
          Log out of your account?
        </h2>

        <p id="logout-modal-desc" className={styles.description}>
          <span className={styles.descriptionMobile}>
            You will need to sign in again. In-game sessions remain unaffected.
          </span>
          <span className={styles.descriptionDesktop}>
            You will need to sign in again to access your dashboard, cart, and active
            privileges. Active in-game sessions remain unaffected.
          </span>
        </p>

        <div className={styles.userCard}>
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
          <div className={styles.userCopy}>
            <span className={styles.userLabel}>Signed in as</span>
            <span className={styles.userNameMobile}>{name}</span>
            <span className={styles.userNameDesktop}>
              {name}
              {email ? `  •  ${email}` : ''}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={confirming}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? 'Logging out…' : 'Log out'}
          </button>
        </div>

        <p className={styles.footnote}>Sessions auto-expire after 30 days</p>
      </div>
    </div>,
    document.body,
  );
}
