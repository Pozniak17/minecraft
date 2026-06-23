'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getOrderItems } from '@/lib/api/cart';

export const CART_UPDATED_EVENT = 'cart-updated';

export function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function useCartItemCount(): number {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const items = await getOrderItems();
      setCount(items.length);
    } catch {
      // залишаємо попереднє значення
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    const onUpdate = () => {
      refresh();
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    window.addEventListener('focus', onUpdate);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
      window.removeEventListener('focus', onUpdate);
    };
  }, [refresh]);

  return count;
}
