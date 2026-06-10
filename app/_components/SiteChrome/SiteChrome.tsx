'use client';

import { usePathname } from 'next/navigation';
import { DashboardHeader } from '../DashboardHeader/DashboardHeader';
import { DashboardSidebar } from '../DashboardSidebar/DashboardSidebar';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './SiteChrome.module.css';

const AUTH_ROUTES = ['/register', '/login', '/forgot-password', '/verify-email'];
const DASHBOARD_ROUTES = ['/dashboard', '/profile'];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (matchesRoute(pathname, AUTH_ROUTES)) {
    return children;
  }

  if (matchesRoute(pathname, DASHBOARD_ROUTES)) {
    return (
      <div className={styles.dashboard}>
        <DashboardSidebar />
        <div className={styles.dashboardMain}>
          <DashboardHeader />
          <main className={styles.dashboardContent}>{children}</main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
