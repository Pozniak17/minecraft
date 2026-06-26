import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import ArticlesClient from './ArticlesClient';
import { BLOG_ARTICLES } from './articlesData';
import styles from './Articles.module.css';

export default async function Articles() {
  const t = await getTranslations('blog');

  const translatedArticles = BLOG_ARTICLES.map(article => {
    try {
      const pt = t.raw(`posts.${article.slug}`) as { title?: string; description?: string } | null;
      return {
        ...article,
        title: pt?.title ?? article.title,
        description: pt?.description ?? article.description,
      };
    } catch {
      return article;
    }
  });

  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <Suspense fallback={null}>
          <ArticlesClient articles={translatedArticles} />
        </Suspense>
      </Container>
    </section>
  );
}
