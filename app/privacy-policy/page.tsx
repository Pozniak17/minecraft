import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Adventures in Minecraft collects, uses, and protects your personal information.',
  path: '/privacy-policy',
  noindex: true,
});

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('privacy.badge'),
    title: t('privacy.title'),
    lastUpdated: t('privacy.lastUpdated'),
    intro: t('privacy.intro'),
    sections: t.raw('privacy.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
