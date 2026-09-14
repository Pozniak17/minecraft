'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import GameItemsCards from '@/app/_components/GameItemsCards/GameItemsCards';
import { useShopSectionHref } from '@/lib/client/useShopSectionHref';

const STORE_TABS = ['Crystals', 'Privileges', 'GameItems'] as const satisfies readonly Tab[];

export default function Category({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('store');
  const [activeTab, setActiveTab] = useState<Tab>('Privileges');
  const crystalsHref = useShopSectionHref(isAuthed, 'Crystals');
  const privilegesHref = useShopSectionHref(isAuthed, 'Privileges');
  const gameItemsHref = useShopSectionHref(isAuthed, 'GameItems');

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>{t('category_title')}</h2>

        <Tabs value={activeTab} onChange={setActiveTab} tabs={STORE_TABS} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? (
            <CrystalsCards seeMoreHref={crystalsHref} />
          ) : activeTab === 'GameItems' ? (
            <GameItemsCards shopHref={gameItemsHref} />
          ) : (
            <PrivilegesCards addToCartHref={privilegesHref} />
          )}
        </div>
      </Container>
    </section>
  );
}
