import Hero from './_sections/Hero/Hero';
import FaqBody from './_sections/FaqBody/FaqBody';
import Support from './_sections/Support/Support';
import Suggest from './_sections/Suggest/Suggest';
import FaqCta from './_sections/FaqCta/FaqCta';

export default function FAQ() {
  return (
    <main style={{ backgroundColor: '#001812' }}>
      <Hero />
      <FaqBody />
      <Support />
      <Suggest />
      <FaqCta />
    </main>
  );
}
