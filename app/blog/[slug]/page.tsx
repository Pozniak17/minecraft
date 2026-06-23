import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticlePage from '../_article/ArticlePage';
import { getAllPostSlugs, getPostBySlug } from '../_article/posts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Article not found' };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ArticlePage post={post} />;
}
