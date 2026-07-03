import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Billing, Refunds & Chargeback Policy',
  description:
    'Payment processing, refund eligibility, and chargeback rules for Adventures in Minecraft purchases.',
  path: '/billing-refunds',
  noindex: true,
});

export default async function BillingRefundsPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('billingRefunds.badge'),
    title: t('billingRefunds.title'),
    lastUpdated: t('billingRefunds.lastUpdated'),
    intro: t('billingRefunds.intro'),
    sections: t.raw('billingRefunds.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
