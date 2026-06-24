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
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from '@/lib/seo/meta';
import { JsonLd } from './_components/JsonLd/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Minecraft Game',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  keywords: [
    'Minecraft server',
    'Minecraft survival',
    'Minecraft PvP',
    'Minecraft economy',
    'Minecraft tournaments',
    'Java Edition',
    'Bedrock Edition',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_TWITTER,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
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
        <JsonLd id="org-schema" data={organizationSchema()} />
        <JsonLd id="website-schema" data={websiteSchema()} />
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
