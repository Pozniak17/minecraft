'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

const AUTH_ROUTES = ['/register', '/login', '/forgot-password'];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAuthRoute(pathname)) {
    return children;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
