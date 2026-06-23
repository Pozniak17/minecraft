import Image from 'next/image';
import { Container } from '@/app/_components/Container/Container';
import { SOCIAL_LINKS } from '@/app/_components/Header/navLinks';
import ContactForm from '@/app/contacts/_sections/ContactForm/ContactForm';
import { CONTACT_CHANNELS } from '@/lib/data/contacts';
import styles from './ContactChannels.module.css';

export default function ContactChannels() {
  return (
    <section className={styles.channels} aria-labelledby="contact-channels-heading">
      <Container variant="faq" className={styles.shell}>
        <header className={styles.intro}>
          <h2 id="contact-channels-heading" className={styles.sectionTitle}>
            How can we help?
          </h2>
          <p className={styles.sectionDescription}>
            Send us a message, email us directly, or follow us on social — we will get back to you
            as soon as possible.
          </p>
        </header>

        <div className={styles.body}>
          <ul className={styles.grid}>
            {CONTACT_CHANNELS.map(channel => (
              <li key={channel.id} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {channel.icon}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{channel.title}</h3>
                  <p className={styles.cardDescription}>{channel.description}</p>
                  {channel.meta ? <p className={styles.cardMeta}>{channel.meta}</p> : null}
                </div>
                <a href={channel.href} className={styles.primaryButton}>
                  {channel.actionLabel}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.formColumn}>
            <ContactForm />
          </div>

          <article className={styles.socialCard}>
            <p className={styles.socialLabel}>Follow us</p>
            <h3 className={styles.socialTitle}>Stay in the loop</h3>
            <p className={styles.socialDescription}>
              Updates, tournaments, and community highlights — follow us on your favourite platform.
            </p>
            <ul className={styles.socialList}>
              {SOCIAL_LINKS.map(link => (
                <li key={link.alt}>
                  <a
                    href={link.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.alt}
                  >
                    <Image
                      src={link.icon}
                      alt=""
                      width={link.size}
                      height={link.size}
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
