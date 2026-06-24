import Hero from './_sections/Hero/Hero';
import FaqBody from './_sections/FaqBody/FaqBody';
import { FaqPageProvider } from './_sections/FaqPageContext';
import Support from './_sections/Support/Support';
import Suggest from './_sections/Suggest/Suggest';

export default function FAQ() {
  return (
    <FaqPageProvider>
      <main style={{ backgroundColor: '#001812' }}>
        <Hero />
        <FaqBody />
        <Support />
        <Suggest />
      </main>
    </FaqPageProvider>
  );
}
