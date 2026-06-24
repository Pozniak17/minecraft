import type { Metadata } from 'next';
import Benefits from './_sections/Benefits/Benefits';
import CommunityTrust from './_sections/CommunityTrust/CommunityTrust';
import Features from './_sections/Features/Features';

import { Hero } from './_sections/Hero/Hero';
import Preview from './_sections/Preview/Preview';
import Questions, { HOME_FAQ } from './_sections/Questions/Questions';
import Rate from './_sections/Rate/Rate';

import Server from './_sections/Server/Server';
import StartAdventure from './_sections/StartAdventure/StartAdventure';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { faqPageSchema, itemListSchema, videoGameSchema } from '@/lib/seo/schema';
import { PROJECT_SERVERS } from '@/lib/data/servers';

export const metadata: Metadata = buildMetadata({ path: '/' });

export default async function Home() {
  const isAuthed = Boolean(await getRefreshToken());
  return (
    <>
      <JsonLd id="home-videogame" data={videoGameSchema()} />
      <JsonLd
        id="home-servers"
        data={itemListSchema(
          'Minecraft servers',
          PROJECT_SERVERS.map(server => ({ name: server.name, url: '/servers' })),
        )}
      />
      <JsonLd
        id="home-faq"
        data={faqPageSchema(
          HOME_FAQ.map(item => ({ question: item.question, answer: item.answer })),
        )}
      />
      <Hero isAuthed={isAuthed} />
      <Server />
      <Features />
      <Preview isAuthed={isAuthed} />
      <Benefits />
      <Rate />
      <CommunityTrust />
      <Questions />
      <StartAdventure isAuthed={isAuthed} />
    </>
  );
}
