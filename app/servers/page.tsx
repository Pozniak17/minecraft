import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import MainServer from './_sections/MainServer/MainServer';

export const metadata: Metadata = {
  title: 'Servers — Minecraft Game',
  description: 'Pick your world — live status, current load, and latency for every server.',
};

export default function ServersPage() {
  return (
    <>
      <Hero />
      <MainServer />
    </>
  );
}
