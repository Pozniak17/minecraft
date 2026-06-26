import Link from 'next/link';
import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';

import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { formatArticleViews, type FaqArticleMeta } from '@/app/faq/_data/faqArticles';
import styles from './Hero.module.css';

type ArticleHeroProps = {
  article: FaqArticleMeta;
};

function DesktopBreadcrumbs({
  items,
  links,
}: {
  items: string[];
  links: (string | undefined)[];
}) {
  return (
    <nav className={styles.breadcrumbsDesktop} aria-label="Breadcrumb">
      {items.map((label, index) => {
        const isLast = index === items.length - 1;
        const href = links[index];

        return (
          <Fragment key={label + index}>
            {index > 0 && (
              <span className={styles.breadcrumbSep} aria-hidden="true">
                /
              </span>
            )}
            {isLast || !href ? (
              <span className={styles.breadcrumbCurrent}>{label}</span>
            ) : (
              <Link href={href} className={styles.breadcrumbLink}>
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default async function Hero({ article }: ArticleHeroProps) {
  const t = await getTranslations('faq');

  const categoryLabel = t(`categoryMeta.${article.categoryId}.label` as Parameters<typeof t>[0]);
  const categoryBreadcrumb = t(`categoryMeta.${article.categoryId}.breadcrumb` as Parameters<typeof t>[0]);
  const breadcrumbShort = t(`articles.${article.slug}.breadcrumb` as Parameters<typeof t>[0]);

  const breadcrumbItemsMobile = [
    t('breadcrumb.home'),
    t('breadcrumb.faq'),
    categoryBreadcrumb,
    breadcrumbShort,
  ];
  const breadcrumbLinksMobile = ['/', '/faq', '/faq'];

  const breadcrumbItemsDesktop = [
    t('breadcrumb.home'),
    t('breadcrumb.support'),
    t('breadcrumb.faq'),
    categoryBreadcrumb,
    breadcrumbShort,
  ];

  return (
    <section className={styles.hero}>
      <Container variant="faq">
        <div className={styles.content}>
          <Breadcrumbs
            items={breadcrumbItemsMobile}
            links={breadcrumbLinksMobile}
            className={`${styles.breadcrumbsMobile} ${styles.mobileOnly}`}
          />
          <DesktopBreadcrumbs
            items={breadcrumbItemsDesktop}
            links={['/', '/faq', '/faq', `/faq?category=${article.categoryId}`, undefined]}
          />

          <div className={styles.tags}>
            <span className={styles.tagCategory}>{categoryLabel}</span>
            {article.featured && (
              <>
                <span className={`${styles.tagTop} ${styles.mobileOnly}`}>
                  <span aria-hidden="true">★</span>
                  {t('article.tagTop')}
                </span>
                <span className={`${styles.tagTop} ${styles.desktopOnly}`}>
                  <span aria-hidden="true">★</span>
                  {t('article.tagTopDesktop')}
                </span>
              </>
            )}
          </div>

          <h1 className={styles.title}>
            {t(`articles.${article.slug}.question` as Parameters<typeof t>[0])}
          </h1>

          <div className={`${styles.meta} ${styles.mobileOnly}`}>
            <span>{article.updated}</span>
            <span>{article.helpfulPercent}%</span>
            <span>{article.readMinutes} min</span>
          </div>

          <div className={`${styles.meta} ${styles.desktopOnly}`}>
            <span>{t('article.updatedFull', { date: article.updated })}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{t('article.views', { count: formatArticleViews(article.views) })}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{t('article.helpfulPct', { percent: article.helpfulPercent })}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{t('article.minRead', { min: article.readMinutes })}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
