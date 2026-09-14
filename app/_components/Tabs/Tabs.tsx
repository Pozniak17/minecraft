'use client';
import { useTranslations } from 'next-intl';
import styles from './Tabs.module.css';

export const ALL_TABS = ['Crystals', 'Privileges', 'GameItems'] as const;
export type Tab = (typeof ALL_TABS)[number];

const DEFAULT_TABS: Tab[] = ['Crystals', 'Privileges'];

type TabsProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
  tabs?: readonly Tab[];
};

function labelKey(tab: Tab): 'tabs_crystals' | 'tabs_privileges' | 'tabs_gameItems' {
  if (tab === 'Crystals') return 'tabs_crystals';
  if (tab === 'Privileges') return 'tabs_privileges';
  return 'tabs_gameItems';
}

export default function Tabs({ value, onChange, tabs = DEFAULT_TABS }: TabsProps) {
  const t = useTranslations('store');

  return (
    <div className={styles.tabs} role="tablist" aria-label={t('tabs_ariaLabel')}>
      {tabs.map(tab => {
        const isActive = tab === value;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(tab)}
          >
            {t(labelKey(tab))}
          </button>
        );
      })}
    </div>
  );
}
