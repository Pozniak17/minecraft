'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import { GAME_SERVERS } from '@/lib/server/gameServers';
import {
  JOIN_ADD_SERVER,
  JOIN_BEFORE,
  JOIN_CHOOSE_SERVER,
  JOIN_CONNECT,
  JOIN_CREATE_ACCOUNT,
  JOIN_FEEDBACK,
  JOIN_LEAD,
  JOIN_SIDEBAR_RELATED,
  JOIN_TROUBLESHOOTING,
  JOIN_WHATS_NEXT,
} from '@/app/faq/_data/joinArticleContent';
import styles from './ArticleBody.module.css';
import { useFaqArticleToc } from './useFaqArticleToc';

const TOC_ITEMS = [
  { id: 'before-you-start', num: '01', label: 'Before you start' },
  { id: 'create-account', num: '02', label: '1. Create an account' },
  { id: 'choose-server', num: '03', label: '2. Choose your server' },
  { id: 'add-server', num: '04', label: '3. Add the server' },
  { id: 'connect', num: '05', label: '4. Connect for the first time' },
  { id: 'troubleshooting', num: '06', label: 'Troubleshooting' },
  { id: 'whats-next', num: '07', label: "What's next?" },
] as const;

const SECTION_IDS = TOC_ITEMS.map(item => item.id);

const SOCIAL_LINKS = [
  { icon: '/icons/social/prime_twitter.svg', alt: 'X', href: 'https://x.com/Minecrafts_Game', size: 18 },
  { icon: '/icons/social/twitch.svg', alt: 'Twitch', href: '#', size: 18 },
  { icon: '/icons/social/ic_round-facebook.svg', alt: 'Facebook', href: 'https://www.facebook.com/minecraftsgame/', size: 18 },
  { icon: '/icons/social/ri_instagram-fill.svg', alt: 'Instagram', href: 'https://www.instagram.com/minecraftsgame', size: 18 },
] as const;

const EXAMPLE_IP = GAME_SERVERS.luckysurvival.ip;

