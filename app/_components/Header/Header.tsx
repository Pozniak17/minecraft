'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '../Container/Container';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { MobileNav } from './MobileNav/MobileNav';
import { isNavLinkActive, NAV_LINKS } from './navLinks';
import styles from './Header.module.css';

export function Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nick, setNick] = useState('Player');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    setNick(email ? email.split('@')[0] : 'Player');
  }, []);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <div className={`${styles.divider} ${styles.dividerEdge}`} />

        <Link href="/" className={styles.logo}>
          <Image src="/icons/icons/logo.webp" alt="Minecraft game logo" width={215} height={59} />
        </Link>

        <div className={styles.divider} />

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                styles.navLink,
                isNavLinkActive(link.href, pathname) && styles.navLinkActive,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isNavLinkActive(link.href, pathname) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image src="/icons/icons/ic_twotone-menu.svg" alt="" width={24} height={24} />
        </button>

        <div className={styles.divider} />

        <div className={styles.authButtons}>
          {isAuthed ? (
            <Link href="/dashboard" className={styles.account} aria-label="Go to dashboard">
              <span className={styles.avatar} aria-hidden="true">
                {nick.charAt(0).toUpperCase()}
              </span>
              <span className={styles.nick}>{nick}</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnSecondary}>
                Log In
              </Link>
              <Link href="/register" className={styles.btnPrimary}>
                Sign UP
              </Link>
            </>
          )}
        </div>

        <div className={styles.dividerDesktop} />

        <LanguageSwitcher
          className={styles.langButton}
          menuAlign="right"
          arrow={
            <Image
              src="/icons/icons/fe_arrow-down.svg"
              alt=""
              width={15}
              height={15}
              className={styles.langArrow}
            />
          }
        />

        <div className={`${styles.divider} ${styles.dividerEdge}`} />
      </Container>

      <MobileNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
        isAuthed={isAuthed}
        nick={nick}
      />
    </header>
  );
}
