'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNavLinkActive, NAV_LINKS } from '../Header/navLinks';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { DashboardNav } from './DashboardNav/DashboardNav';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  const pathname = usePathname();
  const { initial, photoUrl } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
          <Link href="/dashboard" className={styles.avatar} aria-label="My account">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Profile" className={styles.avatarImg} />
            ) : (
              initial
            )}
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
      </nav>

      <DashboardNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
      />
    </header>
  );
}
