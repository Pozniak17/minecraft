'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/api/auth';
import { dashboardIconStyle as iconStyle, WORKSPACE_LINKS } from '../dashboardNav';
import { isNavLinkActive } from '../Header/navLinks';
import styles from './DashboardSidebar.module.css';

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

type DashboardSidebarProps = {
  balance?: number;
};

export function DashboardSidebar({ balance = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('Player');
  const [initial, setInitial] = useState('U');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    setName(email ? email.split('@')[0] : 'Player');
    setInitial(email ? email.charAt(0).toUpperCase() : 'U');
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // навіть якщо запит впав — чистимо клієнтський стан і виходимо
    } finally {
      window.localStorage.removeItem('user_email');
      router.push('/');
      router.refresh();
    }
  }

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <Link href="/dashboard" className={styles.logo}>
        <Image src="/icons/icons/logo.webp" alt="Minecraft game logo" width={144} height={40} priority />
      </Link>

      <div className={styles.userCard}>
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{name}</span>
          <span className={styles.balance}>
            <Image src="/profile/img.png" alt="" width={14} height={18} className={styles.balanceIcon} />
            <span className={styles.balanceValue}>{formatBalance(balance)}</span>
            <span className={styles.balanceUnit}>crystals</span>
          </span>
        </div>
      </div>

      <Link href="/store" className={styles.topup}>
        Top up crystals
      </Link>

      <div className={styles.sectionLabel}>
        <span>My workspace</span>
        <span className={styles.sectionLine} aria-hidden="true" />
      </div>

      <nav className={styles.workspace} aria-label="My workspace">
        {WORKSPACE_LINKS.map(link => {
          const isActive = link.href !== '#' && isNavLinkActive(link.href, pathname);
          const className = [
            styles.wsItem,
            isActive && styles.wsItemActive,
            link.soon && styles.wsItemDisabled,
          ]
            .filter(Boolean)
            .join(' ');

          const content = (
            <>
              <span className={styles.wsIcon} style={iconStyle(link.icon)} aria-hidden="true" />
              <span className={styles.wsLabel}>{link.label}</span>
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span className={styles.badge}>{link.badge}</span>
              )}
              {link.soon && <span className={styles.soon}>Soon</span>}
            </>
          );

          if (link.soon) {
            return (
              <span key={link.label} className={className} aria-disabled="true">
                {content}
              </span>
            );
          }

          return (
            <Link
              key={link.label}
              href={link.href}
              className={className}
              aria-current={isActive ? 'page' : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className={styles.spacer} aria-hidden="true" />

      <hr className={styles.divider} />

      <div className={styles.account}>
        <Link href="/profile" className={styles.footItem}>
          <span className={styles.wsIcon} style={iconStyle('settings-outline')} aria-hidden="true" />
          <span className={styles.footLabel}>Settings</span>
        </Link>
        <button type="button" className={styles.footItem} onClick={handleLogout} disabled={loggingOut}>
          <span className={styles.wsIcon} style={iconStyle('logout-outline')} aria-hidden="true" />
          <span className={styles.footLabel}>{loggingOut ? 'Logging out…' : 'Log out'}</span>
        </button>
      </div>

      <div className={styles.bottom}>
        <button type="button" className={styles.langButton}>
          <span>EN</span>
          <span className={styles.langArrow} aria-hidden="true">
            ▾
          </span>
        </button>
        <span className={styles.version}>v 2.6.0</span>
      </div>
    </aside>
  );
}
