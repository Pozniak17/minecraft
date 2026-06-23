import { Suspense } from 'react';
import { Container } from '@/app/_components/Container/Container';
import ArticlesClient from './ArticlesClient';
import { BLOG_ARTICLES } from './articlesData';
import styles from './Articles.module.css';

export default function Articles() {
  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <Suspense fallback={null}>
          <ArticlesClient articles={BLOG_ARTICLES} />
        </Suspense>
      </Container>
    </section>
  );
}
