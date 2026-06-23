import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import Card, { type ArticleCardProps } from '@/app/blog/CardList/Card/Card';
import styles from './Related.module.css';

type RelatedProps = {
  articles: ArticleCardProps[];
  desktopArticles?: ArticleCardProps[];
};

export default function Related({ articles, desktopArticles }: RelatedProps) {
  const desktopList = desktopArticles ?? articles;

  return (
    <section className={styles.related}>
      <Container variant="blog">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <span className={styles.badge}>Popular this week</span>
              <h2 className={styles.title}>Keep reading</h2>
            </div>

            <Link href="/blog" className={`${styles.button} ${styles.buttonDesktop}`}>
              All articles
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={`${styles.list} ${styles.listMobile}`}>
            {articles.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <ul className={`${styles.list} ${styles.listDesktop}`}>
            {desktopList.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <Link href="/blog" className={`${styles.button} ${styles.buttonMobile}`}>
            All articles
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
