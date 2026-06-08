import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import type { FaqRelatedItem } from '@/app/faq/_data/faqRelatedItems';
import styles from './Related.module.css';

type RelatedProps = {
  items: FaqRelatedItem[];
  categoryLabel?: string;
};

export default function Related({ items, categoryLabel = 'Getting started' }: RelatedProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.related}>
      <Container variant="faq">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headText}>
              <span className={`${styles.badge} ${styles.mobileOnly}`}>Related</span>
              <span className={`${styles.badge} ${styles.desktopOnly}`}>
                More from {categoryLabel}
              </span>
              <h2 className={`${styles.title} ${styles.mobileOnly}`}>More questions</h2>
              <h2 className={`${styles.title} ${styles.desktopOnly}`}>Related questions</h2>
            </div>

            <Link href="/faq" className={`${styles.allLink} ${styles.desktopOnly}`}>
              <span>All FAQ</span>
              <span className={styles.allLinkArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={styles.list}>
            {items.map(item => (
              <li key={item.question}>
                <article className={styles.card}>
                  <span className={styles.category}>{item.category}</span>
                  <h3 className={styles.question}>{item.question}</h3>
                  <p className={styles.excerpt}>{item.excerpt}</p>
                  <div className={styles.footer}>
                    <span className={styles.helpful}>
                      <span className={styles.mobileOnly}>👍 {item.helpfulPercent}%</span>
                      <span className={styles.desktopOnly}>{item.helpfulPercent}%</span>
                    </span>
                    <Link href={item.href} className={styles.readLink}>
                      <span className={styles.mobileOnly}>
                        Read <span aria-hidden="true">→</span>
                      </span>
                      <span className={styles.desktopOnly}>
                        Read answer <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
