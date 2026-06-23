import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import ContactChannels from './_sections/ContactChannels/ContactChannels';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contacts — Minecraft Game',
  description:
    'Reach our support team by email, form, or social. We are here to help with account, billing, and gameplay questions.',
};

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <Hero />
      <ContactChannels />
    </main>
  );
}
