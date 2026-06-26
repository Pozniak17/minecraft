'use client';

import { usePathname } from 'next/navigation';
import { DashboardHeader } from '../DashboardHeader/DashboardHeader';
import { DashboardSidebar } from '../DashboardSidebar/DashboardSidebar';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { ProfileProvider } from '../ProfileProvider/ProfileProvider';
import type { UserProfile } from '@/lib/api/types';
import styles from './SiteChrome.module.css';

const AUTH_ROUTES = ['/register', '/login', '/forgot-password', '/verify-email', '/payment'];
const DASHBOARD_ROUTES = ['/dashboard'];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function SiteChrome({
  children,
  isAuthed = false,
  initialProfile = null,
}: {
  children: React.ReactNode;
  isAuthed?: boolean;
  initialProfile?: UserProfile | null;
}) {
  const pathname = usePathname();

  if (matchesRoute(pathname, AUTH_ROUTES)) {
    return children;
  }

  const isDashboard = isAuthed && matchesRoute(pathname, DASHBOARD_ROUTES);

  const content = isDashboard ? (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.dashboardMain}>
        <DashboardHeader />
        <main className={styles.dashboardContent}>{children}</main>
      </div>
    </div>
  ) : (
    <>
      <Header isAuthed={isAuthed} />
      <main>{children}</main>
      <Footer />
    </>
  );

  if (isAuthed) {
    return <ProfileProvider initial={initialProfile}>{content}</ProfileProvider>;
  }

  return content;
}
