'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readHasStoredAccount } from '@/lib/client/storedAccount';
import { getDashboardPlayHref, getOpenStoreHref } from '@/lib/data/servers';

type StepperAuthLinkProps = {
  isAuthed: boolean;
  intent: 'play' | 'store';
  className?: string;
  children: React.ReactNode;
};

function resolveHref(intent: StepperAuthLinkProps['intent'], isAuthed: boolean, hasAccount: boolean) {
  return intent === 'play'
    ? getDashboardPlayHref(isAuthed, hasAccount)
    : getOpenStoreHref(isAuthed, hasAccount);
}

export default function StepperAuthLink({
  isAuthed,
  intent,
  className,
  children,
}: StepperAuthLinkProps) {
  const [href, setHref] = useState(() => resolveHref(intent, isAuthed, false));

  useEffect(() => {
    setHref(resolveHref(intent, isAuthed, readHasStoredAccount()));
  }, [isAuthed, intent]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
