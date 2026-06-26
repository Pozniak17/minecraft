import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ArticlePage from '../_article/ArticlePage';
import { getAllPostSlugs, getRelatedArticles, getTranslatedPost } from '../_article/posts';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { articleSchema, breadcrumbSchema, toIsoDate } from '@/lib/seo/schema';
import type { ArticleCardProps } from '../CardList/Card/Card';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const post = getTranslatedPost(slug, key => t.raw(key as Parameters<typeof t.raw>[0]));

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
  const t = await getTranslations('blog');
  const getRaw = (key: string) => t.raw(key as Parameters<typeof t.raw>[0]);

  const post = getTranslatedPost(slug, getRaw);

  if (!post) {
    notFound();
  }

  const { mobile: relatedMobile, desktop: relatedDesktop } = getRelatedArticles(slug);

  const translateCard = (
    card: ArticleCardProps & { slug?: string },
    useDesktop = false,
  ): ArticleCardProps & { slug?: string } => {
    const s = card.slug;
    if (!s) return card;
    try {
      const pt = getRaw(`posts.${s}`) as {
        title?: string;
        description?: string;
        descriptionDesktop?: string;
      } | null;
      return {
        ...card,
        title: pt?.title ?? card.title,
        description: (useDesktop ? pt?.descriptionDesktop : pt?.description) ?? card.description,
      };
    } catch {
      return card;
    }
  };

  const translatedRelatedMobile = relatedMobile.map(c => translateCard(c, false));
  const translatedRelatedDesktop = relatedDesktop.map(c => translateCard(c, true));

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
      <ArticlePage
        post={post}
        relatedMobile={translatedRelatedMobile}
        relatedDesktop={translatedRelatedDesktop}
      />
    </>
  );
}