function BulletList({
  items,
  desktopItems,
}: {
  items: readonly string[];
  desktopItems?: readonly string[];
}) {
  return (
    <>
      <ul className={`${styles.bulletList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map(item => (
          <li key={item} className={styles.bulletItem}>
            <span className={styles.bullet} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {desktopItems && (
        <ul className={`${styles.bulletList} ${styles.desktopOnly}`}>
          {desktopItems.map(item => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function OrderedList({
  items,
  desktopItems,
}: {
  items: readonly string[];
  desktopItems?: readonly string[];
}) {
  return (
    <>
      <ol className={`${styles.orderedList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map((item, index) => (
          <li key={item} className={styles.orderedItem}>
            <span className={styles.orderedNum}>{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
      {desktopItems && (
        <ol className={`${styles.orderedList} ${styles.desktopOnly}`}>
          {desktopItems.map((item, index) => (
            <li key={item} className={styles.orderedItem}>
              <span className={styles.orderedNum}>{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function InfoCallout({
  title,
  children,
  desktopChildren,
}: {
  title: string;
  children: React.ReactNode;
  desktopChildren?: React.ReactNode;
}) {
  return (
    <aside className={styles.calloutInfo}>
      <p className={styles.calloutTitle}>{title}</p>
      <p className={`${styles.calloutText} ${desktopChildren ? styles.mobileOnly : ''}`}>{children}</p>
      {desktopChildren && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{desktopChildren}</p>
      )}
    </aside>
  );
}

function SuccessCallout({
  title,
  desktopTitle,
  children,
  desktopChildren,
}: {
  title: string;
  desktopTitle?: string;
  children: React.ReactNode;
  desktopChildren?: React.ReactNode;
}) {
  return (
    <aside className={styles.calloutSuccess}>
      <p className={styles.calloutSuccessTitle}>
        <span aria-hidden="true">✓</span>
        <span className={styles.mobileOnly}>{title}</span>
        {desktopTitle && <span className={styles.desktopOnly}>{desktopTitle}</span>}
      </p>
      <p className={`${styles.calloutText} ${desktopChildren ? styles.mobileOnly : ''}`}>{children}</p>
      {desktopChildren && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{desktopChildren}</p>
      )}
    </aside>
  );
}

function ShareLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map(link => (
        <a
          key={link.alt}
          href={link.href}
          className={styles.shareLink}
          aria-label={link.alt}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={link.icon} alt="" width={link.size} height={link.size} />
        </a>
      ))}
    </div>
  );
}

function copyIp() {
  void navigator.clipboard.writeText(EXAMPLE_IP);
}

export default function ArticleBody() {
  const { activeId, scrollToSection } = useFaqArticleToc(SECTION_IDS);

  return (
    <section className={styles.article}>
      <Container variant="faq">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarToc} aria-label="On this page">
              <p className={styles.sidebarTocLabel}>On this page</p>
              <ul className={styles.sidebarTocList}>
                {TOC_ITEMS.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.sidebarTocItem} ${activeId === item.id ? styles.sidebarTocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.sidebarTocNum}>{item.num}</span>
                      <span className={styles.sidebarTocText}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>Share this article</p>
              <ShareLinks className={styles.shareCardLinks} />
            </div>

            <div className={styles.relatedCard}>
              <p className={styles.relatedCardTitle}>Related questions</p>
              <ul className={styles.relatedCardList}>
                {JOIN_SIDEBAR_RELATED.map(question => (
                  <li key={question}>
                    <Link href="#" className={styles.relatedCardLink}>
                      <span aria-hidden="true">→</span>
                      {question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.main}>
            <nav className={`${styles.toc} ${styles.mobileOnly}`} aria-label="On this page">
              <div className={styles.tocHead}>
                <span className={styles.tocLabel}>On this page</span>
                <span className={styles.tocChevron} aria-hidden="true">
                  ▾
                </span>
              </div>
              <ul className={styles.tocList}>
                {TOC_ITEMS.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.tocNum}>{item.num}</span>
                      <span className={styles.tocText}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <p className={`${styles.lead} ${styles.mobileOnly}`}>{JOIN_LEAD.mobile}</p>
            <p className={`${styles.lead} ${styles.desktopOnly}`}>{JOIN_LEAD.desktop}</p>

            <section id="section-before-you-start" className={styles.section}>
              <h2 className={styles.sectionTitle}>Before you start</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>{JOIN_BEFORE.lead.mobile}</p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>{JOIN_BEFORE.lead.desktop}</p>
              <BulletList items={JOIN_BEFORE.bullets.mobile} desktopItems={JOIN_BEFORE.bullets.desktop} />
              <InfoCallout title="Heads up" desktopChildren={JOIN_BEFORE.callout.desktop}>
                {JOIN_BEFORE.callout.mobile}
              </InfoCallout>
            </section>

            <section id="section-create-account" className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Create an account</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>
                {JOIN_CREATE_ACCOUNT.lead.mobile}
              </p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>
                {JOIN_CREATE_ACCOUNT.lead.desktop}
              </p>
              <OrderedList
                items={JOIN_CREATE_ACCOUNT.steps.mobile}
                desktopItems={JOIN_CREATE_ACCOUNT.steps.desktop}
              />
              <figure className={styles.figure}>
                <div className={styles.figureFrame}>
                  <Image
                    src="/faq/article1.webp"
                    alt="Green Minecraft cat creating an account at a terminal"
                    width={760}
                    height={400}
                    className={styles.figureImage}
                  />
                </div>
                <figcaption className={`${styles.figureCaption} ${styles.desktopOnly}`}>
                  {JOIN_CREATE_ACCOUNT.caption}
                </figcaption>
              </figure>
            </section>

            <section id="section-choose-server" className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Choose your server</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>
                {JOIN_CHOOSE_SERVER.lead.mobile}
              </p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>
                {JOIN_CHOOSE_SERVER.lead.desktop}
              </p>
              <BulletList
                items={JOIN_CHOOSE_SERVER.bullets.mobile}
                desktopItems={JOIN_CHOOSE_SERVER.bullets.desktop}
              />
              <InfoCallout title="Tip" desktopChildren={JOIN_CHOOSE_SERVER.callout.desktop}>
                {JOIN_CHOOSE_SERVER.callout.mobile}
              </InfoCallout>
            </section>

            <section id="section-add-server" className={styles.section}>
              <h2 className={`${styles.sectionTitle} ${styles.mobileOnly}`}>
                {JOIN_ADD_SERVER.title.mobile}
              </h2>
              <h2 className={`${styles.sectionTitle} ${styles.desktopOnly}`}>
                {JOIN_ADD_SERVER.title.desktop}
              </h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>{JOIN_ADD_SERVER.lead.mobile}</p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>{JOIN_ADD_SERVER.lead.desktop}</p>
              <OrderedList
                items={JOIN_ADD_SERVER.steps.mobile}
                desktopItems={JOIN_ADD_SERVER.steps.desktop}
              />
              <div className={styles.ipBox}>
                <div className={styles.ipMain}>
                  <p className={styles.ipLabel}>Example IP</p>
                  <p className={styles.ipValue}>{EXAMPLE_IP}</p>
                </div>
                <button type="button" className={styles.copyButton} onClick={copyIp}>
                  Copy
                </button>
              </div>
            </section>

            <section id="section-connect" className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Connect for the first time</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>{JOIN_CONNECT.lead.mobile}</p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>{JOIN_CONNECT.lead.desktop}</p>
              <OrderedList items={JOIN_CONNECT.steps.mobile} desktopItems={JOIN_CONNECT.steps.desktop} />
              <figure className={`${styles.figure} ${styles.desktopOnly}`}>
                <div className={styles.figureFrame}>
                  <Image
                    src="/faq/article2.webp"
                    alt="Green Minecraft cat in the spawn lobby"
                    width={760}
                    height={400}
                    className={styles.figureImage}
                  />
                </div>
                <figcaption className={styles.figureCaption}>{JOIN_CONNECT.caption}</figcaption>
              </figure>
              <SuccessCallout
                title={JOIN_CONNECT.successTitle.mobile}
                desktopTitle={JOIN_CONNECT.successTitle.desktop}
                desktopChildren={JOIN_CONNECT.callout.desktop}
              >
                {JOIN_CONNECT.callout.mobile}
              </SuccessCallout>
            </section>

            <section id="section-troubleshooting" className={styles.section}>
              <h2 className={styles.sectionTitle}>Troubleshooting</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>
                {JOIN_TROUBLESHOOTING.lead.mobile}
              </p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>
                {JOIN_TROUBLESHOOTING.lead.desktop}
              </p>
              <ul className={`${styles.troubleList} ${styles.mobileOnly}`}>
                {JOIN_TROUBLESHOOTING.items.mobile.map(item => (
                  <li key={item.title} className={styles.troubleItem}>
                    <div className={styles.troubleHead}>
                      <span className={styles.troubleIcon} aria-hidden="true">
                        ⚠
                      </span>
                      <p className={styles.troubleTitle}>{item.title}</p>
                    </div>
                    <p className={styles.troubleText}>{item.text}</p>
                  </li>
                ))}
              </ul>
              <ul className={`${styles.troubleList} ${styles.desktopOnly}`}>
                {JOIN_TROUBLESHOOTING.items.desktop.map(item => (
                  <li key={item.title} className={styles.troubleItem}>
                    <div className={styles.troubleHead}>
                      <span className={styles.troubleIcon} aria-hidden="true">
                        ⚠
                      </span>
                      <p className={styles.troubleTitle}>{item.title}</p>
                    </div>
                    <p className={styles.troubleText}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="section-whats-next" className={styles.section}>
              <h2 className={styles.sectionTitle}>What&apos;s next?</h2>
              <p className={`${styles.sectionLead} ${styles.mobileOnly}`}>{JOIN_WHATS_NEXT.lead.mobile}</p>
              <p className={`${styles.sectionLead} ${styles.desktopOnly}`}>{JOIN_WHATS_NEXT.lead.desktop}</p>
              <BulletList
                items={JOIN_WHATS_NEXT.bullets.mobile}
                desktopItems={JOIN_WHATS_NEXT.bullets.desktop}
              />
              <div className={styles.ctaGroup}>
                <a href="#" className={styles.ctaPrimary}>
                  Join Twitch
                </a>
                <a href="#" className={styles.ctaSecondary}>
                  <span className={styles.mobileOnly}>
                    Read full guide <span className={styles.ctaArrow} aria-hidden="true">→</span>
                  </span>
                  <span className={styles.desktopOnly}>
                    Read the full guide
                  </span>
                  <span className={`${styles.ctaArrow} ${styles.desktopOnly}`} aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </section>

            <aside className={styles.feedback}>
              <h2 className={styles.feedbackTitle}>Was this answer helpful?</h2>
              <p className={`${styles.feedbackHint} ${styles.mobileOnly}`}>{JOIN_FEEDBACK.hint.mobile}</p>
              <p className={`${styles.feedbackHint} ${styles.desktopOnly}`}>{JOIN_FEEDBACK.hint.desktop}</p>
              <div className={styles.feedbackButtons}>
                <button type="button" className={styles.feedbackYes}>
                  <span className={styles.mobileOnly}>{JOIN_FEEDBACK.yes.mobile}</span>
                  <span className={styles.desktopOnly}>{JOIN_FEEDBACK.yes.desktop}</span>
                </button>
                <button type="button" className={styles.feedbackNo}>
                  <span className={styles.mobileOnly}>{JOIN_FEEDBACK.no.mobile}</span>
                  <span className={styles.desktopOnly}>{JOIN_FEEDBACK.no.desktop}</span>
                </button>
              </div>
              <p className={`${styles.feedbackStats} ${styles.mobileOnly}`}>{JOIN_FEEDBACK.stats.mobile}</p>
              <p className={`${styles.feedbackStats} ${styles.desktopOnly}`}>{JOIN_FEEDBACK.stats.desktop}</p>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
