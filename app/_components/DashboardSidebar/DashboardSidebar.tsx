'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/api/auth';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { LogoutModal } from '../LogoutModal/LogoutModal';
import { LogoutOverlay } from '../LogoutOverlay/LogoutOverlay';
import { dashboardIconStyle as iconStyle, WORKSPACE_LINKS } from '../dashboardNav';
import { isNavLinkActive } from '../Header/navLinks';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, displayName: name, initial, photoUrl } = useProfile();
  const email = profile?.email ?? '';
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // навіть якщо запит впав — чистимо клієнтський стан і виходимо
    } finally {
      window.localStorage.removeItem('user_email');
      setLogoutOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  return (
    <>
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <Link href="/dashboard" className={styles.logo}>
        <Image
          src="/icons/icons/logo.webp"
          alt="Minecraft game logo"
          width={214}
          height={59}
          priority
        />
      </Link>

      <div className={styles.userCard}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.avatar}
            src={photoUrl}
            alt="Profile"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
        )}
        <div className={styles.userInfo}>
          <span className={styles.userName}>{name}</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>
        <span>My workspace</span>
        <span className={styles.sectionLine} aria-hidden="true" />
      </div>

      <nav className={styles.workspace} aria-label="My workspace">
        {WORKSPACE_LINKS.map(link => {
          const isActive = link.href !== '#' && isNavLinkActive(link.href, pathname);
          const isDisabled = link.soon && link.href === '#';
          const className = [
            styles.wsItem,
            isActive && styles.wsItemActive,
            isDisabled && styles.wsItemDisabled,
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

          if (isDisabled) {
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

      <div className={styles.footer}>
        <div className={styles.spacer} aria-hidden="true">
          <Image
            src="/profile/2.webp"
            alt=""
            width={480}
            height={540}
            className={styles.spacerMascot}
          />
        </div>

        <hr className={styles.divider} />

        <div className={styles.account}>
          <Link href="/dashboard/settings" className={styles.footItem}>
            <span
              className={styles.wsIcon}
              style={iconStyle('settings-outline')}
              aria-hidden="true"
            />
            <span className={styles.footLabel}>Settings</span>
          </Link>
          <button
            type="button"
            className={styles.footItem}
            onClick={() => setLogoutOpen(true)}
            disabled={loggingOut}
          >
            <span className={styles.wsIcon} style={iconStyle('logout-outline')} aria-hidden="true" />
            <span className={styles.footLabel}>{loggingOut ? 'Logging out…' : 'Log out'}</span>
          </button>
        </div>
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

    <LogoutModal
      isOpen={logoutOpen}
      onClose={() => setLogoutOpen(false)}
      onConfirm={handleLogout}
      name={name}
      email={email}
      initial={initial}
      confirming={loggingOut}
    />

    <LogoutOverlay show={loggingOut} />
    </>
  );
}
