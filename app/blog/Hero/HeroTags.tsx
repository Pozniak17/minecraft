'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BLOG_CATEGORIES, categoryHref, parseCategoryParam } from '../categories';
import styles from './HeroTags.module.css';

export default function HeroTags() {
  const searchParams = useSearchParams();
  const activeTag = parseCategoryParam(searchParams.get('category'));
  const t = useTranslations('blog');

  return (
    <div className={styles.tags} role="tablist" aria-label={t('hero.categoriesLabel')}>
      {BLOG_CATEGORIES.map(tag => {
        const isActive = tag === activeTag;

        return (
          <Link
            key={tag}
            href={categoryHref(tag)}
            role="tab"
            aria-selected={isActive}
            className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
          >
            {t(`categories.${tag}` as Parameters<typeof t>[0])}
          </Link>
        );
      })}
    </div>
  );
}
