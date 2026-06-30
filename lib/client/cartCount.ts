'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getOrderItems } from '@/lib/api/cart';

const CART_UPDATED_EVENT = 'cart-updated';

export function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function useCartItemCount(enabled = true): number {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const items = await getOrderItems();
      setCount(items.length);
    } catch {
      // залишаємо попереднє значення
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    refresh();
  }, [refresh, pathname, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onUpdate = () => {
      refresh();
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    window.addEventListener('focus', onUpdate);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
      window.removeEventListener('focus', onUpdate);
    };
  }, [refresh, enabled]);

  return count;
}
