import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './[locale]/not-found.module.css';

// Корневий not-found. Спрацьовує, коли `notFound()` кидається у app/[locale]/layout.tsx
// (невалідна локаль) — Next.js ескалує пошук межі not-found вище сегмента [locale],
// тож без цього файлу показувалась би стандартна 404 Next.js. Рендериться всередині
// кореневого app/layout.tsx (html/body), без SiteChrome та i18n-провайдера, тому
// тексти беремо через server-side getTranslations (fallback-локаль з i18n/request.ts).
export default async function NotFound() {
  const t = await getTranslations('system');

  return (
    <div className={styles.section}>
      <Container variant="faq">
        <div className={styles.content}>
          <span className={styles.badgeMobile}>
            <span></span>{t('notFound_badgeMobile')}
          </span>

          <span className={styles.badgeDesktop}>
            <span></span>{t('notFound_badgeDesktop')}
          </span>
          <h1 className={styles.title}>{t('notFound_title')}</h1>
          <p className={styles.textMobile}>{t('notFound_textMobile')}</p>
          <p className={styles.textDesktop}>{t('notFound_textDesktop')}</p>
          <a href="/" className={styles.backLink}>
            <span>←</span>{t('notFound_goBack')}
          </a>
        </div>
      </Container>
    </div>
  );
}
