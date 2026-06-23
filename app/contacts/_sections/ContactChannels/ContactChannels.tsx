import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import { SOCIAL_LINKS } from '@/app/_components/Header/navLinks';
import { CONTACT_CHANNELS } from '@/lib/data/contacts';
import styles from './ContactChannels.module.css';
function ChannelAction({
  channel,
}: {
  channel: (typeof CONTACT_CHANNELS)[number];
}) {
  if (channel.type === 'button') {
    return (
      <button type="button" className={styles.primaryButton}>
        {channel.actionLabel}
      </button>
    );
  }

  if (channel.href) {
    const className =
      channel.type === 'mailto' ? styles.secondaryButton : styles.primaryButton;

    return (
      <a
        href={channel.href}
        className={className}
        target={channel.external ? '_blank' : undefined}
        rel={channel.external ? 'noopener noreferrer' : undefined}
      >
        {channel.actionLabel}
      </a>
    );
  }

  return null;
}

export default function ContactChannels() {
  return (
    <section className={styles.channels} aria-labelledby="contact-channels-heading">
      <Container variant="faq" className={styles.shell}>
        <header className={styles.intro}>
          <div className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.statusLabel}>Support team — online</span>
          </div>
          <h2 id="contact-channels-heading" className={styles.sectionTitle}>
            How can we help?
          </h2>
          <p className={styles.sectionDescription}>
            Pick a channel below. For common questions, check the FAQ first — most answers are
            already there.
          </p>
        </header>

        <ul className={styles.grid}>
          {CONTACT_CHANNELS.map(channel => (
            <li key={channel.id} className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true">
                {channel.iconImage ? (
                  <Image src={channel.iconImage} alt="" width={24} height={24} />
                ) : (
                  channel.icon
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{channel.title}</h3>
                <p className={styles.cardDescription}>{channel.description}</p>
                {channel.meta ? <p className={styles.cardMeta}>{channel.meta}</p> : null}
              </div>
              <ChannelAction channel={channel} />
            </li>
          ))}
        </ul>

        <div className={styles.bottomRow}>
          <article className={styles.faqCard}>
            <p className={styles.faqLabel}>Before you write</p>
            <h3 className={styles.faqTitle}>Check the FAQ</h3>
            <p className={styles.faqDescription}>
              Billing, gameplay, and account questions are answered in our help center — often
              faster than waiting for a reply.
            </p>
            <Link href="/faq" className={styles.faqLink}>
              Browse FAQ →
            </Link>
          </article>

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
            </ul>          </article>
        </div>
      </Container>
    </section>
  );
}
