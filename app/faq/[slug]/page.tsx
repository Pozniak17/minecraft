import { notFound } from 'next/navigation';
import ArticleBody from '../_sections/ArticleBody/ArticleBody';
import ArticleCta from '../_sections/ArticleCta/ArticleCta';
import Hero from '../_sections/ArticleHero/Hero';
import Related from '../_sections/Related/Related';
import { getFaqArticleBySlug } from '../_data/faqArticles';
import { getFaqRelatedItems } from '../_data/faqRelatedItems';

type FaqArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FaqArticlePage({ params }: FaqArticlePageProps) {
  const { slug } = await params;
  const article = getFaqArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedItems = getFaqRelatedItems(slug);

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <Hero article={article} />
      <ArticleBody />
      <Related items={relatedItems} categoryLabel={article.categoryLabel} />
      <ArticleCta />
    </main>
  );
}
