import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { SiteChrome } from './_components/SiteChrome/SiteChrome';
import { CookieConsent } from './_components/CookieConsent/CookieConsent';
import { getRefreshToken } from '@/lib/server/authCookies';
import { getServerProfile } from '@/lib/server/profile';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Minecraft Game — A Next-Generation Ecosystem',
  description:
    'Three unique servers, an in-game economy, rankings, and tournaments. Play the way you like.',
  manifest: '/favicon/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthed = Boolean(await getRefreshToken());
  const initialProfile = isAuthed ? await getServerProfile() : null;
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={montserrat.variable}>
        <NextIntlClientProvider>
          <SiteChrome isAuthed={isAuthed} initialProfile={initialProfile}>
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
        <CookieConsent />
        <Script
          src="https://static.minecraftsgame.com/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
