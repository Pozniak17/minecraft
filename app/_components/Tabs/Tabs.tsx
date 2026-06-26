'use client';
import { useTranslations } from 'next-intl';
import styles from './Tabs.module.css';

const TABS = ['Crystals', 'Privileges'] as const;
export type Tab = (typeof TABS)[number];

type TabsProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
};

export default function Tabs({ value, onChange }: TabsProps) {
  const t = useTranslations('store');

  return (
    <div className={styles.tabs} role="tablist" aria-label={t('tabs_ariaLabel')}>
      {TABS.map(tab => {
        const isActive = tab === value;
        const label = tab === 'Crystals' ? t('tabs_crystals') : t('tabs_privileges');
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(tab)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
