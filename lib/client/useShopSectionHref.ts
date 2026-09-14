'use client';

import { useEffect, useState } from 'react';
import { getShopSectionHref, type ShopSection } from '@/lib/data/servers';
import { readHasStoredAccount } from '@/lib/client/storedAccount';

export function useShopSectionHref(isAuthed: boolean, section: ShopSection): string {
  const [href, setHref] = useState(() => getShopSectionHref(isAuthed, section, false));

  useEffect(() => {
    setHref(getShopSectionHref(isAuthed, section, readHasStoredAccount()));
  }, [isAuthed, section]);

  return href;
}
