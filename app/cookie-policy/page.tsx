import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { cookiePolicy } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy — Minecraft Game',
  description: 'What cookies Adventures in Minecraft uses and the choices you have regarding them.',
};

export default function CookiePolicyPage() {
  return <LegalPage document={cookiePolicy} />;
}
