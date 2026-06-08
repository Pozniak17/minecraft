import { FAQ_CATEGORIES, FAQ_MOST_ASKED, type FaqCategoryId } from '../faqCategories';
import styles from './FaqSidebar.module.css';

type FaqSidebarProps = {
  activeCategory: FaqCategoryId;
  onCategoryChange: (category: FaqCategoryId) => void;
};

export default function FaqSidebar({ activeCategory, onCategoryChange }: FaqSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="FAQ navigation">
      <div className={styles.categoriesCard}>
        <h2 className={styles.cardTitle}>Browse by topic</h2>
        <ul className={styles.categoryList}>
          {FAQ_CATEGORIES.map(category => {
            const isActive = category.id === activeCategory;

            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  aria-pressed={isActive}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className={styles.categoryLabel}>{category.label}</span>
                  <span className={styles.categoryCount}>{category.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.popularCard}>
        <h2 className={styles.cardTitle}>Most asked</h2>
        <ul className={styles.popularList}>
          {FAQ_MOST_ASKED.map(item => (
            <li key={item.num} className={styles.popularItem}>
              <span className={styles.popularNum}>{item.num}</span>
              <span className={styles.popularQuestion}>{item.question}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.supportCard}>
        <div className={styles.supportTop}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.supportLabel}>Live support online</span>
        </div>
        <h3 className={styles.supportTitle}>Still need help?</h3>
        <p className={styles.supportDescription}>
          Chat with us 24/7 or send a ticket — we usually reply within 4 hours.
        </p>
        <div className={styles.supportActions}>
          <button type="button" className={styles.primaryButton}>
            Open live chat
          </button>
          <button type="button" className={styles.secondaryButton}>
            Send a ticket
          </button>
        </div>
      </div>
    </aside>
  );
}
