import type { Metadata } from 'next';
import { getRefreshToken } from '@/lib/server/authCookies';
import { Divider } from '../_components/Divider/Divider';
import Category from './_sections/Category/Category';
import Currency from './_sections/Currency/Currency';
import Hero from './_sections/Hero/Hero';
import Shop from './_sections/Shop/Shop';

export const metadata: Metadata = {
  title: 'Shop — Minecraft Game',
  description: 'Top up crystals and upgrade your account with privileges.',
};

export default async function StorePage() {
  const isAuthed = Boolean(await getRefreshToken());

  if (isAuthed) {
    return <Shop />;
  }

  return (
    <>
      <Hero />
      <Category />
      <Divider />
      <Currency />
    </>
  );
}
