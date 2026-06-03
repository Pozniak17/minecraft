import { Container } from '@/app/_components/Container/Container';
import styles from './Featured.module.css';
import Image from 'next/image';

export default function Featured() {
  return (
    <section className={styles.featured}>
      <Container>
        <div className={styles.main_wrapper}>
          <div className={styles.image_wrapper}>
            <Image
              className={styles.image}
              src="/blog/blog-featured.webp"
              alt="Featured"
              width={1440}
              height={836}
              sizes="(min-width: 1280px) 720px, 335px"
            />
          </div>
          <div className={styles.wrapper}>
            <ul className={styles.tags}>
              <li>
                <p className={styles.tag}>Featured</p>
              </li>

              <li>
                <p className={styles.tag}>Updates</p>
              </li>
            </ul>

            <h2 className={styles.title}>
              Server Update 2.6 — new Skyblock mechanics, custom crafts, and the biggest patch of
              the season
            </h2>

            <p className={styles.description}>
              We rewrote the entire island generator, added 12 new custom crafts, rebalanced the
              economy, and shipped a brand-new tournament mode. Here is everything you need to know
              — and the changes you can already test on the public branch tonight.
            </p>

            <div className={styles.meta}>
              <span className={styles.avatar}>M</span>
              <span className={styles.author_name}>Mike Rasmus</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.author_date}>Apr 28, 2026</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.author_read}>7 min read</span>
            </div>

            <ul className={styles.button_list}>
              <li>
                <button className={styles.first_button}>Read article</button>
              </li>
              <li>
                <button className={styles.second_button}>All updates</button>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
