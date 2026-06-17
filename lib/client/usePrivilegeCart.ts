'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api/shop';
import { addToCart } from '@/lib/api/cart';

// Хендлер «Add to cart» для публічних секцій із привілеями.
// Неавторизований користувач їде на /login; авторизований — додає товар у кошик.
export function usePrivilegeCart(isAuthed: boolean) {
  const router = useRouter();
  const [idByTitle, setIdByTitle] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!isAuthed) return; // мапа продуктів потрібна лише для авторизованих
    let active = true;
    getProducts({ page_size: 100 })
      .then(data => {
        if (!active) return;
        const map = new Map<string, string>();
        for (const p of data.results) {
          if (p.title) map.set(p.title.toLowerCase(), p.id);
        }
        setIdByTitle(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isAuthed]);

  return useCallback(
    async (title: string) => {
      if (!isAuthed) {
        router.push('/login');
        return;
      }
      const id = idByTitle.get(title.toLowerCase());
      if (!id) {
        throw new Error('product-not-found');
      }
      await addToCart({ amount: 1, item_id: id, currency: 'EUR' });
    },
    [isAuthed, idByTitle, router]
  );
}
