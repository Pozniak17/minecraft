import AboutActivities from './_sections/AboutActivities/AboutActivities';
import AboutEconomy from './_sections/AboutEconomy/AboutEconomy';
import AboutMission from './_sections/AboutMission/AboutMission';
import AboutServers from './_sections/AboutServers/AboutServers';
import { getRefreshToken } from '@/lib/server/authCookies';

import Hero from './_sections/Hero/Hero';

const About = async () => {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <div style={{ backgroundColor: '#001812' }}>
      <Hero isAuthed={isAuthed} />
      <AboutServers />
      <AboutEconomy />
      <AboutActivities />
      <AboutMission />
    </div>
  );
};

export default About;
