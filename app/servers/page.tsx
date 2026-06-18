import type { Metadata } from 'next';
import { getRefreshToken } from '@/lib/server/authCookies';
import Hero from './_sections/Hero/Hero';
import MainServer from './_sections/MainServer/MainServer';

export const metadata: Metadata = {
  title: 'Servers — Minecraft Game',
  description: 'Pick your world — live status, current load, and latency for every server.',
};

export default async function ServersPage() {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <>
      <Hero />
      <MainServer isAuthed={isAuthed} />
    </>
  );
}
