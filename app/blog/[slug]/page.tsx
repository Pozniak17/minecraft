import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticlePage from '../_article/ArticlePage';
import { getAllPostSlugs, getPostBySlug } from '../_article/posts';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { articleSchema, breadcrumbSchema, toIsoDate } from '@/lib/seo/schema';

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

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    image: post.image,
    ogType: 'article',
    article: {
      publishedTime: toIsoDate(post.date),
      tags: [...post.sidebarTags],
    },
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        id="article-schema"
        data={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${slug}`,
          image: post.image,
          datePublished: toIsoDate(post.date),
          tags: post.sidebarTags,
        })}
      />
      <JsonLd
        id="article-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.breadcrumbLabel, path: `/blog/${slug}` },
        ])}
      />
      <ArticlePage post={post} />
    </>
  );
}
