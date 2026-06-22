import Hero from './_sections/Hero/Hero';
import { getRefreshToken } from '@/lib/server/authCookies';

export default async function HowToStartPage() {
  const isAuthed = Boolean(await getRefreshToken());

  return <Hero isAuthed={isAuthed} />;
}
