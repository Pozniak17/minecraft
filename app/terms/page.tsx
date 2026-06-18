import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { termsConditions } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Minecraft Game',
  description: 'The terms that govern your use of the Adventures in Minecraft website and servers.',
};

export default function TermsPage() {
  return <LegalPage document={termsConditions} />;
}
