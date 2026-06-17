import type { Metadata } from 'next';
import { Divider } from '../_components/Divider/Divider';
import { getRefreshToken } from '@/lib/server/authCookies';
import Category from './_sections/Category/Category';
import Currency from './_sections/Currency/Currency';
import Hero from './_sections/Hero/Hero';

export const metadata: Metadata = {
  title: 'Shop — Minecraft Game',
  description: 'Top up crystals and upgrade your account with privileges.',
};

export default async function StorePage() {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <>
      <Hero />
      <Category isAuthed={isAuthed} />
      <Divider />
      <Currency />
    </>
  );
}
