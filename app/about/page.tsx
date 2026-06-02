import AboutEconomy from './_sections/AboutEconomy/AboutEconomy';
import AboutServers from './_sections/AboutServers/AboutServers';

import Hero from './_sections/Hero/Hero';

const About = () => {
  return (
    <div style={{ backgroundColor: '#001812' }}>
      <Hero />
      <AboutServers />
      <AboutEconomy />
    </div>
  );
};

export default About;
