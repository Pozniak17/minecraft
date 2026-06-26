import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';
import { Badge } from '@/app/_components/Badge/Badge';
import HeroTags from './HeroTags';

export default async function Hero() {
  const t = await getTranslations('blog');

  return (
    <section className={styles.hero}>
      <Container variant="blog" className={styles.content}>
        <div className={styles.head}>
          <Badge className={styles.badge}>{t('hero.badge')}</Badge>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.description}>{t('hero.description')}</p>
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input className={styles.input} type="search" placeholder={t('hero.searchPlaceholder')} />
          <button type="button" className={styles.searchButton}>
            {t('hero.searchButton')}
          </button>
        </div>

        <Suspense fallback={null}>
          <HeroTags />
        </Suspense>
      </Container>
    </section>
  );
}
