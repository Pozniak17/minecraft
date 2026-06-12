import type { Metadata } from 'next';
import { Divider } from '../_components/Divider/Divider';
import Category from './_sections/Category/Category';
import Currency from './_sections/Currency/Currency';
import Hero from './_sections/Hero/Hero';

export const metadata: Metadata = {
  title: 'Shop — Minecraft Game',
  description: 'Top up crystals and upgrade your account with privileges.',
};

export default function StorePage() {
  return (
    <>
      <Hero />
      <Category />
      <Divider />
      <Currency />
    </>
  );
}
