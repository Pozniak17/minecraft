import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Billing, Refunds & Chargeback Policy',
    description:
      'How billing, balances, refunds, and chargebacks work for digital purchases on minecraftsgame.com.',
    path: '/billing-refunds',
    noindex: true,
  });
}

export default async function BillingRefundsPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('billing.badge'),
    title: t('billing.title'),
    lastUpdated: t('billing.lastUpdated'),
    intro: t.raw('billing.intro') as LegalDocument['intro'],
    sections: t.raw('billing.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
