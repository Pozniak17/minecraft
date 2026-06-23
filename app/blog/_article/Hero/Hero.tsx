import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { categoryHref } from '@/app/blog/categories';
import type { BlogPostFull } from '../types';
import styles from './Hero.module.css';
import Image from 'next/image';

type HeroProps = Pick<
  BlogPostFull,
  | 'genre'
  | 'heroTags'
  | 'breadcrumbLabel'
  | 'title'
  | 'description'
  | 'descriptionDesktop'
  | 'date'
  | 'time'
  | 'image'
  | 'heroImageDesktop'
>;

export default function Hero({
  genre,
  heroTags,
  breadcrumbLabel,
  title,
  description,
  descriptionDesktop,
  date,
  time,
  image,
  heroImageDesktop,
}: HeroProps) {
  const breadcrumbItems = ['Home', 'Blog', genre, breadcrumbLabel];
  const breadcrumbLinks = ['/', '/blog', categoryHref(genre)];
  const desktopImage = heroImageDesktop ?? image;

  return (
    <div className={styles.page}>
      <Container variant="blog">
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <Breadcrumbs items={breadcrumbItems} links={breadcrumbLinks} />
            <ul className={styles.tags}>
              {heroTags.map(tag => (
                <li key={tag}>
                  <span>{tag}</span>
                </li>
              ))}
            </ul>
            <h1 className={styles.title}>{title}</h1>

            <p className={styles.description}>{description}</p>
            <p className={styles.descriptionDesktop}>{descriptionDesktop}</p>

            <div className={styles.meta}>
              <span className={styles.date}>{date.toString()}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.readTime}>{time} min read</span>
            </div>
          </div>

          <Image
            src={image}
            alt={title}
            width={375}
            height={203}
            className={`${styles.image} ${styles.imageMobile}`}
            priority
          />
          <Image
            src={desktopImage}
            alt={title}
            width={1114}
            height={603}
            className={`${styles.image} ${styles.imageDesktop}`}
            priority
          />
        </div>
      </Container>
    </div>
  );
}
