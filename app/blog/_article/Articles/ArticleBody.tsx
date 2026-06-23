'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import { TWITCH_URL } from '@/lib/data/social';
import type { ArticleBlock, ArticleSection, BlogPostFull, ResponsiveText } from '../types';
import styles from './Articles.module.css';
import { useArticleToc } from './useArticleToc';

const SOCIAL_LINKS = [
  { icon: '/icons/social/prime_twitter.svg', alt: 'X', href: 'https://x.com/Minecrafts_Game', size: 18 },
  { icon: '/icons/social/twitch.svg', alt: 'Twitch', href: TWITCH_URL, size: 18 },
  { icon: '/icons/social/ic_round-facebook.svg', alt: 'Facebook', href: 'https://www.facebook.com/minecraftsgame/', size: 18 },
  { icon: '/icons/social/ri_instagram-fill.svg', alt: 'Instagram', href: 'https://www.instagram.com/minecraftsgame', size: 18 },
] as const;

function ResponsiveParagraph({ text, className }: { text: ResponsiveText; className: string }) {
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
            <span className={styles.bulletText}>{item}</span>
          </li>
        ))}
      </ul>
      {desktopItems && (
        <ul className={`${styles.bulletList} ${styles.desktopOnly}`}>
          {desktopItems.map(item => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span className={styles.bulletText}>{item}</span>
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
            <span className={styles.orderedText}>{item}</span>
          </li>
        ))}
      </ol>
      {desktopItems && (
        <ol className={`${styles.orderedList} ${styles.desktopOnly}`}>
          {desktopItems.map((item, index) => (
            <li key={item} className={styles.orderedItem}>
              <span className={styles.orderedNum}>{index + 1}</span>
              <span className={styles.orderedText}>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function ArticleFigure({
  src,
  alt,
  caption,
  dashed,
}: {
  src: string;
  alt: string;
  caption: string;
  dashed?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.figureFrame} ${dashed ? styles.figureFrameDashed : ''}`}>
        <Image src={src} alt={alt} width={760} height={420} className={styles.figureImage} />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

function Callout({
  variant,
  title,
  text,
}: {
  variant: 'info' | 'warn';
  title: string;
  text: ResponsiveText;
}) {
  return (
    <aside
      className={`${styles.callout} ${variant === 'info' ? styles.calloutInfo : styles.calloutWarn}`}
    >
      <p className={styles.calloutTitle}>{title}</p>
      <p className={`${styles.calloutText} ${text.desktop ? styles.mobileOnly : ''}`}>
        {text.mobile}
      </p>
      {text.desktop && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{text.desktop}</p>
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

function ArticleBlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <ResponsiveParagraph text={block.text} className={styles.paragraph} />;
    case 'bullets':
      return <BulletList items={block.items} desktopItems={block.desktopItems} />;
    case 'ordered':
      return <OrderedList items={block.items} desktopItems={block.desktopItems} />;
    case 'subheading':
      return <h3 className={styles.subheading}>{block.text}</h3>;
    case 'figure':
      return (
        <ArticleFigure
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          dashed={block.dashed}
        />
      );
    case 'callout':
      return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <ResponsiveParagraph text={block.text} className={styles.quoteText} />
          <cite className={styles.quoteAuthor}>— {block.author}</cite>
        </blockquote>
      );
    case 'cta':
      return (
        <div className={styles.cta}>
          <button type="button" className={styles.ctaPrimary}>
            {block.primary}
          </button>
          <Link href={block.secondaryHref} className={styles.ctaSecondary}>
            {block.secondaryLabel}
          </Link>
        </div>
      );
    default:
      return null;
  }
}

function ArticleSectionRenderer({
  section,
  index,
}: {
  section: ArticleSection;
  index: number;
}) {
  return (
    <section id={`section-${section.id}`} className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {index + 1}. {section.title}
      </h2>
      {section.blocks.map((block, blockIndex) => (
        <ArticleBlockRenderer key={`${section.id}-${blockIndex}`} block={block} />
      ))}
    </section>
  );
}

type ArticleBodyProps = Pick<BlogPostFull, 'lead' | 'sections' | 'sidebarTags'>;

export default function ArticleBody({ lead, sections, sidebarTags }: ArticleBodyProps) {
  const tocItems = sections.map(section => ({ id: section.id, label: section.tocLabel }));
  const sectionIds = tocItems.map(item => item.id);
  const { activeId, readingProgress, setActiveId } = useArticleToc(sectionIds);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.card} aria-label="On this page">
              <div className={styles.head}>
                <span className={styles.headLabel}>On this page</span>
                <span className={styles.headIcon} aria-hidden="true">
                  ▾
                </span>
              </div>

              <ol className={styles.list}>
                {tocItems.map(item => {
                  const isActive = item.id === activeId;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className={styles.itemNumber}>{item.id}</span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className={styles.progressBlock}>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>Reading progress</span>
                  <span className={styles.progressValue}>{readingProgress}%</span>
                </div>

                <div
                  className={styles.progressBar}
                  role="progressbar"
                  aria-valuenow={readingProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Reading progress"
                >
                  <span className={styles.progressFill} style={{ width: `${readingProgress}%` }} />
                </div>
              </div>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>Share this article</p>
              <ShareLinks className={styles.shareCardLinks} />
            </div>

            <div className={styles.tagsCard}>
              <p className={styles.tagsCardTitle}>Tags</p>
              <ul className={styles.tagsList}>
                {sidebarTags.map(tag => (
                  <li key={tag}>
                    <span className={styles.tag}>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Share:</span>
              <ShareLinks className={styles.shareRowLinks} />
            </div>

            <ResponsiveParagraph text={lead} className={styles.lead} />

            {sections.map((section, index) => (
              <ArticleSectionRenderer key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
