import { Suspense } from 'react';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';
import { Badge } from '@/app/_components/Badge/Badge';
import HeroTags from './HeroTags';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container variant="blog" className={styles.content}>
        <div className={styles.head}>
          <Badge className={styles.badge}>Blog</Badge>
          <h1 className={styles.title}>Stories from the Minecraft ecosystem</h1>
          <p className={styles.description}>
            Guides, server updates and player stories from our worlds.
          </p>
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input className={styles.input} type="search" placeholder="Search articles…" />
          <button type="button" className={styles.searchButton}>
            Search
          </button>
        </div>

        <Suspense fallback={null}>
          <HeroTags />
        </Suspense>
      </Container>
    </section>
  );
}
