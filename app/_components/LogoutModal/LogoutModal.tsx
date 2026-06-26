'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('common');
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
        aria-label={t('logout.closeDialog')}
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
          {t('logout.title')}
        </h2>

        <p id="logout-modal-desc" className={styles.description}>
          <span className={styles.descriptionMobile}>
            {t('logout.descMobile')}
          </span>
          <span className={styles.descriptionDesktop}>
            {t('logout.descDesktop')}
          </span>
        </p>

        <div className={styles.userCard}>
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
          <div className={styles.userCopy}>
            <span className={styles.userLabel}>{t('logout.signedInAs')}</span>
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
            {t('logout.cancel')}
          </button>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? t('shared.loggingOut') : t('shared.logOut')}
          </button>
        </div>

        <p className={styles.footnote}>{t('logout.autoExpire')}</p>
      </div>
    </div>,
    document.body,
  );
}
