'use client';

import { useEffect } from 'react';

/** Loads PWA manifest after first paint so it stays off Lighthouse's critical request chain. */
export function DeferredManifest() {
  useEffect(() => {
    if (document.querySelector('link[rel="manifest"]')) return;

    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/favicon/site.webmanifest';
    document.head.appendChild(link);
  }, []);

  return null;
}
