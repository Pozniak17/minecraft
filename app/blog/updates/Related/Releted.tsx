import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import Card, { type ArticleCardProps } from '@/app/blog/CardList/Card/Card';
import styles from './Releted.module.css';

type RelatedArticle = ArticleCardProps & { slug: string };

export default async function Related() {
  const t = await getTranslations('blog');

  const related = t.raw('updates.related') as Array<
    RelatedArticle & { descriptionDesktop?: string }
  >;

  const relatedMobile: RelatedArticle[] = related.map(({ descriptionDesktop: _dt, ...article }) => article);
  const relatedDesktop: RelatedArticle[] = related.map(article => ({
    ...article,
    description: article.descriptionDesktop ?? article.description,
  }));

  return (
    <section className={styles.related}>
      <Container variant="blog">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <span className={styles.badge}>{t('related.badge')}</span>
              <h2 className={styles.title}>{t('related.title')}</h2>
            </div>

            <Link href="/blog" className={`${styles.button} ${styles.buttonDesktop}`}>
              {t('articleCta')}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={`${styles.list} ${styles.listMobile}`}>
            {relatedMobile.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <ul className={`${styles.list} ${styles.listDesktop}`}>
            {relatedDesktop.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <Link href="/blog" className={`${styles.button} ${styles.buttonMobile}`}>
            {t('articleCta')}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
