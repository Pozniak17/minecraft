import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SiteChrome } from './_components/SiteChrome/SiteChrome';
import { getRefreshToken } from '@/lib/server/authCookies';

const VIEWPORT_ZOOM_SCRIPT = `(function () {
  var DESIGN_WIDTH = 1440;
  var MAX_ZOOM = 3;
  function applyZoom() {
    var width = window.innerWidth;
    var zoom = width > DESIGN_WIDTH ? Math.min(width / DESIGN_WIDTH, MAX_ZOOM) : 1;
    document.documentElement.style.zoom = String(zoom);
  }
  applyZoom();
  window.addEventListener('resize', applyZoom);
})();`;

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

  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Script id="viewport-zoom" strategy="beforeInteractive">
          {VIEWPORT_ZOOM_SCRIPT}
        </Script>
        <SiteChrome isAuthed={isAuthed}>{children}</SiteChrome>
      </body>
    </html>
  );
}
