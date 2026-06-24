import type { Metadata } from 'next';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import { termsConditions } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Terms and Conditions',
  description: 'The terms that govern your use of the Adventures in Minecraft website and servers.',
  path: '/terms',
});

export default function TermsPage() {
  return <LegalPage document={termsConditions} />;
}
