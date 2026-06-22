import { Container } from '@/app/_components/Container/Container';
import { Badge } from '@/app/_components/Badge/Badge';
import styles from './Hero.module.css';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import HeroTopics from './HeroTopics';

const BREADCRUMB_ITEMS = ['Home', 'Support', 'FAQ'];
const BREADCRUMB_LINKS = ['/', '/support'];

const STATS = [
  { value: '120+', label: 'questions' },
  { value: '8', label: 'categories' },
  { value: '< 4h', label: 'avg reply' },
] as const;

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container variant="faq">
        <div className={styles.content}>
          <Breadcrumbs items={BREADCRUMB_ITEMS} links={BREADCRUMB_LINKS} />

          <div className={styles.head}>
            <Badge className={styles.badge}>Help center</Badge>
            <h1 className={styles.title}>Frequently asked questions</h1>
            <p className={`${styles.description} ${styles.descriptionMobile}`}>
              The answers our team gives most often. Browse by topic, search, or contact us directly.
            </p>
            <p className={`${styles.description} ${styles.descriptionDesktop}`}>
              The answers our team gives most often. Browse by topic, search by keyword, or contact us
              directly if you don&apos;t find what you need.
            </p>
          </div>

          <div className={styles.search}>
            <span className={styles.searchIcon} aria-hidden="true">
              ⌕
            </span>
            <input
              className={`${styles.input} ${styles.inputMobile}`}
              type="search"
              placeholder="Search 120+ questions…"
              aria-label="Search FAQ"
            />
            <input
              className={`${styles.input} ${styles.inputDesktop}`}
              type="search"
              placeholder='Search 120+ questions — "how do I link my account", "payment refund"…'
              aria-label="Search FAQ"
            />
            <button type="button" className={styles.searchButton}>
              <span className={styles.searchButtonMobile}>Go</span>
              <span className={styles.searchButtonDesktop}>Search</span>
            </button>
          </div>

          <div className={styles.stats}>
            {STATS.map(stat => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <HeroTopics />
        </div>
      </Container>
    </section>
  );
}
