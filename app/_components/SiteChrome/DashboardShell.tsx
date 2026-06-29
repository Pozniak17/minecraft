'use client';

import { DashboardHeader } from '../DashboardHeader/DashboardHeader';
import { DashboardSidebar } from '../DashboardSidebar/DashboardSidebar';
import styles from './SiteChrome.module.css';

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
