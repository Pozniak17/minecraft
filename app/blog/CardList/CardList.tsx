import Card, { ArticleCardProps } from './Card/Card';
import styles from './CardList.module.css';

export default function CardList({ articles }: { articles: ArticleCardProps[] }) {
  return (
    <>
      <ul className={styles.list}>
        {articles.map((article, index) => (
          <Card
            key={index}
            image={article.image}
            genre={article.genre}
            time={article.time}
            title={article.title}
            description={article.description}
            author={article.author}
            date={article.date}
          />
        ))}
      </ul>
      <button className={styles.button}>
        Load more articles <span className={styles.arrow}>↓</span>
      </button>
    </>
  );
}
