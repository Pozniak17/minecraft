import Hero from './Hero/Hero';
import ArticleBody from './Articles/ArticleBody';
import Related from './Related/Related';
import { getRelatedArticles } from './posts';
import type { BlogPostFull } from './types';

export default function ArticlePage({ post }: { post: BlogPostFull }) {
  const { mobile: relatedMobile, desktop: relatedDesktop } = getRelatedArticles(post.slug);

  return (
    <>
      <Hero {...post} />
      <ArticleBody lead={post.lead} sections={post.sections} sidebarTags={post.sidebarTags} />
      <Related articles={relatedMobile} desktopArticles={relatedDesktop} />
    </>
  );
}
