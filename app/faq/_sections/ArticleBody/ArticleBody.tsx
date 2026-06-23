'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import {
  getFaqArticleBySlug,
  getFaqArticleHref,
} from '@/app/faq/_data/faqArticles';
import { getFaqArticleContent } from '@/app/faq/_data/faqArticleContent';
import type { FaqArticleContentBlock, FaqSectionContent } from '@/app/faq/_data/faqArticleTypes';
import { GAME_SERVERS } from '@/lib/server/gameServers';
import { TWITCH_URL } from '@/lib/data/social';
import styles from './ArticleBody.module.css';
import { useFaqArticleToc } from './useFaqArticleToc';

const SOCIAL_LINKS = [
  { icon: '/icons/social/prime_twitter.svg', alt: 'X', href: 'https://x.com/Minecrafts_Game', size: 18 },
  { icon: '/icons/social/twitch.svg', alt: 'Twitch', href: TWITCH_URL, size: 18 },
  { icon: '/icons/social/ic_round-facebook.svg', alt: 'Facebook', href: 'https://www.facebook.com/minecraftsgame/', size: 18 },
  { icon: '/icons/social/ri_instagram-fill.svg', alt: 'Instagram', href: 'https://www.instagram.com/minecraftsgame', size: 18 },
] as const;

const EXAMPLE_IP = GAME_SERVERS.luckysurvival.ip;

function TextBlock({
  text,
  className,
}: {
  text: FaqArticleContentBlock;
  className: string;
}) {
  return (
    <>
      <p className={`${className} ${text.desktop ? styles.mobileOnly : ''}`}>{text.mobile}</p>
      {text.desktop && <p className={`${className} ${styles.desktopOnly}`}>{text.desktop}</p>}
    </>
  );
}

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

function SectionRenderer({ section }: { section: FaqSectionContent }) {
  return (
    <section id={`section-${section.id}`} className={styles.section}>
      {section.titleDesktop ? (
        <>
          <h2 className={`${styles.sectionTitle} ${styles.mobileOnly}`}>{section.title}</h2>
          <h2 className={`${styles.sectionTitle} ${styles.desktopOnly}`}>{section.titleDesktop}</h2>
        </>
      ) : (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}

      <TextBlock text={section.lead} className={styles.sectionLead} />

      {section.bullets && (
        <BulletList items={section.bullets.mobile} desktopItems={section.bullets.desktop} />
      )}

      {section.steps && (
        <OrderedList items={section.steps.mobile} desktopItems={section.steps.desktop} />
      )}

      {section.figure && (
        <figure className={`${styles.figure} ${section.figure.desktopOnly ? styles.desktopOnly : ''}`}>
          <div className={styles.figureFrame}>
            <Image
              src={section.figure.src}
              alt={section.figure.alt}
              width={760}
              height={400}
              className={styles.figureImage}
            />
          </div>
          {section.figure.caption && (
            <figcaption className={`${styles.figureCaption} ${styles.desktopOnly}`}>
              {section.figure.caption}
            </figcaption>
          )}
        </figure>
      )}

      {section.showIpBox && (
        <div className={styles.ipBox}>
          <div className={styles.ipMain}>
            <p className={styles.ipLabel}>Example IP</p>
            <p className={styles.ipValue}>{EXAMPLE_IP}</p>
          </div>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void navigator.clipboard.writeText(EXAMPLE_IP)}
          >
            Copy
          </button>
        </div>
      )}

      {section.callout &&
        (section.callout.variant === 'success' ? (
          <SuccessCallout
            title={section.callout.title}
            desktopTitle={section.callout.titleDesktop}
            desktopChildren={section.callout.text.desktop}
          >
            {section.callout.text.mobile}
          </SuccessCallout>
        ) : (
          <InfoCallout title={section.callout.title} desktopChildren={section.callout.text.desktop}>
            {section.callout.text.mobile}
          </InfoCallout>
        ))}

      {section.troubleItems && (
        <>
          <ul className={`${styles.troubleList} ${styles.mobileOnly}`}>
            {section.troubleItems.mobile.map(item => (
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
            {section.troubleItems.desktop.map(item => (
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
        </>
      )}
    </section>
  );
}

type ArticleBodyProps = {
  slug: string;
};

export default function ArticleBody({ slug }: ArticleBodyProps) {
  const content = getFaqArticleContent(slug);
  const meta = getFaqArticleBySlug(slug);

  if (!content || !meta) {
    return null;
  }

  const sectionIds = content.sections.map(section => section.id);
  const { activeId, scrollToSection } = useFaqArticleToc(sectionIds);
  const primaryCtaHref =
    content.cta?.primary === 'Join Twitch' ? TWITCH_URL : content.cta?.primaryHref ?? '/faq';

  return (
    <section className={styles.article}>
      <Container variant="faq">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarToc} aria-label="On this page">
              <p className={styles.sidebarTocLabel}>On this page</p>
              <ul className={styles.sidebarTocList}>
                {content.sections.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.sidebarTocItem} ${activeId === item.id ? styles.sidebarTocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.sidebarTocNum}>{item.tocNum}</span>
                      <span className={styles.sidebarTocText}>{item.tocLabel}</span>
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
                {content.sidebarRelatedSlugs.map(relatedSlug => {
                  const related = getFaqArticleBySlug(relatedSlug);
                  if (!related) {
                    return null;
                  }

                  return (
                    <li key={relatedSlug}>
                      <Link href={getFaqArticleHref(relatedSlug)} className={styles.relatedCardLink}>
                        <span aria-hidden="true">→</span>
                        {related.question}
                      </Link>
                    </li>
                  );
                })}
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
                {content.sections.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.tocNum}>{item.tocNum}</span>
                      <span className={styles.tocText}>{item.tocLabel}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <TextBlock text={content.lead} className={styles.lead} />

            {content.sections.map(section => (
              <SectionRenderer key={section.id} section={section} />
            ))}

            {content.cta && (
              <div className={styles.ctaGroup}>
                <a
                  href={primaryCtaHref}
                  target={primaryCtaHref.startsWith('http') ? '_blank' : undefined}
                  rel={primaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={styles.ctaPrimary}
                >
                  {content.cta.primary}
                </a>
                <Link href={content.cta.secondaryHref} className={styles.ctaSecondary}>
                  <span className={styles.mobileOnly}>
                    {content.cta.secondary} <span className={styles.ctaArrow} aria-hidden="true">→</span>
                  </span>
                  <span className={styles.desktopOnly}>{content.cta.secondary}</span>
                  <span className={`${styles.ctaArrow} ${styles.desktopOnly}`} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            )}

            <aside className={styles.feedback}>
              <h2 className={styles.feedbackTitle}>Was this answer helpful?</h2>
              <TextBlock text={content.feedback.hint} className={styles.feedbackHint} />
              <div className={styles.feedbackButtons}>
                <button type="button" className={styles.feedbackYes}>
                  <span className={styles.mobileOnly}>{content.feedback.yes.mobile}</span>
                  <span className={styles.desktopOnly}>{content.feedback.yes.desktop}</span>
                </button>
                <button type="button" className={styles.feedbackNo}>
                  <span className={styles.mobileOnly}>{content.feedback.no.mobile}</span>
                  <span className={styles.desktopOnly}>{content.feedback.no.desktop}</span>
                </button>
              </div>
              <TextBlock text={content.feedback.stats} className={styles.feedbackStats} />
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
