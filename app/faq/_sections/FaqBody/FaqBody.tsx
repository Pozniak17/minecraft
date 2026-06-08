'use client';

import { useState } from 'react';
import { Container } from '@/app/_components/Container/Container';
import Filters from '../Filters/Filters';
import FaqList from '../FaqList/FaqList';
import { DEFAULT_FAQ_CATEGORY, type FaqCategoryId } from '../faqCategories';
import FaqSidebar from './FaqSidebar';
import styles from './FaqBody.module.css';

export default function FaqBody() {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>(DEFAULT_FAQ_CATEGORY);

  return (
    <section className={styles.faqBody}>
      <Container variant="faq" className={styles.shell}>
        <FaqSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        <div className={styles.main}>
          <Filters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <FaqList activeCategory={activeCategory} />
        </div>
      </Container>
    </section>
  );
}
