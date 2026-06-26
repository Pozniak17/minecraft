import Hero from './Hero/Hero';
import ArticleBody from './Articles/ArticleBody';
import Related from './Related/Related';
import type { BlogPostFull } from './types';
import type { ArticleCardProps } from '../CardList/Card/Card';

type ArticlePageProps = {
  post: BlogPostFull;
  relatedMobile?: (ArticleCardProps & { slug?: string })[];
  relatedDesktop?: (ArticleCardProps & { slug?: string })[];
};

export default function ArticlePage({ post, relatedMobile, relatedDesktop }: ArticlePageProps) {
  return (
    <>
      <Hero {...post} />
      <ArticleBody title={post.title} lead={post.lead} sections={post.sections} sidebarTags={post.sidebarTags} />
      <Related articles={relatedMobile ?? []} desktopArticles={relatedDesktop} />
    </>
  );
}
