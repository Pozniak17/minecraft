'use client';

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/app/_actions/setLocale';
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT,
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from '@/lib/i18n/config';
import styles from './LanguageSwitcher.module.css';

type Props = {
  /** Клас тригер-кнопки — щоб збігтися зі стилем кожного місця (langButton). */
  className?: string;
  /** Елемент стрілки хоста (SVG або символ), рендериться після підпису. */
  arrow?: ReactNode;
  /** Вирівнювання випадайки відносно кнопки. */
  menuAlign?: 'left' | 'right';
  /** Розкриття меню вгору (для футерних/нижніх кнопок). */
  openUp?: boolean;
};

export function LanguageSwitcher({
  className,
  arrow,
  menuAlign = 'left',
  openUp = false,
}: Props) {
  const rawLocale = useLocale();
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  const menuClasses = [
    styles.menu,
    menuAlign === 'right' ? styles.menuRight : '',
    openUp ? styles.menuUp : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(value => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        disabled={isPending}
      >
        <span className={styles.triggerLabel}>{LOCALE_SHORT[locale]}</span>
        {arrow}
      </button>

      {open && (
        <ul className={menuClasses} role="listbox">
          {LOCALES.map(item => (
            <li key={item}>
              <button
                type="button"
                role="option"
                aria-selected={item === locale}
                className={`${styles.option} ${item === locale ? styles.optionActive : ''}`}
                onClick={() => choose(item)}
              >
                <span className={styles.optionShort}>{LOCALE_SHORT[item]}</span>
                <span className={styles.optionLabel}>{LOCALE_LABELS[item]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
