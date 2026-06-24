import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { privacyPolicy } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Adventures in Minecraft collects, uses, and protects your personal information.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
