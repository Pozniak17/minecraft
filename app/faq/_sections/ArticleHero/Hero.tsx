import Link from 'next/link';
import { Fragment } from 'react';

import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { formatArticleViews, type FaqArticleMeta } from '@/app/faq/_data/faqArticles';
import styles from './Hero.module.css';

type ArticleHeroProps = {
  article: FaqArticleMeta;
};

function DesktopBreadcrumbs({ article }: { article: FaqArticleMeta }) {
  const items = article.breadcrumbItemsDesktop;
  const links = article.breadcrumbLinksDesktop;

  return (
    <nav className={styles.breadcrumbsDesktop} aria-label="Breadcrumb">
      {items.map((label, index) => {
        const isLast = index === items.length - 1;
        const href = links[index];

        return (
          <Fragment key={label}>
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

export default function Hero({ article }: ArticleHeroProps) {
  const breadcrumbItemsMobile = ['Home', 'FAQ', article.breadcrumbCategory, article.breadcrumbShort];
  const breadcrumbLinksMobile = ['/', '/faq', '/faq'];

  return (
    <section className={styles.hero}>
      <Container variant="faq">
        <div className={styles.content}>
          <Breadcrumbs
            items={breadcrumbItemsMobile}
            links={breadcrumbLinksMobile}
            className={`${styles.breadcrumbsMobile} ${styles.mobileOnly}`}
          />
          <DesktopBreadcrumbs article={article} />

          <div className={styles.tags}>
            <span className={styles.tagCategory}>{article.categoryLabel}</span>
            {article.featured && (
              <>
                <span className={`${styles.tagTop} ${styles.mobileOnly}`}>
                  <span aria-hidden="true">★</span>
                  Top
                </span>
                <span className={`${styles.tagTop} ${styles.desktopOnly}`}>
                  <span aria-hidden="true">★</span>
                  Top question
                </span>
              </>
            )}
          </div>

          <h1 className={styles.title}>{article.question}</h1>

          <div className={`${styles.meta} ${styles.mobileOnly}`}>
            <span>{article.updated}</span>
            <span>{article.helpfulPercent}%</span>
            <span>{article.readMinutes} min</span>
          </div>

          <div className={`${styles.meta} ${styles.desktopOnly}`}>
            <span>{article.updatedFull}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{formatArticleViews(article.views)} views</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{article.helpfulPercent}% found this helpful</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{article.readMinutes} min read</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
