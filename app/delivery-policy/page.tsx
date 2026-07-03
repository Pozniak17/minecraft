import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Delivery Policy',
  description:
    'How Adventures in Minecraft delivers digital items and privileges to your in-game account.',
  path: '/delivery-policy',
  noindex: true,
});

export default async function DeliveryPolicyPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('delivery.badge'),
    title: t('delivery.title'),
    lastUpdated: t('delivery.lastUpdated'),
    intro: t('delivery.intro'),
    sections: t.raw('delivery.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
