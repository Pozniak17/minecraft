'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './TopRatings.module.css';

type Option = {
  value: string;
  label: string;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

type Props = {
  prefix: string;
  value: string;
  options: Option[];
  selectedValue: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  ariaLabel: string;
};

const MENU_GAP = 6;

function getMenuPosition(trigger: HTMLElement): MenuPosition {
  const rect = trigger.getBoundingClientRect();

  return {
    top: rect.bottom + MENU_GAP,
    left: rect.left,
    width: rect.width,
  };
}

export default function FilterDropdown({
  prefix,
  value,
  options,
  selectedValue,
  isOpen,
  onOpenChange,
  onSelect,
  ariaLabel,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setMenuPosition(getMenuPosition(trigger));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      onOpenChange(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpenChange]);

  const menu =
    isOpen && menuPosition && mounted
      ? createPortal(
          <ul
            ref={menuRef}
            className={styles.filterMenu}
            role="listbox"
            aria-label={ariaLabel}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            {options.map(option => (
              <li key={option.value} role="option" aria-selected={selectedValue === option.value}>
                <button
                  type="button"
                  className={styles.filterOption}
                  onClick={() => {
                    onSelect(option.value);
                    onOpenChange(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={styles.filterWrap} ref={rootRef}>
        <button
          type="button"
          ref={triggerRef}
          className={styles.filterBtn}
          onClick={() => onOpenChange(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.filterPrefix}>{prefix}</span>
          <span className={styles.filterValue}>{value}</span>
          <span className={styles.filterCaret} aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
      {menu}
    </>
  );
}
