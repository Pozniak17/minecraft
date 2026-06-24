import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { cookiePolicy } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Policy',
  description: 'What cookies Adventures in Minecraft uses and the choices you have regarding them.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return <LegalPage document={cookiePolicy} />;
}
