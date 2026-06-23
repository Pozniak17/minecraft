import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleBody from '../_sections/ArticleBody/ArticleBody';
import ArticleCta from '../_sections/ArticleCta/ArticleCta';
import Hero from '../_sections/ArticleHero/Hero';
import Related from '../_sections/Related/Related';
import { getAllFaqSlugs, getFaqArticleBySlug } from '../_data/faqArticles';
import { getFaqRelatedItems } from '../_data/faqRelatedItems';

type FaqArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllFaqSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: FaqArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getFaqArticleBySlug(slug);

  if (!article) {
    return { title: 'FAQ article not found' };
  }

  return {
    title: article.question,
    description: article.excerpt,
  };
}

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
      <ArticleBody slug={slug} />
      <Related items={relatedItems} categoryLabel={article.categoryLabel} />
      <ArticleCta />
    </main>
  );
}
