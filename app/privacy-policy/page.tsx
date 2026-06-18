import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { privacyPolicy } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — Minecraft Game',
  description: 'How Adventures in Minecraft collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
