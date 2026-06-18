import { Badge } from '../Badge/Badge';
import { Container } from '../Container/Container';
import styles from './LegalPage.module.css';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  badge: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ document }: { document: LegalDocument }) {
  const { badge, title, lastUpdated, intro, sections } = document;

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        <header className={styles.header}>
          <Badge>{badge}</Badge>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Last updated: {lastUpdated}</p>
          <p className={styles.intro}>{intro}</p>
        </header>

        <div className={styles.body}>
          {sections.map((sectionItem, index) => (
            <section key={sectionItem.heading} className={styles.block}>
              <h2 className={styles.blockHeading}>
                <span className={styles.blockNumber}>{index + 1}.</span>
                {sectionItem.heading}
              </h2>
              {sectionItem.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
