import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/meta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/login',
          '/register',
          '/forgot-password',
          '/verify-email/',
          '/payment/',
          '/api/',
          '/terms',
          '/privacy-policy',
          '/cookie-policy',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
