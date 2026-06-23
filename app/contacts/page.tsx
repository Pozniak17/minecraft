import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import ContactChannels from './_sections/ContactChannels/ContactChannels';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contacts — Minecraft Game',
  description:
    'Reach our support team via live chat, email, or Discord. Average reply time under 4 hours, around the clock.',
};

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <Hero />
      <ContactChannels />
    </main>
  );
}
