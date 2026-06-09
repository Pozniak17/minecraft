import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { SiteChrome } from './_components/SiteChrome/SiteChrome';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
