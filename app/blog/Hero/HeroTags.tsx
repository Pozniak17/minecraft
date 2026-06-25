'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BLOG_CATEGORIES, categoryHref, parseCategoryParam, type BlogCategory } from '../categories';
import styles from './HeroTags.module.css';

export default function HeroTags() {
  const searchParams = useSearchParams();
  const activeTag = parseCategoryParam(searchParams.get('category'));

  return (
    <div className={styles.tags} role="tablist" aria-label="Blog categories">
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
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
