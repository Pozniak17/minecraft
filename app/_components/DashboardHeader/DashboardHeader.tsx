'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNavLinkActive, NAV_LINKS } from '../Header/navLinks';
import { DashboardNav } from './DashboardNav/DashboardNav';
import styles from './DashboardHeader.module.css';

type DashboardHeaderProps = {
  balance?: number;
};

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function DashboardHeader({ balance = 0 }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [initial, setInitial] = useState('U');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const email = window.localStorage.getItem('user_email') ?? '';
    setInitial(email ? email.charAt(0).toUpperCase() : 'U');
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image src="/icons/icons/ic_twotone-menu.svg" alt="" width={20} height={20} />
        </button>

        <Link href="/dashboard" className={styles.logo} aria-label="Dashboard home">
          <Image
            src="/icons/icons/logo.webp"
            alt="Minecraft game logo"
            width={144}
            height={40}
            priority
          />
        </Link>

        <div className={styles.right}>
          <div className={styles.balance}>
            <Image
              src="/profile/img.png"
              alt=""
              width={16}
              height={22}
              className={styles.balanceIcon}
            />
            <span className={styles.balanceValue}>{formatBalance(balance)}</span>
          </div>

          <Link href="/profile" className={styles.avatar} aria-label="My account">
            {initial}
          </Link>
        </div>
      </div>

      <nav className={styles.desktopNav} aria-label="Main navigation">
        <span className={styles.navDivider} aria-hidden="true" />

        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={[styles.navLink, isNavLinkActive(link.href, pathname) && styles.navLinkActive]
              .filter(Boolean)
              .join(' ')}
            aria-current={isNavLinkActive(link.href, pathname) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}

        <span className={styles.navDivider} aria-hidden="true" />

        <button type="button" className={styles.langButton}>
          <span>EN</span>
          <Image
            src="/icons/icons/fe_arrow-down.svg"
            alt=""
            width={15}
            height={15}
            className={styles.langArrow}
          />
        </button>
      </nav>

      <DashboardNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
        balance={balance}
      />
    </header>
  );
}
