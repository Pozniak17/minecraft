'use client';

import { useState } from 'react';
import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import { usePrivilegeCart } from '@/lib/client/usePrivilegeCart';
import { getStoreHref } from '@/lib/data/servers';

export default function Category({ isAuthed = false }: { isAuthed?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>('Privileges');
  const addPrivilege = usePrivilegeCart(isAuthed);
  const storeHref = getStoreHref(isAuthed);

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>Category</h2>

        <Tabs value={activeTab} onChange={setActiveTab} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? (
            <CrystalsCards seeMoreHref={storeHref} />
          ) : (
            <PrivilegesCards onAddToCart={addPrivilege} />
          )}
        </div>
      </Container>
    </section>
  );
}
