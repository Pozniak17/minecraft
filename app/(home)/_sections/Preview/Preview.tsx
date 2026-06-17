'use client';

import { useState } from 'react';
import styles from './Preview.module.css';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '../../../_components/Divider/Divider';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import { usePrivilegeCart } from '@/lib/client/usePrivilegeCart';

export default function Preview({ isAuthed = false }: { isAuthed?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');
  const addPrivilege = usePrivilegeCart(isAuthed);

  return (
    <>
      <section className={styles.preview}>
        <Container>
          <h2 className={styles.title}>Store Preview</h2>

          <Tabs value={activeTab} onChange={setActiveTab} />

          <div className={styles.cards}>
            {activeTab === 'Crystals' ? (
              <CrystalsCards />
            ) : (
              <PrivilegesCards
                initialLimit={3}
                viewMoreHref="/store"
                onAddToCart={addPrivilege}
              />
            )}
          </div>
        </Container>
      </section>
      <Divider />
    </>
  );
}
