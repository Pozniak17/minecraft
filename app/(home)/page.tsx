import Benefits from './_sections/Benefits/Benefits';
import CommunityTrust from './_sections/CommunityTrust/CommunityTrust';
import Features from './_sections/Features/Features';

import { Hero } from './_sections/Hero/Hero';
import Preview from './_sections/Preview/Preview';
import Questions from './_sections/Questions/Questions';
import Rate from './_sections/Rate/Rate';

import Server from './_sections/Server/Server';
import StartAdventure from './_sections/StartAdventure/StartAdventure';
import { getRefreshToken } from '@/lib/server/authCookies';

export default async function Home() {
  const isAuthed = Boolean(await getRefreshToken());
  return (
    <>
      <Hero isAuthed={isAuthed} />
      <Server />
      <Features />
      <Preview isAuthed={isAuthed} />
      <Benefits />
      <Rate />
      <CommunityTrust />
      <Questions />
      <StartAdventure />
    </>
  );
}
