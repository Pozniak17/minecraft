import Card, { ArticleCardProps } from './Card/Card';
import styles from './CardList.module.css';

const PAGINATION_STUB = [1, 2, 3] as const;

export default function CardList({ articles }: { articles: ArticleCardProps[] }) {
  return (
    <>
      <ul className={styles.list}>
        {articles.map(article => (
          <Card
            key={article.title}
            image={article.image}
            genre={article.genre}
            time={article.time}
            title={article.title}
            description={article.description}
            date={article.date}
          />
        ))}
      </ul>

      <nav className={styles.pagination} aria-label="Articles pagination">
        <div className={styles.pagRow}>
          {PAGINATION_STUB.map(number => (
            <button
              key={number}
              type="button"
              className={`${styles.pagNumber} ${number === 1 ? styles.pagNumberActive : ''}`}
              aria-current={number === 1 ? 'page' : undefined}
              aria-disabled="true"
              tabIndex={-1}
            >
              {number}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
