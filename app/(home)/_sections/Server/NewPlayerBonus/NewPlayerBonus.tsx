'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../Server.module.css';

const NEW_PLAYER_PROMO_CODE = 'WELCOME20';
const COPY_NOTICE = 'Promo code copied! Use it during checkout.';

export function NewPlayerBonus() {
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const handleClaim = useCallback(() => {
    void navigator.clipboard.writeText(NEW_PLAYER_PROMO_CODE).then(() => {
      setNotice(COPY_NOTICE);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  return (
    <>
      <div className={styles.newPlayerBonus}>
        <h2 className={styles.newPlayerBonus_title}>New Player Bonus</h2>
        <p className={styles.newPlayerBonus_text}>Get 20% OFF your first purchase</p>
        <p className={styles.newPlayerBonus_description}>
          Boost your gameplay with in-game currency or privileges.
          <br />
          Limited-time offer for new players.
        </p>
        <button type="button" className={styles.newPlayerBonus_button} onClick={handleClaim}>
          Claim Bonus
        </button>
        <Image
          className={styles.newPlayerBonus_illustration}
          src="/icons/illustrations/server-illustration.png"
          alt=""
          width={475}
          height={243}
          aria-hidden="true"
        />
      </div>

      {notice && (
        <div className={styles.toast} role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </>
  );
}
