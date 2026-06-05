import Newsletter from '../Newsletter/Newsletter';
import Articles from './Articles/Articles';
import Hero from './Hero/Hero';
import Related from './Related/Releted';

export default function Updates() {
  return (
    <>
      <Hero />
      <Articles />
      <Related />
      <Newsletter />
    </>
  );
}
