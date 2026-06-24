import type { Metadata } from 'next';
import Articles from './Articles/Articles';
import Featured from './Featured/Featured';
import Hero from './Hero/Hero';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo/schema';
import { getAllPostSlugs } from './_article/posts';
import { getPostBySlug } from './_article/posts';

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Guides, PvP & Updates',
  description:
    'Survival guides, PvP loadouts, redstone tutorials, player spotlights, and server updates from the Minecraft Game team.',
  path: '/blog',
});

const Blog = () => {
  const posts = getAllPostSlugs()
    .map(getPostBySlug)
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="blog-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />
      <JsonLd
        id="blog-list"
        data={itemListSchema(
          'Minecraft Game blog articles',
          posts.map(post => ({ name: post.title, url: `/blog/${post.slug}` })),
        )}
      />
      <Hero />
      <Featured />
      <Articles />
    </main>
  );
};

export default Blog;
